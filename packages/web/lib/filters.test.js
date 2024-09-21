import { it, describe } from 'node:test';
import assert from 'node:assert/strict';
import { where, limit, sortByKey, getLatestCollectionItemDate } from './filters.js';

describe('custom 11ty filters', () => {
  describe('limit', () => {
    it('returns the first n > 0 elements of an array', () => {
      assert.deepStrictEqual(limit(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3), ['a', 'b', 'c']);
    });
    it('returns an empty array if limit is 0', () => {
      assert.deepStrictEqual(limit(['a', 'b'], 0), []);
    });
    it('returns all elements when the limit matches the array length', () => {
      assert.deepStrictEqual(limit(['a', 'b'], 2), ['a', 'b']);
    });
    it('throws an error if the limit is negative', () => {
      assert.throws(() => limit(['a', 'b'], -1));
    });
  });
  describe('sortByKey', () => {
    it('sorts by string values', () => {
      const posts = [
        { data: { title: 'My best post' } },
        { data: { title: 'Another post' } },
        { data: { title: 'Post 1' } },
      ];
      assert.deepStrictEqual(sortByKey(posts, 'data.title', 'DESC'), [
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
      assert.deepStrictEqual(sortByKey(posts, 'data.order', 'DESC'), [
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
      assert.throws(() => sortByKey(posts, 'data.order', 'ABC'));
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
      assert.deepStrictEqual(where(posts, 'data.isPopular', true), [
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
      assert.deepStrictEqual(where(posts, 'data.isPopular', true), []);
    });
  });
  describe('getLatestCollectionItemDate', () => {
    it(`returns the latest item.data.lastUpdated date`, () => {
      const posts = [
        { title: 'Item 1', date: '2021-04-20' },
        { title: 'Item 2', date: '2021-04-21', data: { lastUpdated: '2021-05-20' } },
        { title: 'Item 3', date: '2021-01-01', data: { lastUpdated: '2021-08-11' } },
      ];
      assert.deepStrictEqual(getLatestCollectionItemDate(posts), '2021-08-11');
    });
    it(`returns the latest item.date`, () => {
      const posts = [
        { title: 'Item 1', date: '2021-01-02' },
        { title: 'Item 2', date: '2020-04-20', data: { lastUpdated: '2021-01-01' } },
        { title: 'Item 3', date: '2020-04-08', data: { lastUpdated: '2020-12-31' } },
      ];
      assert.deepStrictEqual(getLatestCollectionItemDate(posts), '2021-01-02');
    });
    it('returns undefined for empty arrays', () => {
      assert.deepStrictEqual(getLatestCollectionItemDate([]), undefined);
    });
    it('returns undefined for undated collection items', () => {
      const items = [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }];
      assert.deepStrictEqual(getLatestCollectionItemDate(items), undefined);
    });
  });
});
