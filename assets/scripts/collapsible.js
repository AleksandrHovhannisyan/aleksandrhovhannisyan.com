(function registerCollapsibleClickHandlers() {
  const collapsibles = document.getElementsByClassName('collapsible-header');
  for (const collapsible of Array.from(collapsibles)) {
    collapsible.addEventListener('click', toggleCollapsible);
  }
})();

const ANGLE_UP =
  'M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z';
const ANGLE_DOWN =
  'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z';

/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
function toggleCollapsible() {
  const content = this.parentElement.querySelector('.collapsible-content');
  const svg = this.querySelector('svg');

  // Must use computed style for initial check; it's set to 0px in style.css, not as an inline style
  const collapsibleIsBeingOpened =
    getComputedStyle(content).maxHeight === '0px';
  let angle = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  if (collapsibleIsBeingOpened) {
    content.style.maxHeight = content.scrollHeight + 'px';
    angle.setAttributeNS(null, 'd', ANGLE_UP);
    content.scrollIntoView(true);
  } else {
    content.style.maxHeight = '0px';
    angle.setAttributeNS(null, 'd', ANGLE_DOWN);
  }

  svg.innerHTML = '';
  svg.appendChild(angle);
}
