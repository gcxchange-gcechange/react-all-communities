import { SPHttpClient } from '@microsoft/sp-http';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IReactMyGroupsProps {
  link: string;
  addCommLink: string;
  titleEn: string;
  titleFr: string;
  layout: string;
  sort: string;
  numberPerPage: number;
  toggleSeeAll: boolean;
  themeVariant: IReadonlyTheme | undefined;
  prefLang: string;

}
