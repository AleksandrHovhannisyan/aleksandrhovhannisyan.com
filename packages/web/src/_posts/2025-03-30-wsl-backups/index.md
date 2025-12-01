---
title: WSL Backup Guide
description: Back up your entire WSL distribution and import it on a different machine.
categories: [note, wsl, windows]
---

Windows Subsystem for Linux (WSL) is my preferred dev environment on Windows, and I back it up regularly just like I would any other file system. Here's a quick guide on how to do that.

## 1. Export a Distribution

For convenience, I like to use the following Batch script to back up my WSL distro. I put this on my external drive so I can just one-click run it whenever I connect the drive to my machine. It'll list all the available distros and ask you to pick one before running the export command.

```batch {data-copyable="true" data-file="wsl-backup.bat"}
@echo off
setlocal

REM List WSL distributions and prompt user to pick one
wsl.exe --list
set /p distribution="Your WSL distributions are listed above. Enter the name of the distribution to back up: "

REM Prompt the user for backup file name
set /p outputFile="Enter the path and name of your WSL export file (e.g., E:\wsl-backups\backup.tar): "

REM Confirm the action
set /p confirmation="Run command 'wsl.exe --export %distribution% %outputFile%'? (y/N): "

REM Confirm before running
if /i "%confirmation%"=="y" (
    wsl.exe --export %distribution% %outputFile%
) else (
    echo Operation cancelled.
)

endlocal
pause
```

## 2. Import a Distribution

To import a WSL distribution onto a new machine, I always reference this excellent guide by Jeremy Murrah: [Moving WSL from one machine to another](https://murrahjm.github.io/Exporting-WSL-data/). I'll summarize the steps below, but I encourage you to read the full guide for some cautionary notes and a more detailed breakdown. This example assumes you're using Ubuntu, so you'll need to adjust it accordingly if you aren't:

1. Download a Linux distribution so you can overwrite it later.
2. Install the distribution like you would normally. Verify that it works.
3. In a command prompt, run `wsl.exe --shutdown`.
4. Run `wsl.exe --unregister <distro-name>`, replacing `distro-name` with the name of the distribution you just installed. If you're not sure what the name is, run `wsl.exe --list`.
5. Run `wsl.exe --import <distro-name> %localappdata%\Packages\CanonicalGroupLimited.<ID>\Localstate path\to\wsl-backup.tar`.
6. Configure the default user for the distro so it doesn't launch as root: `ubuntu.exe config --default-user <your-wsl-username>`.
