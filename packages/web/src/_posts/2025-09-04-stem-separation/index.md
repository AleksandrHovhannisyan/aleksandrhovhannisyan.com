---
title: How to Split Audio Stems
description: Ultimate Vocal Remover is a free and open-source tool that allows you to separate stems from audio tracks using machine learning.
categories: [note, music, ai]
keywords: [stem, split, ultimate vocal remover]
---

If you're covering music or trying to isolate an instrument for a practice session, you're probably going to need a <dfn>stem splitter</dfn>: software that takes an audio track, analyzes its waveforms with machine learning, and generates audio files for each stem. Paid and free stem splitters have been around for a while, but one I personally like is [Ultimate Vocal Remover](https://github.com/Anjok07/ultimatevocalremovergui) because it's free and open source, and it lets you pick from many different stem separation models (all local). I've used it for several of my own guitar covers, and I've been very happy with the results so far.

This is a short tutorial on how to set up and use this software. Thanks to Vizard for their helpful response on the following Reddit thread: ["Any free music AI stem separators that are truly free and awesome?"](https://www.reddit.com/r/musicproduction/comments/1704kob/comment/ktj2y1u/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1) I'm including screenshots and summarizing their answer here. I've also included a list of other tools at the end.

## Using Ultimate Vocal Remover

1. Download [the latest release of Ultimate Vocal Remover from GitHub](https://github.com/Anjok07/ultimatevocalremovergui/releases).

![GitHub release assets for UVR 5.6.0 showing different download links.](./images/uvr-download.png)

2. Run the installer. When it finishes, open the app. You should see this:

![Default UVR 5 screen showing input file, output folder, output format, processing method, and other buttons.](./images/uvr-screen.png)

3. Click the wrench icon to the left of the "Start Processing" button to open the settings menu. Navigate to the `Download Center` tab at the top of this window:

![Window titled "Settings Guide" overlaid on the main UVR window. There are three tabs at the top of this window: Settings Guide, Additional Settings, and Download Center. The Download Center tab is active.](./images/uvr-download-center.png)

4. From the list of available models, click the radio button next to Demucs to select it. Then, click the dropdown and scroll until you find the model named `Demucs v4: htdemucs_6s`. Select it:

![Window titled "Settings Guide" overlaid on the main UVR window. There are three tabs at the top of this window: Settings Guide, Additional Settings, and Download Center. The Download Center tab is active. Demucs is selected and the combobox below it shows that htdemucs_6s is selected.](./images/uvr-htdemucs6s.png)

{% aside %}
Note: [Demucs](https://github.com/facebookresearch/demucs) is just the name of an open-source stem separation model developed by researchers at Facebook (Meta). Specifically, `htdemucs_6s` was trained to extract six stems: bass, guitar, piano, drums, vocals, and other.
{% endaside %}

5. Click the Download button to download your selected model(s). You'll see a progress meter and a button to stop the download if you change your mind.

![Download progress bar for htdemucs_6s model in UVR settings window.](./images/uvr-htdemucs-download.png)

6. Once the download finishes, you can close the settings window and return to the main window. There, select your input file (e.g., a music video or audio file). Select an output folder where you want Ultimate Vocal Remover to save each stem. Under "Choose process method," select Demucs. Under "Choose demucs model," select the `htdemucs_6s` model you just downloaded. Finally, if your system has a GPU, consider checking that box to speed up the process.

![Main UVR window showing all the selected options for input file, output folder, model, GPU conversion, etc.](./images/uvr-inputs.png)

7. Click Start Processing. Once it's finished, you'll be able to see the audio files for each stem in the output folder you selected earlier.

## Closing Remarks

Remember to use this tool ethically and responsibly. Do not use it to illegally redistribute copyrighted work or generate deepfakes. If you opt to monetize your covers, upload them only to YouTube since it splits revenue with the creators.

If you found Ultimate Vocal Remover useful, consider [donating to the developer to support their work](https://buymeacoffee.com/uvr5). I'm not affiliated with the developer or their project, and this article wasn't sponsored.

## Other Tools

- [ISSE : An Interactive Source Separation Editor](https://isse.sourceforge.net/)
- [StemRoller](https://github.com/stemrollerapp/stemroller/) (free, open source, and also uses Demucs)
