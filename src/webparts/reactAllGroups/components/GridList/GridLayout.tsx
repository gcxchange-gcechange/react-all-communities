import * as React from 'react';
import styles from './GridLayout.module.scss';
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import { IGridLayoutProps } from './GridLayout.types';




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


      return (

          <div data-is-focusable>
             {/* style={{width: `${cellWidth}px`, marginRight: `${cellPadding}px`}} > */}
          {/* style={{ marginRight: `${cellPadding}px`}} > */}

            {this.props.onRenderGridItem(item, index)}

          </div>
      );
    }
}
