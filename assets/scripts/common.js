'use strict';
const html = document.documentElement;

(function() {
  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('click', toggleColorTheme);
  // For accessibility, allow users to toggle with Enter
  themeSwitch.addEventListener('keyup', keyEvent => {
    if (keyEvent.keyCode === 13) {
      toggleColorTheme();
    }
  });
})();

function setColorTheme(theme) {
  html.className = theme;
  localStorage.setItem('theme', theme);
}

/** Called when the user clicks the dark mode switch in the top-left of the navbar.
 *  Toggles the document's class to trigger a change in the color themes.
 */
function toggleColorTheme() {
  if (html.className === 'dark') {
    setColorTheme('light');
  } else {
    setColorTheme('dark');
  }
}

const navbarHamburger = document.querySelector('#topnav .navbar-hamburger');
const navbarLinks = document.querySelector('#topnav .nav-links');

/** Called when the user clicks on the hamburger icon in the navigation menu.
 */
navbarHamburger.addEventListener('click', function toggleMobileNavbar() {
  // I'm doing this via JS because the best alternative is to set some arbitrary max-height on .nav-links
  // via CSS, e.g. 1000 px, but that's hacky and doesn't work well with the transition duration.
  if (getComputedStyle(navbarLinks).maxHeight === '0px') {
    navbarLinks.style.maxHeight = navbarLinks.scrollHeight + 'px';
  } else {
    navbarLinks.style.maxHeight = '0px';
  }
});

(function() {
  const anchors = Array.from(navbarLinks.querySelectorAll('a'));

  let cachedActiveNavlink;

  // Manually listen to these events to ensure that we never underline two different links
  // simultaneously. For example, if we're on Experience but hovering over Blog, we don't want
  // both links to have an underline. See onNavLinkHovered for how that's handled.
  anchors.forEach(anchor => {
    anchor.addEventListener('focusin', onNavLinkHovered);
    anchor.addEventListener('mouseenter', onNavLinkHovered);
    anchor.addEventListener('focusout', rehighlightActiveNavLink);
    anchor.addEventListener('mouseleave', rehighlightActiveNavLink);
  });

  // Ensures that only one navbar link has the active state at a time. Otherwise, if there's
  // an active link and we hover another link, both will have an underline.
  function onNavLinkHovered(mouseEvent) {
    const activeNavLink = document.getElementById('active-nav-link');

    // Happens if we're on the home page
    if (!activeNavLink) return;

    const hoveredAnchor = mouseEvent.target;
    
    if (hoveredAnchor === activeNavLink) return;

    cachedActiveNavlink = activeNavLink;
    activeNavLink.id = '';
  }

  // Once we stop hovering a link, simply re-apply the active-nav-link
  // ID to the cached anchor, if there is one.
  function rehighlightActiveNavLink() {
    if (cachedActiveNavlink) {
      cachedActiveNavlink.id = 'active-nav-link';
    }
  }
})();

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      const url = card.querySelector('.container-link');
      window.open(url.getAttribute('href'), '_self');
    }
  });
})