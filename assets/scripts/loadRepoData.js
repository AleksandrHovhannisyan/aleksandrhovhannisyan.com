"use strict";


// Using a map instead of an object because I want to show the repos in the order in which they're inserted
const repos = new Map();
setupRepos();
requestRepoData();


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
    addRepo("aleksandrhovhannisyan.github.io", "Personal Website", '💾', ["jekyll", "html5", "css", "javascript"]);
    addRepo("Steering-Behaviors", "Steering Behaviors", '⚙️', ["c#", "unity", "ai"]);
    addRepo("MIPS-Linked-List", "ASM Linked List", '⛓️', ["mips", "asm", "qtspim"]);
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
    const card = document.createElement('div');
    card.classList.add('card', 'project');
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

    for (const topic of get(repo).topics) {
        const span = document.createElement('span');
        span.classList.add('topic');
        span.textContent = topic;
        footer.appendChild(span);
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
    const grid = document.getElementById('card-grid');
    const placeholder = document.getElementById('project-placeholder');

    for (const repo of repos.values()) {
        grid.insertBefore(repo.card, placeholder);
    }
}
