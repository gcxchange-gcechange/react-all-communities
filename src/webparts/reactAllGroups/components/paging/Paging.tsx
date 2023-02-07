import * as React from 'react';
import { css } from '@uifabric/utilities/lib/css';
import { ActionButton, DefaultButton, IButtonProps, IButtonStyles, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { IPagingProps, IPagingState } from "./index";
import styles from "./Paging.module.scss";
import { Stack } from 'office-ui-fabric-react';



/**
 * A custom pagination control designed to look & feel like Office UI Fabric
 */
export class Paging extends React.Component<IPagingProps, IPagingState> {

    public render(): React.ReactElement<IPagingProps> {

        const { currentPage,
          nextButtonLabel,
          previousButtonLabel,
          nextButtonAriaLabel,
          previousButtonAriaLabel,
          firstButtonLabel,
          lastButtonLabel,
          currentPageLabel,
          goToPageLabel } = this.props;


        // calculate the page situation
        const numberOfPages: number = this._getNumberOfPages().length;
        // console.log("NumPages", numberOfPages);


        // we disable the previous button if we're on page 1
        const prevDisabled: boolean = currentPage < 2;

        // we disable the next button if we're on the last page
        const nextDisabled: boolean = currentPage >= numberOfPages;


        const buttonStyles: IButtonStyles = {
        root:{
          padding: '0px',
          minWidth: '30px',
          borderRadius: '50%',
          borderColor: 'transparent'

        },

        rootHovered: {
          backgroundColor: "lightgray"
        }

      };

        return (
            <Stack horizontal  horizontalAlign="center" verticalAlign="center">

              <ActionButton className={styles.prev}
                onRenderIcon={(_props: IButtonProps) => {
                        // we use the render custom icon method to render the icon consistently with the right icon
                        return (
                            <Icon iconName="DoubleChevronLeft" />
                        );
                    }}
                    disabled={prevDisabled}
                    onClick={this._goToFirstPage}
                    ariaLabel={firstButtonLabel}/>

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




                 {this._getNumberOfPages().map( itemNumber =>
                  <div id={itemNumber.toString()}  tabIndex={0}   onClick={() => this._goToPage(itemNumber) }>{
                    itemNumber === currentPage
                       ? <DefaultButton styles={buttonStyles} className={styles.currentPage} aria-label={`${currentPageLabel}, ${currentPage}`} aria-current={true}>
                        {currentPage}
                        </DefaultButton>
                       : <DefaultButton  styles={buttonStyles} id={itemNumber.toString()} aria-label={`${goToPageLabel} ${itemNumber}`} >{itemNumber}</DefaultButton>}
                  </div>)}



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
                    ariaLabel={lastButtonLabel}>

              </ActionButton>
            </Stack>
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
        if( number !== 1) {
          this.props.onPageUpdate(1);
        }
    }


    private _goToLastPage = (): void => {
      const number: number = this.props.currentPage;
      const lastItem = this._getNumberOfPages()[this._getNumberOfPages().length - 1];

      if(number !== lastItem) {
        this.props.onPageUpdate(lastItem);
      }
    }

    private _goToPage = (itemNumber):void => {
        const pageNumber: number[]  = this._getNumberOfPages();
        const selected = pageNumber.indexOf(itemNumber);
        this.props.onPageUpdate(pageNumber[selected]);
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

        return numbers;
    }




}
