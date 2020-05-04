(function () {
  const collapsibles = document.querySelectorAll('.collapsible');

  collapsibles.forEach((collapsible) => {
    const toggleButton = collapsible.querySelector('.collapsible-toggle');
    toggleButton.addEventListener('click', (clickEvent) => {
      toggleCollapsible(clickEvent.target);
    });
  });
})();

/** Called when a user clicks on a collapsible element's header.
 * Toggles the visibility of the collapsible's content.
 */
function toggleCollapsible(button) {
  const collapsible = button.closest('.collapsible');
  const content = collapsible.querySelector('.collapsible-content');
  const collapsibleIsBeingOpened = collapsible.classList.contains('collapsible-closed');

  if (collapsibleIsBeingOpened) {
    collapsible.classList.replace('collapsible-closed', 'collapsible-open');
    content.style.maxHeight = content.scrollHeight + 'px';
    content.scrollIntoView(true);
    content.setAttribute('aria-hidden', false);
  } else {
    collapsible.classList.replace('collapsible-open', 'collapsible-closed');
    content.style.maxHeight = '0px';
    content.setAttribute('aria-hidden', true);
  }
}
