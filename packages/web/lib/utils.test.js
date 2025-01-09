import assert from 'node:assert';
import { describe, it } from 'node:test';
import { escapeString, getRelativeTimeString } from './utils.js';

describe('escapeString', () => {
	it('uses html entities', () => {
		assert.deepStrictEqual(escapeString(''), '');
		assert.deepStrictEqual(escapeString('a & b'), 'a &amp; b');
		assert.deepStrictEqual(escapeString('<a href="#">&</a>'), '&lt;a href=&quot;#&quot;&gt;&amp;&lt;/a&gt;');
	});
});

describe('getRelativeTimeString', () => {
	it('handles strict boundaries in the past', () => {
		assert.deepStrictEqual(getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)), 'now');
		// minute
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 60)),
			'1 minute ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 1, 0)),
			'1 minute ago'
		);
		// hour
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 60, 0)),
			'1 hour ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 1, 0, 0)),
			'1 hour ago'
		);
		// day
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 24, 0, 0)),
			'yesterday'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 2, 0, 0, 0)),
			'yesterday'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 48, 0, 0)),
			'2 days ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 3, 0, 0, 0)),
			'2 days ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 2, 24, 0, 0)),
			'2 days ago'
		);
		// week
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 8, 0, 0, 0)),
			'last week'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 15, 0, 0, 0)),
			'2 weeks ago'
		);
		// month
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 31, 0, 0, 0)),
			'last month'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 1, 1, 0, 0, 0)),
			'last month'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 2, 1, 0, 0, 0)),
			'2 months ago'
		);
		// year
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 12, 0, 0, 0, 0)),
			'last year'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2025, 0, 1, 0, 0, 0)),
			'last year'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2026, 0, 1, 0, 0, 0)),
			'2 years ago'
		);
	});
	it('handles strict boundaries in the future', () => {
		// minute
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 60), new Date(2024, 0, 1, 0, 0, 0)),
			'in 1 minute'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 1, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 1 minute'
		);
		// hour
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 60, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 1 hour'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 1, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 1 hour'
		);
		// day
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 24, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'tomorrow'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 2, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'tomorrow'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 48, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 days'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 3, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 days'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 2, 24, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 days'
		);
		// week
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 8, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'next week'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 15, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 weeks'
		);
		// month
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 31, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'next month'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'next month'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 2, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 months'
		);
		// year
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 12, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'next year'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2025, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'next year'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2026, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 0)),
			'in 2 years'
		);
	});
	it('handles boundary edge cases', () => {
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 0, 59)),
			'59 seconds ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 0, 59, 0)),
			'59 minutes ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 1, 23, 0, 0)),
			'23 hours ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 7, 0, 0, 0)),
			'6 days ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 0, 30, 0, 0, 0)),
			'4 weeks ago'
		);
		assert.deepStrictEqual(
			getRelativeTimeString(new Date(2024, 0, 1, 0, 0, 0), new Date(2024, 11, 1, 0, 0, 0)),
			'11 months ago'
		);
	});
});
