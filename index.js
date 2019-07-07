"use strict";

// Using a map instead of an object because I want to show the repos in the order in which they're inserted
const repos = new Map();
setupRepos();
requestRepoData();


// Auto-transition to night mode, if applicable
(function(){
    const nightModeSwitch = document.getElementById('nightmode-switch');
    nightModeSwitch.addEventListener('click', toggleColorTheme);

    const today = new Date();    
    if (today.getHours() >= 20 || today.getHours() <= 6) {
        nightModeSwitch.click();
    }
})();


/** Defines all repositories of interest, to be displayed in the Projects section of the page in
 * the precise order that they appear here. These serve as filters for when we scour through all 
 * repositories returned by the GitHub API. Though these are mostly hardcoded, we only have to enter
 * the information within this function; the rest of the script is not hardcoded in that respect.
 * Notable downside: if the name of the repo changes for whatever reason, it will need to be updated here.
 */
function setupRepos() {
    // The only alternative to passing in icons as hardcoded emoji is to clutter my repo descriptions on GitHub with emoji
    // at the start and to use substring hacks to extract the icon part, which I'd rather not do
    addRepo("Scribe-Text-Editor", "Scribe: Text Editor", '📄', ["c++", "qt5", "qtcreator"]);
    addRepo("EmbodyGame", "Embody: Game", '👻', ["c#", "unity", "inkscape", "ai"]);
    addRepo("aleksandrhovhannisyan.github.io", "Personal Website", '💾', ["html5", "css", "javascript"]);
    addRepo("Steering-Behaviors", "Steering Behaviors", '⚙️', ["c#", "unity", "ai"]);
    addRepo("MIPS-Linked-List", "ASM Linked List", '⛓️', ["mips", "asm", "qtspim"]);
    addRepo('Dimension35', "dim35: Game", '⚔️', ["godot", "networking"]);
}


/** Associates the given official name of a repo with an object representing custom data about that repository.
 * This hashing/association makes it easier to do lookups later on.
 * 
 * @param {string} officialName - The unique name used to identify this repository on GitHub.
 * @param {string} customName - A custom name for the repository, not necessarily the same as its official name.
 * @param {string} icon - A string containing the emoji to be used as the project icon.
 * @param {string[]} topics - An array of strings denoting the topics that correspond to this repo.
 */
function addRepo(officialName, customName, icon, topics) {
    // Note 1: We define a custom name here for two reasons: 1) some repo names are quite long, such as my website's,
    // and 2) multi-word repos have hyphens instead of spaces on GitHub, so we'd need to replace those (which would be wasteful)

    // Note 2: We define the topics here instead of parsing them dynamically because GitHub's API returns the topics
    // as a *sorted* array, which means we'll end up displaying undesired tags (since we don't show all of them).
    // This approach gives us more control but sacrifices flexibility, since we have to enter topics manually for repos of interest.
    repos.set(officialName, { customName, topics, icon, card : null });
}


/** Convenience wrapper for accessing the custom data for a particular repo. Uses the given
 * repo's official name (per the GitHub API) as the key into the associated Map.
 * 
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Object} The custom object representing the given repo.
 */
function get(repo) {
    // Notice how the underlying syntax is messy; the wrapper makes it cleaner when used
    return repos.get(repo.name);
}


function requestRepoData() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/users/AleksandrHovhannisyan/repos', true);
    request.onload = parseRepos;
    request.send();
}


function parseRepos() {
    if (this.status !== 200) return;

    const data = JSON.parse(this.response);

    // Even though we have to loop over all repos to find the ones we want, doing so is arguably
    // much faster (and easier) than making separate API requests for each repo of interest
    // Also note that GitHub has a rate limit of 60 requests/hr for unauthenticated IPs
    for (const repo of data) {
        if (repos.has(repo.name)) {
            // We cache the card here instead of publishing it immediately so we can display
            // the cards in our own order, since the requests are processed out of order (b/c of async)
            get(repo).card = createCardFor(repo);
        }
    }

    publishRepoCards();
}


/** Creates a project card for the given repo. A card consists of a header, description,
 * and footer, as well as an invisible link and hidden content to be displayed when the
 * card is hovered over.
 * 
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A DOM element representing a project card for the given repo.
 */
