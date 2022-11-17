import * as React from 'react';
import styles from './GridLayout.module.scss';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle, ISize } from 'office-ui-fabric-react/lib/Utilities';
import { IGridLayoutProps } from './GridLayout.types';
import { KeyCodes, getRTLSafeKeyCode } from 'office-ui-fabric-react';



const ROWS_PER_PAGE: number = +styles.rowsPerPage;
const MAX_ROW_HEIGHT: number = +styles.maxWidth;
const PADDING: number = +styles.padding;
const MIN_WIDTH: number = +styles.minWidth;



export class GridLayout extends React.Component<IGridLayoutProps> {

  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;



  public render(): React.ReactElement<IGridLayoutProps> {

    const totalItems = this.props.items.length;


    return (
         <FocusZone
            aria-label={`There are ${totalItems} items in grid layout.
            Use left and right arrow keys to navigate between the sites in the grid.`}
           role="grid" isCircularNavigation={true}
           as="div" direction={FocusZoneDirection.vertical}>
           <List
            className={styles.gridLayout}
            items={this.props.items}
            getItemCountForPage={this._getItemCountForPage}
            getPageHeight={this._getPageHeight}
            onRenderCell={this._onRenderCell}
            renderedWindowsAhead={4}
            data-is-focusable={true}
            {...this.props.listProps}
          />
        </FocusZone>

    );

  }


  private _getItemCountForPage = (itemIndex: number, surfaceRect: IRectangle): number => {

    if(itemIndex === 0) {

      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.max(MIN_WIDTH, Math.floor(surfaceRect.width / this._columnCount) + Math.floor(PADDING / this._columnCount));
      this._rowHeight = this._columnWidth;
    }

    return  this._columnCount + this._columnWidth +  this._rowHeight * ROWS_PER_PAGE;
  }

  private _getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  private _onRenderCell = (item: any, index: number | undefined): JSX.Element => {

    const cellPadding: number = index % this._columnCount !== this._columnCount - 1  ? PADDING : 0;
    const cellWidth: number =  this._columnWidth - PADDING;


      return (
          <div data-is-focusable={true}>
             {/* style={{width: `${cellWidth}px`, marginRight: `${cellPadding}px`}} > */}
          {/* style={{ marginRight: `${cellPadding}px`}} > */}


            {this.props.onRenderGridItem(item)}

          </div>
      );
    }
}
