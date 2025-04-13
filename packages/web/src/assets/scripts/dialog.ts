document.querySelectorAll('dialog[id]').forEach((dialog: HTMLDialogElement) => {
  const openButton: HTMLButtonElement = document.querySelector(
    `button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls="${dialog.id}"]`
  );
  const closeButton: HTMLButtonElement = document.querySelector(
    `button[data-dialog-action="close"][aria-controls="${dialog.id}"]`
  );

  const showAction = openButton.dataset.dialogAction || 'show';
  const isNonModalDialog = showAction !== 'showModal';

  const showDialog = () => {
    dialog[showAction]();
    if (isNonModalDialog) {
      openButton.setAttribute('aria-expanded', 'true');
      closeButton.setAttribute('aria-expanded', 'true');
    }
  };
  const closeDialog = () => {
    dialog.close();
    if (isNonModalDialog) {
      openButton.setAttribute('aria-expanded', 'false');
      closeButton.setAttribute('aria-expanded', 'false');
    }
  };
  openButton.addEventListener('click', showDialog);
  closeButton.addEventListener('click', closeDialog);

  // Detect outside clicks. NOTE: This only works if the ::backdrop ignores pointer events.
  // Once closedby has enough support, remove this https://github.com/whatwg/html/pull/10737
  document.addEventListener(
    'click',
    (e) => {
      if (dialog.open && !e.composedPath().includes(dialog)) {
        closeDialog();
      }
    },
    // Fixes a race condition where clicking the open button would cause a dialog to open and then close instantly.
    // Could also stopPropagation() on the open button's click event.
    { capture: true }
  );
});
