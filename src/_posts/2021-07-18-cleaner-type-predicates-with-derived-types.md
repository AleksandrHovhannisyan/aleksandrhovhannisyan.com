---
title: Cleaner Type Predicates with Derived Types
description: Type predicates are a powerful TypeScript feature that allows you to narrow down an abstract type to a more concrete type. Together with derived types, they can greatly reduce repetition in your code.
keywords: [type predicate, derived types, typescript]
categories: [typescript, javascript]
thumbnail: thumbnail.jpg
---

Let's pretend that we're writing the frontend for a juice shop that prepares a combination of fruits and vegetables for its juices. We want to strictly type our ingredients, so we first take a naive approach that lists the types upfront for fruits and vegetables:

```ts
type Fruit = 'apple' | 'banana' | 'orange';
type Vegetable = 'carrot' | 'beet' | 'cucumber';
type Ingredient = Fruit | Vegetable;
```

Somewhere in the code, we need to distinguish between fruits and vegetables, so we need helper functions like `isFruit` and `isVegetable` that tell us whether a particular ingredient is of one type or the other:

```ts
const prepareIngredient = (ingredient: Ingredient) => {
  if (isFruit(ingredient)) {
    prepareFruit(ingredient);
  } else if (isVegetable(ingredient)) {
    prepareVegetable(ingredient);
  }
}

const prepareFruit = (fruit: Fruit) => {}
const prepareVegetable = (vegetable: Vegetable) => {}
```

Nevermind *why* we're doing things this way—in reality, this could be avoided entirely if we restructured our data to include flags as part of each ingredient:

```ts
type IngredientType = 'fruit' | 'vegetable';

type FruitName = 'apple' | 'banana' | 'orange';
type VegetableName = 'carrot' | 'beet' | 'cucumber';

type Fruit = {
  type: 'fruit';
  name: FruitName;
}

type Vegetable = {
  type: 'vegetable';
  name: VegetableName;
}

type Ingredient = Fruit | Vegetable;
```

We could then check the `type` flag in a `switch` statement and handle each case accordingly:

```ts
const prepareIngredient = (ingredient: Ingredient) => {
  switch (ingredient.type) {
    case 'fruit':
      prepareFruit(ingredient);
      break;
    case 'vegetable':
      prepareVegetable(ingredient);
    default:
      break;
  }
}

const prepareFruit = (fruit: Fruit) => {}
const prepareVegetable = (vegetable: Vegetable) => {}
```

But for the sake of this article, let's assume that we're dealing with a more flat and simple structure. This comes up in other scenarios, but our juice shop is easy enough to understand while still being somewhat grounded in reality.

## Type Predicates in TypeScript: Fruit or Vegetable?

We can write helper functions that take advantage of a TypeScript feature known as **type predicates** to determine whether a variable is of one type or another.

A type predicate has an explicit return type of the pattern `argumentName is ConcreteType`. In our juice shop example, we could write type predicates to determine if an ingredient is a fruit or vegetable, allowing us to handle each case separately later in our code:

```ts
const isFruit = (ingredient: Ingredient): ingredient is Fruit => {
  return ingredient === 'apple' || ingredient === 'banana' || ingredient === 'orange';
}

const isVegetable = (ingredient: Ingredient): ingredient is Vegetable => {
  return ingredient === 'carrot' || ingredient === 'beet' || ingredient === 'cucumber';
}
```

If the corresponding `if` statement for a type predicate evaluates to `true`, then `ingredient` is assumed to be the concrete type asserted in that particular type predicate. Thus, TypeScript guarantees better type safety within the corresponding block of code:

```ts
if (isFruit(ingredient)) {
  // in this block, ingredient is of type Fruit
} else if (isVegetable(ingredient)) {
  // but here, ingredient is of type Vegetable
}
```

But did you notice the problem? We had to repeat ourselves twice: once when we defined the string union upfront for the `Fruit` and `Vegetable` types, and once again in the corresponding type predicate to exhaustively list all of the possible types for fruits and vegetables.

