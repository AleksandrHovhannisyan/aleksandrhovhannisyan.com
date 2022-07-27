---
title: Easily Sort Ant Design Tables
description: The Ant Design UI library lets you sort tables by one or more columns, using a sorter prop. But the syntax can get quite repetitive. Let's fix that!
keywords: [sort ant design tables]
categories: [antd, react, frontend]
commentsId: 53
thumbnail: ./images/thumbnail.png
---

Want to sort tables in Ant Design but without putting in much effort? Then you're in luck—in this post, we'll look at how you can automate this process to easily sort any column (even multiple ones in combination).

{% include "toc.md" %}

## How Tables Work in Ant Design

The Ant Design docs for the `Table` component use this example for [multi-sorting columns](https://ant.design/components/table/#components-table-demo-multiple-sorter):

```jsx {data-copyable=true}
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: '2',
    name: 'Jim Green',
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: '3',
    name: 'Joe Black',
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: '4',
    name: 'Jim Red',
    chinese: 88,
    math: 99,
    english: 89,
  },
];

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

ReactDOM.render(<Table columns={columns} dataSource={data} onChange={onChange} />, mountNode);
```

That renders a table like this, whose columns can either be sorted individually or in combination with one another, based on the precedence/priority you've defined for each column:

{% include "postImage.html" src: "./images/table.png", alt: "An Ant Design Table component, with one column being sorted." %}

Let's zoom in on this piece of code to understand how columns are actually sorted in Ant Design:

```jsx
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];
```

Basically, an Ant Design table can accept a `columns` prop, which is just an array of objects. Each object defines props for that column. For example, a column can have a title, a `dataIndex` (which Ant Design uses to pull in the right data from your `dataSource`), and more.

In particular, if a column is sortable, it can specify a `sorter` prop, consisting of:

- `compare`: the comparison function that's used to order two rows relative to one another.
- `multiple`: the priority that a column should take for multi-column sorting.

Every time you want to sort a column, you need to specify a sorting routine that accepts two arguments (the rows being compared). That function should behave like a standard **comparator function**, returning a negative result if the first argument precedes the second, zero if they're equal, or a positive number if the second argument precedes the first.

Unfortunately, if you can't already tell from this code, sorting Ant Design tables gets repetitive very quickly. You have to repeatedly define these functions, and they're doing the same thing each time. Plus, most of the time, the sorters should be using the `dataIndex` that's already defined for the column. It seems pretty silly to have to specify that, doesn't it?

Can we do better? (Hint: Of course we can!)

## Creating a Wrapper `Table` Component

It's always a good idea to create wrapper components in React whenever you're customizing the behavior or appearance of a library component, especially if you're working with Ant Design. So we'll go ahead and create our own `Table` component like so:

```jsx {data-file="components/Table" data-copyable=true}
import React from 'react';
import { Table as AntTable } from 'antd';

const Table = props => { return (<AntTable {...props} />); };

export default Table;
```

Notice that we're importing the Ant Design table with an alias so that we don't get naming clashes. Meanwhile, we've named our own component `Table`, just like the original Ant Design component. Whenever we want to render a table, we'll import our wrapper component instead of Ant Design's. If you're using TypeScript, you should also import `TableProps` and add static typing to your props argument.

For our purposes, we want to sort Ant Design tables with ease, automating the process to a certain extent. Ideally, we should be able to just specify a **generic sorting routine** for each column that needs to be sorted; we shouldn't have to define the function's implementation each time, writing out the arguments by hand and then returning a comparison result by hand. Rather, our component should look up that information dynamically.

## Creating a Sorter Utility

We'll start by creating a utility file (e.g., `utils/sorter.js`) that defines a few generic sorting routines. Two common use cases that you'll run into with sorting Ant Design columns are 1) text/numeric columns and 2) date columns. These should be handled separately; the latter will use the `moment` library. Feel free to use another library if you want to.

```javascript {data-file="utils/sorter.js" data-copyable=true}
import moment from 'moment';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort = (dateA, dateB) => moment(dateA).diff(moment(dateB));

/**
 *
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort = (a, b) => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};
```

Short and sweet. We'll then export an object that defines two generic lookup properties—`Sorter.DEFAULT` and `Sorter.DATE`:

```javascript {data-file="utils/sorter.js" data-copyable=true}
export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
};
```

We'll use this in a second.

## Sorting Ant Design Table Columns

Let's revisit our "consumer" component, where the table is being rendered. We'll change the import to use our custom Table component:

