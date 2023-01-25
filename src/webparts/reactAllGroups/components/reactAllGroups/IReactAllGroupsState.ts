import * as MicrosoftGroup from '@microsoft/microsoft-graph-types';
//import {IGroup} from '../../../../models/IGroup';

export interface IReactAllGroupsState {
  groups: MicrosoftGroup.Group[];
  isLoading: boolean;
  currentPage: number;
  pagelimit: number;
  showless: boolean;
  pageSeeAll: boolean;
  selectedLetter: string;
  errorMessage: string;
  numberOfCommunities: number;
  pageCount: number;
  nextPageUrl: string;
  showLoader: boolean;
  numberOfLoadClicks:number;

}
