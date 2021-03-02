---
title: 6 Ways to Undo Changes in Git
description: If you ever find yourself in a sticky situation with git, don't panic. Here are six simple ways you can undo changes in git and clean up your commit history.
keywords: [undo changes in git, git]
tags: [dev, git, github]
comments_id: 60
---

Eventually, there will come a point when you'll find yourself having to modify old commits, delete commits, and rewrite history in all sorts of scary ways. Especially if you're new to git, it can sometimes feel like you're navigating a minefield. But fear not—it's actually easier than you think! In this post, we'll look at a bunch of ways you can undo changes in git and rewrite your commit history.

{% include toc.md %}

## Setup

Before we get to the examples, let's create a simple git repo with a few commits:

{% include codeHeader.html %}
```bash
git init && \
echo {} > package.json && git add . && git commit -m "Add package.json" && \
echo FOO=bar > .env && git add . && git commit -m "Add .env" && \
touch README.md && git add . && git commit -m "Add README" && \
touch .gitignore && git add . && git commit -m "Add .gitignore"
```

On my end, that gives me this history:

```
* 4753e23 - (HEAD -> master) Add .gitignore (4 seconds ago) <AleksandrHovhannisyan>
* 893d18d - Add README (4 seconds ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (4 seconds ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (5 seconds ago) <AleksandrHovhannisyan>
```

Obviously, your commit hashes will differ from mine.

Feel free to follow along and run these commands—the best way to learn git is to use git!

(Also, if you're concerned that we added an `.env` to git, good eye! We'll delete that later.)

## A Note on Modifying Public Branches in Git

For me to come up with reproducible code samples for this tutorial—and for you to be able to easily run them on your end—we'll be executing most git commands directly on `master` itself.

With git tutorials, it's often difficult to accurately simulate the real world, where you most likely will not be committing directly to master, and where you'll be working with other developers. Public branches like `master` are ones that your team regularly merges work into via pull requests and that nobody commits to directly. These branches provide an untouched history of your repository, documenting your features and software releases. But there are also the so-called "personal" (feature) branches that individual developers create and commit to directly, and that later get merged into milestone branches (or directly into your `master` branch, depending on your workflow).

Everything you'll learn in this tutorial is still practical and can be extended to the real world, so long as you keep in mind that you should never try to undo changes in git on public branches, unless you know what you're doing. As for your own branches, you are free to do whatever you want—like deleting old commits you introduced on that branch. The same holds if you're the only developer in your repo since you're in full control of your own work and won't interfere with anyone else.

> **Note**: Most of the time, you won't even have direct write access to public branches if your team's admins have configured the repo properly, so this is not an issue.

With that boring preface out of the way, let's finally get to the good stuff!

## 1. Amending the Most Recent Commit

You have this commit history:

```
* 4753e23 - (HEAD -> master) Add .gitignore (4 seconds ago) <AleksandrHovhannisyan>
* 893d18d - Add README (4 seconds ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (4 seconds ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (5 seconds ago) <AleksandrHovhannisyan>
```

Shortly after creating your `.gitignore` and committing it, you decide to change the file:

{% include codeHeader.html %}
```bash
echo node_modules > .gitignore
```

But you don't want to pollute your git log history with yet another commit for such a minor change. Or maybe you need to correct a typo in your most recent commit message.

Both of these are classic use cases for the `git amend` command:

{% include codeHeader.html %}
```bash
git commit -a --amend
```

Simply put, **amending** is how you edit commits and commit messages in git. It's one of the most basic ways to undo changes in git (or, in this case, to introduce new ones).

When you run the code above, git will open up the most recent commit in your editor of choice, adding your changes to the staging environment:

```bash
Add .gitignore

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Oct 11 08:25:58 2020 -0400
#
# On branch master
# Changes to be committed:
#       new file:   .gitignore
#
```

Save and close the file, and git will amend the most recent commit to include your new changes. You can also edit the commit message before saving the file.

If all you need to do is update the commit message itself, like to fix a typo, you don't actually need to stage any changes. All you need to do is run this command:

{% include codeHeader.html %}
```bash
git commit --amend
```

Change the commit message in your editor, and close and save the file. That's it!

In any case, after amending the most recent commit, you'll have a log that looks something like this:

