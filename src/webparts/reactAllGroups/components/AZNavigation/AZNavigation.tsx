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

    // Create the A-Z Array
    const arrayAtoZ = ():any => {
      const navitems: string[] = [];
      for (let i = 65; i < 91; i++) {
        navitems.push(String.fromCharCode(i));
      }
      navitems.push(String.fromCharCode(35));
      return navitems;
    };

    const combinedIndex = arrayAtoZ();

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


