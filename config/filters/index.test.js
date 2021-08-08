const {
  where,
  limit,
  sortByKey,
  wordCount,
  dividedBy,
  newlineToBr,
  stripNewlines,
  stripHtml,
  toAbsoluteUrl,
  unslugify,
} = require('.');
const site = require('../../src/_data/site');

describe('custom 11ty filters', () => {
  describe('limit', () => {
    it('returns the first n > 0 elements of an array', () => {
      expect(limit(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3)).toEqual(['a', 'b', 'c']);
    });
    it('returns an empty array if limit is 0', () => {
      expect(limit(['a', 'b'], 0)).toEqual([]);
    });
    it('returns all elements when the limit matches the array length', () => {
      expect(limit(['a', 'b'], 2)).toEqual(['a', 'b']);
    });
    it('throws an error if the limit is negative', () => {
      expect(() => limit(['a', 'b'], -1)).toThrow();
    });
  });
  describe('sortByKey', () => {
    it('sorts by string values', () => {
      const posts = [
        { data: { title: 'My best post' } },
        { data: { title: 'Another post' } },
        { data: { title: 'Post 1' } },
      ];
      expect(sortByKey(posts, 'data.title', 'DESC')).toEqual([
        { data: { title: 'Post 1' } },
        { data: { title: 'My best post' } },
        { data: { title: 'Another post' } },
      ]);
    });
    it('sorts by numbers', () => {
      const posts = [
        { data: { title: 'My best post', order: 0 } },
        { data: { title: 'Another post', order: 2 } },
        { data: { title: 'Post 1', order: 1 } },
      ];
      expect(sortByKey(posts, 'data.order', 'DESC')).toEqual([
        { data: { title: 'Another post', order: 2 } },
        { data: { title: 'Post 1', order: 1 } },
        { data: { title: 'My best post', order: 0 } },
      ]);
    });
    it('throws when provided an invalid order', () => {
      const posts = [
        { data: { title: 'My best post', order: 0 } },
        { data: { title: 'Another post', order: 2 } },
        { data: { title: 'Post 1', order: 1 } },
      ];
      expect(() => sortByKey(posts, 'data.order', 'ABC')).toThrow();
    });
  });
  describe('wordCount', () => {
    it('returns 0 for an empty string', () => {
      expect(wordCount('')).toEqual(0);
    });
    it('returns 1 for a single word', () => {
      expect(wordCount('hello')).toEqual(1);
    });
    it('returns 1 for a hyphenated word', () => {
      expect(wordCount('full-time')).toEqual(1);
    });
    it('returns word count for longer sentences', () => {
      expect(wordCount(`Hello, World. My name's Aleksandr.`)).toEqual(5);
    });
    it(`throws an error if the argument isn't a string`, () => {
      expect(() => wordCount(1)).toThrow();
    });
  });
  describe('dividedBy', () => {
    it('throws an error if the divisor is 0', () => {
      expect(() => dividedBy(1, 0)).toThrow();
    });
    it('returns the right quotient', () => {
      expect(dividedBy(1, 2)).toEqual(0.5);
    });
  });
  describe('newlineToBr', () => {
    it('replaces all newslines with a line break', () => {
      expect(newlineToBr(`hey\nsoul\nsister`)).toEqual(`hey<br>soul<br>sister`);
    });
    it('returns the original string if it has no newlines', () => {
      expect(newlineToBr(`original string with no newlines`)).toEqual(`original string with no newlines`);
    });
    it(`throws an error if the argument isn't a string`, () => {
      expect(() => newlineToBr(1)).toThrow();
    });
  });
  describe('stripNewlines', () => {
    it('removes all newlines', () => {
      expect(stripNewlines(`hey\nsoul\nsister`)).toEqual(`heysoulsister`);
    });
    it('returns the original string if it has no newlines', () => {
      expect(stripNewlines(`music is pretty cool I guess`)).toEqual(`music is pretty cool I guess`);
    });
    it(`throws an error if the argument isn't a string`, () => {
      expect(() => stripNewlines(1)).toThrow();
    });
  });
  describe('stripHtml', () => {
    it('removes all html tags', () => {
      const html = `<p>This is some <strong>HTML</strong> with <span id="abc" class="efg">lots</span> of tags</p>`;
      expect(stripHtml(html)).toEqual(`This is some HTML with lots of tags`);
    });
    it('returns the original string if it has no HTML', () => {
      const html = `This is some HTML with lots of tags`;
      expect(stripHtml(html)).toEqual(`This is some HTML with lots of tags`);
    });
    it(`throws an error if the argument isn't a string`, () => {
      expect(() => stripHtml(1)).toThrow();
    });
  });
  describe('where', () => {
    it('returns all objects matching the specified keyPath:value pair', () => {
      const posts = [
        {
          data: {
            title: 'Post 1',
            isPopular: true,
          },
        },
        {
          data: {
            title: 'Post 2',
          },
        },
        {
          data: {
            title: 'Post 3',
            isPopular: true,
          },
        },
      ];
      expect(where(posts, 'data.isPopular', true)).toEqual([
        {
          data: {
            title: 'Post 1',
            isPopular: true,
          },
        },
        {
          data: {
            title: 'Post 3',
            isPopular: true,
          },
        },
      ]);
    });
    it('returns an empty array if no objects match', () => {
      const posts = [
        {
          data: {
            title: 'Post 1',
          },
        },
        {
          data: {
            title: 'Post 2',
          },
        },
        {
          data: {
            title: 'Post 3',
          },
        },
      ];
      expect(where(posts, 'data.isPopular', true)).toEqual([]);
    });
  });
  describe('toAbsoluteUrl', () => {
    it('handles relative paths that start with a slash', () => {
      site.url = 'https://site.com';
      expect(toAbsoluteUrl('/some/path/')).toEqual(`https://site.com/some/path/`);
    });
    it('handles site URL that has a trailing slash', () => {
      site.url = 'https://site.com/';
      expect(toAbsoluteUrl('some/path/')).toEqual(`https://site.com/some/path/`);
    });
    it('handles both site URL with trailing slash and url with preceding slash', () => {
      site.url = 'https://site.com/';
      expect(toAbsoluteUrl('/some/path/')).toEqual(`https://site.com/some/path/`);
    });
    it('throws an error if the argument is not a string', () => {
      site.url = 'https://site.com/';
      expect(() => toAbsoluteUrl(42)).toThrow();
    });
  });
  describe('unslugify', () => {
    it('unslugifies a slugged string', () => {
      const sluggedString = 'some-slugged-sentence';
      expect(unslugify(sluggedString)).toEqual('Some Slugged Sentence');
    });
    it(`doesn't modify a non-slugged string`, () => {
      const unsluggedString = 'Full-time employees work full time. Off-topic posts are off topic. Hyphens are tricky.';
      expect(unslugify(unsluggedString)).toEqual(unsluggedString);
    });
  });
});
