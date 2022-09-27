---
title: The Cost of Tech Debt
description: The longer you leave tech debt unresolved, the more problems it will create for your team, until one day it becomes unbearable.
keywords: [tech debt]
categories: [essay, career, practices, tech-debt]
thumbnail:
    url: https://images.unsplash.com/photo-1533234427049-9e9bb093186d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80
---

Technical debt (*tech debt* for short) is a term that, over time, has become a regular part of our vocabulary in the software industry—so much so that almost anything can be considered tech debt if you try hard enough. Slow tests? Tech debt. Slow app startup? Tech debt. Bugs piling up in the queue? Tech debt. New features? Not... really. But I suppose it depends on who you ask.

The term *tech debt* also sounds like it might have something to do with finance, but it doesn't—at least not directly. Rather, tech debt refers to the accumulation of inconveniences and problems in a code base over time. It's a byproduct of the typical software development cycle: planning, development, and release.

Like any other debt, tech debt incurs a cost. Where money is involved, a debt may incur penalties and interest if the principal amount is not paid off in time. With tech debt, the cost is developer productivity and the quality of the code that we ship.

{% include "toc.md" %}

## Why Tech Debt Exists

Ultimately, tech debt accrues because time is a scarce resource, so addressing tech debt isn't always a top priority at work. You may be itching to resolve issues that have been creeping up and impacting your productivity over time, but if you're expected to deliver a critical feature by the end of the week, you might simply not have enough time to work on both tasks. Besides, your manager might not be too pleased if you spend your time resolving minor issues when there are more pressing concerns at hand.

Even if you have time to address tech debt, it's not always viewed as a legitimate concern, especially among startups. In those kinds of fast-paced environments, it matters less that you ship a feature *correctly* and more that you get something out the door, even if it's not perfect. While this is a convenient mindset for the short term, it does create more work over the long term. The hope is that once you acquire more funding, you'll have enough time, money, and staff to be able to afford tackling those problems later on. An alternative and all-too-common reality is that you *continue* to churn out new features to meet your growing customer base's demands without ever fixing your existing problems.

## The Cost of Unresolved Tech Debt

The software development process leaves little (if any) room for maintenance and downtime at the end of sprints. Unfortunately, this often turns into a vicious cycle: The less time you devote to resolving tech debt, the more it accumulates. And the more it accumulates, the less productive your team becomes, impeding your ability to deliver features on time. Eventually, there will come a point when the cost of tech debt will be too much to bear, and your team will have to confront it.

### Impeded Work

Before working on a task, developers are typically asked to estimate how long it will take to complete. This helps the team to understand whether it's worth completing the ticket now, delaying it until a future release, or narrowing its scope. It also helps you understand how well equipped the developer is to take on that task and whether they'll need extra time, resources, or support along the way.

Let's say you attend a meeting to kick off a new feature. Based on an initial review of the design and the existing code, you think the task should be straightforward. You're asked to provide an estimate of the work: Will it take one week? Two? Three? It's often hard to say, and the real answer is usually that _it depends_. With this in mind, you're careful to give conservative estimates just in case the feature turns out to be more complex than you anticipate, and you also account for testing and documentation since those are also part of dev work. Once your questions have been addressed, you're off to the races.

Initially, things move forward at a steady and productive pace, and it seems like you'll be able to deliver the feature on time. But once you get deeper into the work, you hit an unexpected roadblock. It turns out that your feature depends on certain other functionality in the app that was originally architected under different requirements. And since that was a high-priority feature, it was pushed out of the gate as quickly as possible, creating some tech debt in the process. Unfortunately, this means that you're missing some functionality that's necessary to complete your current task. Designers and product are usually unaware of these limitations, so the burden falls on developers to flag these issues early on. But it's not always the case that the developer is familiar with the tech debt affecting that particular area of the app.

Upon realizing this, you consult with other developers on the team who are more familiar with that area of the code, and they confirm that this is going to require a refactor before you can proceed with your ticket. Your single scope of work has become two: One to resolve a related issue and another to complete the primary task you were assigned. Your team was likely aware that this refactor would eventually need to happen, but it wasn't a priority—at least not until now.

Who knows how many more surprises lie in wait? Will this refactor, in turn, require additional cleanup before you can resume working on your main task? How much time will you spend clearing the path before you can walk these roads safely?

