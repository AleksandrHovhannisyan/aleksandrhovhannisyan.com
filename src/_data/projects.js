const Cache = require('@11ty/eleventy-cache-assets');
const { imageShortcode } = require('../../config/shortcodes');

// Combination of static + dynamic data
const repos = {
  fluidTypeScale: {
    getIcon: async () => {
      const icon = await imageShortcode({
        src: '/assets/images/projects/fluid-type-scale-calculator.png',
        alt: '',
        clickable: false,
        widths: [32],
      });
      return icon;
    },
    url: 'https://www.fluid-type-scale.com/',
    repo: 'AleksandrHovhannisyan/fluid-type-scale-calculator',
    tech: ['11ty', 'slinkity', 'sass', 'react'],
  },
  scribe: {
    getIcon: () => '📄',
    repo: 'AleksandrHovhannisyan/Scribe-Text-Editor',
    tech: ['c++', 'qt5', 'qtcreator'],
  },
  usGunCrimes: {
    getIcon: () => '⚖️',
    repo: 'CIS4301-Project-University-of-Florida/U.S.-Gun-Crime',
    tech: ['react', 'typescript', 'express', 'sql'],
  },
  blog: {
    getIcon: () => '💾',
    name: 'This Website!',
    repo: 'AleksandrHovhannisyan/aleksandrhovhannisyan.com',
    tech: ['11ty', 'sass', 'javascript'],
  },
  embody: {
    getIcon: () => '👻',
    repo: 'cap4053-cheeky-pixels/EmbodyGame',
    tech: ['c#', 'unity', 'game-ai'],
  },
};

const fetchRepo = async (repoKey) => {
  const staticConfig = repos[repoKey];
  const icon = await staticConfig.getIcon();
  const data = await Cache(`https://api.github.com/repos/${staticConfig.repo}`, {
    duration: '1d',
    type: 'json',
  });
  return {
    icon,
    name: staticConfig.name ?? data.name,
    rating: data.stargazers_count,
    description: data.description.endsWith('.') ? data.description : `${data.description}.`,
    url: staticConfig.url ?? data.html_url,
    tech: staticConfig.tech,
  };
};

module.exports = async () => {
  console.log('Fetching GitHub projects...');
  const projects = await Promise.all(Object.keys(repos).map((key) => fetchRepo(key)));
  // Highest rated projects first
  return projects.sort((a, b) => b.rating - a.rating);
};
