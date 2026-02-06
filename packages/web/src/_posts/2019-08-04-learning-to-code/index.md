---
title: On Learning to Code
description: Beginners tend to prioritize the wrong things when learning to code. This is my advice for what to focus on.
keywords: [learn to code]
categories: [essay, career]
commentsId: 29
lastUpdated: 2026-02-05
redirectFrom:
    - /blog/learn-to-code-without-wasting-time-and-money/
thumbnail: https://images.unsplash.com/photo-1499673610122-01c7122c5dcb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

I remember reading a short story in high school about an aspiring writer who invested a great deal of time and money in procuring a fancy pen and an ornately bound notebook, purchasing a desk only a serious writer would sit at, furnishing his study with shelves full of old books he'd never read, and daydreaming about the prospect of writing. What was missing from this picture was any ink touching paper—he did anything but actually write.

The same thing often happens with beginners who want to learn programming—they install an assortment of IDEs and tools whose purpose they don't really understand, read articles that offer generic advice, and generally spend most of their time _contemplating_ programming instead of... well, *programming*.

## Just Pick a Language

Instead of wasting your time comparing different languages, just pick one and start coding. It really doesn't matter. Learn Java, Python, PHP, JavaScript, Go, Scratch, whatever. Anything, as long as you actually start somewhere. What you *shouldn't* do is waste time debating the merits and drawbacks of various languages when you don't even have experience yet—that's what you really need, after all; the language is just a means to an end.

