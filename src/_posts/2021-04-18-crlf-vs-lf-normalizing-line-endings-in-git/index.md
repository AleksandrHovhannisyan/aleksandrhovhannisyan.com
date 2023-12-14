---
title: "CRLF vs. LF: Normalizing Line Endings in Git"
description: Line endings can differ from one OS to another. Learn the history behind CRLF and LF line endings and how to enforce line endings in Git.
keywords: [line endings, git, gitattributes, carriage return, line feed, crlf vs lf]
categories: [git, operating-systems, tooling]
commentsId: 79
isFeatured: true
lastUpdated: 2022-07-23
thumbnail:
  url: https://images.unsplash.com/photo-1583913836387-ab656f4e0457?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

If you've ever worked on a project where developers use different operating systems, you know that line endings can be a peculiar source of frustration. This issue of CRLF vs. LF line endings is actually fairly popular—you'll find tons of questions on StackOverflow about how to configure software like Git to play nicely with different operating systems.

The typical advice is to configure your local Git to handle line ending conversions for you. For the sake of comprehensiveness, we'll look at how that can be done in this article, but it isn't ideal if you're on a large team of developers. If just one person forgets to configure their line endings correctly, you'll need to re-normalize your line endings and recommit your files every time a change is made.

A better solution is to add a `.gitattributes` file to your repo so you can enforce line endings consistently in your codebase regardless of what operating systems your developers are using. Before we look at how that's done, we'll briefly review the history behind line endings on Windows and Unix so we can understand why this issue exists in the first place.

