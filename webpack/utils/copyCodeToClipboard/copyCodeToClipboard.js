const copyToClipboard = (text) => {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.textContent = text;
  document.body.appendChild(tempTextArea);

  const selection = document.getSelection();
  selection.removeAllRanges();
  tempTextArea.select();
  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(tempTextArea);
};

// Temporary text area hack: https://stackoverflow.com/a/46822033/5323344
const copyCodeToClipboard = (clickEvent, copyFn = copyToClipboard) => {
  const copyCodeButton = clickEvent.target;
  copyFn(copyCodeButton.getAttribute('data-code'));

  // Show "Copied!" and green checkmark
  copyCodeButton.classList.add('copied');
  setTimeout(() => {
    copyCodeButton.classList.remove('copied');
  }, 2000);
};

export default copyCodeToClipboard;
