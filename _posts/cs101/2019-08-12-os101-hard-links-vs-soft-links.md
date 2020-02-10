---
title: "OS101: Hard Links vs. Soft Links"
description: What are hard links and soft links? One of them sticks around for good, while the other one rots. Here's an in-depth look at their differences.
keywords: [hard links vs soft links, what are hard links, what are soft links, what are file links]
tags: [cs101, operating-systems, file-systems]
---

You may have heard the terms "hard link" and "soft link" used in the context of operating systems such as Linux or Windows. What exactly are they? Let's find out!

{% include linkedHeading.html heading="File System Basics" level=2 %}

You can skip this section if you're familiar with the following terms:

- **File**: a named and persistent medium for storing information on a computer. We say it's persistent because it survives process termination, such as if you restart your computer. This is unlike data stored in, say, main memory.
- **Directory**: a special kind of *system* file storing metadata (information) about related files and directories. On GUI systems, directories are usually represented as "folders." However, there is no such notion of a "folder" in a file system—there are only files.

With that out of the way, let's take a look at what links are all about.

{% include linkedHeading.html heading="What Are File Links?" level=2 %}

**Linking** is the process of referencing an existing file from either its current directory or some other directory. Thus, we say that a **link** is just a reference to a file.

In the special case of creating a file for the very first time, *the link to the file is the file name itself.* By definition, that may seem a bit self-referential—it is, and for good reason.

> **Key takeaway**: Links are just references to files. Whenever we create a file, we create its first link (reference). In the case of creating a file for the first time, the link is the file name itself.

As you may have guessed, there can be multiple links to a single file. The **link count** of a file tracks the number of references to it.

Per the definitions above, each file must have a link count of at least 1 when it's first created. If that weren't the case, then we'd have a paradox: An existing file with zero references to it. After all, the current directory has a listing for the file, with a valid name, so surely that counts as a reference!

To prove this, let's create a simple file and then run `ls -a -l` to show all (`-a`) files in the current directory, along with information like their permissions, author, and link count:

{% include posts/picture.html img="initial-link" ext="JPG" alt="Creating a new file generates its first link." %}

The 1 circled in red is the file's link count. Notice that we didn't create any other "hidden" files in the directory when we created `test`. As mentioned above, when you first create a file, the link is just the file name itself. Keep an eye on that 1, though—it'll change as we begin experimenting with soft links and hard links.

