---
title: "Python Prefix Tree: Building a Trie from Scratch"
description: A simple Python trie implementation, with accompanying visuals and code.
keywords: [python trie, python prefix tree, python trie implementation, python prefix tree implementation, python trie tutorial, python prefix tree tutorial]
categories: [Programming]
---

Of all the data structures I've encountered, the trie continues to be the one that fascinates me the most because of its simplicity, elegance, and practical applications.

In this Python trie tutorial, I'll guide you through implementing one from scratch. We'll test that our code works as expected using Python's `unittest` library. Let's dive right in!

## Overview: What Is a Prefix Tree?

Prefix trees are one of the easiest data structures to understand both visually and in terms of the code required to implement them. But what exactly are they, and why might we want to implement one?

First, let's run through a little exercise. Have you ever wondered how search engines like Google are able to quickly auto-fill your search box with suggestions that start with whatever you've typed? Take this as an example:

{% include posts/picture.html img="google-search" alt="Google searches that begin with 'ap.'" %}

How would you go about implementing this behavior, all other complex considerations aside? The (very) naive approach is to take the text that the user has typed so far—like `a` or `app`—and check if any words in our dictionary start with that substring, using a linear search. That would maybe work for search engines with a relatively small dictionary. But Google deals with billions of queries, so that would hardly be efficient. It gets even more inefficient the longer the substring becomes.

The efficient answer to this problem is a neat little data structure known as a **prefix tree**, also called a *trie*. It's just a tree (not necessarily a *binary* tree) that serves a special purpose.

Let's say we're building such a dictionary but want to be clever with how we do it so that our search doesn't take forever. Suppose we want to record the words `ape`, `apple`, `bat`, and `big` in this dictionary. The corresponding prefix tree would look like this:

{% include posts/picture.html img="trie" alt="An example of a trie for the words bat, big, ape, and apple." %}

> **Exercise**: Trace the path from the root of the trie to the word `apple`. Make a mental note of how each "branch" is like a particular key-value pair in a `dict`. The key is the character we add to the end of the prefix. The value is the node that the branch leads to.

In a prefix tree, each node contains a string. That string may be a complete word that someone entered, like `apple` or `bat`, or it may be a substring for the term the user has entered, such as the `ap-` in `ape` and `apple`.

Each branch coming out of a node represents the addition of a character (in yellow) to the end of that node's string. For example, if our current node is `app` and the word we want to insert is `apple`, we would concatenate an `l`.

This branching pattern allows us to  reduce our search space to something more efficient than just a linear search of all words. If a user has entered the substring `appl` so far, then we won't ever consider the branching paths for `ape`, let alone all the branching paths that start with `b`!

Tracing a path from the root of a trie to a particular node produces either a prefix for a word we entered (e.g., the `app-` in `apple`) or the word itself (e.g., `apple`). This distinction is important because our dictionary doesn't actually contain the word `app` just yet; that node is merely a substring node. You'll see why this is important later on, but for now, just keep it in mind.

## Trie Methods and Operations

A prefix tree has three main operations:

- Inserting a word into the tree.

- Searching for a node that matches a given string exactly.

- Returning a list of all nodes (if any) that begin with a given string prefix.

Let's put this into the context of a search engine. A company like Google might take an enormous list of words, insert all of them into a trie, and then use the trie to get a list of all words that begin with a certain prefix. That prefix is the partial text the user has entered into the search bar. (Of course, things are a little more complicated than that because of search term popularity and your past searches, but that's not important for our purposes here.)

Or perhaps you're creating your own autocomplete widget in, say, React. You'd create the trie beforehand and subscribe to your input field's `onkeyup` event. As the user enters text, you adjust the list of options that you show to them by using your trie.

## Prefix Tree Representation in Code

So now that we understand what a prefix tree looks like and how it can be used, how do we represent it in code? You'll be happy to know that it's actually really simple, especially if you're comfortable with recursion.

First, like all trees, a prefix tree is going to consist of nodes. Each node will keep track of three pieces of data. I'll cover the two important ones here and bring up the third one when we get to it:

- **A string**. We saw above that each node keeps track of the "prefix" that has accumulated along a specific path from the root. A node may contain a word that was inserted, like `apple` or `bat`, or it may contain a prefix, like `app-` or `b-`. So, each node will certainly need to have a member to store this string. I'll call that member `word`.

- **Children**. As with many trees, each node of a trie will have zero or more children that are "linked" to it via the selection of a particular character (the branches). The most natural expression of this sort of relationship is a map: Each node maps a character to a child `TrieNode`.

Let's build the `TrieNode` class in Python:

