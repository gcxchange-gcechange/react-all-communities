import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneChoiceGroup, PropertyPaneDropdown, PropertyPaneSlider } from "@microsoft/sp-property-pane";
import GroupService from '../../services/GroupService';
import { ReactAllGroups, IReactAllGroupsProps } from './components';
import {IReadonlyTheme } from '@microsoft/sp-component-base';
import { SelectLanguage } from "./components/SelectLanguage";

export interface IReactAllGroupsWebPartProps {
  layout: string;
  prefLang: string;
  toggleSeeAll: boolean;
  numberPerPage: number;
  sort: string;
  themeVariant: IReadonlyTheme | undefined;
  selectedLetter: string;
  hidingGroups: string;

}

export default class ReactAllGroupsWebPart extends BaseClientSideWebPart<IReactAllGroupsWebPartProps> {

  private _themeVariant: IReadonlyTheme;
  private strings: IReactAllGroupsWebPartStrings;

  public updateWebPart= async ():Promise<void> =>{
    this.context.propertyPane.refresh();
    this.render();
  }

  public render(): void {
    this.strings = SelectLanguage(this.properties.prefLang);
    this.context.propertyPane.refresh();

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
        hidingGroups: this.properties.hidingGroups,
        updateWebPart: this.updateWebPart
      }
    );


    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.strings = SelectLanguage(this.properties.prefLang);
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
                  ],
                  selectedKey: this.strings.userLang,
                }),

                PropertyPaneChoiceGroup('sort', {
                  label: this.strings.setSortOpt,
                  options: [
                    {
                      key: "DateCreation",
                      text:this.strings.dateCreation,
                      checked: layout === "DateCreation" ? true : false,
                    },

                    {
                      key: "Alphabetical",
                      text:this.strings.alphabetical,
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

                PropertyPaneTextField( 'hidingGroups', {
                  label: 'Groups not in search, seperate items by pressing the Enter key.',
                  placeholder: 'Seperate items by pressing the Enter key.',
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
