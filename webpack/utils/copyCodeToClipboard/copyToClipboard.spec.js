import copyCodeToClipboard from './copyCodeToClipboard';

let copyFn;

beforeEach(() => {
  copyFn = jest.fn();
});

describe('copyCode utility', () => {
  it('calls the copy to clipboard routine', () => {
    const copyCodeButton = document.createElement('button');
    const code = 'Some code';
    copyCodeButton.className = 'copy-code-button';
    copyCodeButton.setAttribute('data-code', code);
    copyCodeButton.addEventListener('click', (e) => copyCodeToClipboard(e, copyFn));

    copyCodeButton.click();
    expect(copyFn).toHaveBeenCalledTimes(1);
  });
});
