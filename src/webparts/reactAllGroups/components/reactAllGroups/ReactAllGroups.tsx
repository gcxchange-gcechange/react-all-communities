import * as React from "react";
import styles from "./ReactAllGroups.module.scss";
import { IReactAllGroupsProps } from "./IReactAllGroupsProps";
import GroupService from "../../../../services/GroupService";
import { IReactAllGroupsState } from "./IReactAllGroupsState";
import { IGroup } from "../../../../models";
import { DefaultButton, SelectionDirection, Spinner, TagItemSuggestion } from "office-ui-fabric-react";
import { GridLayout } from "../GridList";
import { SelectLanguage } from "../SelectLanguage";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Stack, Image, IImageProps, ImageFit, PrimaryButton } from "office-ui-fabric-react";
import { AZNavigation } from "../AZNavigation/AZNavigation";
import { Paging } from "../paging";
import { groups } from "ReactAllGroupsWebPartStrings";
import { findIndex, split } from "lodash";



export class ReactAllGroups extends React.Component<
  IReactAllGroupsProps,
  IReactAllGroupsState
> {
  constructor(props: IReactAllGroupsProps) {
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
      pageCount: 0,
      nextPageUrl: '',
      showLoader: true,
      numberOfLoadClicks: 0



    };
  }

  public strings = SelectLanguage(this.props.prefLang);

  //Selected Letter by user
  public handleClickEvent = (letter: string) => {
    this.setState(
      {
        selectedLetter: this.props.selectedLetter,
        currentPage: 1,
        nextPageUrl: ''
      },
      //functions that renders groups based on user selected letter
      function () {
        const {numberPerPage} = this.props;
        this._setLoading(true);
        this._getGroups(letter, numberPerPage);


      }
    );
  }

  public componentDidMount(): void {
    const {numberPerPage} = this.props;
    this._getGroups(this.state.selectedLetter, numberPerPage);

  }

  // public componentDidUpdate(prevProps: Readonly<IReactAllGroupsProps>, prevState: Readonly<IReactAllGroupsState>, snapshot?: any): void {
  //   if (prevState.nextPageUrl !== this.state.nextPageUrl) {
  //     console.log("this is updated");
  //     this._getnextPage()

  //   }
  // }


  public _getGroups = (letter: string, numberPerPage: number): void => {
    GroupService.getGroupsBatch(letter, numberPerPage).then((groupData) => {


      let pageCount = 0;
      let url = '';
      console.log("GROUPDATA", groupData);

      pageCount = Number(groupData[groupData.length - 1]);

      if(pageCount > 1) {

        url = groupData[numberPerPage].toString();
        console.log(url);


        this.setState({
          groups: groupData,
          pageCount: pageCount,
          nextPageUrl: url,
        });
        console.log("State1", this.state);

      } else {
        this.setState({
          groups: groupData,
          pageCount: pageCount
        });
      }

      // console.log("url",url);
      this._getGroupsLinks(groupData);

    });
  }


  public _onLoadMore = () => {


    console.log(this.state.numberOfLoadClicks);

    let currentGroups: any[] = this.state.groups;
    let url = this.state.nextPageUrl

    //when the user selects another page pass the nextPage API to get the other items

    if (url !== undefined) {

      this._getnextPage(url, currentGroups); // pass the URL from the first group call

    }

    this.setState((prevState) => ({
      numberOfLoadClicks: prevState.numberOfLoadClicks + 1
    }));

  }



   public _getnextPage = (url: any, prevGroups: any) => {
    console.log("StateNext", this.state.isLoading);
    // debugger
    let nextSetGroup = [];
    let nextPageLink = [];



    if (url !== undefined) {
      GroupService.getNextLinkPageGroups(url).then((nextGroupItems) => {

        //prevGroups is the current state of groups
          nextSetGroup.push([...prevGroups], nextGroupItems[1]);
          nextPageLink.push(nextGroupItems[0]);

        console.log("NSG", nextSetGroup);

        if (nextPageLink !== undefined) {

          this.setState((prevState) => ({
            groups: [...prevState.groups, ...nextSetGroup[1]]
          }));
          console.log("State", this.state.groups);

          this.setState({
            ...prevGroups, nextPageUrl: nextPageLink
          });
          // this.setState({
          //   ...prevGroups, nextPageUrl: nextPageLink,  isLoading: true
          //  });
           console.log("load", this.state.groups);

        }
        //  else {

        //   this.setState({
        //     ...prevGroups, groups: nextGroupItems[1]
        //    });
        // }
        this._getGroupsLinks(nextGroupItems[1]);
      });
    }
  }


  public _getGroupsLinks = (items: any): void => {

    let groupsCompleted = 0;
    let totalGroups = items.length;
    let newPageCount = Math.ceil(totalGroups / 10);


    if (totalGroups == 0) {
      this._setLoading(false);
    }

    items.map((groupItem) =>
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
                      members: groupUrl[2]
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
              // pageCount: newPageCount

            });
          }

          if (groupsCompleted >= totalGroups) {
            this._getGroupThumbnails(this.state.groups);
          }
        })
        .catch((error) => {
          this.setState({
            errorMessage: "OOPS" + error,
          });
        })
    );
  }

  public _getGroupThumbnails = (groupItems: any): void => {
    // debugger
    let groupsCompleted = 0;
    let totalGroups = groupItems.length;

    if (totalGroups == 0) {
      this._setLoading(false);
    }

    groupItems.map((groupItem) =>
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

  public _pageViews = (groupsViews: any): void => {
    groupsViews.map((item) =>
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
    this._setLoading(false);
  }



  private _setLoading(state: boolean) {
    this.setState({
      isLoading: state,
    });
  }

  // private _showLoading(state: boolean) {
  //   this.setState({
  //     showLoader: state,
  //   })

  //   console.log("showLoaderState", this.state.showLoader);
  // }



  private _onRenderGridItem = (item: any, index: number): JSX.Element => {

    // console.log("Index", index);
    // let groupInitial: string = item.displayName.charAt(0);

    return (
      <div className={styles.siteCard} key={index}>
        <a href={item.url} target="_blank">
          <div className={styles.cardBanner} />

        {/* {item.thumbnail[0] !== null ? */}
          <img
            className={styles.bannerImg}
            src={item.thumbnail}
            alt={`${this.strings.altImgLogo} ${item.displayName} `}
          />
         {/* :
          <div className={styles.emptySquare}>{groupInitial}</div>
        } */}
          <h3 className={`${styles.cardTitle} ${styles.cardPrimaryAction}`}>
            {item.displayName}
          </h3>
        </a>

        <div
          className={styles.cardDescription}
          aria-label={item.description}
        >
          {item.description}
        </div>
        <footer className={styles.cardFooter}>
          <div className={styles.footerRow}>
            <div className={styles.footerItem}>
              <p aria-label={this.strings.members}>
                {this.strings.members}
              </p>
              <p className={styles.pl5}>{item.members}</p>
            </div>

            <div className={styles.footerItem}>
              <p aria-label={this.strings.created}>{this.strings.created}</p>
              <p className={styles.pl5}>
                {this.strings.userLang === "FR"
                  ? new Date(item.createdDateTime).toLocaleDateString("fr-CA")
                  : new Date(item.createdDateTime).toLocaleDateString("en-CA")}
              </p>
            </div>
          </div>

          <div className={styles.footerRow}>
            <div className={styles.footerItem}>
              <p aria-label={this.strings.siteViews}>{this.strings.siteViews}</p>
              <p className={styles.pl5}>{item.views}</p>
            </div>

            <div className={styles.footerItem}>
              <p aria-label={this.strings.lastModified}>
                {this.strings.lastModified}
              </p>
              <p
                className={styles.pl5}
                aria-label={
                  this.strings.userLang === "FR"
                    ? new Date(item.modified).toLocaleDateString("fr-CA")
                    : new Date(item.modified).toLocaleDateString("en-CA")
                }
              >
                {this.strings.userLang === "FR"
                  ? new Date(item.modified).toLocaleDateString("fr-CA")
                  : new Date(item.modified).toLocaleDateString("en-CA")}
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  private _onPageUpdate = (pageNumber: number): void => {

    this.setState({
      currentPage: pageNumber,
    });

  }




  public render(): React.ReactElement<IReactAllGroupsProps> {
    //Sorting in the Control panel
    let myData = [];
    this.props.sort == "DateCreation"
      ? (myData = []
          .concat(this.state.groups)
          .sort((a, b) => (a.createdDateTime < b.createdDateTime ? 1 : -1)))
      : (myData = []
          .concat(this.state.groups)
          .sort((a, b) => (a.displayName < b.displayName ? -1 : 1)));

    let pagedItems: any[] = this.state.groups;
        // console.log("PgItems",pagedItems.length);

    // total the groups that are not status code 403
    let totalItems: any[] = this.state.groups;

     //No Results Image props
     const imageProps: Partial<IImageProps> = {
     src: (require("../../assets/YetiHiding.png")),
      // imageFit: ImageFit.contain,
      width: 300,
      height: 300,
    };

    //Paging

    const numberOfItems: number = totalItems.length;
    const pages = Number(this.state.pageCount);
    // console.log("pages", pages);
    // console.log("#total Item for specific letter",numberOfItems);
    let showPages: boolean = false;

    //slider events
    // let  maxEvents: number = this.props.numberPerPage;
    let  maxEvents: number = 5;
    // console.log("maxEvents",maxEvents);
    const { currentPage } = this.state;

    if (true && pages > 0 ) {

      let numbers: number[] = [];
      for (let i = 0; i < pages; i++) {
        numbers.push(i + 1);
      }

      // const pageStartAt: number = numbers[0] * (currentPage - 1);
      // const pageEndAt: number = ((numbers.length -1) * currentPage);

      // const pageStartAt: number = maxEvents * (currentPage - 1);
      // const pageEndAt: number = (maxEvents * currentPage);

      // pagedItems = pagedItems.slice(pageStartAt, pageEndAt);
      showPages = true;
    }

    const LoadMoreLink = this.state.nextPageUrl[0];



    return (

      <div className={styles.reactAllGroups}>
        <div className={styles.flexCenter}>
          <AZNavigation
            selectedLetter={this.props.selectedLetter}
            onClickEvent={this.handleClickEvent}
          />
          { this.state.isLoading  ? (
            <Spinner label={this.strings.loadingState} />
          ) : totalItems !== null && totalItems.length >= 1 ? (
            <>
            {/*<Stack  horizontal  horizontalAlign="center" verticalAlign="center" >
              //  <DefaultButton onClick={this._getpreviousPage}>Previous</DefaultButton>
              {LoadMoreLink !== undefined ? (  <PrimaryButton onClick={this._onNextPageSelected}>Load More</PrimaryButton> ) : ''}

            </Stack>*/}

            <div>
              <GridLayout
                sort={this.props.sort}
                items={pagedItems}
                onRenderGridItem={(item: any, index: number) => this._onRenderGridItem(item, index)}
              />

            </div>
            <div>
              {LoadMoreLink !== undefined ? (  <PrimaryButton onClick={this._onLoadMore}>Load More</PrimaryButton> ) : ''}

            </div>
            </>
          ) : (
            <Stack  as='div' horizontal reversed  verticalAlign="center" tabIndex={0} aria-label={this.strings.noResults}>

              {this.strings.userLang === "FR" ? (
                <div
                  className={styles.noResultsText}
                  aria-label={this.strings.noResultsFR}
                  tabIndex={0}
                >
                  <h4 className={styles.margin0}>
                    Désolés.
                    <br />
                    Nous ne pouvons trouver la collectivité que vous cherchez.
                  </h4>
                  <p className={styles.margin0} >
                    Soit elle n’existe pas ou elle porte un autre nom que celui
                    que vous avez entré.
                    <br />
                    Essayez de trouver cette collectivité en utilisant un autre
                    caractère qui fait partie du titre ou créez votre propre
                    collectivité.
                  </p>
                </div>

              ) : (
                <>
                  <div
                    className={styles.noResultsText}
                    aria-label={this.strings.noResultsEN}
                    tabIndex={0}

                    >
                    <h4 className={styles.margin0} >
                      Sorry.
                      <br />
                      We couldn't find the community you were looking for.
                    </h4>
                    <p className={styles.margin0}>
                      Either the community does not exist or it has a different
                      name.
                      <br />
                      Try searching for the community by another letter in the
                      title or start your own community.
                    </p>
                  </div>

                </>
              )}
                <div>
                  <img {...imageProps} alt={this.strings.hidingYeti}/>
                </div>
            </Stack>
          )}
        </div>
      </div>
    );
  }
}
