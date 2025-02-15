document.querySelectorAll('button[data-dialog-action="show"][aria-controls]').forEach((openButton) => {
  const dialogId = openButton.getAttribute('aria-controls');
  /** @type {HTMLDialogElement} */
  const dialog = document.getElementById(dialogId);

  /**
   * @param {boolean} shouldOpen
   */
  function setIsOpen(shouldOpen) {
    if (shouldOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
    openButton.setAttribute('aria-expanded', shouldOpen.toString());
  }

  /** @type {HTMLButtonElement} */
  const closeButton = dialog.querySelector(`button[data-dialog-action="hide"][aria-controls="${dialogId}"]`);
  closeButton.addEventListener('click', () => setIsOpen(false));

  openButton.addEventListener('click', (e) => {
    // Otherwise the click event will bubble to the outside-click listener registered below
    e.stopPropagation();

    if (!dialog.open) {
      setIsOpen(true);
    }

    // Detect outside clicks. NOTE: This only works if the ::backdrop ignores pointer events.
    // Once closedby has enough support, remove this https://github.com/whatwg/html/pull/10737
    document.addEventListener('click', (e) => {
      if (dialog.open && !e.composedPath().includes(dialog)) {
        setIsOpen(false);
      }
    });
  });
});
