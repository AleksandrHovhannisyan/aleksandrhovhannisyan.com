import copyToClipboard from '.';

let mockClippy;
let copyFn;

beforeEach(() => {
  copyFn = jest.fn();
  mockClippy = {
    writeText: (text) => copyFn(text),
  };
});

describe('copyToClipboard utility', () => {
  it('calls the copy to clipboard routine', () => {
    copyToClipboard('foo bar', mockClippy);
    expect(copyFn).toHaveBeenCalledTimes(1);
    expect(copyFn).toHaveBeenCalledWith('foo bar');
  });
});
