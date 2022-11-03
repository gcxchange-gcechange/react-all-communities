import * as React from 'react';
import styles from './GridLayout.module.scss';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle, ISize } from 'office-ui-fabric-react/lib/Utilities';
import { IGridLayoutProps } from './GridLayout.types';
import { Stack } from 'office-ui-fabric-react';


const ROWS_PER_PAGE: number = +styles.rowsPerPage;
const MAX_ROW_HEIGHT: number = +styles.maxWidth;
const PADDING: number = +styles.padding;
const MIN_WIDTH: number = +styles.minWidth;


export class GridLayout extends React.Component<IGridLayoutProps> {

  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;


  public render(): React.ReactElement<IGridLayoutProps> {

    return (
      <div role="group" aria-label={this.props.ariaLabel}>
         <FocusZone>
           <List
            role="presentation"
            className={styles.gridLayout}
            items={this.props.items}
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
    if(itemIndex !== 0) {

      this._columnCount = Math.ceil(surfaceRect.width / (MAX_ROW_HEIGHT));
      this._columnWidth = Math.max(MIN_WIDTH, Math.floor(surfaceRect.width / this._columnCount) + Math.floor(PADDING / this._columnCount));
      this._rowHeight = this._columnWidth;
    }


    return this._columnCount + this._columnWidth +  this._rowHeight * ROWS_PER_PAGE;
  }

  private _getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  private _onRenderCell = (item: any, index: number | undefined): JSX.Element => {

    const cellPadding: number = index % this._columnCount !== this._columnCount - 1  ? PADDING : 0;
    const cellWidth: number =  this._columnWidth - PADDING;


      return (
          <div >
          {/* style={{ marginRight: `${cellPadding}px`}} > */}
          {/* style={{width: `${cellWidth}px`, marginRight: `${cellPadding}px`}} > */}

            {this.props.onRenderGridItem(item)}

          </div>
      );
    }
}
