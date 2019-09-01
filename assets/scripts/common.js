"use strict";
const html = document.documentElement;


// Auto-transition to night theme, if applicable
(function() {
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('click', toggleColorTheme);
})();


/** Called when the user clicks the night mode switch in the top-left of the navbar.
 *  Toggles the document's class to trigger a change in the color themes. 
 */
function toggleColorTheme() {
    if (html.className === 'night') {
        html.className = 'day';
        localStorage.setItem('theme', 'day');
    } else {
        html.className = 'night';
        localStorage.setItem('theme', 'night');
    }
}


/** Scrolls to the provided target destination at the given speed.
 * @param targetPosition - the location to which the page should scroll.
 * @param duration - the number of milliseconds for which the scroll animation should play.
 */
function smoothScrollTo(targetPosition, duration=500){
    // Note: this is really the only place we need to use jQuery because there's
    // no good JavaScript equivalent that isn't messy and convoluted. The best alternative
    // is 'scroll-behavior: smooth' via CSS, but that's not supported in all browsers.
    $('html, body').animate({scrollTop: targetPosition}, duration);
}


// Another closure, just to prevent variables from leaking into global scope when possible
(function registerCollapsibleClickHandlers() {
    const collapsibles = document.getElementsByClassName('collapsible-header');
    for (const collapsible of Array.from(collapsibles)) {
        collapsible.addEventListener('click', toggleCollapsible);
    }
})();

const ANGLE_UP = 'M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z';
const ANGLE_DOWN = 'M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z';

/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
function toggleCollapsible() {
    const content = this.parentElement.querySelector('.collapsible-content');
    const svg = this.querySelector('svg');

    // Must use computed style for initial check; it's set to 0px in style.css, not as an inline style
    const collapsibleIsBeingOpened = getComputedStyle(content).maxHeight === '0px';
    let angle = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (collapsibleIsBeingOpened) {
        content.style.maxHeight = content.scrollHeight + 'px';
        angle.setAttributeNS(null, 'd', ANGLE_UP);
        smoothScrollTo(content.offsetTop - 60);
    } else {
        content.style.maxHeight = '0px';
        angle.setAttributeNS(null, 'd', ANGLE_DOWN);
    }

    svg.innerHTML = '';
    svg.appendChild(angle);
};


const navbarHamburger = document.querySelector('#topnav .navbar-hamburger');
const navbarLinks = document.querySelector('#topnav .nav-links');

/** Called when the user clicks on the hamburger icon in the navigation menu. 
 */
navbarHamburger.addEventListener('click', function toggleMobileNavbar() {
    // I'm doing this via JS because the best alternative is to set some arbitrary max-height on .nav-links
    // via CSS, e.g. 1000 px, but that's hacky and doesn't work well with the transition duration.
    // If I didn't want any smooth animation on the nav menu opening, this could be accomplished by
    // simply toggling a class on .nav-links and changing the max height property via the "hacky" solution.
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
    if (getComputedStyle(navbarHamburger).display !== 'none'){
        navbarHamburger.click();
    }
};