import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneToggle, PropertyPaneLink, PropertyPaneButton, PropertyPaneButtonType } from "@microsoft/sp-property-pane";
import GroupService from '../../services/GroupService';
import * as strings from 'ReactMyGroupsWebPartStrings';
import { ReactMyGroups, IReactMyGroupsProps } from './components';
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';


export interface IReactMyGroupsWebPartProps {
  addCommLink: string;
  layout: string;
  prefLang: string;
  toggleSeeAll: boolean;
  numberPerPage: number;
  sort: string;
  themeVariant: IReadonlyTheme | undefined;
  selectedLetter: string;
  commLink: string;
  createComm: string;



}

export default class ReactMyGroupsWebPart extends BaseClientSideWebPart<IReactMyGroupsWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme;

  public render(): void {
    const element: React.ReactElement<IReactMyGroupsProps > = React.createElement(
      ReactMyGroups,
      {
        addCommLink: this.properties.addCommLink,
        layout: this.properties.layout,
        prefLang: this.properties.prefLang,
        toggleSeeAll: this.properties.toggleSeeAll,
        numberPerPage: this.properties.numberPerPage,
        sort: this.properties.sort,
        themeVariant: this._themeVariant,
        selectedLetter: this.properties.selectedLetter,
        commLink: this.properties.commLink,
        createComm: this.properties.createComm,


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


    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
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

                PropertyPaneTextField('commLink', {
                  label: strings.commLink,



                }),

                PropertyPaneTextField('addCommLink', {
                  label:`${strings.addCommLink}`,
                  value:`https://`,
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
