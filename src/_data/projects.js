import Cache from '@11ty/eleventy-cache-assets';
import path from 'path';
import { imagePaths } from '../../config/constants.js';
import { imageShortcode } from '../../config/shortcodes/index.js';

// Combination of static + dynamic data
const repos = {
  fluidTypeScale: {
    getIcon: async () => {
      const icon = await imageShortcode({
        src: 'https://www.fluid-type-scale.com/images/favicon-32.png',
        alt: '',
        isLinked: false,
        widths: [32],
      });
      return icon;
    },
    name: 'fluid-type-scale.com',
    url: 'https://www.fluid-type-scale.com/',
    repo: 'AleksandrHovhannisyan/fluid-type-scale-calculator',
    tech: ['svelte', 'typescript', 'sass'],
  },
  scribe: {
    getIcon: () => '📄',
    name: 'Scribe',
    repo: 'AleksandrHovhannisyan/Scribe-Text-Editor',
    tech: ['c++', 'qt5', 'qtcreator'],
  },
  usGunCrimes: {
    getIcon: () => '⚖️',
    name: 'U.S. Gun Crimes',
    repo: 'CIS4301-Project-University-of-Florida/U.S.-Gun-Crime',
    tech: ['react', 'typescript', 'express', 'sql'],
  },
  blog: {
    getIcon: async () => {
      const icon = await imageShortcode({
        src: path.join(imagePaths.input, 'favicons/favicon.png'),
        alt: '',
        isLinked: false,
        widths: [32],
      });
      return icon;
    },
    name: 'This website!',
    repo: 'AleksandrHovhannisyan/aleksandrhovhannisyan.com',
    tech: ['11ty', 'sass', 'javascript'],
  },
  embody: {
    getIcon: () => '👻',
    name: 'Embody',
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

export default async function getProjects() {
  console.log('Fetching GitHub projects...');
  const projects = await Promise.all(Object.keys(repos).map((key) => fetchRepo(key)));
  // Highest rated projects first
  return projects.sort((a, b) => b.rating - a.rating);
};
