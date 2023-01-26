import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../models";
import { groups } from "ReactAllGroupsWebPartStrings";
import { lastIndexOf } from "lodash";



export class GroupServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }


  public getGroupsBatch(letter:string, numberPerPage: number): Promise<MicrosoftGraph.Group[]> {
    let apiTxt: string = "";

    let numberofItems: number = numberPerPage;

    if (letter === "#") {
      apiTxt =
        `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'0') or startsWith(displayName,'1') or startswith(displayName,'2') or startswith(displayName,'3') or startswith(displayName,'4')or startswith(displayName,'5') or startswith(displayName,'6') or startswith(displayName,'7') or startswith(displayName,'8') or startswith(displayName,'9')&$count=true&$top=${numberofItems}`;
    } else {
      // apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')`;
      apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')&$select=id,displayName,createdDateTime,description&$count=true&$top=${numberofItems}`;

    }

    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `${apiTxt}`,
          headers: {
            ConsistencyLevel: "eventual"
          }
        },

      ],
    };


    return new Promise((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`/$batch`)

              .post(requestBody, (error: any, responseObject: any) => {

                if (error) {
                  Promise.reject(error);
                }
                //store the groups
                let responseContent = [];
                // store the next Link URL
                let nextLinkUrl= [];
                //array that will store all of the groups.
                let lastResult = [];

                const responseGroups = responseObject.responses[0].body.value; // this is the groups returned from the response


                const nextLink: string = responseObject.responses[0].body["@odata.nextLink"]; //this is the next page link object returned from the response
                // console.log("NxtL",nextLink);

                let pageCount: number  = Math.ceil(responseObject.responses[0].body["@odata.count"] / numberofItems); // grab the count of all groups and divide by # of top in API.


                if (nextLink !== undefined ) {
                  nextLinkUrl.push(nextLink);
                  responseContent = [...responseGroups, ...nextLinkUrl, pageCount];
                } else {
                  responseContent = [...responseGroups, pageCount];
                }
                //store the first response groups array to responseContent
                // console.log("RESPONSE_Content", responseContent);
                resolve(responseContent);

            });
          });
      } catch (error) {
          reject(error);
        console.error(error);
      }
    });
  }

  public getNextLinkPageGroups(url:any): Promise<MicrosoftGraph.Group[]> {

    let nextPageItems = [];
    let nextPageUrls= [];
    let responseContent = [];

    let nextLink: string = `${url}`;

    if (nextLink !== undefined) {

      return new Promise<MicrosoftGraph.Group[]>((resolve, reject) => {
        try{
          this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
            .api(nextLink)
            .get((error: any, response: any, rawResponse: any) => {
              // console.log("GROUP CONT "+JSON.stringify(response));
              if(response.value) {
                responseContent.push(response["@odata.nextLink"], response.value);
                nextPageUrls.push(response["@odata.nextLink"]);
                nextPageItems.push(response.value);
              }
              // console.log("RESPContent", responseContent);
              resolve(responseContent);
            });
          });
        } catch (error) {
          reject(error);
          console.log(error);
        }
      });
    } else {
      return null;
    }

  }


  public getGroupLinksBatch(group: any): Promise<any> {

    let request = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/groups/${group.id}/sites/root/`,
        },
        {
          id: "2",
          method: "GET",
          url: `/groups/${group.id}/members/$count?ConsistencyLevel=eventual`
        }
      ],
    };
    return new Promise((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`/$batch`)
              .post(request, (error: any, responseObject: any) => {
                if (error) {
                  Promise.reject(error);
                }
                let responseContent = {};

                responseObject.responses.forEach((response) => {
                  if (response.status === 200) {
                    responseContent[response.id] = response.body;
                  } else if (response.status === 403 || response.status === 404) {
                    return null;
                  }
                });
                // console.log("RES", responseContent);
                resolve(responseContent);
              });
          });
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }


  public getGroupThumbnails(groupItem: IGroup): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`/groups/${groupItem.id}/photos/48x48/$value`)
              .responseType("blob")
              .get((error: any, group: any, rawResponse: any) => {
                let response = [];

                if(group !== null) {
                  response.push(window.URL.createObjectURL(group));
                } else {
                  response.push(group);
                }
                resolve(response);


              });
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  public pageViewsBatch(groupObj: any): Promise<any> {
    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/sites/${groupObj.siteId}/analytics/lastsevendays/access/actionCount`,
        },

      ],
    };
    return new Promise<any>(( resolve, reject ) => {
      try{
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
            .api(`/$batch`)
            .post(requestBody, (error: any, responseObject: any) => {
              let responseContent = {}
              responseContent = responseObject.responses[0].body.value

              // responseObject.responses.forEach((response) => {
              //   responseContent[response.id]= response.body;
              // });
              resolve(responseContent);
            });
          });
        } catch (error) {
          reject(error);
          console.error(error);
        }

    });
  }

}

const GroupService = new GroupServiceManager();
export default GroupService;
