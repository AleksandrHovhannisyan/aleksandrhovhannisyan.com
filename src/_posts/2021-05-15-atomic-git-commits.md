---
title: Make Atomic Git Commits
description: It can be tempting to lump unrelated code changes into a larger commit, but atomic Git commits are more maintainable.
keywords: [atomic commits, atomic git commits, git]
categories: [dev, git, practices]
---

We've all been there: You worked on lots of changes at once, some of which didn't have anything in common. For the sake of convenience, you decided to lump all of these changes into a single commit and call it a day. But while this may seem tempting, it could actually cause more problems down the line. Bigger commits can:

1. Obfuscate the source of bugs or regressions in the future.
2. Make it difficult to revert undesired changes without also reverting desired ones.
3. Make larger tickets more overwhelming and difficult to manage.

I've recently developed a habit of making **atomic commits** to keep my work more manageable; I recommend that you give this a try to see if it works for you.

{% include toc.md %}

## Atomic Commits and the Single Responsibility Principle

When developers discuss clean code, they often mention the **single responsibility principle**, which states that a unit of code (like a function or "component") should concern itself with doing only one task. This makes that unit of code easier to test and reuse.

We can easily extend this principle to Git, favoring **atomic commits** that are responsible for documenting a single, complete unit of work. This doesn't mean that each commit needs to be limited to a single file or only a few lines of code (but if that's the case, then so be it). Rather, it means that you should be able to describe your changes with a single, meaningful message without trying to tack on additional information about some unrelated work that you did.

You shouldn't enforce this imperiously or expect that it will be productive for everyone on your team. But in any case, writing atomic commits is a good practice that you may find useful in your workflow.

## There's No Such Thing as Too Many Commits

Developers are sometimes reluctant to make lots of little commits because they're worried that it will create unnecessary noise in their commit history. But there really is no such thing as "too many commits"—many enterprise code bases will have a commit count in the tens of thousands, if not more.

Just to give you an idea, here's a quick look at the commit counts for some of the most popular repositories of all time on GitHub (numbers are as of this writing and will be much higher by the time you read this):

- Visual Studio Code: 82k
- tensorflow: 110k
- kubernetes: 100k
- rust: 140k
- Node.js: 33k
- TypeScript: 32k

You get the idea.

Despite what you might think, pushing lots of commits doesn't make it more difficult to do git logs or time travel in a code base—in fact, it can actually make these tasks *easier* by isolating changes from each other, allowing you to travel to a specific point in time when just *one* change was made. You can clearly differentiate between commits `X`, `X-1`, and `X+1`.

As a compromise, some teams may follow a squash-and-rebase workflow, where developers are free to make as many commits as they want, but these are later rebased into a single commit before a PR is finally merged. I don't like this workflow, but some teams do use it.

## The Benefits of Writing Atomic Commits in Git

Atomic commits solve all of the problems that I mentioned earlier and offer a number of benefits. You'll appreciate them more once you have to [undo changes in Git](/blog/undoing-changes-in-git/) or work with lots of other developers.

### 1. Atomic commits make it easier to track down regressions

While it's true that you need to put in more effort upfront to separate your commits into independent units of work, this investment is well worth it.

For one, atomic commits make it easier for you and your team to track down the source of regressions in the future if you encounter a problem that's particularly tricky to debug.

If you make atomic commits and run a `git bisect`, and Git is able to identify the offending commit, you'll be more confident that the changes in this commit were in fact responsible for introducing the bug and that they didn't also touch other areas of the code. This can significantly narrow the scope of files that you now have to examine more closely to understand what went wrong. Even better, you may be able to get away with just reverting that commit.

If instead you had included additional changes as part of this commit, you would have had to figure out which of those changes were responsible for the bug. This can create an annoying and unpredictable developer experience where bugs can silently creep into your code alongside legitimate changes.

### 2. Atomic commits are easier to revert, drop, and amend

Let's say you're working on a big feature. There are lots of moving pieces, and you may even need to refactor some older code to accommodate your new changes. When at last you put up your PR, some of the reviewers disagree with certain changes you had made and request that you undo them. Sounds simple enough, right?

