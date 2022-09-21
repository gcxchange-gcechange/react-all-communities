import * as React from 'react';
import { IAZNavigationProps } from './IAZNavigationProps';
import  styles from './AZNavigation.module.scss';


export class AZNavigation extends React.Component<IAZNavigationProps> {
  public render(): React.ReactElement<IAZNavigationProps> {
    let arrayAtoZ = () => {
      return Array.apply(null, {length:26}).map((num, index) => String.fromCharCode(65 + index));
    };

    let abcChars: string = arrayAtoZ();
    console.log(abcChars);

    return (
      <div  className={styles.charContainer}></div>
    );
  }
}
