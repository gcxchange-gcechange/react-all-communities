import { SPHttpClient } from '@microsoft/sp-http';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IReactAllGroupsProps {

  // addCommLink: string;
  layout: string;
  sort: string;
  numberPerPage: number;
  toggleSeeAll: boolean;
  themeVariant: IReadonlyTheme | undefined;
  prefLang: string;
  selectedLetter: string;

  // commLink: string;
  // createComm: string;



}
