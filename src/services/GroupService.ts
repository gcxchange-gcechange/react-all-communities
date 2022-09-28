import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../models";
import { GraphRequest } from "@microsoft/microsoft-graph-client";



export class GroupServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }

  public getGroups(letter: string): Promise<MicrosoftGraph.Group[]> {
    return new Promise<MicrosoftGraph.Group[]>((resolve, reject) => {

      try {
        this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
          .api(`/groups?$filter=groupTypes/any(c:c+eq+'Unified')&$filter=startsWith(displayName,'${letter}')`)
          .get((error: any, groups: IGroupCollection, rawResponse: any) => {
            console.log("GROUPS", groups.value);
            resolve(groups.value);
          });
        });
      } catch(error) {
        console.error(error);
      }
    });
  }

  public getGroupLinks(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
          .api(`/groups/${groups.id}/sites/root/weburl`)
          .get((error: any, group: IGroupCollection, rawResponse: any) => {
            console.log("LINKS2", group.value);
            resolve(group.value);
          });
        });
      } catch(error) {
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
          .responseType('blob')
          .get((error: any, group: any, rawResponse: any) => {
            resolve(window.URL.createObjectURL(group));
          });
        });
      } catch(error) {
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

