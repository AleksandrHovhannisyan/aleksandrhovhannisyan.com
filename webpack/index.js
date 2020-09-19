import toggleTheme, { updateThemeSwitchAriaLabel } from './toggleTheme';
import { rehighlightActiveNavLink, toggleMobileNavbarVisibility, onNavLinkHovered } from './navbar';
import lazyLoad from './lazyLoad';
import copyCode from './copyCode';

const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('click', toggleTheme);
updateThemeSwitchAriaLabel();

const navbar = document.querySelector('.navbar');

const navMenu = navbar.querySelector('.navbar-menu');
navMenu.addEventListener('click', toggleMobileNavbarVisibility);

const navLinks = navMenu.querySelector('.navbar-links');
navLinks.addEventListener('click', (clickEvent) => clickEvent.stopPropagation());

const mobileNavbarToggle = navbar.querySelector('#navbar-toggle');
mobileNavbarToggle.addEventListener('click', toggleMobileNavbarVisibility);

// Manually listen to these events to ensure that we never underline two different links
// simultaneously. For example, if we're on Experience but hovering over Blog, we don't want
// both links to have a focus style. See onNavLinkHovered for how that's handled.
navLinks.querySelectorAll('.navbar-link').forEach((anchor) => {
  anchor.addEventListener('focusin', onNavLinkHovered);
  anchor.addEventListener('mouseenter', onNavLinkHovered);
  anchor.addEventListener('focusout', rehighlightActiveNavLink);
  anchor.addEventListener('mouseleave', rehighlightActiveNavLink);
});

const imgObserver = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      lazyLoad(entry.target);
      self.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('#page-content .lazy-img').forEach((img) => {
  imgObserver.observe(img);
});

document.querySelectorAll('.copy-code-button').forEach((copyCodeButton) => {
  copyCodeButton.addEventListener('click', copyCode);
});
