import * as React from 'react';
import styles from './ModernPromotedLinks.module.scss';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react';
import { escape } from '@microsoft/sp-lodash-subset';

export interface IModernPromotedLinkItemProps {
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  launchbehavior: string;
}

export interface IModernPromotedLinkItemState {
  hovering: boolean;
}

export default class ModernPromotedLinks extends React.Component<IModernPromotedLinkItemProps, IModernPromotedLinkItemState> {

  constructor(props: IModernPromotedLinkItemProps, state: IModernPromotedLinkItemState) {
    super(props);

    this.state = {
      hovering: false
    };
  }

  public mouseOver(event): void {
    this.setState({ hovering: true });
  }

  public mouseOut(event): void {
    this.setState({ hovering: false });
  }

  public render(): React.ReactElement<IModernPromotedLinkItemProps> {
    return (
      //  Ternary operator to evaluate target property of link.  Dialog has been excluded as this feature does not work in the page"
      <a className={styles.promotedListElement} href={this.props.href} target={this.props.launchbehavior === 'In page navigation' ? '_top' : '_blank'} role="listitem"
        onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}>
        <div className={styles.pLinkItemWrapper}>
          {/* <div>
            <div className={styles.pLinkItemTitle}>{this.props.title}</div>
          </div> */}
          <Image className={styles.pLinkItemImage} src={this.props.imageUrl} shouldFadeIn={true} imageFit={ImageFit.cover} />
          {/* Linea original */}
          {/* <div className={this.state.hovering ? styles.pLinkItemHoverPanelExpanded : styles.pLinkItemHoverPanelCollapse}> */}
          <div className={styles.pLinkItemHoverPanelExpanded}>
            <div className={styles.pLinkItemTitle}>{this.props.title}</div>
            {/* <p className={styles.pLinkItemDesc}>
              {this.props.description}
            </p> */}
            {/* icono SVG */}
            <svg className={styles.svgPromotedLinkIcon} width="20px" height="20px" viewBox="0 0 30 30" version="1.1">
              <path d="M4,6 L2,6 L2,20 C2,21.1 2.9,22 4,22 L18,22 L18,20 L4,20 L4,6 Z M20,2 L8,2 C6.9,2 6,2.9 6,4 L6,16 C6,17.1 6.9,18 8,18 L20,18 C21.1,18 22,17.1 22,16 L22,4 C22,2.9 21.1,2 20,2 Z M20,16 L8,16 L8,4 L20,4 L20,16 Z M10,9 L18,9 L18,11 L10,11 L10,9 Z M10,12 L14,12 L14,14 L10,14 L10,12 Z M10,6 L18,6 L18,8 L10,8 L10,6 Z" id="🔹-Icon-Color" fill="inherit"></path>
            </svg>
          </div>
        </div>
      </a >
    );
  }
}