This may not seem like a problem if there are only a few strings in these unions, but it will definitely pose a scalability issue if we add more items in the future. Every time we do that, we have to update the information in two places. Fortunately, there's a better approach.

## Better Type Predicates: Deriving Types from Arrays and Objects

Instead of typing fruit and vegetable names *upfront*, we can use an untyped array or object to list that information and then derive the types from that array or object.

First, suppose we have objects that map each fruit and vegetable name to information about them, like their price and any other relevant details:

```ts
const fruits = {
  apple: {
    priceUsd: 0.99,
  },
  banana: {
    priceUsd: 1.5,
  },
  orange: {
    priceUsd: 1.2,
  },
} as const;

const vegetables = {
  carrot: {
    priceUsd: 0.99,
  },
  beet: {
    priceUsd: 1.3,
  },
  cucumber: {
    priceUsd: 0.99,
  },
} as const;
```

Note that the `const` declarations are required here; they tell TypeScript that the string keys are read only, meaning they're the only ones belonging to that particular object. This allows us to derive the concrete types from the object's keys using `keyof typeof`, like so:

```ts
type Fruit = keyof typeof fruits;
type Vegetable = keyof typeof vegetables;
type Ingredient = Fruit | Vegetable;
```

For each object, `typeof` returns the const-declared object shape consisting of read-only string names and their corresponding object values. For fruits, that shape looks like this:

```plaintext
{
  apple: {
    priceUsd: 0.99,
  },
  banana: {
    priceUsd: 1.5,
  },
  orange: {
    priceUsd: 1.2,
  },
}
```

Invoking the `keyof` operator on this shape returns the read-only string keys, which for fruits are `'apple'`, `'banana'`, and `'orange'`.

If instead we decided to use an array, we could derive the types using a special TypeScript syntax known as an [indexed access type](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html):

```ts
const fruits = ['apple', 'banana', 'orange'] as const;
const vegetables = ['carrot', 'beet', 'cucumber'] as const;

type Fruit = typeof fruits[number];
type Vegetable = typeof vegetables[number];
```

In the end, whether we use an object or an array, we get the same result—`Fruit` represents the union of the three strings `'apple'`, `'banana'`, and `'orange'`, while `Vegetable` represents the union of the three strings `'carrot'`, `'beet'`, and `'cucumber'`.

However, our type predicates are now much cleaner. In the case of arrays, we can use `Array.prototype.includes` to check whether an ingredient belongs to a particular array:

```ts
const isFruit = (ingredient: Ingredient): ingredient is Fruit => {
  return fruits.includes(ingredient as Fruit);
}

const isVegetable = (ingredient: Ingredient): ingredient is Vegetable => {
  return vegetables.includes(ingredient as Vegetable);
}
```

It may seem odd that we're using type assertions here, but they're important. Without them, TypeScript will complain that vegetables (a valid ingredient) are not assignable to fruits:

{% include img.html src: "error.jpg", alt: "TypeScript complains that the argument of type 'Ingredient' is not assignable to the parameter of type 'apple' or 'banana' or 'orange'. Type 'carrot' is not assignable to type 'apple' or 'banana' or 'orange'." %}

It's a bit silly in this case since that's the whole point of type predicates: to take an abstract type and narrow it down to a more concrete type! But it is what it is.

In the case of objects, the type predicates are very similar:

```ts
const isFruit = (ingredient: Ingredient): ingredient is Fruit => {
  return !!fruits[ingredient as Fruit];
}

const isVegetable = (ingredient: Ingredient): ingredient is Vegetable => {
  return !!vegetables[ingredient as Vegetable];
}
```

Now, if we add more items for our fruits and vegetables, the derived types will be updated, and the type predicates will still work correctly. Importantly, **we only have to update the data once** rather than repeating ourselves twice, thrice, and so on. This gives us a single source of truth for typing while also allowing us to take advantage of type predicates. It's a win-win!

{% include unsplashAttribution.md name: "Edgar Castrejon", username: "edgarraw", photoId: "1CsaVdwfIew" %}
