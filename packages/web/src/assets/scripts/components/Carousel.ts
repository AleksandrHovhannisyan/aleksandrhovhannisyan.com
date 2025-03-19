import { throttle } from '../utils.js';

interface CarouselProps {
  root: HTMLElement;
  navigationControls?: HTMLOListElement;
}

type FocalPoint = 'start' | 'center' | 'end';

export default class Carousel {
  private root: HTMLElement;
  private scrollContainer: HTMLElement;
  private scrollSnapTargets: HTMLElement[];
  private navControlPrevious: HTMLButtonElement;
  private navControlNext: HTMLButtonElement;
  private isRTL: boolean;

  /**
   * @param {CarouselProps} props
   */
  constructor(props: CarouselProps) {
    this.root = props.root;
    const scrollContainer = this.root.querySelector<HTMLElement>('[role="region"][tabindex="0"]');
    if (!scrollContainer) {
      throw new Error('Carousel must have a scroll region with these attributes: [role="region"][tabindex="0"]');
    }
    this.scrollContainer = scrollContainer;
    if (!this.scrollContainer) return;
    this.scrollSnapTargets = Array.from(this.scrollContainer.querySelectorAll('[role="list"] > *'));
    this.isRTL = window.getComputedStyle(this.root).direction === 'rtl';

    if (props.navigationControls) {
      this.insertNavigationControls(props.navigationControls);
    }
    this.scrollContainer.addEventListener('scroll', throttle(this.handleCarouselScroll, 200));
    this.handleCarouselScroll();
  }

  private insertNavigationControls(controls: HTMLElement) {
    if (!controls) return;

    const [navControlPrevious, navControlNext] = controls.querySelectorAll<HTMLButtonElement>('button[data-direction]');
    this.navControlPrevious = navControlPrevious;
    this.navControlNext = navControlNext;

    const handleNavigation = (e) => {
      const direction = e.target.dataset.direction;
      const isDisabled = e.target.getAttribute('aria-disabled') === 'true';
      if (isDisabled) return;
      this.navigateToNextItem(direction);
    };

    this.navControlPrevious.addEventListener('click', handleNavigation);
    this.navControlNext.addEventListener('click', handleNavigation);
    this.root.appendChild(controls);
  }

  private handleCarouselScroll = () => {
    // scrollLeft is negative in a right-to-left writing mode
    const scrollLeft = Math.abs(this.scrollContainer.scrollLeft);
    // off-by-one correction for Chrome, where clientWidth is sometimes rounded down
    const width = this.scrollContainer.clientWidth + 1;
    const isAtStart = Math.floor(scrollLeft) === 0;
    const isAtEnd = Math.ceil(width + scrollLeft) >= this.scrollContainer.scrollWidth;
    this.navControlPrevious?.setAttribute('aria-disabled', isAtStart.toString());
    this.navControlNext?.setAttribute('aria-disabled', isAtEnd.toString());
  };

  /**
   * Returns the focal point for the given element, as determined by its scroll-snap-align (falling back to the fallback if not specified).
   * @param element The element in question.
   * @param fallback A fallback value for the focal point.
   */
  private getFocalPoint(element: HTMLElement, fallback: FocalPoint = 'center'): FocalPoint {
    let focalPoint = window.getComputedStyle(element).scrollSnapAlign as FocalPoint | 'none';
    if (focalPoint === 'none') {
      focalPoint = fallback;
    }
    return focalPoint;
  }

  /**
   * Returns the distance from the starting edge of the viewport to the given focal point on the element.
   */
  private getDistanceToFocalPoint(element: HTMLElement, focalPoint: FocalPoint = 'center') {
    const documentWidth = document.documentElement.clientWidth;
    const rect = element.getBoundingClientRect();
    switch (focalPoint) {
      case 'start':
        return this.isRTL ? documentWidth - rect.right : rect.left;
      case 'end':
        return this.isRTL ? documentWidth - rect.left : rect.right;
      case 'center':
      default: {
        const centerFromLeft = rect.left + rect.width / 2;
        return this.isRTL ? documentWidth - centerFromLeft : centerFromLeft;
      }
    }
  }

  public navigateToNextItem(direction: 'start' | 'end') {
    let scrollSnapTargets = [...this.scrollSnapTargets];
    scrollSnapTargets = direction === 'start' ? scrollSnapTargets.reverse() : scrollSnapTargets;

    const scrollContainerCenter = this.getDistanceToFocalPoint(this.scrollContainer, 'center');
    let targetFocalPoint;
    for (const item of scrollSnapTargets) {
      const focalPoint = this.getFocalPoint(item);
      const distanceToItem = this.getDistanceToFocalPoint(item, focalPoint);
      const isTarget =
        (direction === 'start' && distanceToItem + 1 < scrollContainerCenter) ||
        (direction === 'end' && distanceToItem - scrollContainerCenter > 1);
      if (isTarget) {
        targetFocalPoint = distanceToItem;
        break;
      }
    }

    // This should never happen, but it doesn't hurt to check
    if (typeof targetFocalPoint === 'undefined') return;
    // RTL flips the direction
    const sign = this.isRTL ? -1 : 1;
    const scrollAmount = sign * (targetFocalPoint - scrollContainerCenter);
    this.scrollContainer.scrollBy({ left: scrollAmount });
  }
}
