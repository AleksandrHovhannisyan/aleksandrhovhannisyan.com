---
title: "What's the Difference Between Hard Links and Soft Links?"
description: One sticks around for good, while the other one rots. Here's a detailed look at the differences between hard links and soft links in Unix.
keywords: [hard links vs soft links]
categories: [unix, file-systems]
lastUpdated: 2021-08-14
thumbnail:
  url: https://images.unsplash.com/photo-1575845137119-f4eca85e0732?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

You may have heard the terms "hard link" and "soft link" used in the context of Unix and Unix-like operating systems. But do you know what they are and how you create them? In this post, we'll look at the differences between hard links and soft links and understand how to create them.

## Commands We'll Be Using

It helps to know these Unix commands, but if you don't, we'll look at how to use them:

- `touch` and `echo` (+ the output redirection operator `>`) for creating files
- `ls` for listing files in a directory (use `-a` to show all files)
- `cat` for printing the contents of a file
- `stat` for viewing information about a file
- `ln` for creating links (don't worry if you're not familiar with this)
- `readlink` for printing the value of a link (more on that later)

We'll use these to explore hard links and symbolic links in this blog post.

## But First... What Are File Links?

When we talk about files in English, we typically picture a folder, binder, or some other container that directly stores documents or information. But files in the *computer* sense are nothing more than named entries in a directory.

A file does not directly store or point to its data. Instead, a file points to an intermediate data structure in computer memory called an **inode**.

Each file is associated with an inode, and inodes are packed full of rich information about the file's data, including:

- File attributes:
    - size in bytes
    - user/group to which it belongs
    - date created
    - date last modified
    - read/write/execute permissions
- Pointers to blocks on the hard disk containing the raw data.

So you can think of a file system roughly as follows:

```
Directory --> File (Name) --> Inode --> Raw Data on disk
```

Now, in the simplest terms, **linking** is the process of "referencing" or pointing to an inode in memory. Thus, we say that a **link** is a pointer to an inode. When we create a file for the first time, the name that we assign it becomes the first link to its corresponding inode. Diagrammatically speaking, the link is the arrow between a file and its inode:

```
File (Name) --> Inode
```

Let's create a file with `echo Hello, links > file` and view information about its inode using the `stat` command:

{% include img.html src: "file.png", alt: "A bash terminal environment. The first command run reads: echo Hello, links > file. The next command reads ls, which shows a single result: the previously created file. The final command is stat file, which shows information about the file, including its inode number." %}

Observe the line that reads `Inode: 4785074605327413`. This is an **inode number**. Each inode has a unique numerical ID associated with it that's generated when the inode is created.

Here's the really interesting bit: *There can be multiple links to a single inode*. The **link count** of an inode tracks the number of files that are pointing to it. Above, we see that the inode associated with `file` has a link count of `1`. This makes sense if you think about it—if creating a file in turn creates an inode somewhere in memory that's associated with the file's data, then surely the inode's initial link count should be `1` and not `0`.

Keep an eye on that `1`—it'll change as we begin experimenting with soft links and hard links.

{% aside %}
  Have you ever heard that "deleting" a file in the traditional sense doesn't imply that the data is irretrievably lost? It's true! In technical terms, a file is considered to have been *truly* deleted when its link count reaches zero. At that point, the space the file occupied is marked as writeable. But until that data is overwritten, computer forensic specialists could potentially recover its contents. To really delete a file, you'd need to [write over it with zeroes](https://www.lifewire.com/what-is-the-write-zero-method-2626052).
{% endaside %}

