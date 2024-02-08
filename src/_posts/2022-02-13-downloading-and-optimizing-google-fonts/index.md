---
title: How to Download and Optimize Google Fonts
description: Self-hosting fonts can improve your site's performance while also respecting your users' privacy in the era of the GDPR. Learn how to download, subset, and optimize any Google Font for your projects.
keywords: [google fonts, woff2, glyphhanger]
categories: [typography, webperf]
thumbnail:
  url: https://images.unsplash.com/photo-1566404252805-1e6d6bc539d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
lastUpdated: 2022-03-10
---

On January 20, 2022, a Munich court ruled that linking to Google Fonts [violates the GDPR in Germany](https://rewis.io/urteile/urteil/lhm-20-01-2022-3-o-1749320/) because it allows any user's IP address to be traced back to their physical address, which is considered personal data under the GDPR. Whether or not you agree with the ruling, it has important implications because it means that German businesses may be unwittingly opening themselves up to lawsuits and fines if they're linking to Google Fonts on their sites.

It's unclear whether other European countries will follow suit, and there are certainly more invasive sites and platforms that don't receive the same treatment. But this isn't about what I think or whether the ruling is just—this is the new reality for German businesses and developers, and they'll need to adapt accordingly.

One way to avoid this problem entirely is to just self-host the Google Fonts you need. Not only does this avoid exposing your users' personal information to Google's servers, but it's also much faster than requesting fonts from the Google Fonts CDN. And in the unlikely event that Google Fonts ever goes down, your site won't be impacted.

Many good articles have already been written on how to self-host fonts, so I won't dive deep into all of the considerations. Instead, I'd like to show you a few ways you can download Google Fonts as a first step. I'll also show you how to manually optimize and subset those font files using a CLI tool like [glyphhanger](https://github.com/zachleat/glyphhanger).

{% include "toc.md" %}

## Downloading Any Google Font

### 1. Using google-webfonts-helper

I learned about this method from Sia Kiaramalegos in her article on [Making Google Fonts Faster](https://sia.codes/posts/making-google-fonts-faster/#self-host-your-web-fonts-for-full-control). Head over to https://gwfh.mranftl.com/fonts, search for your font, customize it to your liking, and download the files. The app also provides you with `@font-face` rulesets that you can copy-paste into your CSS.

{% include "postImage.html" src: "./images/google-webfonts-helper.png", alt: "The google-webfonts-helper app interface, with a selected font family of Inter. The main content region shows a series of stepwise instructions for how to include the font in a project. Step 2 reads 'Select styles,' followed directly by a table that lists all font weights with adjacent checkboxes to enable selection. Step 3 reads 'Copy CSS' and includes an output pane with the @font-face declarations. There are two tabs for the output: Best support and Modern browsers; the former is selected." %}

This one of the easiest ways to download Google Fonts, but it does have a drawback: The app isn't guaranteed to have all of the latest font file revisions, so you may run into some issues that the font's designers have already patched elsewhere. For example, the font Inter has [some rendering issues on Mac](https://github.com/majodev/google-webfonts-helper/issues/130) with the version served by the app, whereas the version hosted by Google Fonts has already fixed those issues.

### 2. Downloading `woff2`s Directly from Google's Servers

When you link to Google Fonts, it already returns font files in `woff2` format by default. Wouldn't it be nice if we could download and self-host those very same font files without having to link to Google Fonts in the first place? Well, we actually can!

Suppose I visit Google Fonts, pick Inter as my font family, and select my desired font weights. As I do this, the right sidebar assembles a link tag with query parameters to match the format required by [the Google Fonts API](https://developers.google.com/fonts/docs/developer_api):

{% include "postImage.html" src: "./images/google-fonts.png", alt: "The Google Fonts page for the font family Inter, with font weights shown in a tabular format by ascending weight and sample text that reads: 'Almost before we knew it, we had left the ground.' Regular 400, Bold 700, and Black 900 have been selected. A sidebar on the right lists the chosen font weights along with link tags that can be inserted into the head to load that font." %}

Here's the link tag from this example:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
```

If you navigate to this URL in your browser, the API will return a stylesheet with all the necessary `@font-face` declarations for your font. Here's what the one for latin looks like:

```css
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v7/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* other weights and charsets omitted for brevity */
```

Each `@font-face` ruleset specifies a `src` so the browser can locate those font files. In this case, they're hosted on Google's dedicated resource domain for fonts, `fonts.gstatic.com`. To download any of these files, you can use a command-line utility like `wget` or `curl` or even just navigate to the file directly via your browser. For example:

```
curl -L https://fonts.gstatic.com/s/inter/v7/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2 -o inter-regular.woff2
```

The final step is to copy-paste the `@font-face` declarations for your chosen charset(s) into your CSS and update the `src` property to point to your locally hosted font file(s) rather than Google's server.

### 3. Downloading the Full Font Family from Google Fonts or GitHub

In addition to assembling a link tag that you can include in your document's `head`, Google Fonts also gives you the option of downloading all of the font files for that family straight from the site itself. This differs from the previous method in that it downloads the full, unoptimized font family in `ttf` (TrueType) format.

Similarly, you can usually find and download the complete font family on GitHub for any Google Font since these are open-source fonts. Typically, the production-ready font files will be made available under the Releases tab along with the source code for the font.

Here's an example for Inter:

{% include "postImage.html" src: "./images/github.png", alt: "The GitHub releases tab for the font family Inter, showing the release notes for version 3.19. Below the notes are links to the font file downloads.", caption: "Release notes for Inter v3.19: https://github.com/rsms/inter/releases" %}

Both of these methods give you `ttf` files containing all of the supported character sets, which is rarely what you want since these files are on the order of several hundred KB in size, *per weight*.

{% include "postImage.html" src: "./images/downloads.png", alt: "Viewing the downloaded font files for Inter in File Explorer on a Windows machine. The main explorer pane lists 9 font files, all of which have a size of roughly 300 KB." %}

But this method is still valid and may even be preferred if you want to download the latest versions of the font files and customize them to your liking. If you're worried about the file sizes, you can subset and optimize the font files yourself.

Speaking of which...

## Optimizing and Subsetting Any Font with glyphhanger

Once you've downloaded your font files, you can optionally run them through a font subsetting tool to remove character sets that you don't intend to use and even convert them to a more optimized format, like `woff2`.

For this task, I recommend using the [glyphhanger Node package](https://www.npmjs.com/package/glyphhanger). Assuming you've followed the [installation instructions](https://github.com/zachleat/glyphhanger#installation) and have all the necessary dependencies, you just need to navigate to the directory containing your font files and invoke the CLI.

Here's an example command you might run:

```{data-copyable=true}
glyphhanger --subset=*.ttf --LATIN --formats=woff2
```

This tells glyphhanger to:

1. Subset all font files that match the glob pattern `*.ttf`.
2. Use only the Latin character set when subsetting the fonts.
3. Output the subsetted font files in `woff2` format.

{% aside %}
  Note that you may need to use a different character set; this depends on what languages and special symbols you need to support on your site. For example, instead of `LATIN`, you could specify `US_ASCII` to use a smaller character set.
{% endaside %}

The savings from subsetting a font can be quite significant. Here's the output from running this command on the font files I downloaded directly from Google Fonts:

```
Subsetting Inter-Black.ttf to Inter-Black-subset.woff2 (was 308.96 KB, now 23.52 KB)
Subsetting Inter-Bold.ttf to Inter-Bold-subset.woff2 (was 308.69 KB, now 24.45 KB)
Subsetting Inter-ExtraBold.ttf to Inter-ExtraBold-subset.woff2 (was 309.29 KB, now 24.45 KB)
Subsetting Inter-ExtraLight.ttf to Inter-ExtraLight-subset.woff2 (was 303.52 KB, now 23.92 KB)
Subsetting Inter-Light.ttf to Inter-Light-subset.woff2 (was 303.14 KB, now 23.88 KB)
Subsetting Inter-Medium.ttf to Inter-Medium-subset.woff2 (was 307.34 KB, now 24.36 KB)
Subsetting Inter-Regular.ttf to Inter-Regular-subset.woff2 (was 302.57 KB, now 22.91 KB)
Subsetting Inter-SemiBold.ttf to Inter-SemiBold-subset.woff2 (was 308.36 KB, now 24.3 KB)
Subsetting Inter-Thin.ttf to Inter-Thin-subset.woff2 (was 303.24 KB, now 22.6 KB)
```

This requires a bit more work than just directly downloading `woff2`s from the Google Fonts stylesheet or using an app like google-webfonts-helper, but it gives you greater control since you can subset and optimize your font files however you want.

{% include "unsplashAttribution.md" name: "Markus Spiske", username: "markusspiske", photoId: "f81ym3dE5N4" %}