function createCardFor(repo) {
    const card = document.createElement('section');
    card.classList.add('project');
    card.appendChild(headerFor(repo));
    card.appendChild(descriptionFor(repo));
    card.appendChild(footerFor(repo));
    card.appendChild(anchorFor(repo));
    card.appendChild(createHoverContent());
    return card;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A header for the given repo, consisting of three key pieces:
 * the repo icon, the repo name, and the repo's rating (stargazers).
 */
function headerFor(repo) {
    var header = document.createElement('header');

    var icon = document.createElement('span');
    icon.classList.add('project-icon');
    icon.textContent = get(repo).icon + ' ';
    
    var h4 = document.createElement('h4');
    h4.appendChild(icon);
    h4.appendChild(nameLabelFor(repo));
    
    header.appendChild(h4);
    header.appendChild(stargazerLabelFor(repo));
    return header;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A label for the name of the given repo.
 */
function nameLabelFor(repo) {
    var projectName = document.createElement('span');
    projectName.textContent = get(repo).customName;
    return projectName;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A label showing the number of stargazers for the given repo.
 */
function stargazerLabelFor(repo) {
    var projectRating = document.createElement('span');
    
    var starIcon = document.createElement('i');
    starIcon.classList.add('fas', 'fa-star', 'filled');
    
    var starCount = document.createElement('span');
    starCount.textContent = ' ' + repo.stargazers_count;
    
    projectRating.classList.add('project-rating');
    projectRating.appendChild(starIcon);
    projectRating.appendChild(starCount);
    
    return projectRating;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} An element containing the description of the given repo.
 */
function descriptionFor(repo) {
    var description = document.createElement('p');
    description.classList.add('description');
    description.textContent = repo.description;
    return description;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A footer for the name of the given repo, consisting of at most
 * three paragraphs denoting the topics associated with that repo.
 */
function footerFor(repo) {
    var footer = document.createElement('footer');
    footer.classList.add('topics');

    for(const topic of get(repo).topics) {
        const p = document.createElement('p');
        p.textContent = topic;
        footer.appendChild(p);
    }

    return footer;
}


/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} An anchor element whose href is set to the given repo's "real" URL.
 */
function anchorFor(repo) {
    var anchor = document.createElement('a');
    anchor.classList.add('container-link');
    anchor.setAttribute('href', repo.html_url);
    anchor.setAttribute('target', '_blank');
    return anchor;
}


function createHoverContent() {
    var hoverContent = document.createElement('div');
    hoverContent.classList.add('hover-content');
    
    var boldText = document.createElement('strong');
    boldText.textContent = 'View on GitHub';

    var externalLinkIcon = document.createElement('i');
    externalLinkIcon.classList.add('fas', 'fa-external-link-alt');
    
    hoverContent.appendChild(boldText);
    hoverContent.appendChild(externalLinkIcon);
    return hoverContent;
}


function publishRepoCards() {
    const projects = document.getElementById('projects');
    const placeholder = document.getElementById('project-placeholder');

    for (const repo of repos.values()) {
        projects.insertBefore(repo.card, placeholder);
    }
}


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
    }
    else {
        themeLabel.textContent = 'Light mode';
    }
}


/** Scrolls to the provided target destination at the given speed.
 * @param topOfTarget - the offset().top of the target, plus/minus any additional offset
 * @param speed - the speed at which the scrolling should be animated 
 */
function smoothScrollTo(topOfTarget, speed=500){
    // Note: this is really the only place we need to use jQuery because there's
    // no good JavaScript equivalent that isn't messy and convoluted
    $('html, body').animate({scrollTop: topOfTarget}, speed);
}


// Another closure, just to prevent variables from leaking into global scope when possible
(function registerCollapsibleClickHandlers() {
    const collapsibles = document.getElementsByClassName('collapsible');
    for(const collapsible of Array.from(collapsibles)) {
        collapsible.addEventListener('click', toggleCollapsible);
    }
})();


/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
function toggleCollapsible() {
    const content = this.nextElementSibling;
    const icon = this.querySelector('i');

    function toggleIcon() {
        icon.classList.toggle('fa-angle-down');
        icon.classList.toggle('fa-angle-right');
    }

    // Must use computed style for initial check; it's set to 0px in style.css, not as an inline style
    if (getComputedStyle(content).maxHeight != '0px') {
        content.style.maxHeight = '0px';
        toggleIcon();
    } else {
        // Have to set the max height to some large value; auto height isn't eligible for transitions/animation, unfortunately
        // One notable downside to this is that the speed will vary depending on the amount of content in the div
        content.style.maxHeight = '1000px';
        toggleIcon();
    }

    smoothScrollTo(this.offsetTop - 60);
};


const navbarHamburger = document.querySelector('#topnav .navbar-hamburger');
const navbarLinkContainer = document.querySelector('#topnav .nav-links');

/** Called when the user clicks on the hamburger icon in the navigation menu. 
 */
navbarHamburger.addEventListener('click', function toggleMobileNavbar(){
    navbarLinkContainer.classList.toggle('active');
});


// Register click listeners for all the navbar links so we can hide the navbar menu
// if the links are clicked from mobile (i.e., to hide the dropdown). Doing this in
// a closure so we don't unnecessarily expose these variables to global scope.
(function() {
    const navbarLinks = navbarLinkContainer.querySelectorAll('a');
    for (const anchor of Array.from(navbarLinks)) {
        anchor.addEventListener('click', hideMobileNavbar);
    }
})();


/** Called when the user clicks on a navbar link. Checks to see if the click occured
 *  while the mobile version of the navigation was showing. If so, it simulates a
 *  click on the hamburger icon to hide the navigation menu.
 */
function hideMobileNavbar() {
    if (getComputedStyle(navbarHamburger).display != 'none'){
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