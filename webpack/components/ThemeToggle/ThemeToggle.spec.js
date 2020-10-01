import ThemeToggle from './ThemeToggle';

let toggleButton;
let themeMap;

beforeEach(() => {
  document.body.innerHTML = '';
  toggleButton = document.createElement('button');
  toggleButton.id = 'theme-toggle';
  document.body.appendChild(toggleButton);
  themeMap = {
    light: 'dark',
    dark: 'light',
  };
  localStorage.clear();
});

describe('ThemeToggle component', () => {
  it('has a default theme of light', () => {
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    expect(toggle.currentTheme).toEqual('light');
  });

  it('calls toggle when the button is clicked', () => {
    // eslint-disable-next-line no-unused-vars
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    const toggleFn = jest.fn();
    ThemeToggle.toggle = toggleFn();

    toggleButton.click();
    expect(toggleFn).toHaveBeenCalled();
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it('toggles from light to dark', () => {
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    toggle.toggle();
    expect(toggle.currentTheme).toEqual('dark');
  });

  it('toggles from dark back to light', () => {
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    toggle.toggle();
    toggle.toggle();
    expect(toggle.currentTheme).toEqual('light');
  });

  it("keeps the theme owner's class in sync with the current theme", () => {
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    toggle.toggle();
    expect(document.documentElement.classList.value).toEqual(toggle.currentTheme);
    toggle.toggle();
    expect(document.documentElement.classList.value).toEqual(toggle.currentTheme);
  });

  it("keeps the toggle element's aria-label in sync with the current theme", () => {
    const toggle = new ThemeToggle({
      toggleSelector: '#theme-toggle',
      themeOwner: document.documentElement,
      storageKey: 'theme',
    });

    const toggleButton = document.getElementById('theme-toggle');
    expect(toggleButton.getAttribute('aria-label')).toEqual(`Switch to ${themeMap[toggle.currentTheme]} mode theme`);
    toggle.toggle();
    expect(toggleButton.getAttribute('aria-label')).toEqual(`Switch to ${themeMap[toggle.currentTheme]} mode theme`);
  });
});
