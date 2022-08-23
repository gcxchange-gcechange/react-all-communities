import { AadHttpClient, MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../models";
import { GraphRequest } from "@microsoft/microsoft-graph-client";
import { TagItem } from "office-ui-fabric-react";
import { GroupList } from "../webparts/reactMyGroups/components";


export class GroupServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }
//Get all of the Grooups  and add to Group Collection

  public getGroups(): Promise<MicrosoftGraph.Group[]> {
    return new Promise<MicrosoftGraph.Group[]>((resolve, reject) => {
      try {
        let allGroups: Array<IGroup> = new Array<IGroup>();
        this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
          .api("/groups?$filter=groupTypes/any(c:c+eq+'Unified')")
          //.api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')")
          .get((error: any, groups: IGroupCollection, rawResponse: any) => {
           console.log("RESPONSE "+JSON.stringify(groups.value));

           groups.value.map((item: any) => {
            allGroups.push({
              id: item.id,
              displayName: item.displayName,
              description: item.description
            });
           });
           console.log("GROUPS value", groups.value);
            resolve(groups.value);
          });
        });
      } catch(error) {
        console.error("ERROR-"+error);
      }
    });

  }

  public getGroupLinks(groups: IGroup): Promise<any> {

    let groupId = groups.id;

    return new Promise<any>((resolve, reject) => {


      try {
        this.context.msGraphClientFactory
        .getClient()
        .then ((client: MSGraphClient) => {
          client
          .api(`/groups/${groupId}/sites/webUrl`)
          .get((error: any, group: IGroup, rawResponse: any) => {
            console.log("GROUPLINKS",JSON.stringify(group));
            resolve(group);
          });
        });
      } catch(error) {
        console.error("Error",error);
      }
    });
  }



  // public getGroupLinksBatch(groups: IGroup[]): Promise<any> {

  //   let requestBody = { requests: [] };
  //   requestBody.requests = groups.map( (group) => ({
  //     id: group.id,
  //     method: "GET",
  //     url: `/groups/${group.id}/sites/root?$select=webUrl`
  //   }));
  // console.log("REQ",requestBody);

  //   return new Promise<any>((resolve, reject) => {
  //     console.log("Cont",groups);
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/$batch`)
  //         .post( requestBody, (error: any, responseObject: any) => {
  //           let linksResponseContent = {};
  //           console.log("2", responseObject);
  //           responseObject.responses.forEach( response => linksResponseContent[response.id] = response.body.value );
  //           console.log("RESPONSE BATCH", linksResponseContent);
  //           resolve(linksResponseContent);
  //         });
  //       });
  //     } catch(error) {
  //       console.error("ERROR",error);
  //     }
  //   });
  // }

  // public getGroupMembers(groups: IGroup): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/groups/${groups.id}/members/$count?ConsistencyLevel=eventual`)
  //         .get((error: any, group: any, rawResponse: any) => {
  //           resolve(group);
  //           console.log("MEMBERS "+JSON.stringify(group));
  //         });
  //       });
  //     } catch(error) {
  //       console.error(error);
  //     }
  //   });
  // }

  // public getGroupMembersBatch(groups: IGroup[]): Promise<any> {

  //   let requestBody = { requests: [] };
  //   requestBody.requests = groups.map( (group) => ({
  //     id: group.id,
  //     method: "GET",
  //     url: `/groups/${group.id}/members/$count?ConsistencyLevel=eventual`,
  //   }));

  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       this.context.msGraphClientFactory
  //       .getClient()
  //       .then((client: MSGraphClient) => {
  //         client
  //         .api(`/$batch`)
  //         .post( requestBody, (error: any, responseObject: any) => {
  //           let membersResponseContent = {};
  //           responseObject.responses.forEach( response => membersResponseContent[response.id] = response.body );

  //           resolve(membersResponseContent);
  //         });
  //       });
  //     } catch(error) {
  //       console.error(error);
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

            console.log("PHOTO", group);
            resolve(window.URL.createObjectURL(group));
          });
        });
      } catch(error) {
        console.error("ERROR "+error);
      }
    });
  }

  // public getGroupThumbnailsBatch(groups: IGroup[]): Promise<any> {

  //   let requestBody = { requests: [] };
  //   requestBody.requests = groups.map( (group) => ({
  //     id: group.id,
  //     method: "GET",
  //     url: `/groups/${group.id}/photos/48x48/$value`,
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
  //       console.error(error);
  //     }
  //   });
  // }
}

const GroupService = new GroupServiceManager();
export default GroupService;