History can be boring, though, so if you stumbled upon this post after hours of frustrated research, you can skip straight to [A Simple `.gitattributes` Config](#a-simple-gitattributes-config) and grab the code. However, I do encourage reading the full post to understand how these things work under the hood—you'll (hopefully) never have to Google line endings again!

{% include "toc.md" %}

## What Are Line Endings?

To *really* understand this problem of CRLF vs. LF line endings, we need to brush up on a bit of typesetting history.

People use letters, numbers, and symbols to communicate with one another. It's how you're reading this post right now! But computers can only understand and work with *numbers*. Since the files on your computer consist of strings of human-readable characters, we need a system that allows us to convert back and forth between these two formats. The [Unicode standard](https://en.wikipedia.org/wiki/Unicode) is that system—it maps characters like `A` and `z` to numbers, bridging the gap between human languages and the language of computers.

Notably, the Unicode standard isn't just for *visible* characters like letters and numbers. A certain subset are **control characters**, also known as **non-printing characters**. They aren't used to render visible characters; rather, they're used to perform unique actions, like deleting the previous character or inserting a newline.

`LF` and `CR` are two such control characters, and they're both related to line endings in files. Their history dates back to the era of the typewriter, so we'll briefly look at how that works so you understand why we have two different control characters rather than just one. Then, we'll look at how this affects the typical developer experience on a multi-OS codebase.

### `LF`: Line Feed

**LF** stands for "line feed," but you're probably more familiar with the term **newline** (the escape sequence `\n`). Simply put, this character represents the end of a line of text. On Linux and Mac, this is equivalent to the start of a new line of text. That distinction is important because Windows does not follow this convention. We'll discuss why once we learn about carriage returns.

### `CR`: Carriage Return

**CR** (the escape sequence `\r`) stands for **carriage return**, which moves the cursor to the start of the current line. For example, if you've ever seen a download progress bar on your terminal, this is how it works its magic. By using the carriage return, your terminal can animate text in place by returning the cursor to the start of the current line and overwriting any existing text.

You may be wondering where the need for such a character originated (beyond just animating text, which happens to be a niche application). It's a good question—and the answer will help us better understand why Windows uses `CRLF`.

#### Typewriters and the Carriage Return

Back when dinosaurs roamed the earth, people used to lug around these chunky devices called *typewriters*.

{% include "postImage.html" src: "./images/typewriter.png", alt: "Top-down view of a typewriter, with paper fed into the carriage.", caption: "Photo credit: [Patrick Fore, Unsplash](https://unsplash.com/photos/59lC6TgZAbQ)" %}

You feed the device a sheet of paper fastened to a mechanical roll known as the **carriage**. With each keystroke, the typewriter prints letters using ink on your sheet of paper, shifting the carriage to the left to ensure that the next letter you type will appear to the right of the previous one. You can [watch a typewriter being used in action](https://www.youtube.com/watch?v=5sTHMXqD9kg) to get a better sense for how this works.

Of course, once you run out of space on the current line, you'll need to go down to the next line on your sheet of paper. This is done by rotating the carriage to move the paper up a certain distance relative to the typewriter's "pen." But you also need to reset your carriage so that the next character you type will be aligned to the left-hand margin of your paper. In other words, you need some way to *return* the carriage to its starting position. And that's precisely the job of the **carriage return**: a metal lever attached to the left side of the carriage that, when pushed, returns the carriage to its starting position.

{% aside %}
  **Fun Fact**: You may be familiar with the characteristic *ding* sound that a typewriter makes from movies or video games (thanks, *Dishonored*!). This is known as the margin bell, which is triggered as soon as your text approaches the very right margin to signal that you need to move on to the next line.
{% endaside %}

That's all good and well, but you're probably wondering how this is relevant in the world of computers, where carriages, levers, and all these contraptions seem obsolete. We're getting there!

#### Teletypewriters and the Birth of `CRLF`

Moving on to the early 20th century, we arrive at the **teletypewriter**, yet another device predating the modern computer. Basically, it works exactly the same way that a typewriter does, except instead of printing to a physical sheet of paper, it sends your message to a receiving party via a transmitter, either over a physical wire or radio waves.

Now we're digital! These devices needed to use both a line feed character (`LF`) and a carriage return character (`CR`) to allow you to type from the start of the next line of text. That's exactly how the original typewriter worked, except it didn't have any notion of "characters" because it was a mechanically operated device. With the teletype, this process is more or less automatic and triggered by a keystroke—you don't have to manually push some sort of "carriage" or move a sheet of paper up or down to achieve the same effect.

It's easier to visualize this if you think of `LF` and `CR` as representing independent movements in either the horizontal or vertical direction, but not both. By itself, a line feed moves you down vertically; a carriage return resets your "cursor" to the very start of the current line. We saw the physical analogue of `CR` and `LF` with typewriters—moving to the next line of text required rotating the carriage to move the sheet of paper up (line feed), and returning your "cursor" to the start of that new line required using a mechanical piece aptly named the *carriage return*.

Teletypes set the standard for `CRLF` line endings in some of the earliest operating systems, like the popular MS-DOS. Microsoft has an excellent article explaining the history of `CRLF` in teletypes and early operating systems. Here's a relevant snippet:

{% quote "Why is the line terminator CR+LF?", "https://devblogs.microsoft.com/oldnewthing/20040318-00/?p=40193" %}
  This protocol dates back to the days of teletypewriters. CR stands for "carriage return" – the CR control character returned the print head ("carriage") to column 0 without advancing the paper. LF stands for "linefeed" – the LF control character advanced the paper one line without moving the print head. So if you wanted to return the print head to column zero (ready to print the next line) and advance the paper (so it prints on fresh paper), you need both CR and LF.

  If you go to the various internet protocol documents, such as RFC 0821 (SMTP), RFC 1939 (POP), RFC 2060 (IMAP), or RFC 2616 (HTTP), you’ll see that they all specify CR+LF as the line termination sequence. So the the real question is not "Why do CP/M, MS-DOS, and Win32 use CR+LF as the line terminator?" but rather "Why did other people choose to differ from these standards documents and use some other line terminator?"
{% endquote %}

MS-DOS used the two-character combination of `CRLF` to denote line endings in files, and modern Windows computers continue to use `CRLF` as their line ending to this day. Meanwhile, from its very inception, [Unix used `LF` to denote line endings](https://unix.stackexchange.com/a/411830/311005), ditching `CRLF` for consistency and simplicity. Apple originally used only `CR` for Mac Classic but eventually switched to `LF` for OS X, consistent with Unix.

This makes it seem like Windows is the odd one out when it's *technically* not. Developers usually get frustrated with line endings on Windows because `CRLF` is seen as an artifact of older times, when you actually *needed* both a carriage return and a line feed to represent newlines on devices like teletypes.

It's easy to see why `CRLF` is redundant by today's standards—using both a carriage return and a line feed assumes that you're bound to the physical limitations of a typewriter, where you *had* to explicitly move your sheet of paper up and then reset the carriage to the left-hand margin. With a file, it suffices to define the newline character as implicitly doing the job of both a line feed and a carriage return under the hood. In other words, so long as your operating system defines the newline character to mean that the next line starts at the *beginning* and not at some arbitrary column offset, then we have no need for an explicit carriage return *in addition* to a line feed—one symbol can do the job of both.

While it may seem like a harmless difference between operating systems, this issue of CRLF vs. LF has been causing people headaches for a long time now. For example, basic Windows text editors like Notepad used to not be able to properly interpret `LF` alone as a true line ending. Thus, if you opened a file created on Linux or Mac with Notepad, the line endings would not get rendered correctly. Notepad was later [updated in 2018 to support `LF`](https://devblogs.microsoft.com/commandline/extended-eol-in-notepad/).

## Line Endings in Git

As you can probably imagine, the lack of a universal line ending presents a dilemma for software like Git, which relies on very precise character comparisons to determine if a file has changed since the last time it was checked in. If one developer uses Windows and another uses Mac or Linux, and they each save and commit the same files, they may see line ending changes in their Git diffs—a conversion from `CRLF` to `LF` or vice versa. This leads to unnecessary noise due to single-character changes and can be quite annoying.

For this reason, Git allows you to configure line endings in one of two ways: by changing your local Git settings or by adding a `.gitattributes` file to your project. We'll look at both approaches over the course of the next several sections.

### Line Ending Transformations Concern the Index

Before we look at any specifics, I want to clarify one detail: All end-of-line transformations in Git occur when moving files in and out of [the index](https://stackoverflow.com/questions/3689838/whats-the-difference-between-head-working-tree-and-index-in-git)—the temporary staging area that sits between your local files ([working tree](https://craftquest.io/articles/what-is-the-working-tree-in-git)) and the repository that later gets pushed to your remote. When you stage files for a commit, they enter the index and may be subject to line ending normalization (depending on your settings). Conversely, when you check out a branch or a set of files, you're moving files out of the index and into your working tree.

When normalization is enabled, line endings in your local and remote *repository* will always be set to `LF` and never `CRLF`. However, depending on some other settings, Git may silently check out files into the *working tree* as `CRLF`. Unlike the original problem described in this article, this will not pollute `git status` with actual line ending changes—it's mainly used to ensure that Windows developers can take advantage of `CRLF` locally while always committing `LF` to the repo.

We'll learn more about how all of this works in the next few sections.

### Configuring Line Endings in Git with `core.autocrlf`

As I mentioned in the intro, you can tell Git how you'd like it to handle line endings on your system with [the `core.autocrlf` setting](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf). While this isn't the ideal approach for configuring line endings in a project, it's still worth taking a brief look at how it works.

You can enable end-of-line normalization in your Git settings with the following command:

```
git config --global core.autocrlf [true|false|input]
```

You can also view the current Git setting using this command:

``` {data-copyable=true}
git config --list
```

By default, `core.autocrlf` is set to `false` on a fresh install of Git, meaning Git won't perform any line ending normalization. Instead, Git will defer to [the `core.eol` setting](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreeol) to decide what line endings should be used; `core.eol` defaults to `native`, which means it depends on the OS you're using. That's not ideal because it means that `CRLF` may make its way into your code base from Windows devs.

That leaves us with two options if we decide to configure Git locally: `core.autocrlf=true` and `core.autocrlf=input`. The line endings for these options are summarized below.

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Setting</th>
        <th scope="col">Repo (check-in)</th>
        <th scope="col">Working Tree (checkout)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>core.autocrlf=true</code></td>
        <td><code>LF</code></td>
        <td><code>CRLF</code></td>
      </tr>
      <tr>
        <td><code>core.autocrlf=input</code></td>
        <td><code>LF</code></td>
        <td>original (usually <code>LF</code>, or <code>CRLF</code> if you're viewing a file you created on Windows)</td>
      </tr>
    </tbody>
  </table>
</div>

Both of these options enable automatic line ending normalization for text files, with one minor difference: `core.autocrlf=true` converts files to `CRLF` on checkout from the repo to the working tree, while `core.autocrlf=input` leaves the working tree untouched.

For this reason, `core.autocrlf=true` tends to be recommended setting for Windows developers since it guarantees `LF` in the remote copy of your code while allowing you to use `CRLF` in your working tree for full compatibility with Windows editors and file formats.

### Normalizing Line Endings in Git with `.gitattributes`

You certainly *could* ask all your developers to configure their local Git. But this is tedious, and it can be confusing trying to recall what these options mean since their recommended usage depends on your operating system. If a developer installs a new environment or gets a new laptop, they'll need to remember to reconfigure Git. And if a Windows developer forgets to read your docs, or someone from another team commits to your repo, then you may start seeing line ending changes again.

Fortunately, there's a better solution: creating a `.gitattributes` file at the root of your repo to settle things once and for all. Git uses this config to apply certain attributes to your files whenever you check out or commit them. One popular use case of `.gitattributes` is to normalize line endings in a project. With this config-based approach, you can ensure that your line endings remain consistent in your codebase regardless of what operating systems or local Git settings your developers use since this file takes priority. You can learn more about the supported `.gitattributes` options in [the official Git docs](https://git-scm.com/docs/gitattributes).

#### A Simple `.gitattributes` Config

The following `.gitattributes` config normalizes line endings to `LF` for all text files checked into your repo while leaving local line endings untouched in the working tree:

```bash {data-file=".gitattributes" data-copyable=true}
* text=auto
```

Add the file to the root of your workspace, commit it, and push it to your repo.

Let's also understand how it works.

First, the wildcard selector (`*`) matches all files that aren't gitignored. These files become candidates for end-of-line normalization, subject to any attributes you've specified. In this case, we're using [the `text` attribute](https://git-scm.com/docs/gitattributes#_text), which normalizes all line endings to `LF` when checking files into your repo. However, it does not modify line endings in your *working tree*. This is essentially the same as setting `core.autocrlf=input` in your Git settings.

More specifically, [the `text=auto` option](https://git-scm.com/docs/gitattributes#Documentation/gitattributes.txt-Settostringvalueauto) tells Git to **only normalize line endings to `LF` for text files** while leaving binary files (images, fonts, etc.) untouched. This distinction is important—we don't want to corrupt binary files by modifying their line endings.

After committing the `.gitattributes` file, your changes won't take effect immediately for files checked into Git *prior* to the addition of `.gitattributes`. To force an update, you can use the following command [since Git 2.16](https://stackoverflow.com/a/50645024/5323344):

``` {data-copyable=true}
git add --renormalize .
```

This updates all tracked files in your repo according to the rules defined in your `.gitattributes` config. If previously committed text files used `CRLF` in your repo and are converted to `LF` during the renormalization process, those files will be staged for a commit. You can then check if any files were modified like you would normally:

``` {data-copyable=true}
git status
```

The only thing left to do is to commit those changes (if any) and push them to your repo. In the future, anytime a new file is checked into Git, it'll use `LF` for line endings.

#### Verifying Line Endings in Git for Any File

If you want to verify that the files in your repo are using the correct line endings after all of these steps, you can run the following command:

``` {data-copyable=true}
git ls-files --eol
```

Or only for a particular file:

```
git ls-files path/to/file --eol
```

For text files, you should see something like this:

```
i/lf    w/crlf  attr/text=auto  file.txt
```

From left to right, those are:

1. `i`: line endings in Git's **i**ndex (and, by extension, the repo). Should be `lf` for text files.
2. `w`: line endings in your **w**orking tree. May be either `lf` or `crlf` for text files.
3. `attr`: The attribute that applies to the file. In this example, that's `text=auto`.
4. The file name itself.

For binary files like images, note that you'll see `-text` for both the index and working tree line endings. This means that Git correctly isolated those binary files, leaving them untouched:

```
i/-text w/-text attr/text=auto  image.png
```

#### Git Line Endings: Working Tree vs. Index

You may see the following message when you stage files containing `CRLF` line endings locally (e.g., if you're on Windows and introduced a new file, or if you're not on Windows and renormalized the line endings for your codebase):

```
warning: CRLF will be replaced by LF in <file-name>.
The file will have its original line endings in your working directory.
```

**This is working as expected**—`CRLF` will be converted to `LF` when you commit your changes, meaning that when you push those files to your remote, they'll use `LF`. Anyone who later pulls or checks out that code will see `LF` line endings locally for those files.

But the `text` attribute doesn't change line endings for the **local copies** of your text files (i.e., the ones in Git's working tree)—it only changes line endings for files in the repo. Hence the second line of the message, which notes that the text files you just renormalized may still continue to use `CRLF` locally (on your file system) if that's the line ending with which they were originally created/cloned on your system. Rest assured that text files will never use `CRLF` in the *remote* copy of your code.

##### The `eol` Attribute: Controlling Line Endings in Git's Working Tree

Sometimes, you actually want files to be checked out locally on your system with `CRLF` while still retaining `LF` in your repo. Usually, this is for Windows-specific files that are very sensitive to line ending changes. Batch scripts are a common example since they need `CRLF` line endings to run properly. It's okay to store these files with `LF` line endings in your repo, so long as they later get checked out with the correct line endings on a Windows machine. You can find a more comprehensive list of files that need `CRLF` line endings in the following article: [`.gitattributes` Best Practices](https://rehansaeed.com/gitattributes-best-practices/#line-endings).

When we [configured our local Git settings](#configuring-line-endings-in-git-with-coreautocrlf), we saw that you can achieve this desired behavior with `core.autocrlf=true`. The `.gitattributes` equivalent of this is using [the `eol` attribute](https://git-scm.com/docs/gitattributes#_eol), which enables `LF` normalization for files checked into your repo but also allows you to control which line ending gets applied in Git's *working tree*:

1. [`eol=lf`](https://git-scm.com/docs/gitattributes#Documentation/gitattributes.txt-Settostringvaluelf): converts to `LF` on checkout.
2. [`eol=crlf`](https://git-scm.com/docs/gitattributes#Documentation/gitattributes.txt-Settostringvaluecrlf): converts to `CRLF` on checkout.

In the case of batch scripts, we'd use `eol=crlf`:

```bash {data-file=".gitattributes" data-copyable=true}
# All files are checked into the repo with LF
* text=auto

# These files are checked out using CRLF locally
*.bat eol=crlf
```

In this case, batch scripts will have two non-overlapping rules applied to them additively: `text=auto` and `eol=crlf`.

**This change won't take effect immediately**, so if you run `git ls-files --eol` after updating your `.gitattributes` file, you might still see `LF` line endings in the working tree. To update existing line endings in your working tree so they respect the `eol` attribute, you'll need to run the following set of commands [per this StackOverflow answer](https://stackoverflow.com/a/29888735/5323344):

``` {data-copyable=true}
git rm --cached -r .
git reset --hard
```

{% aside %}
  Since these commands do not alter line endings in your repo, you will not see any changes staged for a commit. Think of this as "silently" refreshing the line endings in your working tree.
{% endaside %}

You'll notice that this command differs from `git add --renormalize .`, which we previously used to update line endings in the local repo. Now, we're updating line endings in the *working tree* to reflect our `eol` preferences. If you now you run `git ls-files --eol`, you should see `i/lf w/crlf` for any files matching the specified pattern.

{% aside %}
  Under the hood, the `eol` attribute also implies `text` with no value, so it's the same as doing `*.bat text eol=crlf` in this example. [Prior to Git 2.10.0](https://github.com/git/git/blob/master/Documentation/RelNotes/2.10.0.txt#L248), there was a bug where `text=auto eol=crlf` implied `text eol=crlf`—that is, the auto-text-detection algorithm didn't work. This has now been fixed, so `text=auto` can safely be used with `eol`.
{% endaside %}

One final note: In the recommended `.gitattributes` file, we used `* text=auto` to mark all text files for end-of-line normalization to `LF` once they're staged in Git's index. We could've also done `* text=auto eol=lf`, although these two are not identical. Like I mentioned before, if you only use `* text=auto`, you may still see some `CRLF` line endings locally in your working tree; this is okay and is working as expected. If you don't want this, you can enforce `* text=auto eol=lf` instead. However, this is usually not necessary because the main concern is about what line endings make it into the index and your repo.

### Summary: Git Config vs. `.gitattributes`

There are some similarities between Git's local settings and the Git attributes we looked at. The table below lists each Git setting, its corresponding `.gitattributes` rule, and the line endings for text files in the index and working tree:

<div class="scroll-x">
  <table>
    <thead>
      <tr>
        <th scope="col">Git config</th>
        <th scope="col">.gitattributes</th>
        <th scope="col">Index/Repo</th>
        <th scope="col">Working Tree</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>core.autocrlf=true</code></td>
        <td class="nowrap"><code>* text=auto eol=crlf</code></td>
        <td><code>LF</code></td>
        <td><code>CRLF</code></td>
      </tr>
      <tr>
        <td><code>core.autocrlf=input</code></td>
        <td class="nowrap"><code>* text=auto</code></td>
        <td><code>LF</code></td>
        <td>original (<code>LF</code> or <code>CRLF</code>)</td>
      </tr>
    </tbody>
  </table>
</div>

## Bonus: Create an `.editorconfig` File

A `.gitattributes` file is technically all that you need to enforce the line endings in the remote copy of your code. However, as we just saw, you may still see `CRLF` line endings on Windows locally because `.gitattributes` doesn't tell Git to change the working copies of your files.

Again, this doesn't mean that Git's normalization process isn't working; it's just the expected behavior. However, this can get annoying if you're also linting your code with ESLint and Prettier, in which case they'll constantly throw errors and tell you to delete those extra `CR`s:

{% include "postImage.html" src: "./images/prettier.png", alt: "A user's mouse hovers over red squiggly lines in a file that's using CRLF line endings. A prettier warning tells the user to remove the carriage return character." %}

Fortunately, we can take things a step further with an `.editorconfig` file; this is an [editor-agnostic project](https://editorconfig.org/) that aims to create a standardized format for customizing the behavior of any given text editor. Lots of text editors (including VS Code) support and automatically read this file if it's present. You can put something like this in the root of your workspace:

``` {data-file=".editorconfig" data-copyable=true}
root = true

[*]
end_of_line = lf
```

In addition to a bunch of other settings, you can specify the line ending that should be used for any new files created through this text editor. That way, if you're on Windows using VS Code and you create a new file, you'll always see line endings as `LF` in your working tree. Linters are happy, and so is everyone on your team!

## Summary

That was a lot to take in, but hopefully you now have a better understanding of the whole CRLF vs. LF debate and why this causes so many problems for teams that use a mixture of Windows and other operating systems. Whereas Windows follows the original convention of a carriage return plus a line feed (`CRLF`) for line endings, operating systems like Linux and Mac use only the line feed (`LF`) character. The history of these two control characters dates back to the era of the typewriter. While this tends to cause problems with software like Git, you can specify settings at the repo level with a `.gitattributes` file to normalize your line endings regardless of what operating systems your developers are using. You can also optionally add an `.editorconfig` file to ensure that new files are always created with `LF` line endings, even on Windows.

{% include "unsplashAttribution.md" name: "Katrin Hauf", username: "trine", photoId: "jpkvklXwt98" %}
