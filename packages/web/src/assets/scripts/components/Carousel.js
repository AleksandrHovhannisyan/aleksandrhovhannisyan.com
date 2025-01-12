import { throttle } from '../utils.js';

/**
 * @typedef CarouselProps
 * @property {HTMLElement} root
 * @property {HTMLOListElement} [navigationControls]
 */

export default class Carousel {
  /** @type {HTMLElement} */
  #root;
  /** @type {HTMLElement} */
  #scrollContainer;
  /** @type {HTMLElement[]} */
  #scrollSnapTargets;
  /** @type {HTMLElement} */
  #navControlPrevious;
  /** @type {HTMLElement} */
  #navControlNext;
  /** @type {boolean} */
  #isRTL;

  /**
   * @param {CarouselProps} props
   */
  constructor(props) {
    this.#root = props.root;
    this.#scrollContainer = this.#root.querySelector('[role="region"][tabindex="0"]');
    this.#scrollSnapTargets = Array.from(this.#scrollContainer.querySelectorAll('[role="list"] > *'));
    this.#isRTL = window.getComputedStyle(this.#root).direction === 'rtl';

    this.#insertNavigationControls(props.navigationControls);
    this.#scrollContainer.addEventListener('scroll', throttle(this.#handleCarouselScroll, 200));
    this.#handleCarouselScroll();
  }

  /**
   * @param {HTMLElement} controls
   */
  #insertNavigationControls(controls) {
    if (!controls) return;

    const [navControlPrevious, navControlNext] = controls.querySelectorAll('button[data-direction]');
    this.#navControlPrevious = navControlPrevious;
    this.#navControlNext = navControlNext;

    const handleNavigation = (e) => {
      const direction = e.target.dataset.direction;
      const isDisabled = e.target.getAttribute('aria-disabled') === 'true';
      if (isDisabled) return;
      this.navigateToNextItem(direction);
    };

    this.#navControlPrevious.addEventListener('click', handleNavigation);
    this.#navControlNext.addEventListener('click', handleNavigation);
    this.#root.appendChild(controls);
  }

  #handleCarouselScroll = () => {
    // scrollLeft is negative in a right-to-left writing mode
    const scrollLeft = Math.abs(this.#scrollContainer.scrollLeft);
    // off-by-one correction for Chrome, where clientWidth is sometimes rounded down
    const width = this.#scrollContainer.clientWidth + 1;
    const isAtStart = Math.floor(scrollLeft) === 0;
    const isAtEnd = Math.ceil(width + scrollLeft) >= this.#scrollContainer.scrollWidth;
    this.#navControlPrevious?.setAttribute('aria-disabled', isAtStart);
    this.#navControlNext?.setAttribute('aria-disabled', isAtEnd);
  };

  /**
   * Returns the focal point for the given element, as determined by its scroll-snap-align (falling back to the fallback if not specified).
   * @param {HTMLElement} element The element in question.
   * @param {'start'|'center'|'end'} [fallback] A fallback value for the focal point.
   * @returns {'start'|'center'|'end'}
   */
  #getFocalPoint(element, fallback = 'center') {
    let focalPoint = window.getComputedStyle(element).scrollSnapAlign;
    if (focalPoint === 'none') {
      focalPoint = fallback;
    }
    return focalPoint;
  }

  /**
   * Returns the distance from the starting edge of the viewport to the given focal point on the element.
   * @param {HTMLElement} element
   * @param {'start'|'center'|'end'} [focalPoint]
   */
  #getDistanceToFocalPoint(element, focalPoint = 'center') {
    const documentWidth = document.documentElement.clientWidth;
    const rect = element.getBoundingClientRect();
    switch (focalPoint) {
      case 'start':
        return this.#isRTL ? documentWidth - rect.right : rect.left;
      case 'end':
        return this.#isRTL ? documentWidth - rect.left : rect.right;
      case 'center':
      default: {
        const centerFromLeft = rect.left + rect.width / 2;
        return this.#isRTL ? documentWidth - centerFromLeft : centerFromLeft;
      }
    }
  }

  /**
   * @param {'start'|'end'} direction
   */
  navigateToNextItem(direction) {
    let scrollSnapTargets = [...this.#scrollSnapTargets];
    scrollSnapTargets = direction === 'start' ? scrollSnapTargets.reverse() : scrollSnapTargets;

    const scrollContainerCenter = this.#getDistanceToFocalPoint(this.#scrollContainer, 'center');
    let targetFocalPoint;
    for (const item of scrollSnapTargets) {
      const focalPoint = this.#getFocalPoint(item);
      const distanceToItem = this.#getDistanceToFocalPoint(item, focalPoint);
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
    const sign = this.#isRTL ? -1 : 1;
    const scrollAmount = sign * (targetFocalPoint - scrollContainerCenter);
    this.#scrollContainer.scrollBy({ left: scrollAmount });
  }
}