> **Fun fact 1**: Have you ever heard that deleting a file does not necessarily mean that the data is irretrievably lost? It's true! In technical terms, a file is considered to have been **deleted** when its link count reaches zero. At that point, the space the file occupied is essentially marked as writeable. But until that data is overwritten, computer forensic specialists could potentially recover the contents. To really delete a file, you'd need to [write over it with zeroes](https://www.lifewire.com/what-is-the-write-zero-method-2626052).

> **Fun fact 2**: Remember when I said that directories are just files? Well, as it turns out, the starting link count for a new directory is actually 2, not 1. This is because **`.`** (which you can observe using `ls -a`) is a reference to the current directory. Thus, there are two references to every new directory: The directory name itself, and then the link **`.`** within that directory. Confused? [Take a look at this answer](https://unix.stackexchange.com/a/101516/311005).

### Before We Move On...

There's another flag for the `ls` command that we'll be using to investigate hard links and soft links. In order for you to understand the significance of the output, I'll introduce one more simple term:

An **[inode](https://en.wikipedia.org/wiki/Inode) (index node)** is a data structure used to store information about a file on a Unix system (e.g., on Linux). Don't confuse this with a directory. Whereas a directory is a file, an inode is a special data structure. An inode stores two things:

- The file's attributes (e.g., date created, last modified, permissions).
- Pointers to blocks of the hard disk that contain the file's actual data.

However, an inode does not itself store things like the file's name or its contents. In memory, there's an array of inodes for all currently open files.

The Udacity YouTube channel has an excellent short video [explaining the structure of an inode](https://www.youtube.com/watch?v=tMVj22EWg6A) in more detail. If you find yourself confused, feel free to check that out.

Each inode has a unique number that's assigned when the file is created. Let's inspect the inode number for the `test` file we created earlier. To do so, we'll add the `-i` flag (for "inode") to our `ls` command:

{% include posts/picture.html img="inode" ext="JPG" alt="Inspecting the inode number of a file using the ls command." %}

This will be important when we take a look at examples of hard links and soft links.

> **Note**: So far, we've looked at a link that's created by the file itself. Now, we'll look at two special types of links: soft links and hard links. These are links that we create based on an already-existing "target" file.

{% include linkedHeading.html heading="1. What Are Soft Links?" level=2 %}

You may be familiar with Windows shortcuts; these are sort of like soft links.

A **soft link** is a special file that stores the path of the target file. The soft link is a distinctly separate file, though, and has its own inode number. For these reasons, it's sometimes referred to as a **symbolic link**.

To create a soft link in Linux, we use the `ln` ("link") command and supply the `-s` flag (for "soft"), followed by the original file name and the name of the soft link:

{% include posts/picture.html img="soft-link" ext="JPG" alt="Creating a soft link for a file." %}

Observe the following interesting points:

- The original file (`test`) and the soft link (`testSoftLink`) have different inode numbers. Hence, they're different files. (They also have different permissions.)
- The original file's link count remained 1. This is because the soft link is merely symbolic, not a "true" link.
- The original file and the soft link have different file sizes. The original file's contents are `Hello, links` (12 characters). Including the end-of-file character, this constitutes 13 bytes (hence the 13 to the left of `test`'s date). As we mentioned above, a soft link contains the path to the original file. In this case, it's just the file name: `test`, which is 4 bytes (hence the 4 to the left of `testSoftLink`'s date).

Let's also look at their contents:

{% include posts/picture.html img="soft-link-contents" ext="JPG" alt="Displaying the contents of a soft link." %}

Even though the soft link technically contains the path of the original file, printing its contents will show us the *contents* of the original file. It follows that if the original file's contents change, the soft link's printed contents will also change!

> **Exercise 1**: Change the contents of the original file. Note how its file size changes, whereas the soft link's file size remains the same. However, both print the same text when `cat`-ed.

> **Exercise 2**: Create a file with a longer name. Then, create a soft link for that file. Can you determine what the size of the soft link will be in bytes?

### Soft Links and Link Rot

Because a soft link stores the *path* of the original file, there are two natural consequences:

- If the original file is renamed or moved, the soft link will "break."
- If the original file is deleted, the soft link will "break."

Here's an example showing what happens when we rename the original file:

{% include posts/picture.html img="link-rot" ext="JPG" alt="Link rot and soft links." %}

Notice how our terminal even changed the color of the soft link to red to indicate that it's gone "bad." This is known formally as **link rot**.

{% include linkedHeading.html heading="2. What Are Hard Links?" level=2 %}

On the other hand, a **hard link** acts as an alias for the target file. It has the same file size and the same inode number but a different name. Creating a hard link for a target file will increment that file's link count. For these reasons, hard links are also known as **physical links**.

To create a hard link in Linux, we use the `ln` command and supply the `-P` flag (for "physical"). Take a look:

{% include posts/picture.html img="hard-link" ext="JPG" alt="Creating a hard link." %}

Notice that both files are 13 bytes in size, have the same inode number, have the same permissions, and have a link count of 2. There are two links to the original file: the first one we created, and the hard link we just created manually.

Unlike a soft link, a hard link will not rot if we change the original file's name or move it to a different directory. It also will not rot if we *delete* the original file. Below is an example of the latter:

{% include posts/picture.html img="hard-links-dont-rot" ext="JPG" alt="Hard links don't rot when the original file is renamed or deleted." %}

> **Exercise**: Delete the original file, and `cat` the hard link. What do you expect to see?

If we think back to what "deleting" a file really means, this should make sense: A file is not truly deleted until its link count reaches zero. In this case, creating a hard link for the file increments our link count to 2. When we delete the original, the link count goes down to 1. Only if we now delete the hard link will the file truly "disappear" from our directory:

{% include posts/picture.html img="delete-hard-link" ext="JPG" alt="Deleting a hard link." %}

{% include linkedHeading.html heading="How to Create a File Link in Windows" level=2 %}

So far, we've been creating links using the `ln` command on Linux. How can we create links on Windows?

As it turns out, doing so is simply a matter of invoking the `mklink` command:

{% include posts/picture.html img="mklink" ext="JPG" alt="mklink command usage on Windows." %}

By now, the terms soft link and hard link should be familiar enough that the above output makes sense.

{% include linkedHeading.html heading="Additional Exercises" level=2 %}

1. What do you expect will happen if you change the permissions of a hard link using `chmod`? What about changing the permissions of a soft link?
2. Here's an interesting (and easy!) question: What happens if you create a hard link to a soft link? Try it out! Hint: Remember that hard links are simply aliases.

{% include linkedHeading.html heading="Further Reading" level=2 %}

Soft links and hard links aren't as mysterious as they may seem at first. If you're still feeling confused, feel free to re-read this as many times as you want. Go as slowly as you need to, and practice running those commands on your own terminal so you're more comfortable with them.

Here are some additional resources on file links:

- [Hard vs Soft Links in Linux (Linux Links)](https://www.youtube.com/watch?v=4-vye3QFTFo)
- [Explaining Soft Link And Hard Link In Linux With Examples](https://www.ostechnix.com/explaining-soft-link-and-hard-link-in-linux-with-examples/)
- [What is the difference between a symbolic link and a hard link?](https://stackoverflow.com/questions/185899/what-is-the-difference-between-a-symbolic-link-and-a-hard-link)
- [Modern Operating Systems by Tanenbaum, Chapter 4.2.4](https://www.amazon.com/Modern-Operating-Systems-Andrew-Tanenbaum/dp/013359162X)
- [How to take advantage of symbolic links in Windows 10](https://www.techrepublic.com/article/how-to-take-advantage-of-symbolic-links-in-window-10/)