import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../models";
import { GraphRequest } from "@microsoft/microsoft-graph-client";
import { filter } from "lodash";

export class GroupServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }

  public getGroups(letter: string): Promise<MicrosoftGraph.Group[]> {

    let apiTxt: string = "";

    if (letter === "#") {
      apiTxt =
        "/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'1') or startswith(displayName,'2') or startswith(displayName,'3') or startswith(displayName,'4')or startswith(displayName,'5') or startswith(displayName,'6') or startswith(displayName,'7') or startswith(displayName,'8') or startswith(displayName,'9')";
    } else {
      apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${letter}')`;
    }

    return new Promise<MicrosoftGraph.Group[]>((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(apiTxt)
              .get((error: any, groups: IGroupCollection, rawResponse: any) => {

                resolve(groups.value);
                console.log("GROUPS", groups.value);
              });
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  public async getGroupLinks(): Promise<any> {
    return new Promise<any>(async(resolve, reject) => {

      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`me/transitiveMemberOf/microsoft.graph.group`)
              .get((error: any, group: IGroupCollection, rawResponse: any) => {
                console.log("LINKS", group.value);
                if(error) {
                  Promise.reject(error);
                }
                  resolve(group.value);
              });
          });
      } catch (error) {

        console.error("ERROR", error);
      }
    });
  }

  public getGroupLinksBatch(groups: any): Promise<any> {
    let requestBody = {

      "requests": [

          {
            "id": "1",
            "method": "GET",
            "url":`/groups/${groups.id}/sites/root/weburl`

        },
      ]
      };
      return new Promise((resolve, reject) => {
        try {
          this.context.msGraphClientFactory
                .getClient()
                .then((client: MSGraphClient) => {
                  client
                  .api(`/$batch`)
                  .post( requestBody, (error: any, responseObject: any) => {
                    if(error){
                      Promise.reject(error);
                    }
                    debugger
                    let responseContent = {};
                    // responseObject.responses.forEach( response => responseContent[response.id] = response.body );

                    responseObject.responses.forEach(response => {
                      console.log("RES",response);
                      if(response.status === 200) {
                       responseContent[response.id] =  response.body;
                      } else if (response.status === 403) {
                        return null;
                      }

                    })
                    console.log("RESOLVE",responseContent);
                    resolve(responseContent);
                  });
                });
        } catch (error) {
          Promise.reject(error);
          console.error(error);
        }
      });
  }

  // public getGroupActivity(groups: IGroup): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/groups/${groups.id}/sites`)
  //         .get((error: any, result: any, rawResponse: any) => {
  //           console.log("RESULT", result);
  //           resolve(result);
  //         });
  //       });
  //     } catch(error) {
  //       console.log("ERROR", error);
  //     }
  //   });
  // }

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
                if(error) {
                  Promise.reject(error);
                }
                resolve(window.URL.createObjectURL(group));
              });
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  // public getGroupLinks(groups: any): Promise<any> {

  //   let requestBody = { requests: [] };
  //   requestBody.requests = groups.map((group) => ({
  //     id: group.id,
  //     method: "GET",
  //     url: `/groups/${group.id}/sites/root/weburl`
  //   }));

  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/$batch`)
  //         .post( requestBody, (error: any, responseObject: any) => {
  //           let responseContent = {};
  //           responseObject.responses.forEach( response => responseContent[response.id] = response.body );
  //           console.log("batch",responseContent);
  //           resolve(responseContent);
  //         });
  //       });
  //     } catch(error) {
  //       Promise.reject(error)
  //       console.error("ERROR",error);
  //     }
  //   });
  // }
}

const GroupService = new GroupServiceManager();
export default GroupService;