```python
class TrieNode:
    def __init__(self, word = ''):
        '''
        Initializes a TrieNode with the given word and an initially
        empty dictionary mapping strings to TrieNodes.
        '''
        self.word = word
        self.children = dict()
```

Pretty simple, right? Again, note that there's one additional piece of data we'll need to add here later, but you don't have to worry about it now.

Next, the prefix tree itself consists of one or more of these `TrieNodes`, so I'll add another class named `PrefixTree`:

```python
class PrefixTree:
    def __init__(self):
        self.root = TrieNode()
```

Awesome! Finally, our `PrefixTree` needs the following operations, which we'll fill in step by step:

- `insert(self, word)`
- `find(self, word)`
- `starts_with(self, prefix)`
- `size(self)`

That last one is useful for testing; it isn't required.

## 1. Inserting Words Into a Trie

Let's consider how we'd build a trie from scratch. We'll always start with a root node that has an empty string as its `word` and an empty dictionary as its `children`. Then, we want to insert the words we looked at earlier: `ape`, `apple`, `bat`, and `big`. As a reminder, this is what the trie looks like once we finish inserting all of those words:

{% include posts/picture.html img="trie" alt="An example of a trie for the words bat, big, ape, and apple." %}

### Detailed Explanation: How to Build a Prefix Tree

