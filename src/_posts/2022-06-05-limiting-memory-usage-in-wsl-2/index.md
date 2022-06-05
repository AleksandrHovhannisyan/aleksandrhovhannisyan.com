---
title: Limiting Memory Usage in WSL 2
description: By default, WSL 2 may reserve a significant chunk of your host RAM. Thankfully, we can limit its memory usage with a .wslconfig file.
keywords: [wsl 2, memory, ram, memory usage]
categories: [linux, windows, wsl, memory]
---

If you've ever opened up Task Manager while WSL 2 was running on a Windows machine, you've probably noticed a process named `vmmem` hogging a sizable chunk of your memory and slowing down your machine.

{% include postImage.html src: "./images/vmmem.png", alt: "A Task Manager window showing the CPU, memory, and hard disk usage among various processes. The top process is Vmmem, with CPU usage of 29.5% and a whopping 5.1 GB memory used.", caption: "Slow down there, WSL..." %}

This special process represents all the resources consumed by your Linux VM while WSL is running. [According to Microsoft's documentation](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#configuration-setting-for-wslconfig), the amount of RAM that gets allocated to WSL depends on your Windows build number. On machines running build 20175 or higher, RAM is limited to either 50% of your total memory or 8GB, whichever happens to be smaller. On builds older than 20175, WSL could consume up to 80% of your host RAM. That's potentially a lot of RAM!

You can check how much memory and swap space are allocated to WSL using the `free` command from within a WSL distribution:

``` {data-copyable=true}
free -g
```

On my system, that shows the following output, where each number is in gibibytes:

```
              total        used        free      shared  buff/cache   available
Mem:              6           0           5           0           0           5
Swap:             2           0           2
```

Since I'm running a Windows 10 build that's older than 20175 at the time of this writing, my WSL reserves 80% of my host RAM (8 GB), which in this case is 6.4 GB (6 GiB).

Whatever the case may be, if your machine doesn't have enough memory to begin with, then you've probably seen some noticeable slowdowns due to WSL 2. Your machine may become sluggish as it struggles to run resource-hungry host processes like Google Chrome or your favorite IDE alongside VM processes.

{% aside %}
In older versions of WSL 2, this was *especially* bad because it wouldn't release memory to the host machine until WSL shut down completely, so long-running processes could continue to consume memory over time. This is no longer an issue now that [WSL 2 supports memory reclamation](https://devblogs.microsoft.com/commandline/memory-reclaim-in-the-windows-subsystem-for-linux-2/).
{% endaside %}

Fortunately, we can customize WSL 2 to limit the number of CPU cores, memory usage, swap space, and more. A big thanks to [Apostolos Tsakpinis](https://github.com/microsoft/WSL/issues/4166#issuecomment-526725261) for pointing out how this can be done. See the following GitHub issue for the full context: [WSL 2 consumes massive amounts of RAM and doesn't return it](https://github.com/microsoft/WSL/issues/4166).

{% include toc.md %}

## 1. Create `.wslconfig`

You can tell WSL 2 how much RAM, swap space, CPU cores, and other resources it should allocate by creating a special `.wslconfig` file under your Windows user profile directory (`C:\Users\YourUsername\.wslconfig`). On launch, WSL will read this file if it exists and configure itself accordingly.

There are two ways you can create this file:

1. Using WSL itself.
2. Using cmd/PowerShell/whatever in Windows.

If you go with the second option, you may run into a problem where [WSL does not respect `.wslconfig`](https://superuser.com/a/1697991/910187) due to the presence of BOM headers and, in some cases, CRLF line endings. If you use a Windows editor like Notepad, you may later need to reformat the `.wslconfig` file using the `dos2unix` command-line utility.

To make your life easier, I recommend creating and editing the file with WSL directly. You can do this using the [`wslpath` command](https://devblogs.microsoft.com/commandline/windows10v1803/#interoperability) that ships with WSL, as demonstrated below:

``` {data-copyable=true}
touch "$(wslpath "C:\Users\YourUsername\.wslconfig")"
```

Next, open up this file with your preferred Linux editor. For example, you could use VS Code, nano, vim, etc. Refer to the Microsoft docs on [configuration settings for `.wslconfig`](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#configuration-setting-for-wslconfig) if you need help with this step. Below is the config that I'm currently using for my machine since I don't have a lot of RAM to work with:

```bash {data-file="C:\Users\YourUsername\.wslconfig" data-copyable=true}
[wsl2]
memory=3GB
```

While this tutorial focuses on limiting memory usage, you can configure any other options that you want in this file; see the docs for the full list of available settings. Save and close the file when you're finished.

## 2. Restart WSL

You can either close out of WSL manually and wait a few seconds for it to fully shut down, or you could launch Command Prompt or PowerShell and run the following command to forcibly shut down all WSL distributions:

``` {data-copyable=true}
wsl --shutdown
```

Relaunch your WSL distribution when this command finishes executing.

## 3. Verify That WSL Respects `.wslconfig`

Finally, run the `free` command again to verify that WSL respects your specified resource limits:

```
              total        used        free      shared  buff/cache   available
Mem:              2           0           2           0           0           2
Swap:             1           0           1
```

You can also use any other Linux commands to check your resource usage, like `top` or `htop`.
