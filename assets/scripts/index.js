"use strict";

// Auto-transition to night theme, if applicable
(function() {
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('click', toggleColorTheme);

    const today = new Date();    
    if (today.getHours() >= 20 || today.getHours() <= 6) {
        themeSwitch.click();
    }
})();

/** Called when the user clicks the night mode switch in the top-left of the navbar.
 *  Toggles the document's class to trigger a change in the color themes. 
 */

function toggleColorTheme() {
    document.documentElement.classList.toggle('night');
    updateThemeLabel();
}


/** Updates the text in the theme label to match whatever mode the page is in (dark, light).
 */
function updateThemeLabel() {
    const themeLabel = document.getElementById('theme-label');

    if (document.documentElement.classList.contains('night')) {
        themeLabel.textContent = 'Dark mode';
    } else {
        themeLabel.textContent = 'Light mode';
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


function toggleIcon(icon) {
    icon.classList.toggle('fa-angle-down');
    icon.classList.toggle('fa-angle-up');
}


/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
function toggleCollapsible() {
    const content = this.parentElement.querySelector('.collapsible-content');
    const icon = this.querySelector('i');

    // Must use computed style for initial check; it's set to 0px in style.css, not as an inline style
    if (getComputedStyle(content).maxHeight === '0px') {
        content.style.maxHeight = content.scrollHeight + 'px';
        toggleIcon(icon);
        smoothScrollTo(this.offsetTop - 60);
    } else {
        content.style.maxHeight = '0px';
        toggleIcon(icon);
    }
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


/** Smoothly scrolls to the location within the document specified by the clicked anchor's
 *  href attribute. Taken from: https://stackoverflow.com/a/7717572/10480032
 */
$(document).on('click', 'a[href^="#"]', function handleAnchorClick(event) {
    event.preventDefault();
    smoothScrollTo($($.attr(this, 'href')).offset().top);
});