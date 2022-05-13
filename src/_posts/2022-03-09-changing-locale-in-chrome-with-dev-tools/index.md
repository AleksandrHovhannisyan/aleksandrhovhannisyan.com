---
title: Changing the Locale in Chrome with Dev Tools
description: Modern browsers have developer tools that allow us to simulate user preferences, vision impairments, device resolutions, and various other scenarios. Chromium browsers in particular allow us to also simulate loading the page in a different locale.
keywords: [locale, dev tools]
categories: [html, i18n, rtl, browsers, chrome, testing]
thumbnail:
  url: https://images.unsplash.com/photo-1510267413785-9d9e64460cde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&h=900&q=80
---

When working on internationalized apps, it's important to test different locales to ensure that the design looks acceptable for a wide range of audiences. For example, I often test a handful of locales to make sure that the features I'm implementing correctly mirror their content in right-to-left (RTL) locales, or that content doesn't overflow its bounds in locales with notoriously long strings (I'm looking at you, Deutsch).

You can test locales in a number of ways. One is to change your browser's default language settings, although it's a little risky to do this if you can't actually read that language. A less reliable option is to directly edit the `lang` and `dir` attributes via your dev tools Element inspector, but this isn't recommended in hot-reload environment since your changes will be wiped as soon as the page refreshes. An alternative is to set up a query parameter in your app that can be used to override the locale. (This is easier if you're using a framework like Next.js.) However, all of these options require too much effort just to test a different locale, which is becoming an increasingly common task in front-end development.

Modern browsers have developer tools that allow us to simulate user preferences, vision impairments, device resolutions, and various other scenarios. As it turns out, Chromium browsers like Google Chrome and Edge allow us to also simulate loading the page in a different locale. This is perfect for when you just want to view a page in a different language without messing with any other settings.

## Changing the Locale in Chrome

{% aside %}
  Credit: I learned this trick from Kazuya Ito in [their StackOverflow answer](https://stackoverflow.com/a/69149258/5323344) on how to change the browser locale via dev tools in Google Chrome.
{% endaside %}

To start, you'll want to open up a site that you know is internationalized. Maybe that's the one you're creating at work, or maybe it's a popular site that you use. I'll use Wikipedia for this demo. Here's Wikipedia in English on Chrome:

{% include img.html src: "wikipedia-english.png", alt: "The Wikipedia home page shows a globe in the center made up of jigsaw pieces. Arranged in a concentric ring around the globe are links to different translated subdomains of wikipedia. Below this banner is a search box, followed by a dropdown that reads: Read Wikipedia in your language." %}

Open your dev tools, either by right-clicking the page and selecting `Inspect element` or using the keyboard shortcut (<kbd>Ctrl+Shift+I</kbd> on Windows and <kbd>Cmd+Shift+I</kbd> on Mac). Chrome has a command palette that you can invoke using <kbd>Cmd+Shift+P</kbd> or <kbd>Ctrl+Shift+P</kbd>, depending on your OS. Search for `Show sensors`:

{% include img.html src: "show-sensors.png", alt: "Inspecting the Wikipedia page in chrome dev tools, with a sidebar open on the right. A floating menu is highlighted showing a fuzzy search for show sensors. One result appears in the dropdown below the search box." %}

Press <kbd>Enter</kbd>, and you should see a new pane pop up that looks like this:

{% include img.html src: "sensors-pane.png", alt: "Inspecting the Wikipedia page in chrome dev tools, with a sidebar open on the right. The Sensors pane is active, showing one group of actions titled Location. The group has inputs and dropdown menus that can be toggled to override the device's location." %}

As the name suggests, the [Sensors web API](https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs) allows a web site or app to leverage a device's built-in sensors for things like gyroscopes, lighting, accelerometers, geolocation, and more. In Chrome dev tools, the Sensors pane mocks this API, allowing you to simulate a specific device configuration so that when the page tries to read that information, it uses the mocked data rather than the real device data.

Additionally, Chrome's Sensors pane allows us to switch locales. For example, if we select Berlin from the dropdown list and manually refresh the page, we should see the text update to German because the locale for the Berlin option is set to `de-DE` by default:

{% include img.html src: "german.png", alt: "Inspecting the Wikipedia page in chrome dev tools, with a sidebar open on the right. The Sensors pane is active and shows a Location settings group with Berlin actively selected. Below it are the latitude and longitude information for this city, along with a highlighted input labeled locale that reads de-DE. The page itself appears in German." %}

Cool!

What if we also want to test a right-to-left locale, like Arabic? In that case, all we need to do is click the `Manage` button in the Sensors pane and enter the details for our custom location (if it doesn't already exist). Note that you don't need to enter a latitude or longitude if you're not trying to test geolocation functionality. For this example, I'll create a generic location named Arabic and set its locale to `ar`.

{% include img.html src: "add-arabic.png", alt: "Inspecting the Wikipedia page in chrome dev tools, with a sidebar open on the right titled Settings. Several built-in locations are listed with their names, latitudes, longitudes, regions, and locales. A new entry is being added at the bottom of the list titled Arabic, with a latitude and longitude of 0 and a locale of ar." %}

Click `Add`, and close out of the settings view either with <kbd>Escape</kbd> or by clicking the `X` button in the top-right corner. Then, repeat the same steps as before—select your newly created location, and refresh the page:

{% include img.html src: "arabic.png", alt: "Inspecting the Wikipedia page in chrome dev tools, with a sidebar open on the right. The Sensors pane is active and shows a Location settings group with Arabic actively selected. The page itself appears in Arabic text." %}

Not only does the page serve the text in Arabic, but it also flips the text directionality to RTL (since Arabic is one of a handful of RTL languages). You can verify this either visually or by finding `lang="ar"` and `dir="rtl"` in the element inspector.

That's it! Now, you can easily flip-flop between locales without having to mess with your browser or OS settings. This makes it much easier to test RTL and overflow edge cases.

{% include unsplashAttribution.md name: "Bruno Martins", username: "brunus", photoId: "8fbqPK_MUtk" %}
