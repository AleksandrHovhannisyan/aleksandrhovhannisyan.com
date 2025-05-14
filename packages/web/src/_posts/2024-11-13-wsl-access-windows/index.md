---
title: Access Windows Files from WSL
description: Move files between Windows and WSL using the wslpath command-line utility.
categories: [note, wsl, windows]
---

Windows Subsystem for Linux (WSL) has a built-in command-line utility named `wslpath` that takes a Windows path and formats it as a WSL path, allowing you to access Windows files from WSL. You can use this to move files between the two systems. I use this all the time on my machine to move media files into WSL, where I do the majority of my development work.

{% aside %}
**Warning**: Never try to do the opposite. Don't access the WSL file system through Windows via File Explorer or cmd/PowerShell, as doing so can corrupt WSL's ext4 file system.
{% endaside %}

## Code

```bash {data-copyable="true"}
wslpath "C:\users\username\path"
```

## Output

```
/mnt/c/users/username/path
```

## Example

Copy a file from the Windows file system to the WSL file system:

```bash
cp "$(wslpath "C:\users\username\path\file.txt")" ./file.txt
```

Or vice versa:

```bash
cp ./file.txt "$(wslpath "C:\users\username\path")"
```
