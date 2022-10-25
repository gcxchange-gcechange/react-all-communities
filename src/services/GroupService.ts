import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../models";



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
                console.log("GROUPS", groups.value);
                resolve(groups.value);
              });
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  public getGroupLinksBatch(groups: any): Promise<any> {
    let requestBody = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: `/groups/${groups.id}/sites/root/`,
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
                let responseContent = {};

                responseObject.responses.forEach((response) => {
                  if (response.status === 200) {
                    responseContent[response.id] = response.body;
                  } else if (response.status === 403) {
                    return null;
                  }
                });
                console.log("RES", responseContent);
                resolve(responseContent);
              });
          });
      } catch (error) {
        reject(error);
        console.error(error);
      }
    });
  }

  // public getGroupActivity(groups: IGroup): Promise<any> {
  //   // debugger
  //   const period: number = 7;
  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //         .getClient()
  //         .then((client: MSGraphClient) => {
  //           client
  //           .api(`https://graph.microsoft.com/v1.0/sites/${groups.siteId}/analytics/lastsevendays`)
  //             // .api("reports/getSharePointSiteUsagePages(period='D" + period +"')")
  //             .get((error:any, response: any, rawResponse: any) => {
  //               console.log("R", response);
  //               resolve(response);
  //             });
  //         });

  //     } catch (error) {
  //       console.log("ERR",error);
  //       reject(error);
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
                resolve(window.URL.createObjectURL(group));
              });
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

}

const GroupService = new GroupServiceManager();
export default GroupService;
