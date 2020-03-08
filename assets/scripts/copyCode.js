// Temporary text area hack: https://stackoverflow.com/a/46822033/5323344
const copyCode = copyCodeButton => {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.textContent = copyCodeButton.getAttribute("data-code");
  document.body.appendChild(tempTextArea);

  const selection = document.getSelection();
  selection.removeAllRanges();
  tempTextArea.select();
  document.execCommand("copy");
  selection.removeAllRanges();
  document.body.removeChild(tempTextArea);

  // Show "Copied!" and green checkmark
  copyCodeButton.classList.add("copied");
  setTimeout(() => {
    copyCodeButton.classList.remove("copied");
  }, 2000);
};

document.addEventListener("keyup", keyEvent => {
  if (keyEvent.keyCode === 13) {
    copyCode(keyEvent.target);
  }
});

document.querySelectorAll(".copy-code-button").forEach(copyCodeButton => {
  copyCodeButton.addEventListener("click", clickEvent =>
    copyCode(clickEvent.target)
  );
});
