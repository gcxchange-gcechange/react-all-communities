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

  public getGroupLinks(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      const newGroups: Array<string> = [];
      try {
        this.context.msGraphClientFactory
          .getClient()
          .then((client: MSGraphClient) => {
            client
              .api(`/groups/${groups.id}/sites/root/weburl`)
              .get((error: any, group: IGroupCollection, rawResponse: any) => {
                // console.log("LINKS", group.value);
                if(error) {
                  reject(error);
                }
                  resolve(group.value);
              });
          });
      } catch (error) {
        console.error("ERROR", error);
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
                resolve(window.URL.createObjectURL(group));
              });
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  // public getGroupThumbnailsBatch(groups: IGroup[]): Promise<any> {

  //   let requestBody = { requests: [] };
  //   requestBody.requests = groups.map((group) => ({
  //     id: group.id,
  //     method: "GET",
  //     url: `/groups/${group.id}/photos/48x48/$value`
  //   }));

  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/$batch`)
  //         .post( requestBody, (error: any, responseObject: any) => {
  //           let thumbnailsResponseContent = {};
  //           responseObject.responses.forEach( response => thumbnailsResponseContent[response.id] = response.body );

  //           resolve(thumbnailsResponseContent);
  //         });
  //       });
  //     } catch(error) {
  //       console.error("ERROR",error);
  //     }
  //   });
  // }
}

const GroupService = new GroupServiceManager();
export default GroupService;
