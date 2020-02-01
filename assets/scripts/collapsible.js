(function() {
  const collapsibles = document.querySelectorAll('.collapsible');

  collapsibles.forEach(collapsible => {
    const header = collapsible.querySelector('.collapsible-header');
    header.addEventListener('click', toggleCollapsible);
    header.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        toggleCollapsible(event);
      }
    });

    // Because all collapsibles are closed by default
    disableContentAnchorFocus(collapsible);
  });
})();

function disableContentAnchorFocus(collapsible) {
  collapsible.querySelectorAll('a').forEach(anchor => {
    anchor.setAttribute('tabindex', '-1');
  });
}

function enableContentAnchorFocus(collapsible) {
  collapsible.querySelectorAll('a').forEach(anchor => {
    anchor.setAttribute('tabindex', '0');
  });
}

/** Called when a user clicks on a collapsible element's header.
 * Toggles the visibility of the collapsible's content.
 */
function toggleCollapsible(event) {
  // Need to reference this.parentElement because the header is what's being clicked
  const collapsible = event.target.parentElement;
  const content = collapsible.querySelector('.collapsible-content');
  const collapsibleIsBeingOpened = collapsible.classList.contains('collapsible-closed');

  if (collapsibleIsBeingOpened) {
    collapsible.classList.replace('collapsible-closed', 'collapsible-open');
    content.style.maxHeight = content.scrollHeight + 'px';
    content.scrollIntoView(true);
    content.setAttribute('aria-hidden', false);
    enableContentAnchorFocus(collapsible);
  } else {
    collapsible.classList.replace('collapsible-open', 'collapsible-closed');
    content.style.maxHeight = '0px';
    content.setAttribute('aria-hidden', true);
    disableContentAnchorFocus(collapsible);
  }
}
