import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneToggle } from "@microsoft/sp-property-pane";
import GroupService from '../../services/GroupService';
import * as strings from 'ReactMyGroupsWebPartStrings';
import { ReactMyGroups, IReactMyGroupsProps } from './components';
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';


export interface IReactMyGroupsWebPartProps {
  seeAllLink: string;
  titleEn: string;
  titleFr: string;
  layout: string;
  prefLang: string;
  toggleSeeAll: boolean;
  numberPerPage: number;
  sort: string;
  themeVariant: IReadonlyTheme | undefined;

}

export default class ReactMyGroupsWebPart extends BaseClientSideWebPart<IReactMyGroupsWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme;

  public render(): void {
    const element: React.ReactElement<IReactMyGroupsProps > = React.createElement(
      ReactMyGroups,
      {
        seeAllLink: this.properties.seeAllLink,
        titleEn: this.properties.titleEn,
        titleFr: this.properties.titleFr,
        layout: this.properties.layout,
        prefLang: this.properties.prefLang,
        toggleSeeAll: this.properties.toggleSeeAll,
        numberPerPage: this.properties.numberPerPage,
        sort: this.properties.sort,
        themeVariant: this._themeVariant,


      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      GroupService.setup(this.context);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const { layout }  = this.properties;

    let numberPerPageOption: any;
      //if toggleSeeAll is true disable numberperpage
      if( this.properties.toggleSeeAll){
        numberPerPageOption = PropertyPaneTextField('numberPerPage', {
          label: strings.setPageNum,
          disabled: true
        });
      } else {
        numberPerPageOption = PropertyPaneTextField('numberPerPage', {
          label: strings.setPageNum,
          disabled:false
        });
      }


    return {
      pages: [
        {
          // header: {
          //   description: strings.PropertyPaneDescription
          // },
          groups: [
            {

              groupFields: [

                PropertyPaneDropdown('prefLang',{
                  label: 'Preferred Languages',
                  options: [
                    { key: 'account', text: 'Account'},
                    { key: 'en-us', text: 'English'},
                    { key: 'fr-fr', text: 'Français'},
                  ]
                }),

                PropertyPaneTextField('seeAllLink', {
                  label: strings.seeAllLink
                }),

                PropertyPaneTextField('titleEN', {
                  label: strings.setTitleEn,
                }),

                PropertyPaneTextField('titleFr', {
                  label: strings.setTitleFr,
                }),

                PropertyPaneToggle('toggleSeeAll', {
                  key: 'toggleSeeAll',
                  label: strings.seeAllToggle,
                  checked: false,
                  onText: strings.seeAllOn,
                  offText: strings.seeAllOff,
                }),
                numberPerPageOption,

                PropertyPaneChoiceGroup("layout", {
                  label: strings.setLayoutOpt,
                  options: [
                    {
                      key: "Grid",
                      text: strings.gridIcon,
                      iconProps: { officeFabricIconFontName: "GridViewSmall"},
                      checked: layout === "Grid" ? true : false,
                    },
                    {
                      key: "Compact",
                      text: strings.compactIcon,
                      iconProps: { officeFabricIconFontName: "BulletedList2"},
                      checked: layout === "Compact" ? true : false
                    },
                    {
                      key: "List",
                      text: strings.listIcon,
                      iconProps: { officeFabricIconFontName: "ViewList"},
                      checked: layout === "List" ? true : false
                    }
                  ]
                }),

                PropertyPaneChoiceGroup('sort', {
                  label: strings.setSortOpt,
                  options: [
                    {
                      key: "DateCreation",
                      text:strings.dateCreation,
                      checked: layout === "DateCreation" ? true : false,
                    },

                    {
                      key: "Alphabetical",
                      text:strings.alphabetical,
                      checked: layout === "Alphabetical" ? true : false,
                    }
                  ]
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
