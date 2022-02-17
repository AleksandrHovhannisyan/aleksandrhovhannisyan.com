/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import ThemeToggle from './index.mjs';

let toggleElement;

beforeEach(() => {
  toggleElement = document.createElement('button');
  localStorage.clear();
});

describe('ThemeToggle component', () => {
  it('respects the default theme', () => {
    const toggle = new ThemeToggle({
      toggleElement,
      root: document.documentElement,
      storageKey: 'theme',
      defaultTheme: 'dark',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });
    expect(toggle.theme).toEqual('dark');
  });

  it('throws an error if the default theme is not recognized', () => {
    expect(
      () =>
        new ThemeToggle({
          toggleElement,
          root: document.documentElement,
          storageKey: 'theme',
          defaultTheme: 'mango',
          themes: {
            light: 'dark',
            dark: 'light',
          },
        })
    ).toThrow();
  });

  it('calls toggle when the button is clicked', () => {
    // eslint-disable-next-line no-unused-vars
    const toggle = new ThemeToggle({
      toggleElement,
      root: document.documentElement,
      storageKey: 'theme',
      defaultTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    const toggleFn = jest.fn();
    ThemeToggle.toggle = toggleFn();

    toggleElement.click();
    expect(toggleFn).toHaveBeenCalled();
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it('toggles from light to dark', () => {
    const toggle = new ThemeToggle({
      toggleElement,
      root: document.documentElement,
      storageKey: 'theme',
      defaultTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    toggle.toggle();
    expect(toggle.theme).toEqual('dark');
  });

  it('toggles from dark to light', () => {
    const toggle = new ThemeToggle({
      toggleElement,
      root: document.documentElement,
      storageKey: 'theme',
      defaultTheme: 'light',
      themes: {
        light: 'dark',
        dark: 'light',
      },
    });

    toggle.toggle();
    toggle.toggle();
    expect(toggle.theme).toEqual('light');
  });
});
