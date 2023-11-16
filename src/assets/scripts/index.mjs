import { copyToClipboardButtonStrings } from './constants.mjs';

document.querySelectorAll('code[data-copyable]').forEach((codeBlock) => {
  const code = codeBlock.innerText;
  const copyCodeButton = document.createElement('button');
  copyCodeButton.className = 'copy-code-button';
  copyCodeButton.innerText = copyToClipboardButtonStrings.default;
  // Set an aria label explicitly to clarify the button's action a bit better for screen reader users; sighted users should be able to relate "Copy" to the code block in which the button is positioned
  copyCodeButton.setAttribute('aria-label', copyToClipboardButtonStrings.ariaLabel);
  copyCodeButton.type = 'button';
  codeBlock.parentElement.append(copyCodeButton);

  // Accessible alert whose inner text changes when we copy.
  const copiedAlert = document.createElement('span');
  copiedAlert.setAttribute('role', 'alert');
  copiedAlert.classList.add('screen-reader-only');
  codeBlock.parentElement.append(copiedAlert);

  copyCodeButton.addEventListener('click', () => {
    window.navigator.clipboard.writeText(code);
    copyCodeButton.classList.add('copied');
    copyCodeButton.innerText = copyToClipboardButtonStrings.copied;
    copiedAlert.innerText = copyToClipboardButtonStrings.copied;

    setTimeout(() => {
      copyCodeButton.classList.remove('copied');
      copyCodeButton.innerText = copyToClipboardButtonStrings.default;
      copiedAlert.innerText = '';
    }, 2000);
  });
});
