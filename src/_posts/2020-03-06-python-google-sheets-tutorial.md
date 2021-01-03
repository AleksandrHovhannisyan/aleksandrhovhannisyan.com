---
title: "Python Google Sheets Tutorial"
description: In this quick tutorial, you'll learn how to automate data entry tasks using the Google Cloud Platform and the Python Google Sheets API, with minimal setup.
keywords: [python google sheets]
tags: [dev, python, apis, gcp]
---

If you're as lazy as I am, you'll come to realize at a certain point that something you've been doing by hand can easily be automated. That's the kind of laziness that makes the difference between spending hours on doing something by hand versus pressing Enter once and kicking up your feet to relax.

{% include picture.html img="thumbnail.png" alt="Google Sheets and Python." %}

In this short tutorial, I'll show you how to use the Python Google Sheets and Drive APIs to automate data entry tasks in your day-to-day work. This is a game-changer if you're used to manual data entry, so buckle up!

## Creating a Google Cloud Platform Project

If you want to access Google Sheets from Python or use any other Google API, you're going to need to create a **Google Cloud Platform project**. This lets you enable Google APIs through a single dashboard, as well as generate a private key for authorizing your script.

By default, you're in the [free tier of the Google Cloud Platform](https://cloud.google.com/free/docs/gcp-free-tier) when you first sign up for an account:

> *The 12-month, $300 free trial starts automatically when you set up your first billing account. You must provide credit card or bank details to set up a billing account and verify your identity, but you won't be charged during the free trial.*

I don't know about you, but that sounds like a great deal to me! Let's get started.

### 1. Create a New Google Cloud Platform Project

{% include picture.html img="create-project.gif" alt="Creating a Google Cloud Platform project." %}

Visit the [Google Cloud Platform](https://console.cloud.google.com/cloud-resource-manager) and create an account. As noted earlier, you'll need to provide a credit or debit card if you're new, but you won't be charged for the first 12 months.

Afterwards, you should be taken to an empty dashboard.

Click `Create Project`. Enter a project name; you don't need to specify an organization.

When you're done, simply click `Create`.

### 2. Enable the Google Sheets API

{% include picture.html img="enable-sheets-api.gif" alt="Enabling the Google Sheets API." %}

Click the menu icon in the top-left of the page to access the sidebar, and go to `APIs & Services`.

Click the blue `Enable APIs and Services` button at the top of this view.

Search for `Google Sheets API` and click the result card. Then click the blue `Enable` button.

### 3. Create Credentials to Use the Google Sheets API

{% include picture.html img="create-credentials.gif" alt="Creating Google API credentials." %}

You'll need to create credentials for authorizaion to use Google APIs. You'll usually only need to create a credential once, for the first API that you enable. For all future APIs that you enable, you can simply reuse the same credentials you set up before. We'll see this in a future section.

#### Find out what credentials you need

Make sure you're on the `Credentials` page, and click the `Create Credentials` button.

- Which API are you using? Scroll down and select `Google Sheets API`.
- Where will you be calling the API from? For example, if you're creating a script or CLI tool with Python, you can select `Other UI (e.g. Windows, CLI tool)`.
- What data will you be accessing? Application data is appropriate for most use cases, unless you need to access data for a particular Google user.

When you're done, click the `What credentials do I need?` button.

#### Create a service account

Next, you need to create a service account to associate with these credentials. You can use any service account name you want. For the role, `Project > Editor` will suffice, unless you'd like to assign a different one. Leave the key type as JSON.

Click `Continue`, and your browser will download a JSON file with the following structure (note that I've intentionally removed any sensitive information):

```json
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "-----BEGIN PRIVATE KEY-----\n[...]\n-----END PRIVATE KEY-----\n",
  "client_email": "",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": ""
}
```

Move this to your project directory and name it whatever you like. I'll name it `api_key.json`. If your project is being hosted publicly on GitHub, be sure to add this file to your `.gitignore`. Do NOT share your private key with anyone.

### 4. Enable the Google Drive API

{% include picture.html img="enable-drive-api.gif" alt="Enabling the Google Drive API." %}

You may think that's enough, but in order to access Google Sheets from Python, we're actually also going to need to enable the Google Drive API. This will allow our script to actually access the spreadsheet that we want to work with.

To do so, go to `APIs & Services > Library` and search for the Google Drive API. From there, the process is essentially the same as before: Enable the API and configure your credentials, specifying the same usage as before (e.g., application data, other UI, etc.).

Since we're not going to be using the Drive API differently from the Sheets API, we don't need to create a new set of credentials; the credentials we created before authorize us to use both APIs.

## How to Access Google Sheets from Python

Now that we've got the setup out of the way, it's time to actually access Google Sheets from Python and write some data to a custom spreadsheet.

First, you'll need to install these two libraries:

{% capture code %}pip install gspread
pip install oauth2client{% endcapture %}
{% include code.html code=code lang="bash" %}

[Gspread](https://gspread.readthedocs.io/en/latest/) is a Python Google Sheets API that lets you read and write data to spreadsheets saved in Google Drive.

> **Note**: While `oauth2client` is deprecated and no longer being maintained, it does work. In fact, it's the only authorization library that works with `gspread` as of this writing.

Here's a minimal example that uses these two libraries to push data to Google Sheets:

{% capture code %}from oauth2client.service_account import ServiceAccountCredentials
import gspread

# Google Sheets and Google Drive, respectively
scopes = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
# Pass in the full path to your JSON if calling the script from a different directory
creds = ServiceAccountCredentials.from_json_keyfile_name('./api_key.json', scopes)
client = gspread.authorize(creds)

# Replace with your spreadsheet's name and sheet number
sheet = client.open("Google Sheets and Python").sheet1
sheet.append_row(["Hello", "Google", "Sheets", "from", "Python"]){% endcapture %}
{% include code.html file="sheets.py" code=code lang="python" %}

If you try running this now, you'll get the following exception:

```
gspread.exceptions.SpreadsheetNotFound
```

For this script to actually work, you'll need to share the spreadsheet with the service account you created earlier. This is possible because Google automatically generated an email associated with the credentials you set up.

If you don't remember the service account email, simply open up the JSON file that you downloaded:

```json
{
  "client_email": "python-scraping@sheets-api-python-270219.iam.gserviceaccount.com"
}
```

Alternatively, you can look it up on the Google Cloud Platform. Simply go to your project, navigate to `APIs & Services > Credentials`, and scroll down until you see `Service Accounts`:

{% include picture.html img="service-accounts.png" alt="Google Cloud service accounts for a project." %}

Once you have the email, click `Share` in your spreadsheet and paste it in:

{% include picture.html img="share.gif" alt="Sharing your spreadsheet with the client email you set up earlier." %}

You may get a mail delivery failure message in your Gmail inbox shortly after you do this:

{% include picture.html img="mail-delivery-failure.png" alt="Mail delivery failure." %}

**That's normal** and doesn't mean that the authorization failed, so don't panic.

At long last, we've arrived at the moment of truth...

Run the script to see the magic happen before your very eyes!

{% include picture.html img="run.gif" alt="Running a Python script that pushes data to Google Sheets." %}

The world's your oyster now—you can access Google Sheets from Python and perform automated data entry tasks, like scraping the web, reformatting the data, and pushing it to a custom spreadsheet.

I hope you found this tutorial helpful!
