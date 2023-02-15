import * as React from "react";
import styles from "./ReactAllGroups.module.scss";
import { IReactAllGroupsProps } from "./IReactAllGroupsProps";
import GroupService from "../../../../services/GroupService";
import { IReactAllGroupsState } from "./IReactAllGroupsState";
import { IGroup } from "../../../../models";
import { FocusZone, Spinner } from "office-ui-fabric-react";
import { GridLayout } from "../GridList";
import { SelectLanguage } from "../SelectLanguage";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Stack, Image, IImageProps, ImageFit } from "office-ui-fabric-react";
import { AZNavigation } from "../AZNavigation/AZNavigation";
import { Paging } from "../paging";
import { forEach } from "lodash";


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
    };
  }

  public strings = SelectLanguage(this.props.prefLang);

//split the hidingGroups and split them by the comma
  public hidingGroups: String[] = this.props.hidingGroups && this.props.hidingGroups.length > 0 ? this.props.hidingGroups.split(",") : [];


  //Selected Letter by user
  public handleClickEvent = (letter: string) => {
    this.setState(
      {
        selectedLetter: this.props.selectedLetter,
        currentPage: 1
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
    GroupService.getGroupsBatch(letter).then((groupData) => {
      this.setState({
        groups: groupData,
      });
      this._getGroupsLinks(groupData);
    });
  }

  public _getGroupsLinks = (groups: any): void => {

    console.log("hididng", this.hidingGroups);
    let groupsCompleted = 0;
    let totalGroups = groups.length;

    if (totalGroups == 0) {
      this._setLoading(false);
    }

    groups.map((groupItem) =>
      GroupService.getGroupLinksBatch(groupItem)
        .then((groupUrl) => {
          groupsCompleted++;

          console.log("GroupUrl",groupUrl);


          for (let i = 0; i < this.hidingGroups.length; i++) {
            let hideGroups = this.hidingGroups[i];


          //groupUrl[1] is the body of the response from the API without the 403 status codes, groupURL[2] is the members count  API call
          if (
            groupUrl[1] &&
            (groupUrl[1].value !== null || groupUrl[1].value !== undefined)
          )
          {
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
          }
           if ( ){

           }

          else {

            let index = this.state.groups
              .map((g) => g.id)
              .indexOf(groupItem.id);

              console.log("index", index);
            let groupsCopy = JSON.parse(JSON.stringify(this.state.groups));
            groupsCopy.splice(index, 1);
            this.setState({
              groups: groupsCopy,
            });
          }
        }


          if (groupsCompleted >= totalGroups) {
            this._getGroupThumbnails(this.state.groups);
            // console.log(this.state.groups);
          }

        })
        .catch((error) => {
          this.setState({
            errorMessage: "OOPS" + error,
          });
        })
    );
  }

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
              ? { ...group, views: siteCount }
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



  private _onRenderGridItem = (item: any, index: any): JSX.Element => {

    return (
    <a href={item.url} target="_blank">
      <div className={styles.siteCard} id={index}>

          <div className={styles.cardBanner} />
          <img
            className={styles.bannerImg}
            src={item.thumbnail}
            alt={`${this.strings.altImgLogo} ${item.displayName} `}
          />
          <h3 className={`${styles.cardTitle} `}>
            {item.displayName}
          </h3>


        <p
          className={styles.cardDescription}
          aria-label={item.description}
        >
          {item.description}
        </p>
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
    </a>
    );
  }

  private _onPageUpdate = (pageNumber: number): void => {
    this.setState({
      currentPage: pageNumber
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
        console.log("PgItems",pagedItems.length);

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
    // console.log("#total Item for specific letter",numberOfItems);
    let showPages: boolean = false;

    //slider events
    let  maxEvents: number = this.props.numberPerPage;
    // console.log("maxEvents",maxEvents);
    const { currentPage } = this.state;

    if (true && numberOfItems > 0 && numberOfItems > maxEvents) {

      const pageStartAt: number = maxEvents * (currentPage - 1);
      const pageEndAt: number = (maxEvents * currentPage);

      pagedItems = pagedItems.slice(pageStartAt, pageEndAt);
      showPages = true;
    }

    return (

      <div className={styles.reactAllGroups}>
        <div className={styles.flexCenter}>

          <AZNavigation
            selectedLetter={this.props.selectedLetter}
            onClickEvent={this.handleClickEvent}
            lang={this.props.prefLang}
          />

          { this.state.isLoading ? (
            <Spinner label={this.strings.loadingState} />
          ) : totalItems !== null && totalItems.length >= 1 ? (
            <>
            <Paging
              showPageNumber={true}
              currentPage={currentPage}
              itemsCountPerPage={maxEvents}
              numberOfItems={numberOfItems}
              onPageUpdate={this._onPageUpdate}
              nextButtonLabel={this.strings.pagNext}
              previousButtonLabel={this.strings.pagPrev}
              firstButtonLabel={this.strings.firstPage}
              lastButtonLabel={this.strings.lastPage}
              currentPageLabel={this.strings.currentPage}
              goToPageLabel={this.strings.goToPage}
            />

              <GridLayout
                sort={this.props.sort}
                items={pagedItems}
                onRenderGridItem={(item: any, index: any) => this._onRenderGridItem(item, index)}
              />

            <Paging
              showPageNumber={true}
              currentPage={currentPage}
              itemsCountPerPage={maxEvents}
              numberOfItems={numberOfItems}
              onPageUpdate={this._onPageUpdate}
              nextButtonLabel={this.strings.pagNext}
              previousButtonLabel={this.strings.pagPrev}
              firstButtonLabel={this.strings.firstPage}
              lastButtonLabel={this.strings.lastPage}
              currentPageLabel={this.strings.currentPage}
              goToPageLabel={this.strings.goToPage}
            />

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

                  <img {...imageProps} alt={this.strings.hidingYeti}/>

            </Stack>
          )}
        </div>
      </div>
    );
  }
}
