---
title: Returning Data After an Insert in PostgreSQL
description: Easily return auto-generated and serial IDs after inserting new rows into a table with PostgreSQL's RETURNING clause.
keywords: [returning data after insert, postgres]
tags: [dev, postgresql, sql]
---

You've successfully inserted one or more rows into a table using a standard `INSERT` statement in PostgreSQL. Now, suppose that your schema contains an auto-generated `UUID` or `SERIAL` column:

{% include codeHeader.html file="createFooSchema.sql" %}
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE foo
(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
	bar VARCHAR NOT NULL
);
```

You want to retrieve the auto-generated IDs for your newly inserted rows. To do that, you can simply use the `RETURNING` clause, like so:

{% include codeHeader.html %}
```sql
INSERT INTO foo VALUES (DEFAULT, 'a'), (DEFAULT, 'b'), (DEFAULT, 'c')
RETURNING id;
```

Here's one possible result:

<table>
    <thead>
        <tr>
            <th scope="col">
                id
            </th>
        </tr>
    </thead>
    <tbody>
        <tr><td>fa7645a6-fffc-11ea-939a-1002b5bfb71e</td></tr>
        <tr><td>fa767c24-fffc-11ea-939a-1002b5bfb71e</td></tr>
        <tr><td>fa767ef4-fffc-11ea-939a-1002b5bfb71e</td></tr>
    </tbody>
</table>

Now, you don't actually have to return the ID or a key—you can return the values under any column:

{% include codeHeader.html %}
```sql
INSERT INTO foo VALUES (DEFAULT, 'e'), (DEFAULT, 'f'), (DEFAULT, 'g')
RETURNING bar;
```

Result:

<table>
    <thead>
        <tr>
            <th scope="col">
                bar
            </th>
        </tr>
    </thead>
    <tbody>
        <tr><td>e</td></tr>
        <tr><td>f</td></tr>
        <tr><td>g</td></tr>
    </tbody>
</table>

You can even use aliases:

{% include codeHeader.html %}
```sql
INSERT INTO foo VALUES (DEFAULT, 'e'), (DEFAULT, 'f'), (DEFAULT, 'g')
RETURNING bar AS baz;
```

Result:

<table>
    <thead>
        <tr>
            <th scope="col">
                baz
            </th>
        </tr>
    </thead>
    <tbody>
        <tr><td>e</td></tr>
        <tr><td>f</td></tr>
        <tr><td>g</td></tr>
    </tbody>
</table>

## Alternative: Top-N Query (with Serial Primary Keys)

If the table in question uses a `SERIAL` primary key, then you can retrieve values for the last `N` inserted rows by writing a separate Top-N query with a `LIMIT` clause equal to `N`:

{% include codeHeader.html %}
```sql
SELECT id
FROM foo
ORDER BY id DESC
LIMIT 3;
```

Again, this only works if your IDs form a discrete sequence, which is the case with the `SERIAL` auto-incrementing integer type. Furthermore, note that this option requires writing two separate queries, whereas PostgreSQL's `RETURNING` clause allows you to return data after an insert with just one query. The `RETURNING` syntax is more convenient if you need to [use the returned IDs or values in a subsequent query](https://medium.com/@nieldw/use-postgresql-returning-and-with-to-return-updated-rows-f5354de7b45f).

## Attributions

The photo used in this post's social media preview was taken by [Nam Anh](https://unsplash.com/@bepnamanh) ([Unsplash](https://unsplash.com/photos/QJbyG6O0ick)).
