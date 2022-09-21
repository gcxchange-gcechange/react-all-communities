import * as React from 'react';
import { IAZNavigationProps } from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';


export class AZNavigation extends React.Component<IAZNavigationProps> {
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
   const combinedIndex = [...abcChars, ...numSym];

   console.log(combinedIndex);

    return (
      <div  className={styles.charContainer}>
        items={combinedIndex}
      </div>
    );
  }
}
