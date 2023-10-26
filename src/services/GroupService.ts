import { MSGraphClientV3 } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { IGroup } from "../models";



export class GroupServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }


  public getGroupsBatch(letter: string): Promise<MicrosoftGraph.Group[]> {

    let apiTxt: string = "";

    if (letter === "#") {
      apiTxt =
        "/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'1') or startswith(displayName,'2') or startswith(displayName,'3') or startswith(displayName,'4')or startswith(displayName,'5') or startswith(displayName,'6') or startswith(displayName,'7') or startswith(displayName,'8') or startswith(displayName,'9')&$select=id,displayName, createdDateTime,description&$top=999";
    } else {
      apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')&$select=id,displayName, createdDateTime,description&$top=999`;
    }

    const requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `${apiTxt}`
        }
      ]
    };


    return new Promise((resolve, reject) => {
      try{
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3):void => {
            client
              .api(`/$batch`)
              .post(requestBody, (error: any, responseObject: any) => {

                const responseResults:any[] = [];

                responseResults.push(...responseObject.responses[0].body.value);

                const link = responseObject.responses[0].body["@odata.nextLink"];

                if (error) {
                  Promise.reject(error);
                } else if (link) {

                  const handleNextPage = (url: string):any => {
                    client.api(url).get((error:any, response2: any) => {
                      const nextLink = response2["@odata.nextLink"];

                      responseResults.push(...response2.value);

                      if (nextLink) {
                        handleNextPage(nextLink);
                      } else {
                        resolve(responseResults);
                      }
                    })
                  }
                  handleNextPage(link);
                }
                else {
                  resolve(responseResults)
                }
              });
          });
      } catch(error) {
        reject(error);
      }
    });
  }

  public getGroupDetailsBatch(group: any): Promise<any> {
    const requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/groups/${group.id}/sites/root/?select=id,webUrl`,
        },
        {
          id: "2",
          method: "GET",
          url: `/groups/${group.id}/members/$count?ConsistencyLevel=eventual`
        },
        {
          id: "3",
          method: "GET",
          url: `/groups/${group.id}/photos/48x48/$value`
        },

      ],
    };
    return new Promise((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3):void => {
            client
              .api(`/$batch`)
              .post(requestBody, (error: any, responseObject: any) => {
                if (error) {
                  Promise.reject(error);
                }
                const responseContent = {};

                responseObject.responses.forEach((response) => {

                  if (response.status === 200) {
                    responseContent[response.id] = response.body;
                  } else if (response.status === 403 || response.status === 404) {
                    return null;
                  }
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


  public pageViewsBatch(groups: any): Promise<any> {
    const requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/sites/${groups.siteId}/analytics/lastsevendays/access/actionCount`,
        },

      ],
    };
    return new Promise<any>(( resolve, reject ) => {
      try{
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
            .api(`/$batch`)
            .post(requestBody, (error: any, responseObject: any) => {
              let responseContent = {};
              responseContent = responseObject.responses[0].body.value;

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
