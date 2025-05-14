---
title: How to Import and Export WSL Distros
description: Back up your entire WSL distribution and import it on a different machine.
categories: [note, wsl, windows]
---

Windows Subsystem for Linux (WSL) is my preferred dev environment on Windows, and I back it up regularly just like I would any other file system, in case I accidentally bork it one day or need to get a new machine. Here's how you can do that.

## 1. Export a Distribution

Create the following Batch script. I put this on my external drive so I can just one-click run it whenever I connect the drive to my machine. That way I don't have to remember what commands I need to run.

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

`wsl.exe` is the Windows WSL executable; you can use it to start and stop—or, in this case, import and export—distributions. The script first lists all of your available distributions and then prompts you to pick one before proceeding with the backup.

## 2. Import a Distribution

To import a WSL distribution onto a new machine, I always reference this excellent guide by Jeremy Murrah: [Moving WSL from one machine to another](https://murrahjm.github.io/Exporting-WSL-data/). I'll summarize the steps below, but I encourage you to read the full guide for some cautionary notes and a more detailed breakdown. This example assumes you're using Ubuntu, so you'll need to adjust it accordingly if you aren't:

1. Download a Linux distribution so you can overwrite it later.
2. Install the distribution like you would normally. Verify that it works.
3. In a command prompt, run `wsl.exe --shutdown`.
4. Run `wsl.exe --unregister <distro-name>`, replacing `distro-name` with the name of the distribution you just installed. If you're not sure what the name is, run `wsl.exe --list`.
5. Run `wsl.exe --import <distro-name> %localappdata%\Packages\CanonicalGroupLimited.<ID>\Localstate path\to\wsl-backup.tar`.
6. Configure the default user for the distro so it doesn't launch as root: `ubuntu.exe config --default-user <your-wsl-username>`.