import * as React from 'react';
import styles from './ReactMyGroups.module.scss';
import { IReactMyGroupsProps } from './IReactMyGroupsProps';
import GroupService from '../../../../services/GroupService';
import { IReactMyGroupsState } from './IReactMyGroupsState';
import { IGroup } from '../../../../models';
import { Spinner, ISize, FontSizes, nullRender, TagItemSuggestion } from 'office-ui-fabric-react';
import { GridLayout } from '../GridList';
import { SelectLanguage } from '../SelectLanguage';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Paging } from '../paging/Paging';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { AZNavigation } from '../AZNavigation/AZNavigation';



export class ReactMyGroups extends React.Component<IReactMyGroupsProps, IReactMyGroupsState> {

  constructor(props: IReactMyGroupsProps) {
    super(props);

    this.state = {
      groups: [],
      isLoading: true,
      currentPage: 1,
      pagelimit: 0,
      showless: false,
      pageSeeAll: false,
      selectedLetter: 'A',
      errorMessage: null

    };

  }


  public strings = SelectLanguage(this.props.prefLang);

//Selected Letter by user
  public handleClickEvent = (letter: string) => {

    this.setState({
      selectedLetter: this.props.selectedLetter,
    },
    //functions that renders groups based on user selected letter
      function () {
        this._getGroups(letter);
      });

  }


  public render(): React.ReactElement<IReactMyGroupsProps> {

    //Sorting in the Control panel
    let myData =[];
    (this.props.sort == "DateCreation") ? myData = [].concat(this.state.groups).sort(( a, b ) => a.createdDateTime < b. createdDateTime ? 1 : -1) :
    myData = [].concat(this.state.groups).sort(( a, b ) => a.displayName < b.displayName ? 1 : -1);


    let pagedItems: any[] = myData;

    // filter through groups that are not statuscode 403 and have a url

    let newPagedItems = pagedItems.filter(groupData => {
      return groupData.hasOwnProperty('url');

    });

    // total the groups that are not status code 403
    let totalItems: number = pagedItems.length;
    console.log("Tot",totalItems);



    let showPages: boolean = false;

    let maxEvents: number = this.props.numberPerPage;
    const { currentPage } = this.state;


    return (

      <div className={ styles.reactMyGroups }  >
        <div className={styles.addComm}><Icon iconName='Add' className={styles.addIcon}/><a aria-label={this.strings.seeAllLabel} href={this.props.addCommLink} target='_blank'>{(!this.props.commLink ? this.strings.createComm : this.props.commLink)}</a></div>
        <AZNavigation selectedLetter={this.props.selectedLetter} onClickEvent={this.handleClickEvent}/>
          {this.state.isLoading  ?
            <Spinner label={this.strings.loadingState}/>
          :
           totalItems ?
              <div>
                <div className = {styles.groupsContainer}>
                  <GridLayout sort={ this.props.sort } items={ newPagedItems } onRenderGridItem={(item: any) => this._onRenderGridItem(item)}/>
                </div>
              </div>
          :
          <div className = {styles.noResults}>{this.state.errorMessage}</div>
              // <div className = {styles.noResults}>{(this.strings.userLang === 'FR'? this.strings.noResultsFR : this.strings.noResultsEN)}</div>
            }
      </div>
    );
  }

  public componentDidMount (): void {
    this._getGroups(this.state.selectedLetter);

  }


  public  _getGroups = (letter: string): void => {
    GroupService.getGroups(letter).then(groupData => {
      this.setState({
        groups: groupData,
      });
      this._getGroupLinks(groupData);
    });
  }



  public _getGroupLinks = (groups: any): void => {
    groups.map( groupItem => (
     GroupService.getGroupLinksBatch(groupItem).then(groupUrl => {

          this.setState(prevState => ({
           groups: prevState.groups.map(group => group.id === groupItem.id ? {...group, url: groupUrl} : group)

         }));

          //change the state

     }).catch(error => {
      this.setState({
        errorMessage: "OOPS" + error
      });
     })
    ));

    this._getGroupThumbnails(groups);
  }


  // public _getGroupActivity = (groups: any): void => {
  //   groups.map(groupItem => (
  //     GroupService.getGroupActivity(groupItem).then(groupActivity => {

  //       this.setState(prevState => ({
  //         groups: prevState.groups.map(group => group.id === groupItem.id ? {...group, activity: groupActivity} : group)
  //       }));
  //     })
  //   ));

  //   this._getGroupThumbnails(groups);
  // }

  public _getGroupThumbnails = (groups: any): void => {
    groups.map(groupItem => (
      GroupService.getGroupThumbnails(groupItem).then(grouptb => {
        //set group color:

        this.setState(prevState => ({
          groups: prevState.groups.map(group => group.id === groupItem.id ? {...group, thumbnail: grouptb, color: "#0078d4"} : group)
        }));
      })
    ));
    //console.log('Set False');
    this.setState({
      isLoading: false
    });

  }



  private _onRenderGridItem = (item: any): JSX.Element => {


   return (

     <div className={styles.siteCard } >
         <a href={item.url}>
           <div className={styles.cardBanner}>
             <div className={styles.topBanner} style={{backgroundColor: item.color}}></div>
             <img className={styles.bannerImg} src={item.thumbnail} alt={`${this.strings.altImgLogo} ${item.displayName} `}/>
             <div className={styles.cardTitle}>{item.displayName}</div>
             <p className={styles.groups}>{this.strings.groups} </p>
           </div>
         </a>

         <div className={` ${styles.secondSection} ${styles.cardBanner2}`}>
           <ul className={`${styles.groups} ${styles.articleFlex}`}>
               <li className={` ${styles.cardBannerList} `}>
                 <div style={{display: 'flex'}}>
                 <a>
                   <p><strong></strong></p>
                 </a>
                 </div>
               </li>
           </ul>
         </div>
     </div>

   );
 }



  private _onPageUpdate = (pageNumber: number): void => {
    this.setState({
    currentPage: pageNumber
    });
  }

}
