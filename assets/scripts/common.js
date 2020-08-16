'use strict';
const html = document.documentElement;

function mount(root, ...nodes) {
  nodes.forEach((node) => root.appendChild(node));
}

(function () {
  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('click', toggleColorTheme);
})();

function setColorTheme(newTheme, oldTheme) {
  html.classList.add(newTheme);
  html.classList.remove(oldTheme);
  localStorage.setItem('theme', newTheme);
}

function toggleColorTheme() {
  if (html.classList.contains('dark')) {
    setColorTheme('light', 'dark');
  } else {
    setColorTheme('dark', 'light');
  }
}

const navbar = document.querySelector('.navbar');
const mobileNavbarToggle = navbar.querySelector('#navbar-toggle');
mobileNavbarToggle.addEventListener('click', toggleMobileNavbarVisibility);

function toggleMobileNavbarVisibility() {
  if (navbar.classList.contains('opened')) {
    navbar.classList.remove('opened');
    mobileNavbarToggle.setAttribute('aria-label', 'Open navigation menu');
  } else {
    navbar.classList.add('opened');
    mobileNavbarToggle.setAttribute('aria-label', 'Close navigation menu');
  }
}

const navMenu = navbar.querySelector('.navbar-menu');
const navLinks = navMenu.querySelector('.navbar-links');

navMenu.addEventListener('click', toggleMobileNavbarVisibility);
navLinks.addEventListener('click', (clickEvent) => clickEvent.stopPropagation());

(function () {
  const anchors = Array.from(navLinks.querySelectorAll('a'));

  let cachedActiveNavlink;

  // Manually listen to these events to ensure that we never underline two different links
  // simultaneously. For example, if we're on Experience but hovering over Blog, we don't want
  // both links to have a focus style. See onNavLinkHovered for how that's handled.
  anchors.forEach((anchor) => {
    anchor.addEventListener('focusin', onNavLinkHovered);
    anchor.addEventListener('mouseenter', onNavLinkHovered);
    anchor.addEventListener('focusout', rehighlightActiveNavLink);
    anchor.addEventListener('mouseleave', rehighlightActiveNavLink);
  });

  // Ensures that only one navbar link has the active state at a time. Otherwise, if there's
  // an active link and we hover another link, both will have an underline.
  function onNavLinkHovered(mouseEvent) {
    const activeNavLink = document.getElementById('active-navbar-link');

    // Happens if we're on the home page
    if (!activeNavLink) return;

    const hoveredAnchor = mouseEvent.target;

    if (hoveredAnchor === activeNavLink) return;

    cachedActiveNavlink = activeNavLink;
    activeNavLink.id = '';
  }

  // Once we stop hovering a link, simply re-apply the active-navbar-link
  // ID to the cached anchor, if there is one.
  function rehighlightActiveNavLink() {
    if (cachedActiveNavlink) {
      cachedActiveNavlink.id = 'active-navbar-link';
    }
  }
})();