Unfortunately, you didn't make atomic commits—you lumped all of your changes into just one or two commits for convenience, with overlapping scopes of work. Some of your messages were also hastily composed, making it more difficult for you to determine which of these handful of commits introduced the unwanted code changes.

Your only option is to go in and undo those changes by hand. And if the changes were particularly involved, it's going to be even more painful. As it turns out, larger commits are not so convenient after all—you neglected to put in the time upfront to split your commits into independent pieces of work, and now you're suffering the consequences.

If you had instead used atomic commits for all of your work, you'd be able to revert (or even drop) the few commits related to the change requests, and you'd be done within minutes. Rre-request review, and you're done.

This isn't just true for change requests, though—while you're working on a ticket, you may realize that your current approach is not ideal, so you may need to backtrack. But if you have a bunch of uncommitted changes in Git—with multiple overlapping concerns and several different changes in a single file, some of which are needed and others that must be discarded—you'll need to undo your work manually. But if you had written atomic commits, you'd be able to revert the ones that introduced the changes and be done (or, better yet, rebase and drop those commits entirely).

### 3. Atomic commits make it easier to complete larger tasks

Let's imagine that you're in the same scenario—you're working on a big feature ticket or refactoring lots of files. Initially, this may seem overwhelming, and your first instinct may be to just start working in one area of your app to see how far you can get. Eventually, you realize that you've made lots of changes in many different files in an attempt to get a working solution as quickly as possible. And when it comes time for you to reflect on your progress and commit your work, that in itself seems like a challenge: What message do I write? How do I summarize *all of that work* with just a *single commit*?

If you try to tackle multiple changes at once, you won't be able to separate those out into meaningful units of work when it comes time to commit them. Thus, you'll be tempted to make a single commit for everything just so you can be done with it.

In this scenario, the lack of atomic commits is a symptom of a larger problem, which is that you didn't separate the original work into bite-sized, manageable chunks; instead, you tried to rush through doing everything at once. If you *had* split your work into smaller tasks, then you would've been able to commit each piece of work in isolation to provide a clean and accurate record of your progress.

With this in mind, we can see that atomic commits offer two advantages:

1. They minimize the cognitive load of working on larger tickets.
2. They make it easier for you to track and document your progress.

Writing atomic commits forces you to you make small, manageable changes as you tackle large tasks. This can serve as a useful reminder of where you left off the previous day if you need to resume your work or switch contexts frequently. But best of all, it helps ease the mental burden of having to make so many changes at once by gently easing you towards your end goal in smaller increments.

## Recommendations for Writing Clean, Atomic Commits

Making atomic commits is a good practice, but you'll also want to write meaningful commit *messages* to describe your work. Here are just a few tips that you may find useful:

- Pick a tense and stick with it. I prefer to start with a verb in the present tense (e.g., `Fix X`).
- Mention the component, function, or area of code that was changed.
- Mention the bug, if any, that your commit resolves. Bonus: mention the offending commit.
- If possible, reference the issue that you're working on in your commit message (e.g., `This is a commit message (#1234)`). This will create a link to issue #1234 on GitHub, making it easier for other developers to track down tickets and PRs in the future.

Here's an example from the TypeScript repo of what that last tip might look like in practice:

{% include img.html src: "typescript-repo.png", alt: "The TypeScript repository on GitHub, with the main view of folders, the recent commits that changed them, and basic information about the repository. Some commits mention issues, which get hyperlinked automatically.", caption: "Some commits mention issues, which get hyperlinked automatically." %}

And that's really all there is to say about this. Some teams enforce other conventions, too, like prefixing each commit with its type (e.g., `fix:`, `doc:`, etc.). It all depends on what works well for you and your developers.

## Tiny Changes, Big Wins

Writing atomic Git commits can seem annoying at first—it slows you down and forces you to split your work into smaller pieces. And it also requires that you write meaningful, descriptive commit messages. But while this may seem inconvenient at first, it can actually improve the quality of your work and make life easier for you and other developers on your team.

{% include unsplashAttribution.md name: "Gabriella Clare Marino", username: "gabiontheroad", photo_id: "j_puSkFWmPI" %}