```
* 7598875 - (HEAD -> master) Add .gitignore (31 seconds ago) <AleksandrHovhannisyan>
* 893d18d - Add README (79 seconds ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (79 seconds ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (80 seconds ago) <AleksandrHovhannisyan>
```

Now, suppose you had already pushed the old commit to your remote branch before amending it. If you run `git status`, you'll be told that your local branch and the remote branch have diverged by one commit:

```
On branch master
Your branch and 'origin/master' have diverged,
and have 1 and 1 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)
```

That makes sense—your remote branch has the old commit, and your local branch has the amended one. Their hashes are different since amending a commit changes its timestamp, which forces git to compute a new hash. To update your remote branch with the new commit, all you need to do is force push it: `git push -f`. This will overwrite your remote branch's history with your local one.

### Be Careful with Force Pushes

Don't worry about doing force pushes to feature branches, or personal branches in general. You should only be concerned about doing so on shared branches (e.g., `master`) that your team members are always branching off of to create new features. Your local branch is *yours*, and if you rewrite its commit history since the beginning of your iteration of work, you won't really break anything. The absolute "worst" case is if someone checks out your feature branch locally to test it (e.g., for a code review), and their local copy of your feature branch gets out of sync with the real one. But that's easy to fix.

In this toy example, we force-pushed to `master`, but we're the only ones touching this sandbox repo, so there's no issue whatsoever. In the real world, you should never force-push to public branches; if you do this, everyone's local copy of `master` will have diverged from the remote one, and any new features that are based on the old `master` will now have an incompatible commit history.

## 2. Resetting a Branch to an Older Commit

As a reminder, we have this commit history so far:

```
* 7598875 - (HEAD -> master) Add .gitignore (31 seconds ago) <AleksandrHovhannisyan>
* 893d18d - Add README (79 seconds ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (79 seconds ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (80 seconds ago) <AleksandrHovhannisyan>
```

Let's add one more commit directly to `master`:

{% include codeHeader.html %}
```bash
touch file && git add . && git commit -m "Add a file"
```

So now we have this commit history:

```
* b494f6f - (HEAD -> master) Add a file (5 seconds ago) <AleksandrHovhannisyan>
* 7598875 - Add .gitignore (3 minutes ago) <AleksandrHovhannisyan>
* 893d18d - Add README (4 minutes ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (4 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (4 minutes ago) <AleksandrHovhannisyan>
```

A few minutes later, for one reason or another, you decide that you don't actually want to keep the most recent commit. To delete it, you can just do a hard reset to one commit before the `HEAD` pointer, which is always pointing to the latest commit on the current branch:

{% include codeHeader.html %}
```bash
git reset --hard HEAD~1
```

The tilde character (`~`) followed by a number tells git how many commits it should backtrack from a given commit (in this case, the `HEAD` pointer). Since `HEAD` always points to the most recent commit on the current branch, this tells git to do a hard reset to the commit *right before* the most recent one.

Output:

```
HEAD is now at 7598875 Add .gitignore
```

