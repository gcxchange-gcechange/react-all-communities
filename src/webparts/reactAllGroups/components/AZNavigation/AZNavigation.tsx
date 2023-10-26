import * as React from 'react';
import { IAZNavigationProps} from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';
import { IPivotStyles, PivotLinkFormat} from 'office-ui-fabric-react';
import { Pivot, PivotItem} from 'office-ui-fabric-react';
import { SelectLanguage } from '../SelectLanguage';


export class AZNavigation extends React.Component<IAZNavigationProps> {

  public userLang = SelectLanguage(this.props.lang);

   //Handle the click event
  public _handleClick = (item?: PivotItem): void => {
    this.props.onClickEvent(item.props.headerText);
  }




  public render(): React.ReactElement<IAZNavigationProps> {


    //Create # symbol array
      const numberArray = ():any => {

       return Array.from({length:1}).map((num: any, index: number) => String.fromCharCode(35 + index));

      };
      const numSym  = numberArray();


    // Create the A-Z Array
    const arrayAtoZ = ():any => {

      return Array.from({length:26}).map((num: any, index: number) => String.fromCharCode(65 + index));
    };

    const abcChars = arrayAtoZ();

    // Combine both ABC and # symbol arrays

    const combinedIndex = [...abcChars, ...numSym ];

    //Define alphabet styling for the letters

    const pivotStyles: Partial<IPivotStyles> = {
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
    }

    return (
      <Pivot styles={pivotStyles} className={styles.letter} onLinkClick={this._handleClick} selectedKey={this.props.selectedLetter}  linkFormat={PivotLinkFormat.tabs} linkSize={1}>
        {combinedIndex.map((letter,index) => {
             return (
               <PivotItem
                 key={index}
                 itemKey={letter}
                 headerText={letter}
                 headerButtonProps={{'data-title': `${letter}`}}
               />
             );
           })}
           </Pivot>
    );
  }
}


