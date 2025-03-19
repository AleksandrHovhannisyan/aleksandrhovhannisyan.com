document.querySelectorAll<HTMLElement>('.copy-code-button').forEach((copyCodeButton) => {
  const codeBlock = copyCodeButton.closest('figure.code-block');
  const codeElement = codeBlock?.querySelector('code');
  const copiedAlertElement = codeBlock?.querySelector<HTMLElement>('[role="alert"]');
  if (!codeBlock || !codeElement) return;

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(codeElement.innerText);
    const originalButtonHtml = copyCodeButton.innerHTML;
    copyCodeButton.classList.add('copied');
    copyCodeButton.innerText = 'Copied';
    if (copiedAlertElement) {
      copiedAlertElement.innerText = 'Copied';
    }

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
      copyCodeButton.innerHTML = originalButtonHtml;
      if (copiedAlertElement) {
        copiedAlertElement.innerText = '';
      }
    }, 2000);
  });
});
