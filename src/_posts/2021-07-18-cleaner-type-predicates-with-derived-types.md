---
title: Cleaner Type Predicates with Derived Types
description: In TypeScript, type predicates allow you to narrow down an abstract type to a more concrete type with a simple assertion. Together with derived types, they can greatly reduce repetition in your code.
keywords: [type predicate, derived types, typescript]
categories: [typescript, javascript]
commentsId: 98
thumbnail: https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=900&q=80
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
```

But for the sake of this article, let's assume that we're dealing with a more flat and simple structure. This comes up in other scenarios, but our juice shop is easy enough to understand while still being somewhat grounded in reality.

## Type Predicates in TypeScript: Fruit or Vegetable?

We can write helper functions to determine whether an ingredient is a fruit or a vegetable. A naive first attempt might look like this:

```ts
const isFruit = (ingredient: Ingredient) => {
  return ingredient === 'apple' || ingredient === 'banana' || ingredient === 'orange';
}

const isVegetable = (ingredient: Ingredient) => {
  return ingredient === 'carrot' || ingredient === 'beet' || ingredient === 'cucumber';
}
```

We might then try to use those helpers like so:

```ts
const prepareFruit = (fruit: Fruit) => {}
const prepareVegetable = (vegetable: Vegetable) => {}

if (isFruit(ingredient)) {
  prepareFruit(ingredient);
} else if (isVegetable(ingredient)) {
  prepareVegetable(ingredient);
}
```

At first glance, it seems like the helper functions should inform TypeScript that a given ingredient is of either one type (`Fruit`) or the other (`Vegetable`), allowing our code to compile. Unfortunately, that's not the case—the helpers have an implicit return type of `boolean`, which doesn't tell TypeScript to narrow down the argument's type from `Ingredient` to one of the sub-types. Thus, TypeScript will actually throw an error when we attempt to pass a generic `Ingredient` to a function that expects a `Fruit` or a `Vegetable`.

A temporary workaround is to use type assertions in our `if` statements:

```ts
if (isFruit(ingredient)) {
  prepareFruit(ingredient as Fruit);
} else if (isVegetable(ingredient)) {
  prepareVegetable(ingredient as Vegetable);
}
```

But the whole point of writing these helper functions is so that we *don't* have to do type assertions everywhere. We want to be able to narrow down the argument's type so that the TypeScript compiler knows that a given `Ingredient` is either a `Fruit` or a `Vegetable`. And that's where [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) come into play.

A **type predicate** is a special kind of type guard that takes the pattern `argumentName is ConcreteType`. It instructs the TypeScript compiler to treat the argument as the asserted type if the function returns `true`.

Let's add type predicates to our helper functions:

```ts
const isFruit = (ingredient: Ingredient): ingredient is Fruit => {
  return ingredient === 'apple' || ingredient === 'banana' || ingredient === 'orange';
}

const isVegetable = (ingredient: Ingredient): ingredient is Vegetable => {
  return ingredient === 'carrot' || ingredient === 'beet' || ingredient === 'cucumber';
}

if (isFruit(ingredient)) {
  // ingredient is known to be of type Fruit
} else if (isVegetable(ingredient)) {
  // ingredient is known to be of type Vegetable
}
```

Great! TypeScript now knows that if `isFruit` returns `true`, then the ingredient passed in must be of type `Fruit`, and similarly for vegetables.

But do you spot the bigger problem? We had to repeat ourselves twice: once to define the string union for the `Fruit` and `Vegetable` types, and once again in the corresponding helper to exhaustively list all of the possible types for fruits and vegetables.

This may not seem like a problem if there are only a few strings in these unions, but it will scale poorly. Each time we add a new item to our types, we'll have to update the information in two places rather than just one. Fortunately, there's a better approach.

## Better Type Predicates: Deriving Types from Arrays and Objects

Instead of typing fruit and vegetable names *upfront*, we can use an untyped array or object to list all of the pertinent information about ingredients and then derive the types from that data.

Suppose we have objects that provide information about each fruit and vegetable:

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

For each object, `typeof` returns the object shape consisting of read-only string names and their corresponding values. For fruits, that shape looks like this:

```
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

Invoking the `keyof` operator on this shape returns the read-only string keys, which in this case are `'apple'`, `'banana'`, and `'orange'`.

If instead we decided to use an array, we could derive the types using a special TypeScript syntax known as an [indexed access type](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html):

```ts
const fruits = ['apple', 'banana', 'orange'] as const;
const vegetables = ['carrot', 'beet', 'cucumber'] as const;

type Fruit = typeof fruits[number];
type Vegetable = typeof vegetables[number];
```

In the end, whether we use an object or an array, we get the same result—`Fruit` represents the union of the three strings `'apple'`, `'banana'`, and `'orange'`, while `Vegetable` represents the union of the three strings `'carrot'`, `'beet'`, and `'cucumber'`.

However, our type predicate helpers are now much cleaner. In the case of arrays, we can use `Array.prototype.includes` to check whether an ingredient belongs to a particular array:

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

This should make sense—at that point in the code, TypeScript does not yet know that `ingredient` is of one type or the other, so we have to give it a helpful nudge. But when we use these helpers, we'll still get proper type inference.

In the case of objects, the type predicate helpers are very similar:

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