To be clear: You're getting paid to do all of this, and it's part of the job description. It's also not any particular developer's fault—we're all under pressure, and we all deliver features and review each other's code to the best of our abilities and try to future-proof our code as much as possible. We can't—and shouldn't try to—anticipate every future requirement.

But if your process does not leave room for resolving tech debt—an unavoidable byproduct of development work—then it only makes matters worse. Because when the time eventually _does_ come to address the debt, it's no longer just a minor inconvenience that can be pushed back in the queue—it's an entirely new scope of work that impedes your current tasks.

### Increased Surface Area for Bugs

You put in a pull request for a ticket and move on to another task. A while later, you receive some comments from reviewers suggesting a much-needed refactor since you happen to already be in that particular area of the code base. While the concerns they raised are valid, you didn't write the original code—you only modified some parts of it to support your work. And you'd like to get this PR in as soon as possible so it can be tested.

But the reviewer insists, and the change seems innocent enough to accommodate as part of your PR. You may as well do it while you're here, so you go ahead and push up the commit. What can go wrong? If your change happens to break something, hopefully you already have tests in place that will catch your mistake. But perhaps your change introduces more insidious bugs for untested functionality or only fails for certain edge cases that were not previously accounted for. Either way, you've now expanded the scope of this one pull request: Whereas before it focused on introducing new functionality, it now introduces new functionality _and_ potentially breaking changes in an attempt to resolve tech debt.

In fact, it's not necessary for this to occur during PR review. You may just feel tempted to resolve tech debt while you're in a particular file working on a feature, so you may try to sneak those fixes in alongside your main changes. But it's best to resist that temptation. No matter how simple a refactor may seem, it shouldn't ever make its way into the code base alongside your feature as part of the same PR. When you do this, you increase the surface area for bugs, potentially breaking more things than you fixed. If this happens on your team, it may be a symptom of tech debt accumulating, leaking into your normal feature development process. It also suggests that you're not leaving enough time during your sprints for developers to address these issues as separate scopes of work, complete with updated tests and documentation (where relevant).

If you were to dedicate some time during each sprint to resolving tech debt that's piling up in the queue, you would encounter these sorts of situations more rarely. Rather than getting merged into your main branch alongside features and enhancements, these fixes would occur in separate PRs that can be tested thoroughly for specific regressions.

### A Slowdown in Cross-Team Collaboration

Tech debt doesn't just affect developers: Designers, QA/testing, and product also have their fair share of problems that accumulate over time. Sometimes, these issues can spill over from one team to another, slowing everybody down.

For example, tech debt on the design side may force developers to come up with short-term workarounds. Maybe your team doesn't have a design system in place, so developers might need to hard-code values or use a patchwork set of variables spread across the code base to make up for this. Both teams will lose considerable time trying to reconcile inconsistencies between design mocks and this makeshift design system.

Conversely, tech debt on the development side can slow down designers, who are often more forward-thinking and eager to push the bounds of the product. But if developers are hindered by tech debt to the point that they need to slow down and spend more time on each feature, this can create a bottleneck for designers, where they cannot speed too far ahead without leaving everyone else behind.

### Difficulty Onboarding New Developers

To those who haven't had to bear its weight, tech debt can seem like a minor inconvenience. But nobody feels the pain of tech debt quite so acutely as a new hire. Onboarding documentation may be lacking or outdated. Certain tools may not work the way they're supposed to. Key areas of the code base may be undocumented, leaving even seasoned developers clueless. Getting started with your first few tickets on a new job will always present some friction, but tech debt increases that friction.

### Loss of Productivity and Burnout

The scenarios described so far might not seem all that bad if you consider them in isolation. But in a large code base with multiple developers who each experience these problems from time to time, those tech debt issues can eventually accumulate and impact everyone on the team. Your developers might become less enthusiastic about working on new features, fearing that they may relive prior unpleasant experiences. Moreover, because the normal development cycle doesn't leave a whole lot of room for maintenance, developers may begin to feel like their lives revolve around releasing features with no downtime in between sprints, all while long-standing issues continue to worsen. This can take a toll on your developers' productivity and contribute to burnout. It may also create a culture where developers reluctantly write hacky short-term fixes to move their tickets forward. Unfortunately, this only exacerbates the problem and creates more long-term tech debt.

### A Potentially Worse User Experience

