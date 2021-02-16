const copyToClipboard = (text, clippy = window.navigator.clipboard) => {
  if (!text) {
    return;
  }

  clippy.writeText(text);
};

export default copyToClipboard;
