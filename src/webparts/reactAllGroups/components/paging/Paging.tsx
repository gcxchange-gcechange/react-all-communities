import * as React from 'react';
import { css } from '@uifabric/utilities/lib/css';
import { ActionButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { IPagingProps, IPagingState } from "./index";
import styles from "./Paging.module.scss";


/**
 * A custom pagination control designed to look & feel like Office UI Fabric
 */
export class Paging extends React.Component<IPagingProps, IPagingState> {
    public render(): React.ReactElement<IPagingProps> {

        const { currentPage, nextButtonLabel, previousButtonLabel, nextButtonAriaLabel, previousButtonAriaLabel, firstButtonLabel, firstButtonAriaLabel, lastButtonLabel, lastButtonAriaLabel } = this.props;


        // calculate the page situation
        const numberOfPages: number = this._getNumberOfPages().length;
        console.log("NumPages", numberOfPages);


        // we disable the previous button if we're on page 1
        const prevDisabled: boolean = currentPage < 2;

        // we disable the next button if we're on the last page
        const nextDisabled: boolean = currentPage >= numberOfPages;



        return (
            <div className={css(styles.Paging, this.props.showPageNumber ? null : styles.noPageNum)}>
              <ActionButton className={styles.prev}
                onRenderIcon={(_props: IButtonProps) => {
                        // we use the render custom icon method to render the icon consistently with the right icon
                        return (
                            <Icon iconName="DoubleChevronLeft" />
                        );
                    }}
                    disabled={prevDisabled}
                    onClick={this._goToFirstPage}
                    ariaLabel={firstButtonAriaLabel}>

              </ActionButton>
                <ActionButton className={styles.prev}
                    onRenderIcon={(_props: IButtonProps) => {
                        // we use the render custom icon method to render the icon consistently with the right icon
                        return (
                            <Icon iconName="ChevronLeft" />
                        );
                    }}
                    disabled={prevDisabled}
                    onClick={this._prevPage}
                    ariaLabel={previousButtonAriaLabel}
                >
                    {previousButtonLabel}
                </ActionButton>
              {/* NOT IMPLEMENTED: Page numbers aren't shown here, but we'll need them if we want this control to be reusable */}

                <ul>

                 {this._getNumberOfPages().map( itemNumber =>
                  <li id={itemNumber.toString()} aria-label={`Page ${itemNumber}`}>{
                    itemNumber === currentPage
                       ? <a className={styles.currentPage}>{currentPage}</a>
                       : <a onClick={() => {}}>{itemNumber}</a>}
                  </li>)}
                  {/* <div className={styles.circleTxt}>{currentPage}</div> */}
                </ul>

                <ActionButton className={styles.next}
                    disabled={nextDisabled}
                    onRenderMenuIcon={(_props: IButtonProps) => {
                        // we use the render custom menu icon method to render the icon to the right of the text
                        return (
                            <Icon iconName="ChevronRight" />
                        );
                    }}
                    onClick={this._nextPage}
                    ariaLabel={nextButtonAriaLabel}
                >
                    {nextButtonLabel}
                </ActionButton>

                <ActionButton className={styles.prev}
                onRenderIcon={(_props: IButtonProps) => {
                        // we use the render custom icon method to render the icon consistently with the right icon
                        return (
                            <Icon iconName="DoubleChevronRight" />
                        );
                    }}
                    disabled={nextDisabled}
                    onClick={this._goToLastPage}
                    ariaLabel={firstButtonAriaLabel}>

              </ActionButton>
            </div>
        );
    }


    /**
     * Increments the page number unless we're on the last page
     */
    private _nextPage = (): void => {
        const numberOfPages: number = this._getNumberOfPages().length;
        if (this.props.currentPage < numberOfPages) {
            this.props.onPageUpdate(this.props.currentPage + 1);
        }
    }

    /**
     * Decrements the page number unless we're on the first page
     */
    private _prevPage = (): void => {
        if (this.props.currentPage > 1) {
            this.props.onPageUpdate(this.props.currentPage - 1);
        }
    }

    private _goToFirstPage = (): void => {
        const number: number = this._getNumberOfPages().length;
        console.log("first", number)
        if( number !== 1) {
          this.props.onPageUpdate(1)
        }
    }


    private _goToLastPage = (): void => {
      const number: number = this.props.currentPage;
      const lastItem = this._getNumberOfPages()[this._getNumberOfPages().length - 1];

      if(number !== lastItem) {
        this.props.onPageUpdate(lastItem)
      }
  }


    /**
     * Calculates how many pages there will be
     */


    private _getNumberOfPages(): number[] {
        const { numberOfItems, itemsCountPerPage} = this.props;

        let numPages: number = Math.ceil(numberOfItems / itemsCountPerPage);
        let numbers: number[] = [];
        for (let i = 0; i < numPages; i++) {
        numbers.push(i + 1);
        }
        console.log("num",numbers);

        // console.log("numPages", numPagesArray);
        return numbers;
    }




}
