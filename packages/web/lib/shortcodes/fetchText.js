import Fetch from '@11ty/eleventy-fetch';

export default async function fetchText(url, duration) {
  console.log(`${this.page.url}: Fetching ${url} as plaintext...`);
  const text = await Fetch(url, { duration, type: 'text' });
  return text;
}
