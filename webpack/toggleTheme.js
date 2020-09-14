const html = document.documentElement;

const themeMap = {
  light: 'dark',
  dark: 'light',
};

function setColorTheme(oldTheme, newTheme) {
  html.classList.remove(oldTheme);
  html.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeSwitchAriaLabel();
}

function toggleTheme() {
  const oldTheme = html.classList[0];
  setColorTheme(oldTheme, themeMap[oldTheme]);
}

export function updateThemeSwitchAriaLabel() {
  const currentTheme = localStorage.getItem('theme');
  const nextTheme = themeMap[currentTheme];
  document.getElementById('theme-switch').setAttribute('aria-label', `Switch to ${nextTheme} mode theme`);
}

export default toggleTheme;
