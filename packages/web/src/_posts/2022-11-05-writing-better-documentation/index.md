---
title: Writing Better Documentation
description: Documentation is one of those things that you don't appreciate until you have to live without it.
keywords: [documentation, developer, software]
categories: [essay, practices, career]
thumbnail: https://images.unsplash.com/photo-1609643242070-c69786a76c30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80
---

A few years ago, I had a memorable interview experience where I was asked this seemingly technical yet open-ended question: *What does a good API need to have?* Several answers came to mind, but one of them immediately jumped out at me. I didn't hesitate to respond with it, even if it may have seemed a little tongue-in-cheek: *"Documentation!"* The interviewers chuckled and nodded in agreement. Although unexpected, my answer was technically correct—and likely hit close to home.

Documentation is one of those things that you don't appreciate until you have to work without it—trying to make sense of a code base, library, or API without documentation can be a very stressful and overwhelming experience, and it can cause all sorts of problems for your team. In the absence of documentation, your developers may become hyper-specialized, where only one or two team members are comfortable touching an area of the code base and everyone else is afraid to get anywhere near it. Missing documentation also makes it more difficult for new developers to contribute, so they may need to regularly ask for help or spend more time adjusting to the team than they normally would. The lack of documentation may even discourage new developers from joining your team.

For new hires especially, navigating the onboarding process can already feel like learning a new language in a new country: You need to complete HR paperwork, watch training videos, set up your work equipment (which you hopefully already have), get your local environment up and running (you do have GitHub access, don't you?), read your team's documentation (which hopefully exists), fix any issues you encounter along the way (oh, they're not documented?), and try not to have a mental breakdown. Your first few days are likely going to be stressful no matter how well you plan ahead. Unfortunately, the lack of documentation compounds that stress.

Typically, you'll likely be expected to ramp up quickly enough to be able to submit your first small contributions within a few weeks. Meanwhile, your coworkers are going to be busy trying to meet their own deadlines (unless you're assigned a dedicated mentor). Especially if you're just starting out in your career, you might feel like a child in the presence of giants, timidly tugging on their sleeves to get their attention without incurring their wrath. This ramp-up period can be difficult not only because you have so much to do and learn but also because you're under immense pressure to not disappoint or bother your coworkers. I know what it's like to be the new hire who posts a laundry list of questions in Slack and feels compelled to apologize in advance for inconveniencing the team. But I also know how invaluable documentation can be for a seamless onboarding period.

Once you've been on your team long enough, you may begin to forget what it was like when you first joined. But the hiring process doesn't stop with you: A new cohort of developers will eventually join your team, and they'll go through the same trials and tribulations that you endured just a few years back. Nobody can point out shortcomings on your team quite as well as new hires can. While you and your coworkers are already comfortable with the code base and your work process, new hires may struggle to adjust. Your developers may need to spend more time than usual helping their coworkers and answering the same set of commonly asked questions, and these inefficiencies will worsen unless something changes.

For all these reasons and more, documentation is essential to the health of a software team. Good documentation not only helps your seasoned developers to navigate unfamiliar areas of the product and amass more domain knowledge, but it also helps newcomers to get up and running more quickly and familiarize themselves with your team. While it's true that documentation requires time and effort to create as well as maintain, it's an investment in your team: The more high-quality documentation you write, the better equipped your team will be to tackle existing and future problems, and the less time you'll waste chasing answers to your questions.

Unfortunately, documentation on software teams—if it exists at all—is often limited to just the code itself and overlooks other key areas. This can make it difficult for developers to find answers to their questions or reach out to the right coworkers for help. In practice, good documentation should go beyond the code itself and also cover your team, the product, your work process, areas of specialization, and many other important details. Let's look at some concrete steps you can take to improve your documentation.

{% include "toc.md" %}

## Actionable Ways to Improve Your Documentation

### Create a Table of Documentation

It's likely that your documentation has become fragmented over time and is now scattered across Confluence, READMEs, GitHub wiki pages, issues, and code comments, to the point that even your experienced developers may struggle to find what they're looking for. New hires may expect certain information to live in one place but may be surprised to discover that it's in an entirely different location (or worse: it doesn't exist).

One of the best resources you can create for your team is a centralized document that links to every key piece of documentation for your team, work process, and the code base itself. This is your <dfn>table of documentation</dfn>: one big list of links to other documentation. This way, instead of sharing many individual links with new hires, you can just point them to this single document and have them work through it one step at a time.

You can organize this document by area of concern:

- Getting started (machine setup, required dependencies, etc.).
- Contribution guide (git user guidelines, PR review process, feature work process, etc.).
- Troubleshooting guide (FAQs, gotchas, common DX issues).
- Anything else that makes sense for your team.