```jsx {data-file="app/consumer.js" data-copyable=true}
import Table from 'components/Table'
```

{% aside %}
  **Note**: The import syntax may differ depending on how you've configured your project.
{% endaside %}

We'll want to specify the sorting routine for every column that needs to be sorted. We'll do this by simply referencing the generic enum that we exported above:

```jsx {data-file="app/consumer.js" data-copyable=true}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    sorter: {
      compare: Sorter.DEFAULT,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    sorter: {
      compare: Sorter.DEFAULT,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    sorter: {
      compare: Sorter.DEFAULT,
      multiple: 1,
    },
  },
];
```

But remember: Ant Design columns must define the sorter as a function that looks up the appropriate data property to use in the comparison, like we did here originally:

```jsx
sorter: {
  compare: (a, b) => a.chinese - b.chinese,
  multiple: 3,
}
```

In our current version of the code, we aren't looking up any data properties—all we've done so far is assign a reference to a generic sorting routine:

```jsx
sorter: {
  compare: Sorter.DEFAULT,
  multiple: 3,
}
```

How do we actually do the property lookup and row comparison? In the intro, we saw that you can certainly do that by hand each time, but the whole point of this tutorial is to avoid repetition and make our lives easier.

That brings us to the next and final point...

## Wrapper Magic: A Shim to Inject a Dynamic Sorter Prop

By definition, our wrapper component will receive props just like a traditional Ant Design table would. This means it has access to the `columns` prop once that's been provided.

What we'll do is write a [shim](https://stackoverflow.com/a/51646150/5323344)—some code that will basically intercept the `columns` prop, map it to a new `sortableColumns` prop that defines the sorter routine by dynamically looking up the current column's `dataIndex`, and then pass *that* result along to the table's `columns` prop:

```jsx {data-file="components/Table.js" data-copyable=true}
import React from 'react';
import { Table as AntTable } from 'antd';

const Table = props => {
  const {
    columns,
    ...otherTableProps
  } = props;

  const sortableColumns = columns.map(column => {
    const { sorter, dataIndex, ...otherColumnProps } = column;

    if (sorter) {
      const { compare, ...otherSorterProps } = sorter;

      return {
        ...otherColumnProps,
        dataIndex,
        sorter: {
          compare: (rowA, rowB) => compare(rowA[dataIndex], rowB[dataIndex]),
          ...otherSorterProps,
        }
      };
    }

    return column;
  });

  return (
    <AntTable
      columns={sortableColumns}
      {...otherTableProps}
    />
  );
};

export default Table;
```

You'll notice that I used object destructuring quite a bit; this is to isolate certain props of interest while conveniently spreading the rest. Let's take a closer look at what's going on here.

First, notice that we're extracting the `columns` prop up at the top:

```jsx
const {
    columns,
    ...otherTableProps
  } = props;
```

This is so we can work with the `columns` prop while leaving the other `Table` props untouched.

The next few lines of code comprise the meat of the sorting logic. First, we map the `columns` prop to a new array of columns:

```jsx
const sortableColumns = columns.map(column => {
    const { sorter, dataIndex, ...otherColumnProps } = column;

    if (sorter) {
      const { compare, ...otherSorterProps } = sorter;

      return {
        ...otherColumnProps,
        dataIndex,
        sorter: {
          compare: (rowA, rowB) => compare(rowA[dataIndex], rowB[dataIndex]),
          ...otherSorterProps,
        }
      };
    }

    return column;
  });
```

If a column is sortable, we simply look up its generic comparison function and use it to define a **concrete implementation specific to this column**. Notice that we pass along `rowA[dataIndex]` and `rowB[dataIndex]` as the arguments to this generic sorting routine. We then spread the remaining `sorter` props, like `multiple` and any others that Ant Design would let you define for the sorter. Otherwise, if a column isn't sortable, we just return it as-is.

## Final Thoughts

That's it! You can now sort Ant Design tables without having to look up `dataIndex` manually every time—the wrapper component takes care of that lookup for you under the hood.

Need to handle other kinds of comparisons? Simply define a new sorting routine in `utils/sorter.js`, add it to the `Sorter` "enum," and use it in your `sorter` prop for any column that needs it.

You can check out the [CodeSandbox for this tutorial](https://codesandbox.io/s/sorting-ant-design-tables-in-react-the-easy-way-f856v) to play around with the result.

I hope you found this tutorial helpful! Let me know if you run into any problems, and I'll try my best to help you out.
