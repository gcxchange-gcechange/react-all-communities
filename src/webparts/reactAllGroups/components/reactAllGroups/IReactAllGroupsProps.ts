import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IReactAllGroupsProps {

  layout: string;
  sort: string;
  numberPerPage: number;
  toggleSeeAll: boolean;
  themeVariant: IReadonlyTheme | undefined;
  prefLang: string;
  selectedLetter: string;
  hidingGroups: string;
  updateWebPart: Function;
}