Avoid putting anything other than links and section headings in this document. If you find yourself writing additional explanations to supplement the links, those may belong in a separate file. Additionally, if you notice that multiple documents cover the same topic or repeat information, you may want to combine them as part of this effort or extract the shared bits into their own documents and link to them.

Your table of documents should include most of the things covered in this article.

### Create a Technical Glossary

Software development is an inherently technical field, and even seasoned developers will regularly encounter unfamiliar terms on the job. But the jargon doesn't stop at the industry level: Your team likely has its own specialized vocabulary, with certain acronyms and terms that are unique to your company, product, and work process.

While it's easy to find definitions for general software terms, your team's vocabulary may not be documented anywhere. Developers who have been around for a while may use these terms regularly without realizing that some of their coworkers might not understand what they mean. For example, new developers certainly won't understand these terms unless they ask or spend enough time on your team, and even some of your existing developers may be afraid to admit that they've been quietly nodding along this entire time without understanding what anyone is saying.

Nearly every software team would benefit from compiling a <dfn>technical glossary</dfn> that defines every unique acronym or term that is used internally by your team. This resource can help decode your language and make your team more accessible to new and experienced developers alike. Additionally, this can give new hires more confidence because they'll actually understand what people are saying during meetings, and they won't have to awkwardly interrupt a conversation to ask what something means.

Your technical glossary can be as simple as a three-column table that includes:

- The term itself and any other names that it goes by.
- A definition, in as much detail as needed.
- Examples or links that provide additional context.

You'll want to encourage contributions from your experienced developers, but it's even more important to get feedback from your recent hires since their perspective is still fresh, and they may have recently encountered unfamiliar terms in their first few months on your team. This should be one big collaborative effort—some team members might just add a term, while others might fill out all three columns.

The great thing about a technical glossary is that it allows you to use these terms liberally in other documentation without worrying about redefining those terms for new readers; anyone can reference the glossary if they need a refresher.

Considering just how important this document is, be sure to post it somewhere visible—maybe as one of the first links in your table of documentation.

### Document Areas of Expertise

At some point, every developer has asked a question as old as time: Who wrote this code?

(Spoiler: It was you.)

Jokes aside, this question comes up all the time, but not everyone has the answer. Code changes hands so frequently that contributions get lost in translation, and developers may be left wondering who they should reach out to with their questions. Occasionally, this turns into a game of hot potato, where one developer sends you to another, and that developer sends you to yet another team member, and so on until you eventually find the right person to talk to or come back full circle. Other times, you might need guidance from team members who specialize in a certain area (like CSS, accessibility, testing, etc.) but didn't necessarily write the code you're touching now.

In either situation, you might post a question in your workspace messaging app soliciting help, but there's no guarantee that the developer who oversees that area of the product will see your message or respond in time. Moreover, they may have actually left the company, so the feature may now be in the hands of someone else entirely.

Considering just how much time developers spend trying to find answers to these types of questions, a <dfn>table of expertise</dfn> can be an invaluable resource for everyone on your team. This is an up-to-date table that identifies:

- Areas of expertise, both at a high level (problem domain) and low level (feature).
- Team members who specialize in those areas or worked on those features.

The responsibility for creating this table should not fall on just one team member: Everyone knows their own contributions best, so each team member should document their own expertise.

Moreover, this list of names should not be limited to just developers; be sure to also include the names of designers and product members who oversaw that feature's development or approved key decisions. That way, if another developer needs to work in that area and has some questions about the original design or implementation, they know exactly who to reach out to for help. You may also want to list the names of coworkers on other teams who previously collaborated with you on that feature. For example, maybe a developer on your back-end or e-commerce team set up the required infrastructure for a feature; it would be good to have their contact information on hand in case someone else needs to reach out to them in the future.

When employees leave your team, you'll want to set aside some time to find other developers to take partial or whole ownership for that area so it can be maintained moving forward. Otherwise, it may become neglected over time.

### Answer Frequently Asked Questions

Nearly every customer-facing page has a section dedicated to frequently asked questions (FAQs). But customers aren't the only ones who benefit from this type of document; your own team members likely have their own FAQs that you find yourself repeatedly answering. Why not compile those answers into a document that everyone can reference?

Below are just a handful of questions that your team members are likely to have, grouped by area of concern. As you answer these FAQs, try to recall recent situations where developers did something wrong or asked questions that apply to everyone.

Remember to link to each document in your table of documents!

#### Contribution Guide

