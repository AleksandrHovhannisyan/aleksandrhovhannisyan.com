import throttle from 'lodash/throttle.js';

/**
 * Returns `true` if the given element is in a horizontal RTL writing mode.
 * @param {HTMLElement} element
 */
const isRtl = (element) => window.getComputedStyle(element).direction === 'rtl';

/**
 * Returns the distance from the starting edge of the viewport to the given focal point on the element.
 * @param {HTMLElement} element
 * @param {'start'|'center'|'end'} [focalPoint]
 */
const getDistanceToFocalPoint = (element, focalPoint = 'center') => {
  const isHorizontalRtl = isRtl(element);
  const documentWidth = document.documentElement.clientWidth;
  const rect = element.getBoundingClientRect();
  switch (focalPoint) {
    case 'start':
      return isHorizontalRtl ? documentWidth - rect.right : rect.left;
    case 'end':
      return isHorizontalRtl ? documentWidth - rect.left : rect.right;
    case 'center':
    default: {
      const centerFromLeft = rect.left + rect.width / 2;
      return isHorizontalRtl ? documentWidth - centerFromLeft : centerFromLeft;
    }
  }
};

/**
 * Returns the focal point for the given element, as determined by its scroll-snap-align (falling back to the fallback if not specified).
 * @param {HTMLElement} element The element in question.
 * @param {'start'|'center'|'end'} [fallback] A fallback value for the focal point.
 * @returns {'start'|'center'|'end'}
 */
const getFocalPoint = (element, fallback = 'center') => {
  let focalPoint = window.getComputedStyle(element).scrollSnapAlign;
  if (focalPoint === 'none') {
    focalPoint = fallback;
  }
  return focalPoint;
};

const SCROLL_DELAY_MS = 200;

/**
 * @typedef CarouselProps
 * @property {HTMLElement} root
 * @property {HTMLOListElement} [navigationControls]
 * @property {number} [scrollDelayMs] The delay, in milliseconds, for debouncing the scroll event handler.
 */

export default class Carousel {
  /**
   * @param {CarouselProps} props
   */
  constructor(props) {
    // `this` binding for methods
    const scrollDelayMs = props.scrollDelayMs ?? SCROLL_DELAY_MS;
    this._handleCarouselScroll = throttle(this._handleCarouselScroll.bind(this), scrollDelayMs);
    this.navigateToNextItem = this.navigateToNextItem.bind(this);

    // Initialize some member variables
    this.root = props.root;
    this.scrollContainer = this.root.querySelector('[role="region"][tabindex="0"]');
    this.mediaList = this.scrollContainer.querySelector('[role="list"]');

    // Set up event listeners and init UI
    this._insertNavigationControls(props.navigationControls);
    this.scrollContainer.addEventListener('scroll', this._handleCarouselScroll);
    this._handleCarouselScroll();
  }

  /**
   * @param {HTMLElement} controls
   */
  _insertNavigationControls(controls) {
    if (!controls) return;

    const [navControlPrevious, navControlNext] = controls.querySelectorAll('button[data-direction]');
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

  _handleCarouselScroll() {
    // scrollLeft is negative in a right-to-left writing mode
    const scrollLeft = Math.abs(this.scrollContainer.scrollLeft);
    // off-by-one correction for Chrome, where clientWidth is sometimes rounded down
    const width = this.scrollContainer.clientWidth + 1;
    const isAtStart = Math.floor(scrollLeft) === 0;
    const isAtEnd = Math.ceil(width + scrollLeft) >= this.scrollContainer.scrollWidth;
    this.navControlPrevious?.setAttribute('aria-disabled', isAtStart);
    this.navControlNext?.setAttribute('aria-disabled', isAtEnd);
  }

  /**
   * @param {'start'|'end'} direction
   */
  navigateToNextItem(direction) {
    let mediaItems = Array.from(this.mediaList.querySelectorAll(':scope > *'));
    mediaItems = direction === 'start' ? mediaItems.reverse() : mediaItems;

    const scrollContainerCenter = getDistanceToFocalPoint(this.scrollContainer, 'center');
    let targetFocalPoint;
    for (const mediaItem of mediaItems) {
      const focalPoint = getFocalPoint(mediaItem);
      const distanceToItem = getDistanceToFocalPoint(mediaItem, focalPoint);
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
    const sign = isRtl(this.root) ? -1 : 1;
    const scrollAmount = sign * (targetFocalPoint - scrollContainerCenter);
    this.scrollContainer.scrollBy({ left: scrollAmount });
  }
}
