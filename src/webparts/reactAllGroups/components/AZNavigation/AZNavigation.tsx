import * as React from 'react';
import { IAZNavigationProps} from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';
import { IPivotStyles, IStyleSet} from 'office-ui-fabric-react';
import { Pivot, PivotItem} from 'office-ui-fabric-react';


export class AZNavigation extends React.Component<IAZNavigationProps> {


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
        fontWeight: 'bold',
        backgroundColor:'#e3e1e1',
      },

      root:{
        marginTop:'20px',
        marginBottom: '20px',
      },

      linkIsSelected:{
        color: 'white',
        fontWeight: 'bold'
      }
    };


    return (
        <Pivot styles={pivotStyles} onLinkClick={this._handleClick} selectedKey={this.props.selectedLetter} linkFormat={1}>
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
