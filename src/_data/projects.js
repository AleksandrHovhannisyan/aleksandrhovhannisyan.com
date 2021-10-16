const Cache = require('@11ty/eleventy-cache-assets');

// Combination of static + dynamic data
const repos = {
  scribe: {
    icon: '📄',
    repo: 'AleksandrHovhannisyan/Scribe-Text-Editor',
    tech: ['c++', 'qt5', 'qtcreator'],
  },
  cattlelog: {
    icon: '🐮',
    repo: 'Camoen/CattleLog',
    tech: ['android', 'kotlin', 'sql'],
  },
  usGunCrimes: {
    icon: '⚖️',
    repo: 'CIS4301-Project-University-of-Florida/U.S.-Gun-Crime',
    tech: ['react', 'typescript', 'express', 'sql'],
  },
  blog: {
    icon: '💾',
    name: 'This Website!',
    repo: 'AleksandrHovhannisyan/aleksandrhovhannisyan.com',
    tech: ['11ty', 'sass', 'javascript'],
  },
  embody: {
    icon: '👻',
    repo: 'cap4053-cheeky-pixels/EmbodyGame',
    tech: ['c#', 'unity', 'game-ai'],
  },
};

const fetchRepo = async (repoKey) => {
  const staticConfig = repos[repoKey];
  const data = await Cache(`https://api.github.com/repos/${staticConfig.repo}`, {
    duration: '1d',
    type: 'json',
  });
  return {
    icon: staticConfig.icon,
    name: staticConfig.name ?? data.name,
    rating: data.stargazers_count,
    description: data.description.endsWith('.') ? data.description : `${data.description}.`,
    url: data.html_url,
    tech: staticConfig.tech,
  };
};

module.exports = async () => {
  console.log('Fetching GitHub projects...');
  const projects = await Promise.all(Object.keys(repos).map((key) => fetchRepo(key)));
  // Highest rated projects first
  return projects.sort((a, b) => b.rating - a.rating);
};
