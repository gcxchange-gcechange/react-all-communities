export interface IGroup {
  id: any;
  displayName: string;
  description?: string;
  url?: string;
}

export interface IGroupCollection {
  value: IGroup[];

}