- What dependencies and tools do I need to install on my machine?
- What environment variables do I need to configure for the app to work correctly?
- What main branches do we use? Which one should I branch off of?
- Should I fork the repo or just push my branches directly to the origin?
- What git flow (if any) does our team follow?
- What naming convention do we follow for branches?
- What convention should we follow for git commits?
- What continuous integration (CI) pipeline do we use?
- How do I preview a PR build? Is there a way to access deploy previews for PRs?
- How do I view my PR build details and determine why it failed?
- How do I restart PR builds? Are there commands I can use, or do we just force-push?
- Do we have any preference on rebasing vs. merging to update local branches?
- Should I squash-and-rebase my PR before it's merged? (Not all teams do this.)
- Who should I tag for PR review? How many developers should I tag for review?
- Do we have a PR checklist? (Don't answer this—just create issue/PR templates.)
- Do I need to sign my commits?
- What patterns do we follow for software testing, and what tools do we use?
- What is the expected code coverage for different parts of the app?
- Where can I find/create/mock test account credentials?

#### Troubleshooting Guide

- What does (obscure error) mean?
- What causes (error), and how do I fix it?
- Who should I reach out to for help if (a problem occurs)?

#### Process Guide

- What is the end-to-end process for feature work? Do we have kick-off meetings?
- What regular meetings do we attend, and how often? (Scheduling recurring invites may be the best way to answer this question.)
- What HR charge codes should I use for different types of work?
- What is the process for requesting time off?
- Do we host any special team events? (Workshops, team socials, etc.)

### Document Code Effectively

This hopefully goes without saying, but I'm going to say it anyway: You absolutely need to document your code, even if you don't think you need to. The reality is that you're almost never going to be the only developer reading or touching a certain area of the app. You might understand what a piece of code does because you wrote it, but others might find it unclear or confusing when it comes time for them to contribute. Even *you* may struggle to make sense of some arcane magic you wove a couple years ago.

In almost every situation, skipping documentation causes more headaches in the long run, and the short-term convenience of it wears off pretty quickly. There are a few reasons why a developer might decide not to write documentation:

1. **Time pressure and deadlines**. Developers sometimes forget to include documentation (and testing) in their time estimates when planning for a feature. If you don't leave enough time for documentation, it's never going to get written.
2. **Bad habits**. Some developers may be used to working in environments without documentation. Even if they recognize that documentation is important, they may not want to put in the effort to write it themselves.
2. **Ego**. Some developers might wrongly believe that their code is self-documenting and that it's your fault if you don't understand it.

While other developers may understand what your code *does*, they may not necessarily follow _why_ you're doing things that particular way or what problem the code is attempting to solve. For this reason, good documentation shouldn't restate what the code does. For example, I would argue that this comment, while accurate, is not very helpful:

```js
// Get all offline users
const offlineUsers = users.filter((user) => !user.isOnline);
```

{% aside %}
Some developers like to write pseudo-code in comments before writing the code itself to help guide their work. So sometimes, these types comments are leftover artifacts from that drafting process. These "obvious" comments are not inherently bad, so long as you're not *retrospectively* writing them everywhere.
{% endaside %}

If you find yourself writing these types of comments, you're naturally going to feel like documentation is a waste of time. By contrast, helpful comments provide additional context that is otherwise not possible to communicate in the code itself. Let's look at some real-world examples.

Consider this jsDoc comment for a prop type in TypeScript:

```ts
type Props = {
  /** The user's locale, pulled from their browser settings.
   * Example values: `en-US`, `ar`.
   */
  locale?: string;
}
```

It gives concrete examples for a property that is typed loosely as a string (perhaps because there are too many values to enumerate). This way, other developers who work with the code don't have to guess what the values look like in practice.

The following CSS comment clarifies why a particular property is being used over more conventional alternatives:

```css
.parent button {
  /* NOTE: Using opacity here instead of visibility/display to ensure
  that keyboard users can still tab over to this button. */
  opacity: 0;
}
.parent:hover button,
button:focus {
  opacity: 1;
}
```

The following CSS comment clarifies how one property relates to another:

```css
.inline-element {
  /* Some type of inline-* display is needed for vertical align to work */
  display: inline-block;
  vertical-align: middle;
}
```

This JavaScript comment clarifies a hacky, temporary fix for a known race condition:

```js
/* NOTE: Temporarily fixes a race condition to give the browser time
to render the element before we do something with it. */
setTimeout(doSomething, 0);
```

This comment clarifies why editing some part of a JavaScript app is initially disabled:

```js
const initialState = {
  /* Disable editing initially and enable after mount only if the user's
  credentials allow them to edit this card. Otherwise, if we enable it
  initially, they may be able to edit it in time. */
  isEditingDisabled: true,
  items: [],
}
```

This `TODO` comment outlines the steps to fix an HTML issue for a future cleanup task:

```html
<!-- TODO: ideally, we'd use an <ol> here with <article> elements for
the cards, but these components are also used elsewhere, so this
refactor should be done in a separate cleanup PR. Ticket: [link here] -->
```

Finally, this note clarifies the chronology of a feature and could appear in any language:

```js
/* NOTE: Prior to <Release>, we only supported X. Because we now
support X and Y, we must do Z for backwards compatibility.
```

Rather than merely describing what the code does, all of these comments provide additional context and help explain why the code was written this way, any additional improvements that could be made, and any known limitations or gotchas.

{% aside %}
One of the best ways to develop good habits for documenting your code is to start reviewing your own pull requests before tagging other developers. Try to anticipate questions they might have as they read your code. If you suspect that you'll need to make changes or answer those questions on the PR itself, consider preemptively adding comments to the code to clarify those points ahead of time.
{% endaside %}

### Document Your App's End-to-End Data Flow

The bigger and more complex your product, the more likely it is to consist of many moving pieces that work together. Senior developers on your team probably have intimate knowledge of this data flow, but other developers may only specialize in one or two areas, and newer developers will need to spend time working with the product before they understand how all or even some of the pieces relate to one another.

This high-level understanding is essential to working competently on your team—otherwise, a seemingly harmless code change in one area of the app could have unintended consequences elsewhere, and the only way to avoid those types of mistakes is to understand how different areas of the app interact with each other. It can also make it easier for developers to pinpoint where in the code a particular problem should be fixed (since there are usually multiple solutions, some better than others).

Using a balance of text and diagrams, outline the data flow for your product:

- At a high level, what types of data does the app store? (Consider sharing relational diagrams or simple JSON schemas.)
- Where is this data stored?
- Is any of the data cached? Where, when, and for how long is it cached?
- On the front end of the application, what is the entry point for this data?
  - Does the app initialize a global store, or does each component query its own data?
  - How does the data cascade from this entry point to other parts of the app?
  - How does the app reconcile concurrent data access/write operations?
- Is there a standard, consistent way of querying and updating this data?
- How often is the data updated? Does the app pool user actions and update them in batches or update on every mutation?
- Does the app store any data offline in case users lose their network connection? If so, how/when does it later sync with this data?
- How does the app ensure that its UI reacts to data updates in real time and that there aren't data staleness issues? Do you use any patterns or libraries to help with this?

This is just a subset of the questions you'll want to answer. Try to give high-level explanations without going into too much detail on the low-level implementations (since those may change over time). Link to other documentation wherever additional background information is needed.

### Document How to Document

Hopefully, you'll appreciate the circular nature of this section and the irony of me saving it for last. While this section isn't nearly as important as the other items we covered, it's still helpful to include in your documentation.

Some of the advice I gave in this article could be compiled into an internal document on how to write better documentation. But in addition, you'll want to document:

- Where to place new documentation.
  - GitHub wikis
  - A `docs/` directory
  - Some other platform or tool
- How/where to collaborate with teammates when writing documentation.
  - Google Docs
  - GitHub issues (e.g., by editing each other's comments)
  - Slack/Teams channels
- How to get approval on documentation before it's submitted.
- How the team plans to keep documentation up to date.

This is especially useful for new hires because they may notice missing or outdated information as they work through the onboarding documentation, so they may want to contribute fixes while the experience is still fresh in their memory. You may be surprised by just how eager newcomers are to help clean up your docs.

Below are some additional tips for writing better documentation that you may want to include in this document:

- Provide examples, especially if third-party documentation is lacking.
- In READMEs and tests, use minimal code samples without any frills.
- Include links to external documentation, StackOverflow posts, and GitHub issues whenever you solve an obscure problem or research a solution.
- If you notice a problem but don't know how to fix it, leave a `TODO`/`NOTE`/`FIXME` to draw attention to it in the code, and consider also submitting a ticket to track the issue.
- Clarify common pitfalls or gotchas when using a certain module/library.
- When writing short-term fixes, clarify why they were needed. Future developers may not be aware of the limitations you encountered when you initially wrote that code.
- When choosing a certain approach over more conventional ones, clarify your reasoning.
- Reference other files, PRs, and issues where relevant (e.g., `See X for more context`).
- Consider using [GitHub permalinks](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files) when referencing files to prevent dead links.

## Final Thoughts

Navigating a new code base on a new team at a new company without documentation is like hiking in the middle of nowhere without a map or compass: Eventually, you're going to lose your way. Documentation—especially the *right kind* of documentation—can make a world of difference for your team. But it also doesn't come for free; everyone will need to contribute for this to pay off. While documentation does require effort to create and maintain, it's well worth it in the long term because it frees up considerable time and energy for your developers to focus on improving your product.

{% include "unsplashAttribution.md" name: "Hadija Saidi", username: "hadijasaidi", photoId: "jCfDzOQ2-C8" %}
