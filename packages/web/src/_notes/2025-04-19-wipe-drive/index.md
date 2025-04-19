---
title: How to Wipe a Drive Without Removing It
description: Safely wipe a drive using a bootable USB and diskpart.
---

Recently, I installed Windows 11 on a new SSD, but then I found a cheaper disk with comparable read and write speeds, so I decided to return the more expensive drive. But before I could do that, I needed to completely wipe it.

{% aside %}
If instead you bought a new laptop from a retailer and want to return it, use [Windows's built-in reset utility](ms-settings:recovery).
{% endaside %}

The safest way to do this is to use your disk manufacturer's firmware. For example, you can download [Western Digital Dashboard](https://support-en.wd.com/app/answers/detailweb/a_id/31759/~/download%2C-install%2C-test-drive-and-update-firmware-using-western-digital) to clean Western Digital disks. Unfortunately, this didn't work in my case as the software couldn't detect my USB. So here's the alternative method that I followed:

1. Grab a USB drive. You shouldn't need any more than 16 GB of space. Note that you'll lose all data on it, so back it up if it's not already formatted.
2. Turn it into a bootable USB drive. I opted to [create Windows 11 installation media](https://www.microsoft.com/software-download/windows11), but you could also install a Linux distribution and use [the `nvme-cli` package](https://github.com/linux-nvme/nvme-cli) instead of `diskpart`. (See [this answer on the Ubuntu StackExchange forum](https://askubuntu.com/a/1310876)).
3. Fully power down the machine. With the USB drive still inserted, power it back up.
4. Immediately on startup, use your manufacturer's hotkey to access BIOS (usually one of the function keys, like <kbd>F2</kbd> or <kbd>F10</kbd>).
5. Under BIOS, choose to boot from the USB drive you just created. This will start the Windows installation process, but we're not going to follow it for our purposes.
6. On any screen, press <kbd>Shift+Fn+F10</kbd> to open a command prompt window.
7. Type `diskpart` to start Windows's built-in [disk partitioning utility](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/diskpart).
8. Run `list disk` to list all mounted disks. You should see output like this:

```
DISKPART> list disk

  Disk ###  Status         Size     Free     Dyn  Gpt
  --------  -------------  -------  -------  ---  ---
  Disk 0    Online          931 GB  1024 KB        *
```

9. Run `select disk n` to select disk `n` (e.g., `select disk 0` for Disk 0).
10. Run `clean all` to zero out the selected disk. This could take anywhere from 30 minutes to several hours, depending on the size and speed of your disk.
11. Run `list disk` to verify that it worked.
12. Power down the machine. You can now either remove the drive and return it or reinstall an operating system.