Hard resetting is a handy way to undo changes in git, but do note that this is a destructive process—all changes in that commit will be lost. The only way to get them back is through the magic of `git reflog` ([more on that later](#6-using-git-reflog)).

You can also reset to the `HEAD~n`th commit, in which case all work *at and after that commit* will be lost:

{% include codeHeader.html %}
```bash
git reset --hard HEAD~4
```

Or even to a specific commit, if you have its hash:

{% include codeHeader.html %}
```bash
git reset --hard <hash-id>
```

You're also not limited to just resetting against commits in the current branch...

For example, you can reset a local branch to point to another local branch:

{% include codeHeader.html %}
```
git reset --hard <someOtherBranch>
```

Or even to a remote branch:

{% include codeHeader.html %}
```bash
git reset --hard origin/master
```

That last one's useful if, for example, you ever accidentally commit things to your local `master` branch. Let's say you were supposed to start working on a `feat/X` branch, but you forgot to actually create it, and you've really been committing things to your local `master` all along.

Sure, you can use `git cherry-pick` to fix this, but what if you have tens or hundreds of commits? That's kind of painful. Resetting makes this a piece of cake.

To fix this, you'd create the feature branch now (off of `master`, which has the commits you want):

{% include codeHeader.html %}
```bash
git checkout -b feat/X
```

And forcibly reset your local `master` branch to your remote `master`:

{% include codeHeader.html %}
```bash
git checkout master && git reset --hard origin/master
```

And don't forget to go back to your feature branch so you don't repeat the same mistake:

{% include codeHeader.html %}
```bash
git checkout feat/X
```

### Soft-Resetting a Branch

As I mentioned above, if you do a hard reset, you'll lose any work that you did at or past that commit. You can recover from that state, sure, but that's one extra step. If instead you want to keep your changes in git's staging environment, you can do a soft reset:

{% include codeHeader.html %}
```bash
git reset --soft HEAD~1
```

And again, you can just use a commit hash instead of backtracking from the `HEAD` pointer:

{% include codeHeader.html %}
```bash
git reset --soft a80951b
```

All of the changes introduced by that commit, and any commits that came after it, will appear in git's staging environment. Here, you can unstage files using `git reset HEAD file(s)`, make any changes that you need to the already staged files, and so on. Then, you can make any new commits that you need.

**Use case**: You commit File A and File B as part of one commit but later realize that they should've actually been part of two separate commits. You can do a soft reset and selectively commit one file and then proceed with committing the other separately, all without losing any of your work.

### Creating a Backup Branch

You're probably already comfortable with branching for new iterations of work. But don't forget that you can also use branching as a backup mechanism, in case you know you're about to run a command (like `git reset --hard`) that may mess up your branch's commit history. Before you run those commands, you can simply create a temporary backup branch (e.g., `git branch backup`). If anything goes wrong, you can always do a hard reset against your backup branch:

{% include codeHeader.html %}
```bash
git reset --hard backup
```

As an alternative, you can just [dig through git's reflog](#6-using-git-reflog) and undo your changes. We'll learn about that at the end of this tutorial. But it never hurts to create a backup branch for safe measure.

## 3. Interactive Rebases

This is where things get interesting.

Git's **interactive rebase** is one of its most powerful and versatile commands, allowing you to rewind history and make any changes you need. If you've ever wanted to delete an old commit, change an old commit's message, or squash an old commit into another, then this is the tool for you.

All interactive rebases start with the `git rebase -i` command and must specify a commit against which to rebase the current branch. This may be the tip of another branch or, more commonly, a commit somewhere in the current branch's history.

### Deleting Old Commits

So far, we have this commit history:

```
* 7598875 - (HEAD -> master) Add .gitignore (20 minutes ago) <AleksandrHovhannisyan>
* 893d18d - Add README (21 minutes ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (21 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (21 minutes ago) <AleksandrHovhannisyan>
```

That second commit looks a little suspicious... Why did we check our local environment variables (`.env`) into git? Oops. Clearly, we need to delete this commit while keeping all of the others around. To do that, we'll run an interactive rebase against that commit:

{% include codeHeader.html %}
```bash
git rebase -ir 2beb7c7^
```

That'll bring up this editor:

```bash
pick 2beb7c7 Add .env
pick 893d18d Add README
pick 7598875 Add .gitignore
```

To delete `2beb7c7`, change the `pick` command to `drop` (or just `d`) and leave the other ones untouched:

```
drop 2beb7c7 Add .env
pick 893d18d Add README
pick 7598875 Add .gitignore
```

Now close and save the file. You'll get this confirmation:

```bash
Successfully rebased and updated refs/heads/master.
```

And now, if you do a `git log`, you'll no longer see that commit:

```
* 11221d4 - (HEAD -> master) Add .gitignore (6 seconds ago) <AleksandrHovhannisyan>
* 9ed001a - Add README (6 seconds ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (50 minutes ago) <AleksandrHovhannisyan>
```

Note that any commit hashes after the deleted commit will be recomputed. So while the root commit remains untouched as `0beebfb`, all hashes after it changed. As we've seen a few times now, if you had pushed this branch to your repo earlier, the local and remote branches will now be out of sync. So you'll just need to do a force push to update the remote branch:

{% include codeHeader.html %}
```bash
git push -f
```

### Rewording Commit Messages

Let's continue working from where we left off, adding two more commits. We're in a rush, though, so we just throw together whatever commit messages come to mind rather than being descriptive:

```
* 094f8cb - (HEAD -> master) Do more stuff (1 second ago) <AleksandrHovhannisyan>
* 74dab36 - Do something idk (59 seconds ago) <AleksandrHovhannisyan>
* 11221d4 - Add .gitignore (3 minutes ago) <AleksandrHovhannisyan>
* 9ed001a - Add README (3 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (53 minutes ago) <AleksandrHovhannisyan>
```

Looking back at this, we'll want to reword those last two commit message since, truth be told, they suck.

As usual, we'll start with an interactive rebase. Here, we'll target the last two commits:

{% include codeHeader.html %}
```bash
git rebase -i HEAD~2
```

That'll open up your editor:

```bash
pick 74dab36 Do something idk
pick 094f8cb Do more stuff
```

Now, just replace `pick` with `r` (or `reword`) for any commit whose message you want to change:

```bash
reword 74dab36 Do something idk
reword 094f8cb Do more stuff
```

Close and save the file. For each commit that you want to reword, git will open up your editor as if you're amending that commit, allowing you to edit its message.

Maybe we do this for the first commit:

```bash
Update README with getting started instructions

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Oct 11 09:17:41 2020 -0400
#
# interactive rebase in progress; onto 11221d4
# Last command done (1 command done):
#    reword 74dab36 Do something idk
# Next command to do (1 remaining command):
#    reword 094f8cb Do more stuff
# You are currently editing a commit while rebasing branch 'master' on '11221d4'.
#
# Changes to be committed:
#       modified:   README.md
#
```

And this for the second:

```bash
Add name and author to package.json

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# interactive rebase in progress; onto 11221d4
# Last commands done (2 commands done):
#    reword 74dab36 Do something idk
#    reword 094f8cb Do more stuff
# No commands remaining.
# You are currently rebasing branch 'master' on '11221d4'.
#
# Changes to be committed:
#       modified:   package.json
#
```

You'll get this output confirmation:

```
[detached HEAD 665034d] Update README with getting started instructions
 Date: Sun Oct 11 09:17:41 2020 -0400
 1 file changed, 5 insertions(+)
[detached HEAD ba88fb0] Add name and author to package.json
 1 file changed, 4 insertions(+), 1 deletion(-)
Successfully rebased and updated refs/heads/master.
```

And now your commit history looks like this:

```
* ba88fb0 - (HEAD -> master) Add name and author to package.json (31 seconds ago) <AleksandrHovhannisyan>
* 665034d - Update README with getting started instructions (53 seconds ago) <AleksandrHovhannisyan>
* 11221d4 - Add .gitignore (6 minutes ago) <AleksandrHovhannisyan>
* 9ed001a - Add README (6 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (56 minutes ago) <AleksandrHovhannisyan>
```

### Editing Old Commits

Don't confuse this with `reword`ing old commit messages. To edit a commit means to go to the point in history right after that commit was made. This allows you to amend the commit and include (or remove) any changes you want.

So far, our commit history looks like this:

```
* ba88fb0 - (HEAD -> master) Add name and author to package.json (31 seconds ago) <AleksandrHovhannisyan>
* 665034d - Update README with getting started instructions (53 seconds ago) <AleksandrHovhannisyan>
* 11221d4 - Add .gitignore (6 minutes ago) <AleksandrHovhannisyan>
* 9ed001a - Add README (6 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (56 minutes ago) <AleksandrHovhannisyan>
```

Let's say we want to edit the root commit (`0beebfb`) and add a second file:

{% include codeHeader.html %}
```bash
touch .yarnrc
```

We'll start an interactive rebase against that commit. In this special case of editing the root commit, we'll need to use the `--root` option:

{% include codeHeader.html %}
```bash
git rebase -i --root
```

That'll open up our classic editor, showing the commits chronologically:

```
pick 0beebfb Add package.json
pick 9ed001a Add README
pick 11221d4 Add .gitignore
pick 665034d Update README with getting started instructions
pick ba88fb0 Add name and author to package.json
```

And all we need to do is replace `pick` with `edit` for the very first commit in that list:

```
edit 0beebfb Add package.json
pick 9ed001a Add README
pick 11221d4 Add .gitignore
pick 665034d Update README with getting started instructions
pick ba88fb0 Add name and author to package.json
```

Close and save the file. You should see this message from git:

```
Stopped at 0beebfb... Add package.json
You can amend the commit now, with

        git commit --amend

Once you are satisfied with your changes, run

        git rebase --continue
```

Neat! We'll now run these two commands:

{% include codeHeader.html %}
```bash
git add .yarnrc && git commit --amend
```

Now we just need to amend the commit. The editor should look like this:

```bash
Add package.json

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Oct 11 08:25:57 2020 -0400
#
# interactive rebase in progress; onto 666364d
# Last command done (1 command done):
#    edit 0beebfb Add package.json
# Next commands to do (4 remaining commands):
#    pick 9ed001a Add README
#    pick 11221d4 Add .gitignore
# You are currently editing a commit while rebasing branch 'master' on '666364d'.
#
#
# Initial commit
#
# Changes to be committed:
#       new file:   .yarnrc
#       new file:   package.json
#
```

Let's change that message to be `Initialize npm package` and save and exit. Now, per git's suggestion, we need to continue with the rebase:

{% include codeHeader.html %}
```bash
git rebase --continue
```

And that's it! Our commit history now looks like this:

```
* 436e421 - (HEAD -> master) Add name and author to package.json (6 seconds ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (6 seconds ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (6 seconds ago) <AleksandrHovhannisyan>
* 69c997b - Add README (6 seconds ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (56 seconds ago) <AleksandrHovhannisyan>
```

### Squashing

**Squashing** lets you combine `n` commits into one, making your commit history more compact. This is sometimes useful if a feature branch is introducing lots of commits, and you just want the feature to be represented as a single commit in your history (known as a **squash-and-rebase** workflow). The main downside is that you won't be able to revert or modify old commits if you ever need to in the future, which may not be desirable in some cases.

Again, for reference, we have this commit history:

```
* 436e421 - (HEAD -> master) Add name and author to package.json (6 seconds ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (6 seconds ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (6 seconds ago) <AleksandrHovhannisyan>
* 69c997b - Add README (6 seconds ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (56 seconds ago) <AleksandrHovhannisyan>
```

Let's create a toy feature branch and add some commits:

{% include codeHeader.html %}
```bash
git checkout -b feature && \
touch file1 && git add . && git commit -m "Add file1" && \
touch file2 && git add . && git commit -m "Add file2" && \
touch file3 && git add . && git commit -m "Add file3"
```

New commit history:

```
* 6afa3ac - (HEAD -> feature) Add file3 (4 seconds ago) <AleksandrHovhannisyan>
* c16cbc6 - Add file2 (4 seconds ago) <AleksandrHovhannisyan>
* 0832e96 - Add file1 (4 seconds ago) <AleksandrHovhannisyan>
* 436e421 - (master) Add name and author to package.json (12 minutes ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (12 minutes ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (12 minutes ago) <AleksandrHovhannisyan>
* 69c997b - Add README (12 minutes ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (12 minutes ago) <AleksandrHovhannisyan>
```

Assuming our pull request has been reviewed, we can squash all of these into one with the following command:

{% include codeHeader.html %}
```bash
git rebase -i master
```

This rebases our feature branch against the `master` branch. Note that `master` is a reference to a particular commit just like any other:

```
* 436e421 - (HEAD -> master) Add name and author to package.json (6 seconds ago) <AleksandrHovhannisyan>
```

So this is really the same as doing:

{% include codeHeader.html %}
```bash
git rebase -i 436e421
```

Anyway, once you run either of those commands, git will open up your classic editor:

```bash
pick 0832e96 Add file1
pick c16cbc6 Add file2
pick 6afa3ac Add file3
```

We'll squash the last two commits up into the first one, so let's change their `pick` commands to `squash`:

```bash
pick 0832e96 Add file1
squash c16cbc6 Add file2
squash 6afa3ac Add file3
```

Save and exit, and git will open this editor informing you that you're about to combine three commits:

```bash
# This is a combination of 3 commits.
# This is the 1st commit message:

Add file1

# This is the commit message #2:

Add file2

# This is the commit message #3:

Add file3

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sun Oct 11 09:37:05 2020 -0400
#
# interactive rebase in progress; onto 436e421
# Last commands done (3 commands done):
#    squash c16cbc6 Add file2
#    squash 6afa3ac Add file3
# No commands remaining.
# You are currently rebasing branch 'feature' on '436e421'.
#
# Changes to be committed:
#       new file:   file1
#       new file:   file2
#       new file:   file3
#
```

You can now change `Add file1` to be `Add files 1, 2, and 3`, for example, or whatever other commit message you want. Save and close the file, and now your commit history is nice and compact:

```
* b646cf6 - (HEAD -> feature) Add files 1, 2, and 3 (70 seconds ago) <AleksandrHovhannisyan>
* 436e421 - (master) Add name and author to package.json (14 minutes ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (14 minutes ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (14 minutes ago) <AleksandrHovhannisyan>
* 69c997b - Add README (14 minutes ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (15 minutes ago) <AleksandrHovhannisyan>
```

**Fun fact**: If you're worried about losing all the hard work you put into creating your commit messages along the way, don't be. Those other two commit messages will still be visible whenever you view the squashed commit on GitHub, so it still tells a story. Basically, it's just a multi-line commit message:

{% include img.html img="squashed-commit.png" alt="Viewing a squashed commit on GitHub, with three commit messages visible in total." %}

## 4. Reverting Commits

We've already learned two ways that we can remove commits from our history in git:

1. Soft- or hard-resetting the `HEAD` pointer to a commit before the range of commits we want to delete.
2. Performing an interactive rebase and changing `pick` to `drop` for any commits we don't want to keep.

Unfortunately, as we've seen, both of these will **rewrite your commit history**. Take the example of removing the `.env` file from our `master` branch with an interactive rebase. If we were to do that in the real world, on a shared branch like master, deleting the commit would make quite a mess of things. For starters, everyone on our team would have to hard-reset their local `master` branches to match `origin/master`.

Easy enough, right? Sure, but the problem arises if there's any work in progress on people's feature branches, especially if they had branched off of the old master—**where the file you deleted still exists**. See where this is going? A rebase won't work because it may actually reintroduce the file that was deleted on `master`; you can try this out locally to see what I mean. Similarly, a merge of `master` into your feature branch won't work because there's no common history for git to resolve:

```
fatal: refusing to merge unrelated histories
```

Yikes.

That's precisely why `git revert` exists. Unlike deleting commits via rebases or hard/soft resets, the revert command creates a new commit to undo any changes introduced by the target commit:

{% include codeHeader.html %}
```bash
git revert <hash-id>
```

Let's say we're on our `master` branch and want to revert the commit with a hash of `beb7c13`:

```
* 436e421 - (HEAD -> master) Add name and author to package.json (8 hours ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (8 hours ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (8 hours ago) <AleksandrHovhannisyan>
* 69c997b - Add README (8 hours ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (8 hours ago) <AleksandrHovhannisyan>
```

To do that, we'd run:

{% include codeHeader.html %}
```bash
git revert beb7c13
```

Git will open up this editor:

```bash
Revert "Update README with getting started instructions"

This reverts commit beb7c132882ff1e3214dbd380514559fed0ef38f.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# Changes to be committed:
#       modified:   README.md
#
```

You can change the message if you'd like to, but it's usually best to leave it as-is to make it clear what happened. Save and close the file, and run a `git log` to see this history:

```
* e1e6e06 - (HEAD -> master) Revert "Update README with getting started instructions" (58 seconds ago) <AleksandrHovhannisyan>
* 436e421 - Add name and author to package.json (8 hours ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (8 hours ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (8 hours ago) <AleksandrHovhannisyan>
* 69c997b - Add README (8 hours ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (8 hours ago) <AleksandrHovhannisyan>
```

Notice that the original commit is still there in our history, with its hash preserved. The only thing that changed is we added a new commit to the tip of the branch that reverts the changes introduced by that earlier commit. By analogy, it's like if we had gone into the file and manually removed the changes we had originally introduced. Obviously, running `git revert` is saner than doing this by hand.

So, reverting a commit is noisier than an interactive rebase or reset because it introduces one extra commit. But that's not really a big deal. And, on the plus side, it doesn't end up breaking public branches.

Of course, if you need to remove sensitive information that was accidentally committed to your repository, reverting it won't be enough—people will still be able to check out the earlier commit and view the files you "removed." Keep this in mind in case you ever run into a situation like that in the future.

## 5. Checking Out Files

The `git checkout` command is another basic way to undo changes in git. It serves three purposes:

- Creating new branches: `git checkout -b <newBranch>`.
- Switching to branches or commits: `git checkout <existingBranch>`.
- Restoring different versions of files.

We'll focus on the third use case here.

If you have unstaged changes to local files, you can easily undo those changes using the checkout command:

{% include codeHeader.html %}
```bash
git checkout <pathspec>
```

Here, `<pathspec>` can be any valid path specifier, like `.` for the current directory, `path/to/file`, `file.extension`, or even a regular expression.

This will clear all unstaged changes to the specified files and restore the current branch's **untouched version(s) of the file(s)**. It's worth emphasizing again that this command will not affect *staged* files—only unstaged changes will be cleared.

For example, if you want to clear *all* unstaged changes in the current directory and start from scratch, the easy way to do that is using the `git checkout` command with `.` as the pathspec:

{% include codeHeader.html %}
```bash
git checkout .
```

You can also use `git checkout` to restore local or remote versions of a file. For example, you can check out your remote master's copy of a file:

{% include codeHeader.html %}
```bash
git checkout origin/master -- <pathspec>
```

Let's say you need to undo your local changes to a particular file, but those changes span multiple commits that you can't easily revert because they include unrelated changes. So in that case, your best bet is to just check out the old (remote) version of the file.

Similarly, you can check out another local branch's copy of a file:

{% include codeHeader.html %}
```bash
git checkout localBranchName -- <pathspec>
```

## 6. Using Git Reflog

If you thought git's interactive rebase was cool, wait till you see `git reflog` in action.

You can think of reflog as git for git—a sort of internal record-keeping system, if you will. That may seem a bit meta, but it's actually really simple. From [git's documentation on reflog](https://git-scm.com/docs/git-reflog):

> Reference logs, or "reflogs", record when the tips of branches and other references were updated in the local repository. Reflogs are useful in various Git commands, to specify the old value of a reference.

Put differently, reflog captures a series of snapshots for the different states of the `HEAD` pointer over time. This means that any time a commit is introduced, deleted, or amended, or a new branch is checked out, or an old commit's hash is rewritten, those changes will be logged in `reflog`. Translation? You'll be able to travel back in time to undo potentially unwanted changes even if they were seemingly irreversible.

Viewing the reflog for a git repository couldn't be easier:

{% include codeHeader.html %}
```bash
git reflog
```

For example, if I'm on my `feature` branch, I can check out a new branch and git will log that activity:

{% include codeHeader.html %}
```bash
git checkout -b feature2
```

Reflog:

```
b646cf6 (HEAD -> feature2, origin/feature, feature) HEAD@{0}: checkout: moving from feature to feature2
```

This was logged because the `HEAD` pointer was redirected from the tip of the `feature` branch to the tip of the new branch, `feature2`.

We can also view **all of our changes from this tutorial** if we dig deeper in the reflog:

```
b646cf6 (HEAD -> feature2, origin/feature, feature) HEAD@{0}: checkout: moving from feature to feature2
b646cf6 (HEAD -> feature2, origin/feature, feature) HEAD@{1}: rebase -i (finish): returning to refs/heads/feature
b646cf6 (HEAD -> feature2, origin/feature, feature) HEAD@{2}: rebase -i (squash): Add files 1, 2, and 3
f3def0a HEAD@{3}: rebase -i (squash): # This is a combination of 2 commits.
0832e96 HEAD@{4}: rebase -i (start): checkout 436e421
6afa3ac HEAD@{5}: commit: Add file3
c16cbc6 HEAD@{6}: commit: Add file2
0832e96 HEAD@{7}: commit: Add file1
436e421 (master) HEAD@{8}: checkout: moving from master to feature
436e421 (master) HEAD@{9}: rebase -i (finish): returning to refs/heads/master
436e421 (master) HEAD@{10}: rebase -i (pick): Add name and author to package.json
beb7c13 HEAD@{11}: rebase -i (pick): Update README with getting started instructions
1c75f66 HEAD@{12}: rebase -i (pick): Add .gitignore
69c997b HEAD@{13}: rebase -i (pick): Add README
36210ec HEAD@{14}: commit (amend): Initialize npm package
04ba759 HEAD@{15}: rebase -i (edit): Add package.json
2bef9d4 HEAD@{16}: rebase -i (edit): Add package.json
666364d HEAD@{17}: rebase -i (start): checkout 666364da6703fc41e23515b1777de5ac84c8ad5e
ba88fb0 HEAD@{18}: rebase -i (finish): returning to refs/heads/master
ba88fb0 HEAD@{19}: rebase -i (reword): Add name and author to package.json
665034d HEAD@{20}: rebase -i (reword): Update README with getting started instructions
74dab36 HEAD@{21}: rebase -i: fast-forward
11221d4 HEAD@{22}: rebase -i (start): checkout HEAD~2
094f8cb HEAD@{23}: commit: Do more stuff
74dab36 HEAD@{24}: commit: Do something idk
11221d4 HEAD@{25}: rebase -i (finish): returning to refs/heads/master
11221d4 HEAD@{26}: rebase -i (pick): Add .gitignore
9ed001a HEAD@{27}: rebase -i (pick): Add README
0beebfb HEAD@{28}: rebase -i (start): checkout 2beb7c7^
7598875 HEAD@{29}: reset: moving to HEAD~1
b494f6f HEAD@{30}: commit: Add a file
7598875 HEAD@{31}: commit (amend): Add .gitignore
4753e23 HEAD@{32}: commit: Add .gitignore
893d18d HEAD@{33}: commit: Add README
2beb7c7 HEAD@{34}: commit: Add .env
0beebfb HEAD@{35}: commit (initial): Add package.json
```

This tells the story of your entire repo, showing all of the different commits that `HEAD` pointed to.

You can quickly peek at any of these states by checking out those commit hashes:

{% include codeHeader.html %}
```bash
git checkout <hash-id>
```

Or, better yet, you can **reset your branch to those points in history**. Check it out:

{% include codeHeader.html %}
```bash
git reset --soft 7598875
```

That soft-resets my current `feature2` branch to this history:

```
* 7598875 - (HEAD -> feature2) Add .gitignore (84 minutes ago) <AleksandrHovhannisyan>
* 893d18d - Add README (85 minutes ago) <AleksandrHovhannisyan>
* 2beb7c7 - Add .env (85 minutes ago) <AleksandrHovhannisyan>
* 0beebfb - Add package.json (85 minutes ago) <AleksandrHovhannisyan>
```

And I can even run another `reflog` to see *that* change!

```
7598875 (HEAD -> feature2) HEAD@{0}: reset: moving to 7598875
```

And, if *that* was undesirable, you can run *yet another* `reflog` and reset to the `HEAD` right before you took that action:

{% include codeHeader.html %}
```bash
git reset --hard b646cf6
```

Which takes us right back to where we were before:

```
* b646cf6 - (HEAD -> feature2, origin/feature, feature) Add files 1, 2, and 3 (13 minutes ago) <AleksandrHovhannisyan>
* 436e421 - (master) Add name and author to package.json (26 minutes ago) <AleksandrHovhannisyan>
* beb7c13 - Update README with getting started instructions (26 minutes ago) <AleksandrHovhannisyan>
* 1c75f66 - Add .gitignore (26 minutes ago) <AleksandrHovhannisyan>
* 69c997b - Add README (26 minutes ago) <AleksandrHovhannisyan>
* 36210ec - Initialize npm package (27 minutes ago) <AleksandrHovhannisyan>
```

Git's `reflog` command is useful in case you ever do a hard reset and lose all of your precious work. Don't panic! Just review your reflog and reset to the point *before* you did the hard reset. Good as new!

Finally, if for whatever reason you want to clean up your `reflog`, you can delete lines from it using:

{% include codeHeader.html %}
```bash
git reflog delete HEAD@{n}
```

Replacing `n` with whatever line you want to delete from the reflog. `HEAD@{0}` refers to the most recent line in the `reflog`, `HEAD@{1}` refers to the one before that, and so on.

{:.no_toc}
## Wrap Up

There you have it! You now know five powerful ways to undo changes in git. It's not so scary after all! My personal favorite command is `reflog`—it's extremely versatile and can help you get out of sticky situations, if you ever find yourself in trouble.

When in doubt, don't be afraid to ask others for help. There's also a wealth of information online about git, so you're bound to find a question on StackOverflow that's relevant to your needs.

{:.no_toc}
## Attributions

> The git logo used in this article's thumbnail was created by [Jason Long](https://git-scm.com/downloads/logos), licensed under the Creative Commons Attribution 3.0 Unported License.

