export interface IGroup {
  id: any;
  displayName: string;
  description?: string;
  url: string;
  siteId: string;
}

export interface IGroupCollection {
  value: IGroup[];

}
