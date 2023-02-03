import * as React from 'react';
import { IAZNavigationProps} from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';
import { htmlElementProperties, IPivotStyles, IStyleSet, Label, PivotLinkFormat, PivotLinkSize} from 'office-ui-fabric-react';
import { Pivot, PivotItem} from 'office-ui-fabric-react';
import * as strings from 'ReactAllGroupsWebPartStrings';
import { SelectLanguage } from '../SelectLanguage';


export class AZNavigation extends React.Component<IAZNavigationProps> {

  public userLang = SelectLanguage(this.props.lang);

   //Handle the click event
  public _handleClick = (item?: PivotItem): void => {
    this.props.onClickEvent(item.props.headerText);
  }




  public render(): React.ReactElement<IAZNavigationProps> {


    //Create # symbol array
      let numberArray = () => {
        return Array.apply(null, {length:1}).map((num: any, index: number) => String.fromCharCode(35 + index));
      };
      let numSym  = numberArray();

    // Create the A-Z Array
    let arrayAtoZ = () => {
      return Array.apply(null, {length:26}).map((num: any, index: number) => String.fromCharCode(65 + index));
    };

    let abcChars = arrayAtoZ();

    // Combine both ABC and # symbol arrays


    const combinedIndex = [...abcChars, ...numSym ];


   //Change the styles for the letters
    const pivotStyles: Partial<IStyleSet<IPivotStyles>> ={
        link:{
        backgroundColor:'#e3e1e1',
      },

      root:{
        marginTop:'20px',
        marginBottom: '20px',
      },

      linkIsSelected:{
        color: 'white'
      }
    };

    return (
      <Pivot styles={pivotStyles} className={styles.letter} onLinkClick={this._handleClick} selectedKey={this.props.selectedLetter}  linkFormat={PivotLinkFormat.tabs} linkSize={1}>
        {combinedIndex.map((letter) => {

          if(document.documentElement.lang === 'fr-fr') {

            return (
              <div lang="fr-fr">
              <PivotItem
                itemKey={letter}
                headerText={letter}
                headerButtonProps={{'data-title': 'Letter'}}
              />
              </div>
            );
          }
          return (
            <PivotItem
              itemKey={letter}
              headerText={letter}
              headerButtonProps={{'data-title': 'Letter'}}
            />
          );
        })}
      </Pivot>
    );
  }
}


