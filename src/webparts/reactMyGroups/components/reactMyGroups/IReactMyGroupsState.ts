import * as MicrosoftGroup from '@microsoft/microsoft-graph-types';
//import {IGroup} from '../../../../models/IGroup';

export interface IReactMyGroupsState {
  groups: MicrosoftGroup.Group[];
  isLoading: boolean;
  currentPage: number;
  pagelimit: number;
  showless: boolean;
  pageSeeAll: boolean;
}