YouTuber Michael Reeves puts it well in [one of his videos](https://www.youtube.com/watch?v=bZDE6I5B9-E):

> Just pick one and start learning programming... All modern programming languages are wildly powerful, and they can do all kinds of shit.

Programming languages are just tools. The end goal is to be able to pick up any language as needed for the task at hand, rather than limiting yourself.

Granted, some languages are easier to learn than others, and picking one that's too advanced could frustrate you. On the other hand, jumping into the deep end and learning an advanced language like C++ will make learning other languages a breeze later on. It just depends on what kind of learner you are.

Learn how to _program_ and solve common problems instead of memorizing the specific syntax and features of a particular language. Use your favorite language as a way to learn programming fundamentals, algorithms, and data structures and to gradually step out of your comfort zone. All of those are language-agnostic, transferable skills that make it easier to learn additional languages in the future, which is usually just a matter of getting used to a new syntax (and maybe a new way of thinking, like going from an OOP language to a functional one).

## Stop Buying Courses You'll Never Finish

Paid platforms and courses are everywhere, but in my experience they rarely ever provide materials that are of a higher quality than free content that's readily available online.

The biggest problem with courses is the constant hand-holding—it's a disservice. Doing your own research, making mistakes, breaking your code, and learning how to debug all incredibly valuable experiences that will stick with you forever and ultimately make you a better programmer. Simply copying what an instructor does may help you develop muscle memory, but it won't provide you with the deep level of understanding that only first-hand experience can bring.

Have you ever noticed how these courses are always on sale? Or that these platforms have hints on practically every problem, or that the instructors outright tell you how to solve a problem? These are all red flags.

Many of these courses involve passive learning, even if they encourage you to type along and do things on your own machine as you watch them done on the instructor’s end. Why? Because you’re not actually discovering problems yourself and then searching for ways to solve those problems. That’s how people learn—through curiosity and failure.

With many of these platforms, there’s a thin veil of active learning. In reality, you’re doing one of three things:

1. Typing out everything the instructor wrote by hand.
2. Copy-pasting their code or cloning a repo from their GitHub.
3. Passively listening and hoping it all sticks (it probably won't).

Then, a week later, you find yourself having to revisit a past exercise (or even the associated video) to recall how to do something because you already forgot. If that's the case, then you probably didn’t learn anything.

Developers have to constantly search for things online, sifting through Stack Overflow posts, Reddit, YouTube tutorials, articles, and—dare I say it?—*documentation* to find answers to their questions. But why bother seeking out those answers on your own when you can pay for an instructor to *tell you* what to do?

In a similar vein, these platforms also shield you from the process of setting up a dev environment on your own machine. Instead, they offer you a nice little sandbox environment where you can code to your heart's content without ever understanding what happens between you writing your code and the computer interpreting and understanding that code. If you plan on seriously investing your time in learning and using a technology in the real world, why not take the time to understand how you can use it on your own machine?

Here are two Udemy course I once purchased thinking that they were the key to achieving whatever goals I had at the time (web development and game development, apparently):

![Two cards showing Udemy courses I once purchased but never finished. At the bottom of each card is a progress bar depicting the percentage of the course material completed.](./images/udemy-courses.jpg)

I quit about 10% through both of them because I got bored. Over the years, I've learned that I need a meaningful context for anything I set out to learn—a genuinely relevant and challenging project that I want to work on. For example, I learned just about everything I know about HTML, CSS, and (some) JavaScript by making this website—having a vision for what I wanted and then researching all the necessary parts to bring it to life. I learned both web development and game development on my own time, on my own terms.

What do you want to make? Figure that out, and just start learning whatever you need along the way. If you decide that taking a course is the right path for you, just know that there are also plenty of free resources online to get you where you need to go.

## Learn to Read Code

Writing code is just half the job; you'll also need to learn to read and understand other developers' code, especially once you work as part of a team and get tagged on PR reviews or assigned features that other developers previously worked on. Much like how reading books can help you become a better writer by exposing you to different literary styles, techniques, and genres, reading code can make you a better programmer by exposing you to different solutions and design patterns.

Here are my recommendations for how to improve your code reading skills:

1.	Join a site like [Code Review](https://codereview.stackexchange.com/) on the Stack Exchange network. Developers often post their code here for more experienced developers to review. This is an incredibly valuable resource for beginners. I recommend that you read an original poster's code and review the responses to see what kinds of feedback other developers provided. Understanding *why* they made those recommendations can help you avoid making similar mistakes in your own code. If you need to, you can compile a list of common errors that you see and the corresponding recommendations that are provided. With time, though, you shouldn't need such a reference—it will all become second nature through repeated exposure to the same kinds of problems.
2.	Read tutorials. But don't just follow a single tutorial blindly, copy-pasting things without understanding what the code is really doing. Instead, open a few tutorials on a single topic and review them in parallel so you can understand why certain decisions were made in one tutorial but not in another.

I found the second tip to be especially useful when learning CSS on my own. Initially, I hard trouble making sense of other people's stylesheets because I never really understood what their rules were doing. So how did I learn? By reading [W3Schools](https://www.w3schools.com/), [MDN](https://developer.mozilla.org/en-US/), [CSS-Tricks](https://css-tricks.com/), and other reputable sites. Then, for each line of CSS I didn't understand, I'd run that code locally and make a mental note of how it changed the visual presentation of the site. If something confused me, I'd research that CSS property to see what exactly it did. All of this involved reading, and reading, and... more reading. It never stops, and it's an important skill to develop if you're serious about software development, no matter what you specialize in.

## Learn to Set Up Your Environment

In large code bases, it's important to know how to set up your local dev environment correctly, with all the right tools and dependencies. If you're new to this, find a random project using [GitHub's Explore page](https://github.com/explore) and clone it onto your own machine. Then, follow whatever directions they have in their README to set up your dev environment and successfully build the project locally. If you run into any problems, look up how to fix it.

Part of this is learning how to ease your way into a terminal environment and relying less on traditional GUIs. In particular, knowing how to work with Linux and popular CLI commands will make your life much easier as a developer.

### A Note on Git

There are tons of online tutorials and videos to help you understand Git, but they all miss the point: Git is an *applied technology* that's difficult to learn by just reading about it. Unless you actually use it yourself, you'll forget certain commands or workflows.

You should learn Git with a hands-on project—ideally one that involves multiple collaborators—to understand why the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) is the commonly accepted standard, or why you should [never rebase public branches](https://www.atlassian.com/git/tutorials/merging-vs-rebasing). This will also help you to get comfortable with stashing your work, switching branches, amending commits, and checking out specific commits. These are all things that used to intimidate me when I had little to no experience with Git, but once you get comfortable with them, you'll appreciate why they're so important.

## Don't Stress Over Leetcode

Remember the SATs and ACTs? Most people would rather not. It's a time when you're cramming material that you'll likely never need to use in your future. I hated the entire process.

Leetcode is the same. There's this pervasive (and arguably harmful) practice in the hiring industry where a programmer's aptitude is measured by their ability to [solve coding puzzles on a whiteboard](https://twitter.com/mxcl/status/608682016205344768?lang=en), and that has spawned a number of platforms like Leetcode, Hackerrank, and others dedicated to helping developers master the art of solving obscure puzzles. I've personally been fortunate enough to not have to go through this ordeal in my interviews, and I hope you don't either.

Some people will tell you that you should [grind Leetcode](/blog/the-leetcode-grind/) if you want to get a good job in tech. That may be the case if you want to get into elite companies, but it's not for the majority of developer positions. The best thing you can do is to work on personal projects and gain a deeper understanding of the technologies you want to work with in the future, as well as a solid grasp of computer science fundamentals and how to solve problems.

With all that said, I will admit that there are some pretty interesting Leetcode problems that actually get you thinking and test your understanding of fundamental data structures. Here are my personal favorites:

- [Reversing a linked list](https://leetcode.com/problems/reverse-linked-list/)
- [Merging two sorted linked lists](https://leetcode.com/problems/merge-two-sorted-lists/)
- [Implementing a prefix tree from scratch](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [Validating stack sequences](https://leetcode.com/problems/validate-stack-sequences/)
- [Map sum pairs (prefix trees)](https://leetcode.com/problems/map-sum-pairs/)

If you're curious about solving these problems, do give them a shot. But don't waste your time *exclusively* practicing Leetcode thinking that alone will make you a better programmer or a more qualified candidate. It's a small part of the overall picture.

## Be Patient

Failure sucks, but you'll need to get used to that feeling of frustration because it's inevitable in programming.

This is where online courses tend to disappoint—once the training wheels come off, and as soon as you’re confronted with an unfamiliar problem, the panic sets in. Because up until now, every problem you'd ever encountered had a solution: an instructor who would happily tell you exactly how to do something.

And then what happens? People vent on forums and seek reassurance, to be told that coding isn’t that difficult and that they're not stupid and that they'll get better with time.

![A Google Search preview of posts from various programming-related subreddits. The top result is titled: I think I'm too stupid for programming.](./images/programming-woes.jpg)

Learning to code is quite literally learning to speak a new language—there's a rough transition period at the start where you're mostly doing things by rote memorization and repetition, and when few things actually make intuitive sense. Eventually, with enough experience, it all clicks and becomes second nature.

But the process of *getting* to that point isn't easy. Unfortunately, people are misled into believing that programming is somehow easier to pick up than any other skill that pays well, or that spending money on courses will guarantee their success. In reality, becoming a good developer requires years of practice, self-motivation, and hard work.

And, of course, you never stop learning.

{% include "unsplashAttribution.md" name: "Goran Ivos", username: "goran_ivos", photoId: "iOykDIkZLQw" %}
