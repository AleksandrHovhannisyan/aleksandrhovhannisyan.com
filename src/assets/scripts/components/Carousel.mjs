import throttle from 'lodash/throttle';
import ChevronLeft from 'feather-icons/dist/icons/chevron-left.svg';
import ChevronRight from 'feather-icons/dist/icons/chevron-right.svg';
import { getDistanceToFocalPoint, isRtl } from '../utils/utils.mjs';

class Carousel {
  constructor(props) {
    this._handleCarouselScroll = throttle(this._handleCarouselScroll.bind(this), 200);
    this.navigateToNextItem = this.navigateToNextItem.bind(this);

    this.carousel = props.root;
    this.scrollContainer = this.carousel.querySelector('[role="region"][tabindex="0"]');
    this.mediaList = this.scrollContainer.querySelector('[role="list"]');

    const controls = document.createElement('ol');
    controls.setAttribute('role', 'list');
    controls.classList.add('carousel-controls');
    controls.setAttribute('aria-label', 'Navigation controls');

    /**
     * @param {'start'|'end'} direction
     */
    const createNavButton = (direction) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.classList.add('carousel-control', direction);
      button.setAttribute('aria-label', direction === 'start' ? 'Previous' : 'Next');
      button.innerHTML = direction === 'start' ? ChevronLeft : ChevronRight;
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-disabled') === 'true') return;
        this.navigateToNextItem(direction);
      });
      li.appendChild(button);
      controls.appendChild(li);
      return button;
    };

    this.navControlPrevious = createNavButton('start');
    this.navControlNext = createNavButton('end');
    this.carousel.appendChild(controls);

    this.scrollContainer.addEventListener('scroll', this._handleCarouselScroll);
    this._handleCarouselScroll();
  }

  _handleCarouselScroll() {
    // scrollLeft is negative in a right-to-left writing mode
    const scrollLeft = Math.abs(this.scrollContainer.scrollLeft);
    // off-by-one correction for Chrome, where clientWidth is sometimes rounded down
    const width = this.scrollContainer.clientWidth + 1;
    const isAtStart = Math.floor(scrollLeft) === 0;
    const isAtEnd = Math.ceil(width + scrollLeft) >= this.scrollContainer.scrollWidth;
    this.navControlPrevious.setAttribute('aria-disabled', isAtStart);
    this.navControlNext.setAttribute('aria-disabled', isAtEnd);
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
      const focalPoint = window.getComputedStyle(mediaItem).scrollSnapAlign || 'center';
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
    const sign = isRtl(this.carousel) ? -1 : 1;
    const scrollAmount = sign * (targetFocalPoint - scrollContainerCenter);
    this.scrollContainer.scrollBy({ left: scrollAmount });
  }
}

export default Carousel;
