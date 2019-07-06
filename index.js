"use strict";

// Using a map instead of an object because I want to show the repos in the order in which they're inserted
var repos = new Map();

setupRepos();
requestRepoData();


/** Defines all repositories of interest, to be displayed in the Projects section of the page in
 * the precise order that they appear here. These serve as filters for when we scour through all 
 * repositories returned by the GitHub API. Though these are mostly hardcoded, we only have to enter
 * the information within this function; the rest of the script is not hardcoded in that respect.
 * Notable downside: if the name of the repo changes for whatever reason, it will need to be updated here.
 */
function setupRepos() {
    // I decided to pass in icons as hardcoded emoji to avoid cluttering my repo descriptions on GitHub and using weird hacks
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
    card.setAttribute('class', 'project');
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
    icon.setAttribute('class', 'project-icon');
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
    starIcon.setAttribute('class', 'fas fa-star filled');
    
    var starCount = document.createElement('span');
    starCount.textContent = ' ' + repo.stargazers_count;
    
    projectRating.setAttribute('class', 'project-rating');
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
    description.setAttribute('class', 'description');
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
    footer.setAttribute('class', 'topics');

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
    anchor.setAttribute('class', 'container-link');
    anchor.setAttribute('href', repo.html_url);
    anchor.setAttribute('target', '_blank');
    return anchor;
}


function createHoverContent() {
    var hoverContent = document.createElement('div');
    hoverContent.setAttribute('class', 'hover-content');
    
    var boldText = document.createElement('strong');
    boldText.textContent = 'View on GitHub';

    var externalLinkIcon = document.createElement('i');
    externalLinkIcon.setAttribute('class', 'fas fa-external-link-alt');
    
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


var nightModeSwitch = $('.nightmode-switch');
/** Called when the user clicks the night mode switch in the top-left of the navbar.
 *  Toggles the document's class to trigger a change in the color themes. 
 */
nightModeSwitch.click(function(){        
    $(document.documentElement).toggleClass('night');
    updateThemeLabel($(this).next());
});


// Auto-transition to night mode, if applicable
(function(){
    var today = new Date();
    var dusk = 20;
    var dawn = 6;
    
    if(today.getHours() >= dusk || today.getHours() <= dawn) {
        nightModeSwitch.click();
    }
})();


/** Updates the text in the given label to match whatever mode the page is in (dark, light).
 *  @param themeLabel {Node} The element that displays the color theme the page is currently using (light or dark).
 */
function updateThemeLabel(themeLabel){
    if($(document.documentElement).hasClass('night')) {
        themeLabel.html('Dark mode');
    }
    else {
        themeLabel.html('Light mode');
    }
}


/** Scrolls to the provided target destination at the given speed.
 * @param topOfTarget - the offset().top of the target, plus/minus any additional offset
 * @param speed - the speed at which the scrolling should be animated 
 */
function smoothScrollTo(topOfTarget, speed=500){
    $('html, body').animate({scrollTop: topOfTarget}, speed);
}


var collapsible = $('.collapsible');
/** Called when the user clicks on a collapsible element (accordion). Expands or
 *  collapses the button accordingly, and also updates the collapsible's icon.
 */
collapsible.click(function(){        
    var content = $(this).next();
    var icon = $(this).find('i');

    if(content.css('max-height') != '0px'){
        content.css('max-height', '0px');
        icon.toggleClass('fa-angle-down fa-angle-right');
    } else {
        // Have to set the max height to some large value; auto isn't eligible for transitions/animation, unfortunately
        // One notable downside to this is that the speed will vary depending on the amount of content in the div
        content.css('max-height', '1000px');
        icon.toggleClass('fa-angle-right fa-angle-down');
    }

    smoothScrollTo($(this).offset().top - 60);
});


var navbarHamburger = $('#topnav .navbar-hamburger');
var navbarLinkContainer = $('#topnav .nav-links');
/** Called when the user clicks on the hamburger icon in the navigation menu. 
 */
navbarHamburger.click(function(){
    navbarLinkContainer.toggleClass('active');
});


var navbarLinks = navbarLinkContainer.find('a');
/** Called when the user clicks on a navbar link. Checks to see if the click occured
 *  while the mobile version of the navigation was showing. If so, it simulates a
 *  click on the hamburger icon to hide the navigation menu.
 */
navbarLinks.click(function() {
    if(navbarHamburger.css('display') != 'none'){
        navbarHamburger.click();
    }
});


/** Smoothly scrolls to the location within the document specified by the clicked anchor's
 *  href attribute. Taken from: https://stackoverflow.com/a/7717572/10480032
 */
$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    smoothScrollTo($($.attr(this, 'href')).offset().top);
});