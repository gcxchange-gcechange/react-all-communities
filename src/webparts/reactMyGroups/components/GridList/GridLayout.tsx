import * as React from 'react';
import styles from './GridLayout.module.scss';

// Used to render list grid
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle, ISize } from 'office-ui-fabric-react/lib/Utilities';
import { Spinner, TagItemSuggestion } from 'office-ui-fabric-react';

import { IGridLayoutProps, IGridLayoutState } from './GridLayout.types';
import { groups } from 'ReactMyGroupsWebPartStrings';

const ROWS_PER_PAGE: number = +styles.rowsPerPage;
const MAX_ROW_HEIGHT: number = +styles.maxWidth;
const PADDING: number = +styles.padding;
const MIN_WIDTH: number = +styles.minWidth;
const COMPACT_THRESHOLD: number = +styles.compactThreshold;


export class GridLayout extends React.Component<IGridLayoutProps, IGridLayoutState> {
  constructor(props: IGridLayoutProps) {
    super(props);
    this.state = {
      isLoading: true,

    };

  }
  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;
  private _isCompact: boolean;




  public render(): React.ReactElement<IGridLayoutProps> {


    console.log(this.props.items);



    return (
      <div role="group" aria-label={this.props.ariaLabel}>
         <FocusZone>
          <List
            role="presentation"
            className={styles.gridLayout}
            items={this.props.items.filter(group => {return group.hasOwnProperty('url');})}
            getItemCountForPage={this._getItemCountForPage}
            getPageHeight={this._getPageHeight}
            onRenderCell={this._onRenderCell}
            {...this.props.listProps}
          />
        </FocusZone>
      </div>
    );

  }



  private _getItemCountForPage = (itemIndex: number, surfaceRect: IRectangle): number => {

      this._columnCount = Math.ceil(surfaceRect.width / (MAX_ROW_HEIGHT));
      this._columnWidth = Math.max(MIN_WIDTH, Math.floor(surfaceRect.width / this._columnCount) + Math.floor(PADDING / this._columnCount));
      this._rowHeight = this._columnWidth;

    return this._columnCount + this._columnWidth +  this._rowHeight * ROWS_PER_PAGE;
  }

  private _getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  }



  private _onRenderCell = (item: any, index: number | undefined): JSX.Element => {

    const isCompact: boolean = this._isCompact;
    const cellPadding: number = index % this._columnCount !== this._columnCount - 1  ? PADDING : 0;
    const finalSize: ISize = { width: this._columnWidth, height: this._rowHeight };
    const cellWidth: number = isCompact ? this._columnWidth + PADDING : this._columnWidth - PADDING;
    let _totalPages = Math.ceil(item.length / 2);


      return (
          <div className={styles.rendergrid} style={{width: `${cellWidth}px`, marginRight: `${cellPadding}px`}} >


            {this.props.onRenderGridItem(item)}

          </div>

      );

    }


}
