---
title: Don't Mind the Leetcode Grind
description: Leetcode is a polarizing topic in the software industry. But what is it, and how much time should you invest into it?
keywords: [leetcode, leetcode grind]
categories: [algorithms, career]
thumbnail: ./images/thumbnail.png
lastUpdated: 2024-08-20
---

Leetcode is a polarizing topic in the software industry. But what is it, and how much time should you invest into it as you prepare for technical interviews?

## What Is Leetcode?

[Leetcode](https://leetcode.com/) is an online platform where you can solve programming challenges of varying difficulty on a wide range of data structures and algorithms, including trees, dynamic programming, linked lists, string manipulation, and more. Many of these problems require that you find an optimal solution, in terms of time or space complexity (or both).

{% include "postImage.html" src: "./images/leetcode.png", alt: "Leetcode has a list of DSA problems that you can solve" %}

In programming circles, "Leetcode" doesn't always refer to that particular platform. Rather, it's an umbrella term that includes similar sites like Hackerrank, Geeksforgeeks, CodeChef, and more that are meant to help you prepare for the types of problems you'll be asked to solve in technical interviews.

## The Self-Imposed "Grind"

In principle, Leetcode seems pretty harmless. Unfortunately, most of the tech industry has adopted Leetcode as its unofficial method of standardized testing: a way to weed out those who can't solve an unfamiliar problem on a whiteboard, without Googling and without enlisting help from their co-workers. Because, as we all know, these skills are irrelevant in the workplace.

Due to how frequently these types of questions are asked during technical interviews, certain online circles—especially subreddits like [r/cscareerquestions](https://www.reddit.com/r/cscareerquestions/)—have come to develop an almost religious obsession with the so-called "Leetcode grind." It's way of life wherein you devote a majority of your time to cranking out Leetcode or Hackerrank problems in preparation for technical interviews at **FAANGs**: the **F**acebooks, **A**mazons, **A**pples, **N**etflixes, and **G**oogles of the tech world.

{% include "postImage.html" src: "./images/reddit.png", alt: "Reddit is obssessed with the Leetcode grind" %}

And like any obsession, it's nothing short of unhealthy.

## The Leetcode Experience

You've never truly experienced Leetcode unless this sounds familiar:

1. Decide that you're going to finally tackle Leetcode.
2. Get stuck on an Easy problem.
3. Give up 10 minutes in and look at the solution.
4. Fail to understand said solution.
5. Google "Leetcode sucks" and read some encouraging rants on Reddit.
6. Revisit step 1 about a month later.

And yet, it's not exactly healthy when you think about it—not any healthier than the actual "grind" mentality itself.

I'm not a fan of Leetcode. Poorly worded problems frustrate me. Obscure solutions and math tricks practically get my blood boiling. *Who cares? When will I ever use any of this?*

Everyone's felt like this at some point. Maybe you complained about learning certain subjects in school that weren't related to your interests, as many of us did. It's frustrating, sure, but it's also a necessary evil that everyone goes through. After all, the point of most academic programs isn't to teach you how to become a specialist with a very narrow skill set—it's to expose you to a variety of disciplines and problems.

As much as I hate it to admit it, Leetcode isn't *inherently* bad. In fact, it's healthy in moderation because there's nothing wrong with practicing your problem-solving and optimization skills or learning new ways to approach unfamiliar problems. What *is* unhealthy is the grind. And honestly, at the end of the day, Leetcode is just one piece of the puzzle.

## Interviews Are More Than Leetcode

Want to ace tech interviews? Good luck doing that if you've tunnel-visioned into the Leetcode grind. What about these other important areas?

1. Polishing your resume.
2. Practicing answers to soft questions.
3. Preparing questions for interviewers.
4. Researching companies.
5. Writing compelling cover letters.
6. Working on side projects.

Where do these fit into your day when all you do is crank out Leetcode problems?

The biggest problem with the "Leetcode grind" mentality is the fact that it's only useful if Leetcode is asked, and if you actually make it to the technical interview. You're much better off figuring out why you're not making it to the technical interview in the first place or brushing up on concepts specific to the job for which you applied (e.g., web fundamentals if you're a web developer).

Fortunately, not all companies use these types of problems to weed out applicants. In fact, in all of the interviews that I've done to date, I'd say that I've maybe had to do only one or two Leetcode or Hackerrank problems. The rest have been practical interviews:

- Low-pressure pair programming on platforms like Coderpad, where Googling is allowed.
- Bug fixing and simple skill tests, with practical problems relevant to the job you applied for.
- Take-home assignments or Codepen challenges.
- Walking through hypothetical scenarios out loud, like how you would design a REST API.
- Quizzing me on my computer science and programming fundamentals knowledge.
- Asking questions related to the tech that I'd be using on the job.

Part of the blame for the Leetcode grind falls on the tech industry—there are lots of creative and practical ways to test a candidate's skills in a technical interview. Interviewers should put in just as much effort to develop relevant exercises to test a candidate's abilities. But why bother to put in that effort when you can just Google a generic problem, slap it on a white board, and pretend to seem interested in the solution?

## Leetcode Isn't the Real World

On the job, unless your solutions are always inefficient, and unless you know that the input to your algorithm is going to scale to very large sizes, a brute-force solution will be more than good enough. In fact, brute-force solutions are usually pretty easy to understand because they involve some sort of stepwise iteration or problem simulation. Good examples of these kinds of problems are [ZigZag Conversion](https://leetcode.com/problems/zigzag-conversion/) and [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/).

Unfortunately, Leetcode can encourage premature optimization because most Medium and Hard problems cannot be solved with a brute-force approach (it times out). This can lead to analysis paralysis on certain problems that you *would've* been able to solve if you weren't forced to optimize it right out of the gate. In the real world, readable brute-force solutions aren't worth optimizing unless you have a good reason for doing so.

## Tips for Solving Leetcode Problems

Enough complaining—what if you still want to practice Leetcode, either for interviews or for fun? Here are some tips based on my experience solving these kinds of problems.

### 1. Don't always filter problems by subject

Leetcode is all about pattern recognition. And the first step in solving any Leetcode problem is to figure out what type of exercise you're given. String manipulation? Sorting algorithms? Trees, dynamic programming, linked lists? When you're first starting out with Leetcode, it makes sense to familiarize yourself with all of the possible types of problems you may encounter and to practice the ones that are unfamiliar or that you struggle with. But if you always filter Leetcode problems by their type, then you're cheating yourself out of part of the challenge and making those problems easier. In a real-world interview, you won't be told what type of problem you're given—that's up to you to figure out. Try to strike a balance between targeted practice and solving random problem sets so you don't develop a crutch.

### 2. Attempt a brute-force solution first

Like I mentioned before, most advanced Leetcode problems reject brute-force solutions because they tend to be slow. But that doesn't mean that you shouldn't at least *attempt* a brute-force solution as a starting point; if it works, you can optimize it to make it pass. This is especially important in the real world, where interviewers want to see your thought process and problem-solving skills. They don't expect you to come up with an optimal solution on the spot. If you do, great job! But if you don't, that's okay.

If you're practicing Leetcode but can't come up with a brute-force approach, start reading the solution and try to understand the reasoning behind the approach, without looking at the actual solution code. Try to revisit the problem and work through it yourself before spoiling the full solution.

### 3. Don't treat Leetcode as a competition

Yes, Leetcode awards points for solutions. Yes, elitists love to brag in the comments section about how their solution is faster than `X% of Language` submissions. These metrics are meaningless, and you'll get different numbers each time you submit a solution. This is also missing the point of Leetcode entirely. Don't obsess over performance metrics. If your solution is optimal and passes, that's all that matters.

### 4. Pick a language based on your goals

If you're practicing Leetcode to prepare for a technical interview, then it makes sense to use the language you'll be working with if hired. On the other hand, Leetcode can be a useful way to ease yourself into learning an unfamiliar programming language by solving familiar problems. Figure out your goal, and then pick a suitable language.

### 5. Don't beat yourself up

The greatest athletes, actors, and professionals of the world don't achieve mastery without practice. You can't expect to ace Leetcode problems immediately, even if you're a competent developer.

My submissions fail pretty frequently, with only a 40% acceptance rate for the 60 or so problems that I've solved to date. I'm okay with that, and you should be too. Leetcode doesn't define your intelligence or aptitude as a programmer. It's all about spotting patterns—the more you practice, the better you get.

So forget the grind—just focus on the value of practicing your problem-solving skills, not on doing as many exercises as you can in one sitting or solving every problem on the first attempt. With this change in attitude, you'll be much better prepared for the real world, where [nobody cares if you can invert a binary tree on a white board](https://twitter.com/mxcl/status/608682016205344768?lang=en).

## Is Leetcode Making You Miserable?

Then stop—that's all there is to it. Leetcode is only a grind if you let it become one.

If you're preparing for interviews, make a habit of practicing one or two Leetcode problems a day to prepare yourself for solving these kinds of problems more proficiently over the long term. If one day you don't feel like practicing Leetcode, then don't.

Leetcode, like all skills, takes practice and time to perfect. If you expect to solve Medium and Hard problems within minutes of reading them, you'll be disappointed and walk away frustrated. You'll beat yourself up. You'll think you're stupid and not cut out for dev.

Treat Leetcode as an exercise to keep yourself sharp. Don't treat it like a school assignment or an interview. Solve these problems casually, and you'll eventually spot patterns to common problems.

## Attributions

This post's social media preview image uses the Leetcode logo under fair use; it is under the copyright of LeetCode. I am not affiliated with LeetCode.
