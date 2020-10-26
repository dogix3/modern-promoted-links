import * as React from 'react';
import styles from './ModernPromotedLinks.module.scss';
import { IModernPromotedLinksProps, IModernPromotedLinkDataItem } from './IModernPromotedLinksProps';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import ModernPromotedLinkItem, { IModernPromotedLinkItemProps } from './ModernPromotedLinkItem';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
// Se añaden imports para crear la lista horizontal
import * as $ from 'jquery';

export interface IModernPromotedLinksState {
    listData: IModernPromotedLinkDataItem[];
    loading?: boolean;
    showPlaceholder?: boolean;
    scrollMove: Number;
}

export default class ModernPromotedLinks extends React.Component<IModernPromotedLinksProps, IModernPromotedLinksState> {

    constructor(props: IModernPromotedLinksProps, state: IModernPromotedLinksState) {
        super(props);

        this._onConfigure = this._onConfigure.bind(this);

        this.state = {
            listData: [],
            loading: false,
            showPlaceholder: (this.props.lists === null || this.props.lists === ""),
            scrollMove: 791.97
        };
    }

    /*
     * Opens the web part property pane
    */
    private _onConfigure() {
        this.props.context.propertyPane.open();
    }

    public render(): React.ReactElement<IModernPromotedLinksProps> {

        if (this.state.showPlaceholder) {
            // Check if placeholder needs to be shown
            return (
                <Placeholder
                    iconName="Edit"
                    iconText="Promoted links web part configuration"
                    description="Please configure the web part before you can show the promoted links."
                    buttonLabel="Configure"
                    onConfigure={this._onConfigure} />
            );
        }

        return (
            <div className={styles.modernPromotedLinks}>
                {
                    this.state.loading ?
                        (
                            <Spinner size={SpinnerSize.large} label="Retrieving results ..." />
                        ) : (
                            this.state.listData.length === 0 ?
                                (
                                    <Placeholder
                                        iconName="InfoSolid"
                                        iconText="No items found"
                                        description="The Promoted links list you selected does not contain items."
                                    />
                                ) : (
                                    <div className={this.props.lists ? this.props.lists.replace(/-/g,"") : ""}>
                                        <div>
                                            <div className={styles.dInlineBlock}>
                                                <h4 className={styles.webpartTitle}>{this.props.description}</h4>
                                            </div>
                                            <div className={`${styles.dInlineBlock} ${styles.fRight}`}>
                                                <i className={`${styles.arrow} ${styles.left}`}></i>
                                                <i className={`${styles.arrow} ${styles.right}`}></i>
                                            </div>
                                        </div>
                                        {/* <button id={"btnMoveScrollRigth"}>derecha</button> */}
                                        <div className={`promotedListContainer ${styles.modernPromotedLinkContainer} ${styles.promotedListContainer}`}>
                                            {
                                                this.state.listData.map((item: IModernPromotedLinkDataItem) => {
                                                    return <ModernPromotedLinkItem
                                                        title={item.Title}
                                                        description={item.Description}
                                                        imageUrl={item.ImageUrl}
                                                        href={item.LinkUrl}
                                                        launchbehavior={item.LaunchBehavior}
                                                    />;
                                                })
                                            }
                                            <div style={{ clear: 'both' }}></div>
                                        </div>
                                        {/* <button id={"btnMoveScrollLeft"}>izquierda</button> */}
                                    </div>

                                )
                        )
                }
            </div>
        );
    }

    public componentDidMount(): void {
        if (this.props.lists !== null && this.props.lists !== "") {
            this.loadData();
        }
    }

    public componentDidUpdate(prevProps: IModernPromotedLinksProps, prevState: IModernPromotedLinksState, prevContext: any) {
        if (prevProps.lists != this.props.lists) {
            if (this.props.lists !== null && this.props.lists !== "") {
                this.loadData();
            } else {
                this.setState({
                    showPlaceholder: true
                });
            }
        }
        if(this.props.lists){
            $(`.${this.props.lists.replace(/-/g,"")} .${styles.arrow}.${styles.right}`).click(() => {
                event.preventDefault();
                $(`.${this.props.lists.replace(/-/g,"")} .promotedListContainer`).animate({
                    scrollLeft: `+=${this.state.scrollMove}px`
                }, "slow");
            });
    
            $(`.${this.props.lists.replace(/-/g,"")} .${styles.arrow}.${styles.left}`).click(() => {
                event.preventDefault();
                $(`.${this.props.lists.replace(/-/g,"")} .promotedListContainer`).animate({
                    scrollLeft: `-=${this.state.scrollMove}px`
                }, "slow");
            });
        }
        
    }

    private loadData(): void {

        this.setState({
            loading: true
        });

        if (this.props.isWorkbench) {
            // get mock data in Workbench
            this.setState({
                listData: [
                    {
                        Title: "Test Item",
                        Description: "Test description",
                        ImageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/04/a8/17/f5/el-arco.jpg",
                        LinkUrl: "http://www.google.com",
                        LaunchBehavior: "_blank"
                    },
                    {
                        Title: "Test Item with a Long Title",
                        Description: "Test description",
                        ImageUrl: "https://pgcpsmess.files.wordpress.com/2014/04/330277-red-fox-kelly-lyon-760x506.jpg",
                        LinkUrl: "http://www.google.com",
                        LaunchBehavior: "_blank"
                    },
                    {
                        Title: "Test Item",
                        Description: "Test item with a long description for display",
                        ImageUrl: "https://s-media-cache-ak0.pinimg.com/736x/d6/d4/d7/d6d4d7224687ca3de4a160f5264b5b99.jpg",
                        LinkUrl: "http://www.google.com_open.",
                        LaunchBehavior: "_blank"
                    }
                ]
            });
        } else {
            // get data from SharePoint
            this.props.spHttpClient.get(`${this.props.siteUrl}/_api/Web/Lists(guid'${this.props.lists}')/Items`, SPHttpClient.configurations.v1)
                .then(response => {
                    return response.json();
                })
                .then((items: any) => {
                    // console.log(items);
                    const listItems: IModernPromotedLinkDataItem[] = [];
                    for (let i: number = 0; i < items.value.length; i++) {
                        listItems.push({
                            Title: items.value[i].Title,
                            Description: items.value[i].Description,
                            ImageUrl: items.value[i].BackgroundImageLocation.Url,
                            LinkUrl: items.value[i].LinkLocation.Url,
                            LaunchBehavior: items.value[i].LaunchBehavior
                        });
                    }
                    this.setState({
                        listData: listItems,
                        loading: false,
                        showPlaceholder: false
                    });
                }, (err: any) => {
                    console.log(err);
                });
        }
    }
}