{% aside %}
  Directories themselves are special kinds of files—a sort of catalog of files. As it turns out, the starting link count for a new directory is actually `2`, not `1`. This is because **`.`** (which you can observe using `ls -a`) is a reference to the current directory. Thus, there are two references to every new directory: The directory name itself, and then the link **`.`** within that directory. Confused? [Take a look at this answer](https://Unix.stackexchange.com/a/101516/311005).
{% endaside %}

## 1. What Are Symbolic Links?

A **symbolic link** (also known as a "soft link" or "symlink") is a file like any other, but its data is special. Whereas regular files can be created at will—initially empty or with some contents—symbolic links cannot be created out of thin air. Rather, to create a symbolic link, you must associate it with some other file. Thus, a symbolic link's raw data is actually the path (relative or absolute) to its target file.

To create a soft link on a Unix system, you use the `ln` (link) command and supply the `-s` flag (for "symbolic"), followed by the original file name and the name of the soft link, in that order:

{% include img.html src: "soft-link.png", alt: "A bash terminal environment. The user runs the ls command with the a and l flags; the output shows the single file created before. Of note is the fact that the file has a link count of 1. The user then runs the ln command to create a soft link named softLink, one word, pointing to that file. The user finally runs the ls command with the a and l flags, which now shows two results: the original file and softLink." %}

Now, let's run the stat command again on both files:

{% include img.html src: "stat-soft-link.png", alt: "A bash terminal environment. The user runs the stat command on two file names: file and softLink, one word. The output consists of several rows of information, such as the file name, the file size in bytes, the inode number, and the link count." %}

Observe the following:

- The original file (`file`) and the soft link (`softLink`) have different inode numbers. This means that they're actually two different files.
- The original file's link count didn't change. Again, this is because the soft link is an entirely new file that points to a different inode.
- The original file and the soft link have different file sizes. The original file's contents are `Hello, links` (`12` characters). Including the newline character from when we ran `echo`, this constitutes `13` bytes (hence `Size: 13`). As we mentioned above, a soft link's data is the path of the original file. In this case, it's just the string `file`, which has four characters and is therefore four bytes (hence `Size: 4`).

Let's also look at their contents using the `cat` command:

{% include img.html src: "cat-soft-link.png", alt: "A bash terminal environment; the cat command is run on two file names: file and softLink, one word. Both output the same contents previously entered: Hello, links." %}

Even though the symbolic link's underlying data is the *path* of the original file, running the cat command effectively *resolves* or *follows* the symbolic link and prints the contents of the original file: `Hello, links` instead of `file`. Naturally, this implies that if the original file's contents change, the result of running `cat softLink` will also change.

**Exercises**:
1. Change the contents of the original file. Note how its size changes, whereas the symbolic link's file size remains the same. However, both print the same text when `cat`-ed.
2. Create a file with a longer name. Then, create a symbolic link to that file. Can you determine what the size of the symbolic link will be in bytes?

### Symbolic Links to Files in a Different Directory

Let's see what happens if you create a soft link to a file that's not in the same directory:

{% include img.html src: "soft-link-from-another-dir.png", alt: "A bash terminal environment. The user runs the ln command with the s flag to create a soft link to a different directory. The user then outputs information about the soft link with the stat command. Of note is the file size in bytes." %}

This time, the symbolic link's file size is no longer `4` bytes. Rather, it's `10`: the length of the string `links/` (which is `6`) plus the length of the target file name itself (`4`).

### Symbolic Links and Link Rot

Because a symbolic link's data is the *path* to the original file, there are two natural consequences:

- If the original file is renamed or moved to a different directory, the soft link will "break."
- If the original file is deleted, the soft link will "break."

Here's an example showing what happens when we move the original file up one directory:

{% include img.html src: "moved-file.png", alt: "A bash terminal environment. The user first runs the ls command with the l flag to list the two previously created files named file and softLink, one word. The user then runs the mv command on the original file, moving it up one directory level. The user finally runs the stat command on both files. The output is the same as it was before for the soft link." %}

Notice these two lines in particular for the soft link:

```
File: softLink -> file
Size: 4
```

The symbolic link is unaware of the fact that we moved the original file! So what happens if we `cat` the two files?

{% include img.html src: "cat-link-rot.png", alt: "A bash terminal environment. The user runs the cat command on both the original file (one directory up) and the soft link in the current directory. Running cat on the original file outputs the following text: Hello, links. Running cat on the soft link throws an error: softLink: no such file or directory. Running the ls command with the l flag shows the same soft link as before, but now it's colored in red to indicate that it's a dangling reference to a nonexistent file." %}

While the original file's contents are printed just fine, the terminal hints that something is wrong. We can see this with the `ls` command—the soft link's name now appears in red to indicate that it's gone "bad." This is known formally as **link rot**.

Before we move on to discussing hard links, note that there's an additional command you can use: `readlink`. According to the [man page for readlink](https://linux.die.net/man/1/readlink), this command prints the value of the symbolic link, which we know to be the path of the target file. Let's run this on our rotten symlink:

{% include img.html src: "readlink.png", alt: "A bash terminal environment. The user runs the readLink command on the file named softLink, one word. This outputs a single line of text that reads: file." %}

And there's our problem! The symbolic link is still pointing to the original file name, in the same directory. But it no longer exists because we moved it up one directory level.

## 2. What Are Hard Links?

On the other hand, a **hard link** acts as an alias for the target file. It has the same file size and the same inode number but a different name. Creating a hard link for a target file will increment the link count for that file's inode. For these reasons, hard links are also known as **physical links**.

To create a hard link in Linux, we use the `ln` command and supply the `-P` flag (for "physical"):

{% include img.html src: "hard-link.png", alt: "A bash terminal environment. The user runs the ln command with the capital P flag, passing in the following two arguments in order: file and hardLink, one word. Theu ser then runs the ls command with the l flag, which shows three rows of files named as follows: file, hardLink, softLink. The user also runs the stat command on the original file and the newly created hard link." %}

Notice that both the original file and the hard link are `13` bytes in size, have the same inode number, have the same permissions, and have a link count of `2`. There are two links to the original file's inode: the original file itself, and the hard link we just created manually. In fact, notice that the results of `stat`-ing both the original file and the hard link are identical.

Unlike a soft link, a hard link will not rot if we change the original file's name or move it to a different directory because it points to that file's inode, whereas a soft link references the file's path. It also will not rot if we *delete* the original file. Here's an example of moving the file:

{% include img.html src: "hard-links-dont-rot.png", alt: "A bash terminal environment. The user runs the ls command with the l flag to show three lines of output: file, hardLink, and softLink. The user then runs the mv command, moving the original file up one directory level. The user finally runs the ls command followed by stat on both the hard link and the file just moved. The output remains identical for the hard link and the moved file." %}

Let's delete the target file and `cat` the hard link:

{% include img.html src: "deleting-file.png", alt: "The bash terminal environment prior to the one above, before the original file was moved to a different directory. The user runs the rm command on the original file, in the current directory, and then invokes the ls command with the l flag. The soft link is colored red to indicate that it rotted, but the hard link is intact. Running the stat command on the hard link outputs the same file information as before; running the cat command outputs the text: Hello, links." %}

Interesting...

If we think back to what "deleting" a file really means, this should make sense: A file is not truly deleted until its corresponding inode's link count reaches zero. In this case, creating a hard link for the file increments its inode's link count to `2`. When we delete the original file, the link count goes down to `1`. Only if we now delete the hard link will the file reach a link count of zero and disappear.

### Limitations of Hard Links

It's worth mentioning that [hard links have two limitations](http://blog.serverbuddies.com/hard-links-have-two-limitations/) that symbolic links do not:

- You cannot create a hard link to a directory, whereas you *can* create a symbolic link to a directory.
- You cannot create a hard link to a file that's on a different volume/disk partition.

It's a tradeoff: While symbolic links do not face these limitations, they are prone to rotting if the original file is renamed, moved, or deleted.

## Hard Links and Symbolic Links to Executable Files

So far, we've looked at creating hard links and soft links to plaintext files. More often, you'll be creating links to executables in Unix.

Recall from before that running `cat` on a soft link or hard link would essentially "follow" that link to the underlying file's inode and print its contents. This isn't behavior unique to the `cat` command, though. If we invoke any other command on a link, or we try to run it as an executable, it'll once again resolve itself to the referenced file.

If you take a look at `/usr/bin/`, you'll find many soft links to executables:

{% include img.html src: "executables.png", alt: "A bash terminal environment. The user runs the ls command on the directory named /usr/bin/. This outputs several rows of files for python2 and python3. Some are colored in green to indicate that they're the original files. Others are soft links colored in neon blue, with arrows pointing to the original green files." %}

You can also create a custom link:

{% include img.html src: "python-symlink.png", alt: "A bash terminal environment. The user runs the which command, supplying python3.6 as the argument. This outputs the path to the python3.6 executable: /usr/bin/python3.6. The user then supplies this as the argument to the ln command to create a soft link named myPy in the current directory. Finally, the user runs the myP file in the current directory; the Python interactive terminal starts up." %}

As expected, invoking the symlink invokes the underlying executable.

## Additional Exercises

Try these out on your end:

1. What do you expect will happen if you change the permissions of a hard link using `chmod`? What about changing the permissions of a soft link?
2. What happens if you create a hard link to a soft link?

## Further Reading

Soft links and hard links aren't as mysterious as they may seem at first—they just offer two similar (but notably different) ways to reference files on an operating system.

Here are some additional resources on hard links vs. soft links:

- [Hard vs Soft Links in Linux (Linux Links)](https://www.youtube.com/watch?v=4-vye3QFTFo)
- [Explaining Soft Link And Hard Link In Linux With Examples](https://www.ostechnix.com/explaining-soft-link-and-hard-link-in-linux-with-examples/)
- [What is the difference between a symbolic link and a hard link?](https://stackoverflow.com/questions/185899/what-is-the-difference-between-a-symbolic-link-and-a-hard-link)
- [Modern Operating Systems by Tanenbaum, Chapter 4.2.4](https://www.amazon.com/Modern-Operating-Systems-Andrew-Tanenbaum/dp/013359162X)
- [How to take advantage of symbolic links in Windows 10](https://www.techrepublic.com/article/how-to-take-advantage-of-symbolic-links-in-window-10/)

{% include unsplashAttribution.md name: "Sandy Millar", username: "sandym10", photoId: "OzyY3C8zVU8" %}
