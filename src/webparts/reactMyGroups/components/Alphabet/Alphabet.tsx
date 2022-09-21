import * as React from 'react';
import { IAlphabetProps } from './IAlphabetProps';
import styles from "./Alphabet.module.scss";


export class Alphabet extends React.Component<IAlphabetProps> {


  public render(): React.ReactElement<IAlphabetProps> {

    let arrayAtoZ = () => {
      return Array.apply(null, {length:26}).map((num, index) => String.fromCharCode(65 + index));
    };

    let abcChars: string = arrayAtoZ();
    console.log(abcChars);

    return (
      <div></div>
    );


  }
}
