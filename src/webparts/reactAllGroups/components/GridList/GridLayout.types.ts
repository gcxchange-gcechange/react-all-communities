import { IListProps } from 'office-ui-fabric-react/lib/List';

export interface IGridLayoutProps {
  sort?: string;
  /**
   * Accessible text for the grid layout
   */
  ariaLabel?: string;

  /**
   * The array of items to display
   */
  items: any[];

  /**
   * In case you want to override the underlying list
   */
  listProps?: Partial<IListProps>;

  /**
   * The method to render each cell item
   */
  onRenderGridItem: (item: any, index: any) => JSX.Element;



}

