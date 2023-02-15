import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneToggle, PropertyPaneLink, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneSlider } from "@microsoft/sp-property-pane";
import GroupService from '../../services/GroupService';
import * as strings from 'ReactAllGroupsWebPartStrings';
import { ReactAllGroups, IReactAllGroupsProps } from './components';
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';


export interface IReactAllGroupsWebPartProps {
  layout: string;
  prefLang: string;
  toggleSeeAll: boolean;
  numberPerPage: number;
  sort: string;
  themeVariant: IReadonlyTheme | undefined;
  selectedLetter: string;





}

export default class ReactAllGroupsWebPart extends BaseClientSideWebPart<IReactAllGroupsWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme;

  public render(): void {
    const element: React.ReactElement<IReactAllGroupsProps > = React.createElement(
      ReactAllGroups,
      {
        layout: this.properties.layout,
        prefLang: this.properties.prefLang,
        toggleSeeAll: this.properties.toggleSeeAll,
        numberPerPage: this.properties.numberPerPage,
        sort: this.properties.sort,
        themeVariant: this._themeVariant,
        selectedLetter: this.properties.selectedLetter,



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

                PropertyPaneSlider('numberPerPage', {
                  label: 'items per page',
                  min: 10,
                  max: 50,
                  step: 1,
                  showValue: true,
                  value: 10
                }),

                PropertyPaneTextField( 'hideGroups', {
                  label: 'Groups not in search',
                  description: 'Enter group id of groups that are not to be rendered',
                  multiline: true,
                  rows: 10,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
