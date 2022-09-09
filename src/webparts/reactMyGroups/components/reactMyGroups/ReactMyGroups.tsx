import * as React from 'react';
import styles from './ReactMyGroups.module.scss';
import { IReactMyGroupsProps } from './IReactMyGroupsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import GroupService from '../../../../services/GroupService';
import { IReactMyGroupsState } from './IReactMyGroupsState';
import { GroupList } from '../GroupList';
import { IGroup } from '../../../../models';
import { Spinner, ISize, FontSizes } from 'office-ui-fabric-react';
import { GridLayout } from '../GridList';
import { SelectLanguage } from '../SelectLanguage';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Paging } from '../paging/Paging';
import { ListLayout } from '../ListLayout';
import { Icon } from 'office-ui-fabric-react/lib/Icon';




//const colors = ['#0078d4'];

export class ReactMyGroups extends React.Component<IReactMyGroupsProps, IReactMyGroupsState> {

  constructor(props: IReactMyGroupsProps) {
    super(props);

    this.state = {
      groups: [],
      isLoading: true,
      currentPage: 1,
      pagelimit: 0,
      showless: false,
      pageSeeAll: false
    };

  }

  public strings = SelectLanguage(this.props.prefLang);

  public render(): React.ReactElement<IReactMyGroupsProps> {

    //Sorting in the Control panel
    let myData =[];
    (this.props.sort == "DateCreation") ? myData = [].concat(this.state.groups).sort(( a, b ) => a.createdDateTime < b. createdDateTime ? 1 : -1) :
    myData = [].concat(this.state.groups).sort(( a, b ) => a.displayName < b.displayName ? 1 : -1);

    let pagedItems: any[] = myData;
    const totalItems: number = pagedItems.length;
    let showPages: boolean = false;

    let maxEvents: number = this.props.numberPerPage;
    const { currentPage } = this.state;

    //if on see all page, only show 20 at the time
    if(this.props.toggleSeeAll){
      maxEvents = 20;
    }
    if (true && totalItems > 0 && totalItems > maxEvents) {

      const pageStartAt: number = maxEvents * (currentPage - 1);
      const pageEndAt: number = (maxEvents * currentPage);

      pagedItems = pagedItems.slice(pageStartAt, pageEndAt);
      showPages = true;
    }

    return (
      <div className={ styles.reactMyGroups }  >
        <div className={styles.title} role="heading" aria-level={2}>{(this.strings.userLang == "FR"? this.props.titleFr : this.props.titleEn)} </div>

        <div className={styles.seeAll}>{this.props.toggleSeeAll == false && <a aria-label={this.strings.seeAllLabel} href={this.props.seeAllLink}>{this.strings.seeAll}</a>}
        <a className={styles.addComm} href={this.props.addCommLink}><Icon iconName='Add' className={styles.addIcon}/>{this.strings.addCommLink}</a>
        </div>
          {this.state.isLoading ?
            <Spinner label={this.strings.loadingState}/>
                :
              <div>
                <div className = {styles.groupsContainer}>
                  {this.props.layout == 'Compact' ?
                  <GroupList groups={ pagedItems } onRenderItem={(item: any, index: number) => this._onRenderItem(item, index)}/>
                  :
                  this.props.layout == 'Grid' ?
                  <GridLayout sort={ this.props.sort } items= { pagedItems } onRenderGridItem={(item: any, finalSize: ISize, isCompact: boolean) => this._onRenderGridItem(item, finalSize, isCompact)}/>
                  :
                  <ListLayout sort={ this.props.sort } items={ pagedItems } onRenderListItem={(item: any, finalSize: ISize, isCompact: boolean) => this._onRenderListItem(item, finalSize, isCompact)}/>
                }
                    { this.props.toggleSeeAll?
                    <div>
                        <Paging
                          showPageNumber={ true }
                          currentPage = { currentPage }
                          itemsCountPerPage={ 21 }
                          totalItems={ totalItems }
                          onPageUpdate={ this._onPageUpdate }
                          nextButtonLabel={ this.strings.pagNext }
                          previousButtonLabel={ this.strings.pagPrev }
                        />
                    </div> : ""
                    }
                </div>
              </div>
          }
      </div>
    );
  }

  public componentDidMount (): void {
    this._getGroups();
    this.setState({
      pagelimit: this.props.numberPerPage
    });
  }

  public _getGroups = (): void => {
    GroupService.getGroups().then(groups => {
      this.setState({
        groups: groups
      });
      this._getGroupLinks(groups);
      //this._getGroupThumbnails(groups);
    });
  }


  public _getGroupLinks = (groups: any): void => {
    groups.map( groupItem => (
     GroupService.getGroupLinks(groupItem).then(groupUrl => {
       //change the state

       this.setState(prevState => ({
         groups: prevState.groups.map(group => group.id === groupItem.id ? {...group, url: groupUrl} : group)

       }));

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
    console.log('Set False');
    this.setState({
      isLoading: false
    });

  }



  private _onRenderItem = (item: any, index: number): JSX.Element => {
    return (
      <div className={styles.compactContainer}>
        <a className={styles.compactA} href={item.url}>
          <div className={styles.compactWrapper}>
            <img className={styles.compactBanner} src={item.thumbnail} alt={`${this.strings.altImgLogo} ${item.displayName}`} />
            <div className={styles.compactDetails}>
              <div className={styles.compactTitle}>{item.displayName}</div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  private _onRenderGridItem = (item: any, finalSize: ISize, isCompact: boolean): JSX.Element => {
    // console.log("GRIDITEM", item)
    return (
      <div className={styles.siteCard}>
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
                  <div style={{display: 'flex'}}><Icon iconName="Market" className={styles.addIcon} />
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

  private _onRenderListItem = (item: any, finalSize: ISize, isCompact: boolean): JSX.Element => {

    return (
        <div className={styles.siteCardList}>
        <a className="community-list-item" href={item.url}>
           <div className={styles.cardBannerList}>
                <div className={styles.articleFlex} style={{'width':'60px'}}>
                   <img className={styles.bannerImgList} src={item.thumbnail} alt={`${this.strings.altImgLogo} ${item.displayName}`} />
                </div>
                <div className={`${styles.articleFlex} ${styles.secondSection}`}>
                  <div className={styles.cardTitleList}>{item.displayName}</div>
                  <div className={styles.cardDescription}>{item.description}</div>

              </div>
              </div>
            </a>
          </div>
          );
        }

  private _onPageUpdate = (pageNumber: number): void => {
    this.setState({
    currentPage: pageNumber
    });
  }

}
