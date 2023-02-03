export interface IPagingProps {
    currentPage: number;
    numberOfItems: number;
    itemsCountPerPage: number;
    showPageNumber: boolean;
    nextButtonLabel: string;
    previousButtonLabel: string;
    nextButtonAriaLabel?: string;
    previousButtonAriaLabel?: string;
    firstButtonLabel: string;
    lastButtonLabel: string;
    firstButtonAriaLabel?: string;
    lastButtonAriaLabel?: string;
    currentPageLabel?:string;
    goToPageLabel?: string;
    onPageUpdate: (pageNumber: number) => void;
}

export interface IPagingState { }
