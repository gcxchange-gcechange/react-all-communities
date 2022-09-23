import * as React from 'react';
import { IAZNavigationProps} from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';
import { ActionButton, FocusZone, ILabelStyles, initializeIcons, IPivotStyles, IStyleSet, TagItem } from 'office-ui-fabric-react';
import { IAZNavigationState } from './IAZNavigationState';
import { Pivot, PivotItem, Label, PivotLinkFormat} from 'office-ui-fabric-react';


export class AZNavigation extends React.Component<IAZNavigationProps, IAZNavigationState> {

  constructor(props: IAZNavigationProps) {
    super(props);
    this.state = {
      isLoading: true
    };
  }


  public render(): React.ReactElement<IAZNavigationProps> {

    console.log("PROPS",this.props.items);

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

        <Pivot styles={pivotStyles}>
          {combinedIndex.map((letter) => {
            return (
              <PivotItem
               headerText={letter}
               headerButtonProps={{'data-title': 'Letter'}}/>
            );
          })}
          </Pivot>

    );
  }

}
