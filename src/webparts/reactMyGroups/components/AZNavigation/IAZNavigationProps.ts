export interface IAZNavigationProps {
  Letters:string;
  selectedIndexKey: string;
  onIndexSelect: (index: string) => void;
  onSearch: (searchQuery: string) => void;
  onClearSearch: () => void;

}
