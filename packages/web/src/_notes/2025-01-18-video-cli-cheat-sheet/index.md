---
title: CLI Cheat Sheet for Videos
description: A reference for downloading, splitting, and optimizing videos with CLI tools.
keywords: [yt-dlp, ffmpeg]
---

This is a compilation of my most frequently used command-line tools and commands when working with video files. I'm collecting them here both for my own convenience and in case the original sources ever get taken down. Note that this is not meant to be an exhaustive reference.

{% include "toc.md" %}

## Downloading Videos

My go-to tool for downloading videos is [yt-dlp](https://github.com/yt-dlp/yt-dlp), the actively maintained fork of youtube-dl. It's a convenient tool for downloading Twitch clips, YouTube videos, audio files, and more from nearly any source (unless, of course, you get blocked and hit a 403 Forbidden).

{% aside %}
Disclaimer: I'm not saying you can or should do this; you're responsible for respecting copyright laws and the terms of service of these sites.
{% endaside %}

### Download a Full Video

``` {data-copyable="true"}
yt-dlp <url> -o output-file.mp4
```

{% aside %}
**Note**: `<url>` need not point directly to the video file URI. For example, if you give the tool a YouTube URL or the URL for any page containing a video element, it can still download the source file.
{% endaside %}

### Download Sections of a Video by Timestamp

Sometimes, it's faster to download specific timestamp ranges of a video rather than downloading the whole file and then manually splicing it with [ffmpeg](#ffmpeg). The following example downloads only the portion of the given video between 01:00 and 05:00:

``` {data-copyable="true"}
yt-dlp <url> --download-sections "*00:01:00-00:05:00"
```

Reference: [yt-dlp Download Options](https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#download-options)

## Editing Videos

Anyone who's ever edited videos before knows that there are really only three kinds of tools:

1. [FFmpeg](https://www.ffmpeg.org/),
2. FFmpeg wrappers, and
3. Tools that wish they were FFmpeg.

### Split by Timestamp

``` {data-copyable="true"}
ffmpeg -ss 00:01:00 -to 00:02:00 -i input.mp4 -c copy output.mp4
```

Credit: [Online User on StackOverflow, CC BY-SA 4.0](https://stackoverflow.com/a/42827058/5323344).

### Compress File Size

Use the `-vcodec` option to compress the input file using one of ffmpeg's supported codecs. This example uses H.265, but you can also use the older `libx264` (H.264 codec). 

``` {data-copyable="true"}
ffmpeg -i input.mp4 -vcodec libx265 -crf 28 output.mp4
```

Credit: [Vicky Chijwani on the Unix & Linux StackExchange, CC BY-SA 4.0](https://unix.stackexchange.com/a/38380/311005).