How would we go about building this structure from the ground up? I encourage you to grab a pen and paper to work through this by hand, starting with an empty trie and inserting one word at a time (in no particular order, as that doesn't change things).

Each time we insert a word into our tree, we start at the root, which is the empty string. We loop over the word that we've been given one letter at a time: `a`, `p`, `p`, `l`, and finally `e`.

In each iteration, if our current `TrieNode` doesn't have an entry in its `children` map for that letter, we create such an entry. In other words, we map the current letter (e.g., `l`) to a new child node (`appl`). However, if the `letter: TrieNode` mapping does exist, we don't have to do anything. For example, if we first insert `ape` and then insert `apple`, we won't have to insert any new nodes for the shared substring, `ap-`. However, as we branch out of that common ancestor, we *will* need to create new nodes.

In either case, at the end of the current iteration, we move on by setting the current node to be the child node: either the one that existed before or the new one that we just created. We repeat this process until we've iterated through the entire word.

Recall that each node also has to keep track of the string that's been generated so far. For example, if we're inserting the word `apple`, then we'll need to create nodes with the following `word` entries: `a`, `ap`, `app`, `appl`, and `apple`. In Python, doing this is simply a matter of slicing the string with `word[0:i+1]`, where `i` is the current index in the word that we're inserting. Thus, if we're inserting `apple` and `i=2`, then `prefix = word[0:3] = 'app'`.

### The Code: Inserting a Word Into a Trie

Here's the full* Python implementation of inserting nodes into a trie:

```python
def insert(self, word):
    current = self.root
    for i, char in enumerate(word):
        if char not in current.children:
            prefix = word[0:i+1]
            current.children[char] = TrieNode(prefix)
        current = current.children[char]
```

*There's one line missing that I'll mention in the next section. It's not going to complicate things at all.

## 2. Checking if a Word Exists in a Trie

This operation proceeds in a manner similar to insert, except we're not creating new nodes.

We'll loop over the word like we did before, one character at a time. At any point, if we can't find the current letter in the current `TrieNode`'s map of children, then the word we're looking for was never inserted in the first place. Thus, we immediately return `None`.

Otherwise, if we reach the last character of the string without having returned `None`, then that must mean that the current node is the word we were searching for*. So in that case, we return the current node.

<blockquote>
    <p>
        <strong>Exercise</strong>: Using the diagram from earlier, try to find the word <code>appreciate</code>, going down the trie one node at a time. What do you return, and at what point in the loop? Answer: <span class="spoiler">Everything is fine for the common <code>app-</code> substring. But when we look at the letter <code>r</code>, we find that the current node, <code>app</code>, doesn't have that letter in its dictionary; it only has the letter <code>l</code>. Thus, we return <code>None</code>.</span>
    </p>
</blockquote>

Here's the code:

```python
def find(self, word):
    '''
    Returns the TrieNode representing the given word if it exists
    and None otherwise.
    '''
    current = self.root
    for char in word:
        if char not in current.children:
            return None
        current = current.children[char]
    return current
```

*Remember that little caveat I kept bringing up before? This code is mostly correct except for the `return current` line at the end. Let's discuss why this needs to change.

### Fixing Our Code: Learning from Mistakes

I kept this hidden from you on purpose so the learning experience would be more memorable. If you figured out what's wrong with the last line of the code and why, then great! If not, I'll help you understand.

Let's say we insert the word `apple` into our trie, with nothing else, and now invoke ```trie.find('app')```:

{% include posts/picture.html img="wrong-find" alt="An example of a false match for a word in a trie." %}

Our algorithm in its current state won't return `None` as it should. It sees that our trie has a node with the string `app` and considers that a match. But notice that we never actually inserted the word `app` into the tree as a *word*. It only exists in the trie as a *prefix node* leading up to the inserted word `apple`. So clearly, there are two classes of nodes that we must distinguish between: ones that are prefixes, and ones that are "real" words that were inserted.

Fortunately, the fix here is super simple. We need to make three changes:

1. Add a boolean flag in the `TrieNode` class. This flag will be set to `True` for "word nodes."
2. Set that flag to `True` for any words we `insert` and keep it `False` for all others by default.
3. Change the last line of our `find` function to account for this flag.

Let's modify the `TrieNode` class:

```python
class TrieNode:
    def __init__(self, word = ''):
        '''
        Initializes a TrieNode with the given word and an initially
        empty dictionary mapping strings to TrieNodes.
        '''
        self.word = word
        self.children = dict()
        self.is_word = False # New code
```

And then the `insert` method:

```python
def insert(self, word):
    current = self.root
    for i, char in enumerate(word):
        if char not in current.children:
            prefix = word[0:i+1]
            current.children[char] = TrieNode(prefix)
        current = current.children[char]
    current.is_word = True # New code
```

And finally, to verify that the given word exists in our trie, and that the node we found isn't just a prefix node, all we need to do is return the current node's flag. If the flag is `True`, then it's a word, and we found a match; in that case, we return it. Otherwise, it's a prefix node, in which case the function returns `None` implicitly.

Here's the final code for `find`:

```python
def find(self, word):
    '''
    Returns the TrieNode representing the given word if it exists
    and None otherwise.
    '''
    current = self.root
    for char in word:
        if char not in current.children:
            return None
        current = current.children[char]

    if current.is_word: return current # New code, None returned implicitly if this is False
```

And that's it!

Let's go back to our earlier example of inserting just the word `apple` into a trie. What happens if we later try to insert the English word `app` (as in "application") into the trie as a word? Well, the code will go down the trie, reach the `app` prefix node, and switch its flag to `True` so that we know it's now officially an inserted word and not just a prefix node:

{% include posts/picture.html img="right-find" alt="An example of inserting the words app and apple into a trie." %}

Technically, it's both—a prefix leading up to `apple` and a word in and of itself. Of course, that's totally fine! And what matters from a code validity standpoint is that its flag has been set to `True`.

That's another one down, with two more to go. We're almost done!

## 3. Return a List of All Nodes Starting with a Given Prefix

The code for finding partial matches in a trie is also really simple. Here's the algorithm spelled out in English:

1. Given a string prefix, first find the prefix node that matches it (if one exists).
2. Then, if we found a prefix node, simply iterate through all of its subtrees recursively and add all `is_word` strings to a list.

The first step is simple—we just did something very similar above for finding exact matches. This time, though, instead of returning `None` when a match isn't found, we'll return an empty list.

```python
def starts_with(self, prefix):
    '''
    Returns a list of all words beginning with the given prefix, or
    an empty list if no words begin with that prefix.
    '''
    words = list()
    current = self.root
    for char in prefix:
        if char not in current.children:
            # Could also just return words since it's empty by default
            return list()
        current = current.children[char]
    
    # Step 2 will go here
```

Once we've found the prefix node (if it exists), we'll utilize a helper method for the recursion (step two). It will take two arguments: the current node (`node`) and a cumulative list that we'll add nodes to (`words`). If the current node is a word, we add it to the list. Then, for each child of that node, we make a recursive call to the same helper function, passing in the child as the new `node`.

Here's the recursive helper function:

```python
def __child_words_for(self, node, words):
    '''
    Private helper function. Cycles through all children
    of node recursively, adding them to words if they
    constitute whole words (as opposed to merely prefixes).
    '''
    if node.is_word:
        words.append(node.word)
    for letter in node.children:
        self.__child_words_for(node.children[letter], words)
```

And here's the completed code for `starts_with`:

```python
def starts_with(self, prefix):
    '''
    Returns a list of all words beginning with the given prefix, or
    an empty list if no words begin with that prefix.
    '''
    words = list()
    current = self.root
    for char in prefix:
        if char not in current.children:
            # Could also just return words since it's empty by default
            return list()
        current = current.children[char]
    
    # Step 2
    self.__child_words_for(current, words)
    return words
```

> **Note**: Here, I'm returning a list of strings. In reality, it's probably better to return a list of `TrieNode`s, but it's much easier to test our code if we return strings.

That's all we need! Feel free to run through this algorithm by hand to better understand how it works.

## 4. (Optional) Size of a Prefix Tree

This one depends on your definition of "size." Is it the number of *words* that were inserted into the tree, or is it the total number of *nodes* in the tree? I'll use the latter definition for consistency with how "size" is defined for trees in general.

I'll just show the code this time—hopefully you're comfortable with recursion and tries by now:

```python
def size(self, current = None):
    '''
    Returns the size of this prefix tree, defined
    as the total number of nodes in the tree.
    '''
    # By default, get the size of the whole trie, starting at the root
    if not current:
        current = self.root
    count = 1
    for letter in current.children:
        count += self.size(current.children[letter])
    return count
```

Notice that `current` has a default value of `None`. This allows the user to simply invoke `size()` without passing in any arguments for the most common use case: the size of the entire tree. Optionally, if the user wants to check the size of a subtree, they are welcome to do so by passing in the appropriate `TrieNode`.

## Testing Our Code

We can add this to the end of our script to manually test our code:

```python
if __name__ == '__main__':
    trie = PrefixTree()
    trie.insert('apple')
    trie.insert('app')
    trie.insert('aposematic')
    trie.insert('appreciate')
    trie.insert('book')
    trie.insert('bad')
    trie.insert('bear')
    trie.insert('bat')
    print(trie.starts_with('app'))
```

But this is tedious and frankly not a very rigorous way of testing our code. So instead, I'll create a separate file named `test_trie.py` and use the Python `unittest` library. I'll import the `PrefixTree` class I created in `trie.py`.

Below are eight tests covering edge cases. This is where our `size` method really comes in handy.

```python
import unittest
from trie import PrefixTree


class TrieTest(unittest.TestCase):
    def setUp(self):
        self.trie = PrefixTree()

    def test_trie_size(self):
        self.trie.insert('apple')
        self.assertEqual(self.trie.size(), 6)

    def test_prefix_not_found_as_whole_word(self):
        self.trie.insert('apple')
        self.trie.insert('appreciate')
        self.assertEqual(self.trie.find('app'), None)

    def test_prefix_is_also_whole_word(self):
        self.trie.insert('apple')
        self.trie.insert('appreciate')
        self.trie.insert('app')
        # 10: [app], [appr], [appre], [apprec], [appreci], [apprecia]
        # [appreciat], [appreciate], [appl], and [apple]
        self.assertEqual(self.trie.size(self.trie.find('app')), 10)
        self.assertEqual(self.trie.find('app').is_word, True)

    def test_starts_with(self):
        self.trie.insert('apple')
        self.trie.insert('appreciate')
        self.trie.insert('aposematic')
        self.trie.insert('apoplectic')
        self.trie.insert('appendix')
        self.assertEqual(self.trie.starts_with('app'), ['apple', 'appreciate', 'appendix'])

    def test_starts_with_self(self):
        self.trie.insert('app')
        self.assertEqual(self.trie.starts_with('app'), ['app'])

    def test_bigger_size(self):
        self.trie.insert('bad')
        self.trie.insert('bat')
        self.trie.insert('cat')
        self.trie.insert('cage')
        self.assertEqual(self.trie.size(), 10)

    def test_starts_with_empty_and_no_words(self):
        self.assertEqual(self.trie.starts_with(''), [])

    def test_starts_with_empty_returns_all_words(self):
        self.trie.insert('bad')
        self.trie.insert('bat')
        self.trie.insert('cat')
        self.trie.insert('cage')
        self.assertEqual(self.trie.starts_with(''), ['bad', 'bat', 'cat', 'cage'])


if __name__ == '__main__':
    unittest.main()
```

> **Note**: With `unittest`, all method names must begin with `test` in order for the library to detect and run them. This is [per the unittest docs](https://docs.python.org/3/library/unittest.html#basic-example).

The `setUp` method is something that's common in unit testing. It's a method that gets called before each individual test is run. That way, we don't have to manually initialize a new `PrefixTree` in every single method; we can let the framework do that for us.

And here's the output:

{% include posts/picture.html img="test-output" alt="Test output: 8 cases passed" %}

All tests ran correctly—awesome!

## Conclusion

Prefix trees are rarely ever taught in CS curriculum, with more emphasis placed on associative data structures, linked lists, and trees. But it's good to know how to make one by hand if you want to create your own autocomplete dropdown widget from scratch, for example, or if you're looking to add another data structure to your toolkit.

I hope you found this tutorial helpful! If you notice any bugs or other issues, [please let me know on GitHub](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.github.io/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug+Report%3A+%5BConcise+Summary+Here%5D).

You can find the full code for this post [in its GitHub repo](https://github.com/AleksandrHovhannisyan/Python-Trie-Implementation).