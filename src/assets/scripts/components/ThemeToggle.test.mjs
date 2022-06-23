/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import ThemeToggle from './ThemeToggle.mjs';

let toggleElement;

beforeEach(() => {
  toggleElement = document.createElement('button');
});

describe('ThemeToggle component', () => {
  it('initializes the theme', () => {
    const toggle = new ThemeToggle({
      toggleElement,
      setTheme: () => {},
      initialTheme: 'initial',
      themes: {
        initial: 'next',
        next: 'initial',
      },
    });
    expect(toggle.theme).toStrictEqual('initial');
  });

  it('throws an error if the initial theme is not recognized', () => {
    expect(
      () =>
        new ThemeToggle({
          toggleElement,
          setTheme: () => {},
          initialTheme: 'unrecognized',
          themes: {
            first: 'second',
            second: 'first',
          },
        })
    ).toThrow();
  });

  it('throws an error if a theme does not have a target transition state', () => {
    expect(
      () =>
        new ThemeToggle({
          toggleElement,
          setTheme: () => {},
          initialTheme: 'first',
          themes: {
            first: 'second',
            second: 'third',
            third: 'fourth', // on toggle, 'fourth' won't have any target state, so we need to throw preemptively on init
          },
        })
    ).toThrow();
  });

  it('throws an error if a theme is unreachable from other states', () => {
    expect(
      () =>
        new ThemeToggle({
          toggleElement,
          setTheme: () => {},
          initialTheme: 'first',
          themes: {
            first: 'second',
            second: 'first',
            unreachable: 'first',
          },
        })
    ).toThrow();
  });

  it('calls setTheme both on mount and when the toggle button is clicked', () => {
    const mockSetTheme = jest.fn();

    // eslint-disable-next-line no-unused-vars
    const toggle = new ThemeToggle({
      toggleElement,
      setTheme: mockSetTheme,
      initialTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    // Mount
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    // Toggle
    toggleElement.click();
    expect(mockSetTheme).toHaveBeenCalledTimes(2);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('cycles through the theme map', () => {
    const toggle = new ThemeToggle({
      toggleElement,
      setTheme: () => {},
      initialTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    expect(toggle.theme).toEqual('light');
    toggleElement.click();
    expect(toggle.theme).toEqual('dark');
    toggleElement.click();
    expect(toggle.theme).toEqual('light');
  });

  it('calls setCachedTheme on toggle', () => {
    const mockSetCachedTheme = jest.fn();

    // eslint-disable-next-line no-unused-vars
    const toggle = new ThemeToggle({
      toggleElement,
      setTheme: () => {},
      setCachedTheme: mockSetCachedTheme,
      initialTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    toggleElement.click();
    expect(mockSetCachedTheme).toHaveBeenCalledTimes(1);
    expect(mockSetCachedTheme).toHaveBeenCalledWith('dark');
  });
});
