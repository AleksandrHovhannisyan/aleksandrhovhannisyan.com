document
  .querySelectorAll<HTMLButtonElement>('button[data-dialog-action="show"][aria-controls]')
  .forEach((openButton) => {
    const dialogId = openButton.getAttribute('aria-controls');
    const dialog = document.querySelector<HTMLDialogElement>(`#${dialogId}`);
    const closeButton = dialog?.querySelector<HTMLButtonElement>(
      `button[data-dialog-action="hide"][aria-controls="${dialogId}"]`
    );
    if (!dialog || !closeButton) return;

    const setIsOpen = (shouldOpen: boolean) => {
      if (shouldOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
      openButton.setAttribute('aria-expanded', shouldOpen.toString());
    };

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
