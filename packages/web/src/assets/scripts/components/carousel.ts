import { throttle } from '../utils.js';

type FocalPoint = 'start' | 'center' | 'end';

/**
 * Returns the focal point for the given element, as determined by its scroll-snap-align (falling back to the fallback if not specified).
 * @param element The element in question.
 * @param fallback A fallback value for the focal point.
 */
function getFocalPoint(element: HTMLElement): FocalPoint {
  return (element.getAttribute('data-scroll-snap-align') as FocalPoint) ?? 'center';
}

/**
 * Returns the distance from the starting edge of the viewport to the given focal point on the element.
 */
function getDistanceToFocalPoint(element: HTMLElement, focalPoint: FocalPoint, isRTL: boolean): number {
  const documentWidth = document.documentElement.clientWidth;
  const rect = element.getBoundingClientRect();
  switch (focalPoint) {
    case 'start':
      return isRTL ? documentWidth - rect.right : rect.left;
    case 'end':
      return isRTL ? documentWidth - rect.left : rect.right;
    case 'center':
    default: {
      const centerFromLeft = rect.left + rect.width / 2;
      return isRTL ? documentWidth - centerFromLeft : centerFromLeft;
    }
  }
}

class CarouselRoot extends HTMLElement {
  private scrollContainer: HTMLElement;
  private scrollSnapTargets: HTMLElement[];
  private navControlPrevious: HTMLButtonElement;
  private navControlNext: HTMLButtonElement;
  private isRTL: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    this.isRTL = window.getComputedStyle(this).direction === 'rtl';
    this.scrollContainer = this.querySelector('carousel-scroll');
    if (!this.scrollContainer) {
      throw new Error('Carousel must have a scroll region');
    }
    this.scrollSnapTargets = Array.from(this.scrollContainer.querySelectorAll('[data-scroll-snap-align]'));

    this.navControlPrevious = this.querySelector('carousel-navigation button[data-direction="start"]');
    this.navControlNext = this.querySelector('carousel-navigation button[data-direction="end"]');
    this.navControlPrevious?.addEventListener('click', this.handleNavigationButtonClick);
    this.navControlNext?.addEventListener('click', this.handleNavigationButtonClick);

    this.scrollContainer.addEventListener('scroll', this.handleCarouselScroll);
    this.handleCarouselScroll();
  }

  disconnectedCallback() {
    this.scrollContainer.removeEventListener('scroll', this.handleCarouselScroll);
    this.navControlPrevious?.removeEventListener('click', this.handleNavigationButtonClick);
    this.navControlNext?.removeEventListener('click', this.handleNavigationButtonClick);
  }

  private handleCarouselScroll = throttle(() => {
    // scrollLeft is negative in a right-to-left writing mode
    const scrollLeft = Math.abs(this.scrollContainer.scrollLeft);
    // off-by-one correction for Chrome, where clientWidth is sometimes rounded down
    const width = this.scrollContainer.clientWidth + 1;
    const isAtStart = Math.floor(scrollLeft) === 0;
    const isAtEnd = Math.ceil(width + scrollLeft) >= this.scrollContainer.scrollWidth;
    this.navControlPrevious?.setAttribute('aria-disabled', isAtStart.toString());
    this.navControlNext?.setAttribute('aria-disabled', isAtEnd.toString());
  }, 200);

  private handleNavigationButtonClick = (e: Event & { target: HTMLButtonElement }) => {
    const direction = e.target.dataset.direction as 'start' | 'end';
    const isDisabled = e.target.getAttribute('aria-disabled') === 'true';
    if (isDisabled) return;
    this.navigateToNextItem(direction);
  };

  public navigateToNextItem(direction: 'start' | 'end') {
    let scrollSnapTargets = [...this.scrollSnapTargets];
    scrollSnapTargets = direction === 'start' ? scrollSnapTargets.reverse() : scrollSnapTargets;

    const scrollContainerCenter = getDistanceToFocalPoint(this.scrollContainer, 'center', this.isRTL);
    let targetFocalPoint: number | undefined;
    for (const item of scrollSnapTargets) {
      const focalPoint = getFocalPoint(item);
      const distanceToItem = getDistanceToFocalPoint(item, focalPoint, this.isRTL);
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

class CarouselScroll extends HTMLElement {
  constructor() {
    super();
    if (!this.getAttribute('role')) {
      this.setAttribute('role', 'region');
    }
    if (!this.getAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.getAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Media carousel');
    }
  }
}

class CarouselNavigation extends HTMLElement {
  constructor() {
    super();
  }
}

window.customElements.define('carousel-root', CarouselRoot);
window.customElements.define('carousel-scroll', CarouselScroll);
window.customElements.define('carousel-navigation', CarouselNavigation);
