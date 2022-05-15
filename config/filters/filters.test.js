const { where, limit, sortByKey, dividedBy, toAbsoluteUrl, getLatestCollectionItemDate } = require('./filters');
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
  describe('dividedBy', () => {
    it('throws an error if the divisor is 0', () => {
      expect(() => dividedBy(1, 0)).toThrow();
    });
    it('returns the right quotient', () => {
      expect(dividedBy(1, 2)).toEqual(0.5);
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
    it('handles file urls', () => {
      site.url = 'https://site.com/';
      expect(toAbsoluteUrl('/assets/images/img.png')).toEqual(`https://site.com/assets/images/img.png`);
      expect(toAbsoluteUrl('feed.xml')).toEqual(`https://site.com/feed.xml`);
    });
    it('throws an error if the argument is not a string', () => {
      site.url = 'https://site.com/';
      expect(() => toAbsoluteUrl(42)).toThrow();
    });
  });
  describe('getLatestCollectionItemDate', () => {
    it(`returns the latest item.data.lastUpdated date`, () => {
      const posts = [
        { title: 'Item 1', date: '2021-04-20' },
        { title: 'Item 2', date: '2021-04-21', data: { lastUpdated: '2021-05-20' } },
        { title: 'Item 3', date: '2021-01-01', data: { lastUpdated: '2021-08-11' } },
      ];
      expect(getLatestCollectionItemDate(posts)).toStrictEqual('2021-08-11');
    });
    it(`returns the latest item.date`, () => {
      const posts = [
        { title: 'Item 1', date: '2021-01-02' },
        { title: 'Item 2', date: '2020-04-20', data: { lastUpdated: '2021-01-01' } },
        { title: 'Item 3', date: '2020-04-08', data: { lastUpdated: '2020-12-31' } },
      ];
      expect(getLatestCollectionItemDate(posts)).toStrictEqual('2021-01-02');
    });
    it('returns undefined for empty arrays', () => {
      expect(getLatestCollectionItemDate([])).toBeUndefined();
    });
    it('returns undefined for undated collection items', () => {
      const items = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
      expect(getLatestCollectionItemDate(items)).toBeUndefined();
    });
  });
});
