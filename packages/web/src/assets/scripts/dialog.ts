document
  .querySelectorAll<HTMLButtonElement>(
    'button:is([data-dialog-action="show"], [data-dialog-action="showModal"])[aria-controls]'
  )
  .forEach((openButton) => {
    const dialogId = openButton.getAttribute('aria-controls');
    const dialog = document.querySelector<HTMLDialogElement>(`#${dialogId}`);
    const closeButton = dialog?.querySelector<HTMLButtonElement>(
      `button[data-dialog-action="close"][aria-controls="${dialogId}"]`
    );
    if (!dialog || !closeButton) return;

    const showDialog = () => dialog[openButton.dataset.dialogAction || 'show']();
    const closeDialog = () => dialog.close();
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
