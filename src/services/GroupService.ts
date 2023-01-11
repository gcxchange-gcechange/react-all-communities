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


  public getGroupsBatch(letter:string): Promise<MicrosoftGraph.Group[]> {
    let apiTxt: string = "";

    if (letter === "#") {
      apiTxt =
        "/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'1') or startswith(displayName,'2') or startswith(displayName,'3') or startswith(displayName,'4')or startswith(displayName,'5') or startswith(displayName,'6') or startswith(displayName,'7') or startswith(displayName,'8') or startswith(displayName,'9')";
    } else {
      // apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')`;
      apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')&$top=10`;

    }

    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `${apiTxt}`,
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
                const nextLink = responseObject.responses[0].body["@odata.nextLink"]; //this is the next page link object returned from the response


                if (nextLink !== undefined ) {
                  nextLinkUrl.push(nextLink);
                }
                //store the first response groups array to responseContent
                responseContent = [...responseGroups, ...nextLinkUrl];
                console.log("URL",nextLinkUrl);
                console.log("RESCON",responseContent);
                resolve(responseContent);



              // for (let key in responseObject.responses[0].body) {
              //   let link = key
              //   console.log("K", link);

                // if(nextLinkUrl !== null) {

                //   client.api(nextLink).get((error2:any, responseObject2: any) => {

                //     lastResult = [...responseContent, ...responseObject2.value];
                //     console.log("lastResult", responseObject2)
                //     resolve(lastResult);
                //   });
                // }
                //  else {
                //   console.log("first",responseContent)
                //   resolve(responseContent);
                // }

              // }

              // client.api(nextLink).get((error2: any, responseObject2: any) => {
              //   console.log("RES2RAW",responseObject2);
              //   let nextLink2 = responseObject2['@odata.nextLink'];

              //   if(nextLink2) {
              //     nextLinkUrl.push(nextLink2);
              //   }

              //   lastResult = [...responseGroups, ...responseObject2.value];
              //   resolve(lastResult);
              // });

            });
          });
      } catch (error) {
          reject(error);
        console.error(error);
      }
    });
  }

  public getNextLinkGroups(groups:any): Promise<MicrosoftGraph.Group[]> {
    // let apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')&$top=5`;
    console.log("G",groups[10]);
    let nextPageUrl = [];


    let nextLink: string = `${groups[10]}`

      if(nextLink === undefined) {
        return (groups)
      }

      if (nextLink !== undefined) {

        return new Promise<MicrosoftGraph.Group[]>((resolve, reject) => {
          try{
            this.context.msGraphClientFactory
            .getClient()
            .then((client: MSGraphClient) => {
              client
              .api(nextLink)
              .get((error: any, groups: IGroupCollection, rawResponse: any) => {
                console.log("GROUP CONT "+JSON.stringify(groups));
                console.log("groups", groups);
                resolve(groups.value);
              });
            });
          } catch (error) {
            reject(error);
            console.log(error);
          }
        });
      }
  }



  public getGroupLinksBatch(groups: any): Promise<any> {

    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/groups/${groups.id}/sites/root/`,
        },
        {
          id: "2",
          method: "GET",
          url: `/groups/${groups.id}/members/$count?ConsistencyLevel=eventual`
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
              .post(requestBody, (error: any, responseObject: any) => {
                if (error) {
                  Promise.reject(error);
                }
                let responseContent = {};

                responseObject.responses.forEach((response) => {
                  if (response.status === 200) {
                    responseContent[response.id] = response.body;
                  } else if (response.status === 403) {
                    return null;
                  }
                });
                //console.log("RES", responseContent);
                resolve(responseContent);
              });
          });
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }



  public getGroupThumbnails(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`/groups/${groups.id}/photos/48x48/$value`)
              .responseType("blob")
              .get((error: any, group: any, rawResponse: any) => {
                resolve(window.URL.createObjectURL(group));
              });
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  public pageViewsBatch(groups: any): Promise<any> {
    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/sites/${groups.siteId}/analytics/lastsevendays/`,
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
              let responseContent = {};

              responseObject.responses.forEach((response) => {
                responseContent[response.id]= response.body;
              });
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
