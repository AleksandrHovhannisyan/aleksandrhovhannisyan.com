const Cache = require('@11ty/eleventy-cache-assets');

module.exports = async function fetchText(url) {
  console.log(`${this.page.url}: Fetching ${url} as plaintext...`);
  const text = await Cache(url, { duration: '4w', type: 'text' });
  return text;
};
