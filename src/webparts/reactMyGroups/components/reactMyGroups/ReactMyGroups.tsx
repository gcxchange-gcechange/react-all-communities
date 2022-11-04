import * as React from "react";
import styles from "./ReactMyGroups.module.scss";
import { IReactMyGroupsProps } from "./IReactMyGroupsProps";
import GroupService from "../../../../services/GroupService";
import { IReactMyGroupsState } from "./IReactMyGroupsState";
import { IGroup } from "../../../../models";
import { Spinner } from "office-ui-fabric-react";
import { GridLayout } from "../GridList";
import { SelectLanguage } from "../SelectLanguage";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { AZNavigation } from "../AZNavigation/AZNavigation";
import mockData from "../../../../services/mockData";

export class ReactMyGroups extends React.Component<
  IReactMyGroupsProps,
  IReactMyGroupsState
> {
  constructor(props: IReactMyGroupsProps) {
    super(props);

    this.state = {
      groups: [],
      isLoading: true,
      currentPage: 1,
      pagelimit: 0,
      showless: false,
      pageSeeAll: false,
      selectedLetter: "A",
      errorMessage: null,
      numberOfCommunities: null,
    };
  }

  public strings = SelectLanguage(this.props.prefLang);

  //Selected Letter by user
  public handleClickEvent = (letter: string) => {
    this.setState(
      {
        selectedLetter: this.props.selectedLetter,
      },
      //functions that renders groups based on user selected letter
      function () {
        this._setLoading(true);
        this._getGroups(letter);
      }
    );
  }

  public componentDidMount(): void {
    this._getGroups(this.state.selectedLetter);
  }

  public _getGroups = (letter: string): void => {
    GroupService.getGroups(letter).then((groupData) => {
      this.setState({
        groups: groupData,
      });
      this._getGroupsLinks(groupData);
    });
  }

  public _getGroupsLinks = (groups: any): void => {
    let groupsCompleted = 0;
    let totalGroups = groups.length;

    if (totalGroups == 0) {
      this._setLoading(false);
    }

    groups.map((groupItem) =>
      GroupService.getGroupLinksBatch(groupItem)
        .then((groupUrl) => {
          groupsCompleted++;

          if (
            groupUrl[1] &&
            (groupUrl[1].value !== null || groupUrl[1].value !== undefined)
          ) {
            this.setState((prevState) => ({
              groups: prevState.groups.map((group) =>
                group.id === groupItem.id
                  ? {
                      ...group,
                      url: groupUrl[1].webUrl,
                      siteId: groupUrl[1].id,
                      modified: groupUrl[1].lastModifiedDateTime,
                      members: groupUrl[2],
                    }
                  : group
              ),
            }));
          } else {
            let index = this.state.groups
              .map((g) => g.id)
              .indexOf(groupItem.id);
            let groupsCopy = JSON.parse(JSON.stringify(this.state.groups));
            groupsCopy.splice(index, 1);

            this.setState({
              groups: groupsCopy,
            });
          }

          if (groupsCompleted >= totalGroups) {
            this._getGroupThumbnails(this.state.groups);
            console.log(this.state.groups);
          }
        })
        .catch((error) => {
          this.setState({
            errorMessage: "OOPS" + error,
          });
        })
    );
  }

  // public _getGroupActivity =(groups:any):void => {
  //   mockData.map(item => {
  //     this.setState(prevState => ({
  //       groups: prevState.groups.map(group => item.id === groups.id ? {...group, fileCount: item.fileCount}:group),
  //     }));
  //   });
  //   this._getGroupThumbnails(groups);
  // }

  public _getGroupThumbnails = (groups: any): void => {
    let groupsCompleted = 0;
    let totalGroups = groups.length;

    if (totalGroups == 0) {
      this._setLoading(false);
    }

    groups.map((groupItem) =>
      GroupService.getGroupThumbnails(groupItem).then((grouptb) => {
        groupsCompleted++;

        //set group color:
        this.setState((prevState) => ({
          groups: prevState.groups.map((group) =>
            group.id === groupItem.id
              ? { ...group, thumbnail: grouptb, color: "#0078d4" }
              : group
          ),
        }));

        if (groupsCompleted >= totalGroups) {
          this._setLoading(false);
        }
      })
    );
    this._pageViews(this.state.groups);
  }

  public _pageViews = (groups: any): void => {
    groups.map((item) =>
      GroupService.pageViewsBatch(item).then((siteCount) => {
        this.setState((prevState) => ({
          groups: prevState.groups.map((group) =>
            group.id === item.id
              ? { ...group, views: siteCount[1].access.actionCount }
              : group
          ),
        }));
      })
    );
  }

  private _setLoading(state: boolean) {
    this.setState({
      isLoading: state,
    });
  }

  private _onRenderGridItem = (item: any): JSX.Element => {
    const options: any = { year: "numeric", month: "long", day: "2-digit" };

    // let dateCreated = new Date(item.createdDateTime).toLocaleDateString('en-CA', options) ;
    // let dateCreatedFR = new Date(item.createdDateTime).toLocaleDateString('fr-CA', options) ;

    // let modifiedDate = new Date(item.modified).toLocaleDateString('en-CA', options);
    // let modifiedDateFR = new Date(item.modified).toLocaleDateString('fr-CA', options);

    return (
      <div className={styles.siteCard}>
        <a href={item.url}>
          <div className={styles.cardBanner}>
            <div
              className={styles.topBanner}
              style={{ backgroundColor: item.color }}
            ></div>
            <img
              className={styles.bannerImg}
              src={item.thumbnail}
              alt={`${this.strings.altImgLogo} ${item.displayName} `}
            />
            <div className={styles.cardTitle}>{item.displayName}</div>

            {/* <p className = {styles.subTitle}>{this.strings.groups}</p> */}
          </div>
        </a>

        <div className={` ${styles.secondSection} ${styles.articleFlex}`}>
                <div className={styles.cardDescription} aria-label={item.description}>{item.description}</div>
                <div className={styles.cardFooter}>
                  <div className={styles.footerRow}>
                    <div >
                      {(this.strings.userLang === 'FR'? this.strings.members : this.strings.members)}
                      <span className={styles.pl5}>{item.members}</span>
                    </div>

                    <div >
                      {(this.strings.userLang ==='FR' ? this.strings.created : this.strings.created)}
                      <span className={styles.pl5}>{(this.strings.userLang ==='FR' ? new Date(item.createdDateTime).toLocaleDateString('fr-CA') : new Date(item.createdDateTime).toLocaleDateString('en-CA'))}</span>
                    </div>
                  </div>

                  <div className={styles.footerRow}>

                   <div >
                      {(this.strings.userLang === 'FR' ? this.strings.siteViews : this.strings.siteViews)}
                      <span className={styles.pl5}>{item.views}</span>
                    </div>

                      <div>
                        {(this.strings.userLang === 'FR' ? this.strings.lastModified : this.strings.lastModified)}
                      <span className={styles.pl5}>{(this.strings.userLang ==='FR' ? new Date(item.modified).toLocaleDateString('fr-CA') : new Date(item.modified).toLocaleDateString('en-CA'))}</span>
                    </div>

                  </div>


                </div>
              </div>

      </div>
    );
  }

  public render(): React.ReactElement<IReactMyGroupsProps> {
    //Sorting in the Control panel
    let myData = [];
    this.props.sort == "DateCreation"
      ? (myData = []
          .concat(this.state.groups)
          .sort((a, b) => (a.createdDateTime < b.createdDateTime ? 1 : -1)))
      : (myData = []
          .concat(this.state.groups)
          .sort((a, b) => (a.displayName < b.displayName ? 1 : -1)));

    let pagedItems: any[] = myData;

    // total the groups that are not status code 403
    let totalItems: any[] = this.state.groups;

    return (
      <div className={styles.reactMyGroups}>
        <div className={styles.addComm}>
          <Icon iconName="Add" className={styles.addIcon} />
          <a
            aria-label={this.strings.seeAllLabel}
            href={this.props.addCommLink}
            target="_blank"
          >
            {!this.props.commLink
              ? this.strings.createComm
              : this.props.commLink}
          </a>
        </div>
        <div className={styles.flexCenter}>
        <AZNavigation
          selectedLetter={this.props.selectedLetter}
          onClickEvent={this.handleClickEvent}
        />
        {this.state.isLoading ? (
          <Spinner label={this.strings.loadingState} />
        ) : totalItems !== null && totalItems.length >= 1 ? (
          <div>
            <div className={styles.groupsContainer}>
              <GridLayout
                sort={this.props.sort}
                items={pagedItems}
                onRenderGridItem={(item: any) => this._onRenderGridItem(item)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.noResults}>
            {this.strings.userLang === "FR"
              ? this.strings.noResultsFR
              : this.strings.noResultsEN}
          </div>
        )}
        </div>
      </div>
    );
  }
}