Discussions about tech debt usually center on how it impacts teams internally. However, certain kinds of tech debt may ultimately impact the product's user experience if you leave those issues unresolved for long enough. Accessibility is one area where you may encounter this problem. Unless you have a process in place for accessibility testing and QA, and unless you educate your developers about best practices and why they should take accessibility seriously, you may be opening yourself up to all sorts of problems down the road—potentially including lawsuits from people who are unable to use your product.

Typically, this occurs when teams implement custom components for notoriously troublesome UI components, like dropdown menus, tabbed interfaces, or modals. What starts out as a simple feature with a handful of cleanup tickets eventually becomes an impending refactor or a pressing UX concern that users have complained about. Unfortunately, fixing these sorts of problems can be costly if it impacts multiple parts of your app. You'll fix one thing, but you may inadvertently break some other components in the process.

## What's the Solution?

When we're young, we're taught to clean up after ourselves—to put away our toys, to take our dirty dishes to the sink, to make our bed in the morning, and so on. This discipline is an important part of growing up; as we earn more privileges, we must also hold ourselves accountable and take care that our actions don't inconvenience others.

As developers, we have a similar shared responsibility to leave our code base looking cleaner than when we played with it. Unfortunately, in many code bases, tech debt is considered to be an afterthought—an inconvenience that arises naturally as part of the development process and that gets kicked to the back of the queue so that higher priority features can be released more regularly. But this can compound the problem, especially if new features continue to be stacked on top of that precarious foundation. You can leave all your toys sprawled on the floor, but someone is eventually going to trip on them.

### Start Logging Tech Debt

Before you can address tech debt, you need to get a lay of the land. Encourage every developer on your team to log tickets for undocumented tech debt issues, especially if these developers are subject-matter experts in specific areas of the app. Tickets should specify:

- The problem in sufficient detail so that other developers could also investigate the issue.
- The parts of the app that the issue affects.
- Some potential solutions that come to mind.
- An estimate of how long the task will take to complete.
- Any additional considerations.

This requires you to invest some additional time and effort beyond what is normally expected from your team, but it's an essential first step. After all, how can you assess the health of your code base and the impact of your tech debt if these issues are not actually documented anywhere? For example, if your code base has a disproportionate number of `TODO` comments without accompanying tickets, those may be a good place to start. We all know at least a few issues that should be fixed but that we simply haven't had the time to document or look into, so we just hastily left a `TODO` comment explaining the problem and moved on. Time to start making time and following up on these issues.

### Dedicate Time to Tackling Tech Debt

Next, it's up to you to figure out how to manage tech debt on your team in a non-disruptive manner. For example, you may choose to set aside a few quiet days at the end of every sprint to allow your developers to chip away at leftover cleanup tasks from earlier releases. This would create a regular cadence of work where your developers not only deliver features but are also given some time to prune the code base in preparation for future tasks.

You could either have all developers work on tech debt or split them into alternating teams of two, where one team does some light feature development in addition to tech-debt-resolution while the other team focuses on some of the more involved features in your backlog; then, you would swap the roles during the next sprint.

If this process is being implemented retrospectively and you already have several issues piled up in the queue, your team may need to spend a bit more time upfront to resolve issues that have accumulated over a longer period of time. Be sure to also adjust the product team's expectations: Whereas before they may have been used to your team focusing primarily on feature development, they should now be aware that developers will also need time to resolve tech debt.

## Pay What You Owe

Shipping features is important for the growth of a product, but shipping *quality* code is arguably better for its longevity. When you devote time to fixing tech debt, you sacrifice some throughput in the short term because your developers can spend less time working on features. But this time isn't lost—it's an investment. Unhindered by tech debt, your developers will be free to focus on releasing new features with fewer interruptions.

The longer you leave a financial debt unpaid, the more you will eventually owe, so it's in your best interest to pay it off as soon as possible. Similarly, the longer you leave tech debt unresolved, the more problems it will create for your team, until one day the cost becomes unbearable. Ignoring a problem doesn't make it go away—it only allows the problem to get out of hand. Instead of hyper-focusing your team's efforts on development and release, leave some room for housekeeping and maintenance.

In short: Accept that tech debt is here to stay, but try not to let it get in your way.

{% include "unsplashAttribution.md" name: "Markus Spiske", username: "markusspiske", photoId: "C0koz3G1I4I" %}
