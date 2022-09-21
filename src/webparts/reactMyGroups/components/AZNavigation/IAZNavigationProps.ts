export interface IAZNavigationProps {

  selectedIndexKey: string;
  onIndexSelect: (index: string) => void;
  onSearch: (searchQuery: string) => void;
  onClearSearch: () => void;

}
