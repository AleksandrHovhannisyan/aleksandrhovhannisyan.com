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

// Register click listeners for all the navbar links so we can hide the mobile dropdown menu if
// a link is clicked on. Doing this in a closure so we don't unnecessarily expose these variables to global scope.
(function() {
  const anchors = navbarLinks.querySelectorAll('a');
  for (const anchor of Array.from(anchors)) {
    anchor.addEventListener('click', hideMobileMenuOnAnchorClick);
  }
})();

/** Called when the user clicks on a navbar link. Checks to see if the click occured
 *  while the mobile version of the navigation was showing. If so, it simulates a
 *  click on the hamburger icon to hide the navigation menu.
 */
function hideMobileMenuOnAnchorClick() {
  // Because it gets set to 'none' on larger screens
  if (getComputedStyle(navbarHamburger).display !== 'none') {
    navbarHamburger.click();
  }
}
