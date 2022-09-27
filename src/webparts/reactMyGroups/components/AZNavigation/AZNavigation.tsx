import * as React from 'react';
import { IAZNavigationProps} from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';
import { IPivotStyles, IStyleSet} from 'office-ui-fabric-react';
import { IAZNavigationState } from './IAZNavigationState';
import { Pivot, PivotItem} from 'office-ui-fabric-react';


export class AZNavigation extends React.Component<IAZNavigationProps, IAZNavigationState> {


   //Handle the click event
  public _handleClick = (item?: PivotItem): void => {
    //console.log("item", this.props.onClickEvent(item.props.headerText));
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
        padding: '2px',
        fontWeight: 'bold'
      },

      linkIsSelected:{
        padding: '2px',
        color: 'blue'
      }
    };


    return (

        <Pivot styles={pivotStyles} onLinkClick={this._handleClick} selectedKey={this.props.selectedLetter}>
          {combinedIndex.map((letter) => {
            return (
              <PivotItem
               headerText={letter}
               headerButtonProps={{'data-title': 'Letter'}}
              />
            );
          })}
          </Pivot>

    );
  }

}
