---
title: My First DIY Laptop Upgrade
description: A post-mortem of my first attempt at upgrading a laptop.
categories: [hardware, repair]
keywords: [hp envy x360 m6-w103dx]
thumbnail: ./images/disassembled.jpg
---

For close to eight years now, I've been using the same old HP laptop for software development, casual browsing, and light gaming: an [HP Envy x360 (m6-w103dx)](https://support.hp.com/us-en/document/c04791387) with a 6th generation i5 processor, a 1 TB hard drive, and 8 GB of RAM. It's nothing to write home about, but it's also not the worst set of specs under the sun. However, a lot changes in the span of just eight years, especially under Moore's Law—in fact, low-end budget laptops from just a few years ago already have superior hardware and faster processors. Still, my laptop served me well over the years, so I can't complain too much.

However, lately it had begun to show signs of aging. For one, the hard drive was unbearably slow: Windows updates took hours to install, and boot times ranged anywhere from five to ten minutes. And with only 8 GB of RAM out of the box, my laptop struggled to run many of the resource-hungry apps that I use reguarly: Windows Subystem for Linux, Firefox, Slack, and others. In fact, looking back on it now, I'm surprised how it managed to run Android Studio with the mobile emulator when I was in school, not to mention game engines like Unity—those wolfish apps devour your RAM.

For some time, I'd already been debating upgrading to a new laptop, but I wasn't sure if I wanted to pull the trigger. Eventually, over the holidays, I caved and purchased a gaming laptop on sale (specifically, a Lenovo LOQ) to see if I'd like it enough to keep it. And I nearly did—all of the specs blew my old laptop out of the water. It handled everything: gaming, browsing, you name it. But after a few weeks of using this new laptop, I decided to return it. It just didn't feel right to give up on my old laptop so quickly just because it was convenient. Sure, my laptop was slow, but it wasn't dead—and yet I was already abandoning it like some piece of junk. I had too many good memories with this laptop, and it never let me down. But more importantly, it was still in good shape. Sure, there were cracks and scratches in some of the plastic casing here and there, but at least it worked. Also, thinking more practically, I didn't want to be part of the ongoing e-waste problem; ditching my old devices as soon as better ones came down the assembly line wouldn't be very sustainable and would set me up for bad spending habits in the future.

Instead, I decided to try something that I'd never done before: disassembling my machine and upgrading it. I figured if something were to go wrong during this process, then I could always just buy a new laptop as a backup plan. But if I succeeded in upgrading my laptop, then I would save money and walk away with a valuable life skill and a faster laptop that would hopefully last me a few more years. In short, I had nothing to lose by trying.

My goals were to:

1. Learn how to disassemble my laptop—an obvious prerequisite.
2. Replace the 1 TB HDD with a 1 TB SSD ([iFixit guide](https://www.ifixit.com/Guide/HP+Envy+x360+m6-w103dx+Hard+Drive+Replacement/127836)).
3. Upgrade the RAM from 8 GB to 16 GB ([iFixit guide](https://www.ifixit.com/Guide/HP+Envy+x360+m6-w103dx+Memory+(RAM)+Replacement/127837)).

## Disassembling the Laptop

Thankfully, opening the laptop was easier than I thought it would be, especially when following the two iFixit guides. All I needed was:

- A Philips #0 screwdriver for the 12 screws on the back.
- A thin, sharp tool to remove two of the rubber screw covers, and
- A plastic prying tool to remove the rubber feet and lift the keyboard.

I ended up using an old drivers license as a makeshift prying tool.

After I lifted the keyboard slightly, I had to disconnect three ribbon cables before I could fully detach the keyboard. Once that was done, I flipped the keyboard over and laid it on top of the display, which was magnetic and held the keyboard securely in place.

{% include "postImage.html", src: "./images/disassembled.jpg", alt: "Disassembled laptop with the motherboard, fan, drive, and other internal components exposed.", caption: "Note: I took this photo after the hard drive replacement, so what you see here is the final result. Pardon all the dust." %}

I had succeeded in disassembling the laptop, but the hardest parts were yet to come.

## Hard Drive Replacement

I decided to replace the hard drive first since it would give me an immediate return on investment: The hard drive was already failing and glacially slow, so it wouldn't make sense to start with a RAM upgrade first. Besides, the drive replacement was—at least in theory—the easiest task. By comparison, upgrading the RAM required unscrewing the whole motherboard and flipping it over on this model, so the hard drive replacement would help me familiarize myself with the laptop's internals and get comfortable before taking on more challenging repairs.

### Initial Attempt

My plan was to fully clone the old hard drive to a compatible SSD so I could just boot into it like nothing ever happened.

I [looked up my laptop on Crucial's website](https://www.crucial.com/compatible-upgrade-for/hp---compaq/envy-m6-w103dx-x360) and found that it was compatible with their MX500 SSD, so I ordered a [2.5-inch hard drive enclosure from Sabrent](https://www.amazon.com/Sabrent-Tool-free-Enclosure-Optimized-EC-UASP/dp/B00OJ3UJ2S) and the MX500 from Crucial (the latter took almost a month to ship, but it eventually arrived).

Following [Crucial's official guide on SSD installation](https://www.crucial.com/content/dam/crucial/ssd-products/ssd-family/documents/installation-guides/sata-2-5-install/crucial-ssd-install-guide-en.pdf), I then:

1. Inserted the MX500 SSD into the enclosure and connected it to my laptop via USB 3.0.
2. Installed [Acronis True Image](https://www.acronis.com/en-us/promotion/crucialhd-download/), Crucial's recommended cloning software.
3. Attempted to clone the internal HDD to the external SSD with Acronis.

{% include "postImage.html", src: "./images/acronis.png", baseFormat: "png", alt: "Acronis True Image for Crucial window. Tab: Tools. Cards are arranged in a grid layout. The first card, Clone Disk, is active. It reads: This utility helps you clone your operating system, applications, and data to a new disk. The new disk will be identical to your old one and the system bootability will be kept." %}

At first, things looked promising—Acronis detected both drives and began the cloning process. However, at some point, it ran into a disk read error and aborted the clone. According to my research at the time, this usually happens if the source disk is partially corrupt. I stubbornly chose to ignore this error, believing it to be a fluke—and what ensued was a week-long process of trial and error (more so the latter).

### Checking the Disk

After Acronis failed to clone my drive, I ran `chkdsk`, a command-line utility that ships with Windows. This tool can help identify corruption on disks and automatically repair them. After running in the diagnostic mode for about an hour, `chkdsk` reported that it had found 4 kB of bad sectors. I then ran the tool again, this time with the automatic repair flags enabled (`chkdsk /f /r`) to attempt to repair the corruption. After running for more than a day straight, it still wasn't able to fix anything.

{% aside %}
**Note**: You're apparently not supposed to run `chkdsk` on a failing drive, as doing so can cause even more corruption since it's a very read-intensive process. Oops.
{% endaside %}

### Macrium Reflect

So my hard drive was partially corrupt. *Great*.

But 4 kB is miniscule compared to the 1 TB drive capacity, and the corruption wasn't even detected in any of the critical partitions. I naively thought that I could work around this by using a different tool, so I instead tried the free trial of [Macrium Reflect](https://www.macrium.com/reflectfree).

This predictably ran into a similar problem that another user had reported here in the Macrium Reflect forums: [Clone failed - Error 0 - Read failed - 23 - Data error (cyclic redundancy check)](https://forum.macrium.com/72651/Clone-failed-Error-0-Read-failed-23-Data-error-cyclic-redundancy-check). In that thread, one of the responses notes the following:

> CRC (Cyclic Redundancy Check) errors are generally faults in the media being read.  It means there's something wrong with the device.

A bad disk was seeming more and more likely with all the mounting evidence...

Still, there was one more thing that I wanted to try before giving up. I was dead set on cloning the drive so I wouldn't have to start from scratch.

### Clonezilla

{% include "postImage.html", src: "./images/clonezilla.png", baseFormat: "png", alt: "Device to image or device to device clone in Clonezilla live. The user is presented with instructions and two options: 1. device-image (work with disks or partitions using images), or 2. device-device (work directly from a disk or partition to a disk or partition).", caption: "Source: [Clonezilla - Screenshots and Photos](https://clonezilla.org/screenshots/?in_path=/00_Clonezilla)" %}

After reading through some Reddit threads, I found that people who experienced similar read errors with Macrium and Acronis had better luck with [Clonezilla](https://clonezilla.org/), an open-source program for disk cloning and imaging. For some users, Clonezilla was apparently able to repair the bad sectors on the source disk during the cloning process.

For my third attempt, I installed Clonezilla on a flash drive and formatted it to be a bootable drive using [Rufus](https://rufus.ie/en/). I then power cycled and went straight into BIOS to boot into Clonezilla. I followed this YouTube tutorial to learn how to use these programs: [How To Image Any SSD / HDD With Clonezilla - Windows / Linux](https://www.youtube.com/watch?v=ci2VyorBjyQ).

Alas, I ran into the same issue with Clonezilla. Initially, the clone seemed to proceed smoothly, but then Clonezilla reported corruption in one of the disk partitions. I ignored those errors and told it to proceed with the remainder of the clone anyway (and later tried again with the automatic repair option). To my surprise, the cloned SSD actually matched the source disk in terms of the number of partitions and their sizes when I inspected it via the command line in Clonezilla.

Unfortunately, when I installed the SSD into the laptop, Windows failed to boot and went straight to a blue screen with error code `0x00000e` that read: "Recovery. Your PC/Device needs to be repaired." The screen listed these options:

1. <kbd>Enter</kbd> to try again
2. <kbd>F1</kbd> to boot into recovery mode
3. <kbd>F8</kbd> for startup settings
4. Something for BIOS
5. <kbd>ESC</kbd> for UEFI settings

I tried everything, to no avail. Not even power cycling 3–4 times worked (typically, this takes you into diagnostic mode). Annoyed, I disassembled the laptop again and double-checked that the ribbon connection to the drive was secure. I also verified in BIOS that the SSD was first in the boot order. I couldn't even get into a command prompt!

Without taking out the new SSD I just installed, I plugged in my old HDD via the same external enclosure and tried booting into it (apparently, you can't boot into a Windows drive off of USB, but I didn't know this at the time). And I got the same exact error, except this time I actually had some additional options and was able to power cycle into Windows diagnostics. From there, I went into command prompt and ran [`diskpart`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/diskpart) to inspect the two disks. It turned out that Clonezilla had written the SSD's primary partition in RAW format rather than NTFS—probably because of the corruption—which would explain why it failed to boot.

Finally, I was at the end of my wits. All of this could've been avoided had I simply trusted `chkdsk` and the myriad signs that pointed to a corrupt drive. In the end, I gave up cloning or imaging the old drive. And that only left one option.

### Fresh Windows Install

Thankfully, I had already backed up all my personal files to an external drive before all of this, so I still had one option left: reinstalling Windows on the new SSD and simply copying over my files.

{% include "postImage.html", src: "./images/installation-media.png", baseFormat: "png", alt: "Dialog window. Title bar: Windows 10 setup. Content: What do you want to do? Two radio buttons are presented: Upgrade this PC now (unchecked) and Create installation media (USB flash drive, DVD, or ISO file) for another PC, checked.", caption: "Windows installation media wizard" %}

As it turns out, this was by far the simplest solution. I followed the accepted answer in this Microsoft community forum post: [Install Windows on new ssd](https://answers.microsoft.com/en-us/windows/forum/all/install-windows-on-new-ssd/9186ae98-b2b4-4b7a-b3ff-0b053ce2d1c9). All I had to do was:

1. Insert my old HDD into the laptop.
2. [Download the Windows installation media](https://support.microsoft.com/en-us/windows/create-installation-media-for-windows-99a58364-8c02-206f-aa6f-40c3b507420d) from Microsoft.
3. Run the program to create a bootable USB.
4. Swap out the HDD for the new SSD and insert the bootable installation media.
5. Power cycle and boot into the Windows installation media from BIOS.
6. Reinstall Windows to the SSD.

{% aside %}
Looking back on all my fussing around with cloning software, I can't help but wonder why I was so determined to get it to work when a simpler alternative was right there in front of me. I guess the programmer in me just wanted to exhaust all debugging options before declaring defeat.
{% endaside %}

Not only did this work without a hitch, but it was much faster than all the other options I had tried up until this point. After reinstalling Windows, all I had to do was:

1. Customize my Windows preferences and settings,
2. Reinstall missing firmware, and
3. Copy over my personal files.

I also ended up saving about 300 GB of storage with this option, as there were many apps and files on my old drive that I didn't really need after all.

## Memory Upgrade

After successfully upgrading my laptop to an SSD—and disassembling it several times in the process—I gained enough confidence to proceed with the more challenging upgrade: increasing the RAM from 8 GB to 16 GB. On newer laptops, this should be easy, but on this particular laptop it required unscrewing the motherboard, disconnecting various ribbon cables, and flipping the motherboard over to install the memory stick.

I had already purchased a [compatible 8 GB RAM stick from Crucial](https://www.amazon.com/dp/B006YG8X9Y) in advance, so I had everything I needed to begin the final upgrade.

### Screws, Ribbons, Oh My!

According to [the iFixit guide](https://www.ifixit.com/Guide/HP+Envy+x360+m6-w103dx+Memory+(RAM)+Replacement/127837) I was referencing, I needed to begin by unscrewing the five screws on the motherboard and heatsink. The guide got the locations of the screws right, but I took photos anyway to remember exactly where they went.

The next challenge was disconnecting all of the ribbon cables: battery, power supply, fan, drive—too many to keep track of. I then attempted to gently lift the motherboard as instructed, but I noticed it was still attached. That's when I realized the iFixit guide had omitted a key detail: I also needed to detach the metal pins from this Wi-Fi card:

{% include "postImage.html", src: "./images/wifi-card.jpg", alt: "Close-up of a blue motherboard with a green wifi chip. Two black wires with metal pins on the end are attached to the card.", caption: "I left a comment on the iFixit guide to clarify this for future readers." %}

With everything finally disconnected, all that remained was to flip the motherboard over, pop off the metal protector for the RAM, and insert the new stick as the guide instructed.

{% include "postImage.html", src: "./images/motherboard.jpg", alt: "The laptop motherboard flipped over. A square metal casing protects the ram sticks inside.", caption: "Image credit: [Emalee Johnson on iFixit](https://www.ifixit.com/User/3237011/Emalee+Johnson). License: [Creative Commons BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/3.0/)." %}

Reassembling the motherboard was trickier than I expected and was mostly a process of trial and error. For example, I would get it positioned in place and start putting in the screws, but then I'd realize that one or two of the ribbon cables had gotten snagged underneath it, forcing me to redo the process. Or the USB ports would be misaligned. In the end, the motherboard ended up not aligning perfectly with one of the screw holes in the base of the laptop, so I had to leave that unscrewed. But the rest fit in place, so I decided not to test my luck and take what I could get.

### Verifying the Installed RAM

Rebooting my laptop gave me extreme anxiety—I was almost sure I had damaged something along the way, especially with all the unexpected problems that came up. But thankfully, it booted up just fine. And when I opened System Information, I was relieved to see that the upgrade was successful.

{% include "postImage.html", src: "./images/msinfo.png", baseFormat: "png", alt: "Dialog window: System Information. Left-hand pane is a tree nav with System Summary at the root and three children: Hardware Resources, Components, and Software Environment. The right pane lists item-value pairs. Installed Physical Memory shows 16.0 GB.", caption: "Windows system information (`msinfo32`)" %}

My little machine went from being sluggish to fully capable of running all my apps and more. To see how much of a difference this made, I did a stress test with one of the games in my Steam library. Before these upgrades, it would hover around 20 frames per second (FPS) on the lowest settings, and sometimes my PC would freeze up completely because it would run out of memory. After the upgrade, the game ran smoothly at 40–50 FPS; load times also improved thanks to the SSD.

## Success!

So what did I learn from all this? A lot, actually!

First and foremost, I learned how to take care of the hardware that I have and to upgrade it when the time comes, even if it requires a bit more work on my part. This [right to repair](https://en.wikipedia.org/wiki/Right_to_repair) is something that only a handful of companies are championing, and most laptop manufacturers are still making it nearly impossible to disassemble and repair their hardware. Surprisingly, my laptop was easy enough to upgrade—mostly thanks to the iFixit guides published by [Steven Ngo](https://www.ifixit.com/User/3237008/Steven+Ngo) and other contributors. By the end of this little experiment, I also learned to have more confidence in my skills; I went into this thinking I would fail, but it all worked out in the end.

{% aside %}
When I inevitably do need to upgrade to a new machine, I might get a Framework—if the price ever drops, that is. Not only would it be fun to assemble one from scratch with my newfound skills, but it would also make upgrading and repairing my device easier. Well, that's the idea, anyway—I've only ever seen videos of people reviewing the Framework, so I can't judge it for myself until I try it.
{% endaside %}
