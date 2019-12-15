'use strict';
const xmlns = 'http://www.w3.org/2000/svg';

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
  addRepo('Scribe-Text-Editor', 'Scribe', '📄', ['c++', 'qt5', 'qtcreator']);
  addRepo('CattleLog', 'CattleLog', '🐮', [
    'android',
    'mobile dev',
    'kotlin',
    'room-library'
  ]);
  addRepo('U.S.-Gun-Crime', 'U.S. Gun Crimes', '⚖️', [
    'react',
    'typescript',
    'express',
    'oracle'
  ]);
  addRepo('aleksandrhovhannisyan.github.io', 'This Website!', '💾', [
    'jekyll',
    'html5',
    'sass',
    'javascript'
  ]);
  addRepo('EmbodyGame', 'Embody: Game', '👻', [
    'c#',
    'unity',
    'inkscape',
    'ai'
  ]);
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
  repos.set(officialName, { customName, topics, icon, card: null });
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
  request.open(
    'GET',
    'https://api.github.com/users/AleksandrHovhannisyan/repos',
    true
  );
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
  const header = document.createElement('header');

  const icon = document.createElement('span');
  icon.classList.add('project-icon');
  icon.textContent = get(repo).icon;

  const boldProjectName = document.createElement('strong');
  const projectName = document.createElement('span');
  projectName.classList.add('project-name');
  projectName.appendChild(icon);
  projectName.appendChild(nameLabelFor(repo));
  boldProjectName.appendChild(projectName);

  header.appendChild(boldProjectName);
  header.appendChild(stargazerLabelFor(repo));
  return header;
}

/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A label for the name of the given repo.
 */
function nameLabelFor(repo) {
  const projectName = document.createElement('span');
  projectName.textContent = get(repo).customName;
  return projectName;
}

/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} A label showing the number of stargazers for the given repo.
 */
function stargazerLabelFor(repo) {
  const projectRating = document.createElement('span');

  const starIcon = document.createElementNS(xmlns, 'svg');
  starIcon.classList.add('star', 'star-filled');
  starIcon.setAttribute(null, 'role', 'img');
  starIcon.setAttributeNS(null, 'viewBox', '0 0 1792 1792');
  const starPath = document.createElementNS(xmlns, 'path');
  starPath.setAttributeNS(
    null,
    'd',
    'M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z'
  );
  starIcon.appendChild(starPath);

  const starCount = document.createElement('span');
  starCount.textContent = repo.stargazers_count;

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
  const description = document.createElement('p');
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
  const footer = document.createElement('footer');
  footer.classList.add('topics');

  for (const topic of get(repo).topics) {
    const topicDiv = document.createElement('div');
    topicDiv.classList.add('topic');
    topicDiv.textContent = topic;
    footer.appendChild(topicDiv);
  }

  return footer;
}

/**
 * @param {Object} repo - The JSON-parsed object containing a repository's data.
 * @returns {Element} An anchor element whose href is set to the given repo's "real" URL.
 */
function anchorFor(repo) {
  const anchor = document.createElement('a');
  anchor.classList.add('container-link');
  anchor.setAttribute('href', repo.html_url);
  return anchor;
}

function createHoverContent() {
  const hoverContent = document.createElement('div');
  hoverContent.classList.add('hover-content');

  const boldText = document.createElement('strong');
  boldText.textContent = 'Explore on GitHub';

  const externalLinkIcon = document.createElementNS(xmlns, 'svg');
  const svgPath = document.createElementNS(xmlns, 'path');
  svgPath.setAttributeNS(
    null,
    'd',
    'M1408 928v320q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h704q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-320q0-14 9-23t23-9h64q14 0 23 9t9 23zm384-864v512q0 26-19 45t-45 19-45-19l-176-176-652 652q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l652-652-176-176q-19-19-19-45t19-45 45-19h512q26 0 45 19t19 45z'
  );
  externalLinkIcon.setAttributeNS(null, 'viewBox', '0 0 1792 1792');
  externalLinkIcon.appendChild(svgPath);

  hoverContent.appendChild(boldText);
  hoverContent.appendChild(externalLinkIcon);
  return hoverContent;
}

function publishRepoCards() {
  const grid = document.getElementById('project-grid');
  const placeholder = document.getElementById('project-placeholder');

  for (const repo of repos.values()) {
    grid.insertBefore(repo.card, placeholder);
  }
}
