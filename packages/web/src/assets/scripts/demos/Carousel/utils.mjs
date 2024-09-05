/**
 * Returns `true` if the given element is in a horizontal RTL writing mode.
 * @param {HTMLElement} element
 */
export const isRtl = (element) => window.getComputedStyle(element).direction === 'rtl';

/**
 * Returns the distance from the starting edge of the viewport to the given focal point on the element.
 * @param {HTMLElement} element
 * @param {'start'|'center'|'end'} [focalPoint]
 */
export const getDistanceToFocalPoint = (element, focalPoint = 'center') => {
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
export const getFocalPoint = (element, fallback = 'center') => {
  let focalPoint = window.getComputedStyle(element).scrollSnapAlign;
  if (focalPoint === 'none') {
    focalPoint = fallback;
  }
  return focalPoint;
};
