---
title: How to Format on Save with ESlint
description: "Set up ESLint to format on save in two popular code editors: VS Code and neovim."
keywords: [format code on save, auto-format code on save, auto-formatting code, eslint, vs code, neovim]
categories: [eslint, tooling]
commentsId: 80
thumbnail: ./images/thumbnail.png
lastUpdated: 2024-08-22
redirectFrom:
  - /blog/format-code-on-save-vs-code-eslint/
---

By now, I've read my fair share of tutorials on setting up ESLint to format on save. Unfortunately, many of the answers you'll find online are outdated or simply don't work anymore. Heck, I've had to update this post several times over the years because of how frequently tooling and configs change.

I don't know about you, but I'm tired of falling down this rabbit hole every time. Actually, at this point, they're just holes—all the rabbits have hopped off to greener and saner pastures, where you don't have to install ten different packages just so you can lint your code.

So, having suffered through this process enough times myself, I decided to put together this short guide on how to format JavaScript code with ESLint whenever you save. I'll share the settings you need for two popular code editors:

- [Visual Studio Code](#visual-studio-code)
- [Neovim](#neovim)

Other editors are beyond the scope of this tutorial, as these are the only two editors that I use. If you use something else, you'll need to consult your editor's documentation for help.

Before we get started, I assume you already have ESLint installed and ready to go. If you don't, follow the instructions in [Getting Started with ESLint](https://eslint.org/docs/latest/use/getting-started) to init a new ESLint config. Follow the prompts in the CLI to configure it to your liking:

```
npm init @eslint/config@latest
yarn create @eslint/config
pnpm create @eslint/config@latest
```

{% include "toc.md" %}

## Visual Studio Code

### 1. Install the ESLint Extension

First, we need to install the ESLint language server protocol (LSP) extension for VS Code.

1. Open the Extensions tab in the sidebar.
2. Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (`dbaeumer.vscode-eslint`):

{% include "postImage.html" src: "./images/eslint-extension.png", alt: "Viewing the ESLint extension in the VS Code extension marketplace." %}

You may see a prompt to reload VS Code after installing the extension.

At this point, you may also be asked if you want to give the ESLint extension permission to load and use the ESLint executable installed locally in your `node_modules`. A notification will pop up saying something like this:

> The ESLint extension will use node_modules/eslint for validation, which is installed locally in folder 'your-folder'. Do you allow the execution of the ESLint version including all plugins and configuration files it will load on your behalf?

Click `Allow` (or `Allow everywhere`). If the notification doesn't appear and you're seeing squiggly lines in any of your files, you may need to open VS Code's lightbulb menu (put your cursor over the squiggly lines and use the keyboard shortcuts `Ctrl+.` or `Cmd+.`, or right-click the text) and choose `ESLint: Manage Library Execution`.

If you're setting up ESLint in a shared repo, you can also configure the recommended extensions for your project workspace. This will prompt other team members to install the ESLint extension if they don't already have it when they open your workspace in VS Code. To do so, open your command palette and run the command `Configure Recommended Extensions (Workspace Folder)`. This creates an `extensions.json` file in a `.vscode/` folder at the root of your project. Add the string ID for the ESLint extension that you installed:

```json {data-file="extensions.json" data-copyable=true}
{
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
}
```

Commit this file so that other developers on your team receive a prompt to install the ESLint plugin if they don't already have it.

### 2. Configure ESLint Extension

Now we can tell VS Code to auto-format our code with ESLint whenever we save a file. There are two ways to do this:

1. **User settings**: applied to all of your VS Code workspaces.
2. **Workspace settings**: only applied to the current workspace.

Open your command palette (`Ctrl+Shift+P` on Windows and `Cmd+Shift+P` on Mac) and search for `settings`. Look for these two options, depending on which one you want to configure:

- User settings: `Preferences: Open Settings (JSON)`
- Workspace settings: `Preferences: Open Workspace Settings (JSON)`

{% include "postImage.html" src: "./images/settings.png", alt: "Searching for 'settings' via VS Code's command palette." %}

Select either one. I recommend configuring this in both your user and workspace settings; the latter is a good option if other developers on your team use VS Code. That way, they don't have to update their user settings manually—when you push these changes, VS Code will load their workspace settings. User settings are handy if you want to set them once and be done with it.

Either way, you'll want to add these to your JSON:

```json {data-file=".vscode/settings.json" data-copyable=true}
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Here's what these options do:

- `eslint.validate` tells the ESLint extension which languages it should check.
- `editor.codeActionsOnSave` is a hook into VS Code's save event.
- `source.fixAll.eslint` says to fix any issues in the file being saved.

You can remove any languages that you don't want ESLint to check from the validation list.

### 3. Restart TS Server

For these settings to take effect, you'll need to:

1. Open a JavaScript or TypeScript file (it doesn't matter which).
2. Open your VS Code command palette (`Ctrl+P`/`Cmd+P`).
3. Search for the command `TypeScript: Restart TS Server`.

Run the command; you should see a loader pop up on VS Code's status bar saying `Initializing JS/TS language features`. Once it disappears, you should be good to go:

{% include "postImage.html" src: "./images/initializing-language-features.png", alt: "The VS Code status bar displays the text Initializing JS/TS language features next to a loading spinner." %}

Now, open up a JavaScript file and introduce formatting errors on purpose; you should see squiggly red lines if the violation is treated as an error and orange if it's a warning. VS Code will auto-format your code when you save the file.

If that doesn't work, try the command `Developer: Reload Window` instead. This reopens your VS Code workspace.

### Troubleshooting Common Problems

I've gone through this process myself enough times to be reasonably confident that it will work. But tooling can be tricky, especially in JavaScript's massive ecosystem. Sometimes, things do go wrong during the process of setting up your project.

If ESLint is unable to lint your files for whatever reason, check the bottom-right corner of your VS Code status bar. If ESLint encountered an error, you should see `ESLint` with a warning triangle next to it. Click it to open your `Output` pane; any errors will be listed there.

Usually, ESLint will encounter errors for one of the following reasons:

1. You're trying to use an ESLint plugin that isn't installed.
2. You're using JSON for your ESLint config and have trailing commas somewhere.
3. You're using a rule that ESLint does not recognize.

Debugging these issues is beyond the scope of this guide.

## Neovim

I sometimes alternate between VS Code and [neovim](https://neovim.io/), a highly extensible terminal editor based on vim. For my custom neovim config, I forked and modified the [kickstart.nvim project](https://github.com/nvim-lua/kickstart.nvim): Neovim's official starter for custom configs that comes with many sensible defaults out of the box. That project uses [`lazy.nvim`](https://github.com/folke/lazy.nvim) as its plugin manager; it's the modern (and much faster) alternative to older tools like Packer.

### Format on Save with `conform.nvim`

One of the pre-configured plugins in kickstart is [`stevearc/conform.nvim`](https://github.com/stevearc/conform.nvim), which lets you auto-format code in response to various editor events. By default, it is configured to format before save (`BufWritePre`):

```lua {data-file="~/.config/nvim/init.lua"}
require('lazy').setup({
  { -- Autoformat
    'stevearc/conform.nvim',
    event = { 'BufWritePre' },
    cmd = { 'ConformInfo' },
    keys = {
      {
        '<leader>f',
        function()
          require('conform').format { async = true, lsp_fallback = true }
        end,
        mode = '',
        desc = '[F]ormat buffer',
      },
    },
    opts = {
      notify_on_error = false,
      format_on_save = function(bufnr)
        local disable_filetypes = { c = true, cpp = true }
        return {
          timeout_ms = 500,
          lsp_fallback = not disable_filetypes[vim.bo[bufnr].filetype],
        }
      end,
      formatters_by_ft = {
        lua = { 'stylua' },
        javascript = { 'eslint', 'prettierd', 'prettier', stop_after_first = true },
      },
    },
  },
});
```

### Highlight Errors with the ESLint LSP

Note that `conform` is not a language server protocol, so it won't highlight ESLint errors in your editor—it will only fix them. If you want to see the errors as you edit a file, you can install the ESLint LSP using [`neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) and [`williamboman/mason.nvim`](https://github.com/williamboman/mason.nvim), either through the `:Mason` GUI or the same Lua config. Here is what the kickstart config looks like, with comments and unrelated code removed:

```lua {data-file="~/.config/nvim/init.lua"}
require('lazy').setup({
    {
    'neovim/nvim-lspconfig',
    dependencies = {
      { 'williamboman/mason.nvim', config = true },
      'williamboman/mason-lspconfig.nvim',
      'WhoIsSethDaniel/mason-tool-installer.nvim',
    },
    config = function()
        --- ...code omitted for brevity...
      local servers = {
        eslint = {}, -- IMPORTANT
        --- ...code omitted for brevity...
      }
      require('mason').setup()
      local ensure_installed = vim.tbl_keys(servers or {})
      vim.list_extend(ensure_installed, { 'stylua' })
      require('mason-tool-installer').setup { ensure_installed = ensure_installed }
      require('mason-lspconfig').setup {
        handlers = {
          function(server_name)
            local server = servers[server_name] or {}
            server.capabilities = vim.tbl_deep_extend('force', {}, capabilities, server.capabilities or {})
            require('lspconfig')[server_name].setup(server)
          end,
        },
      }
    end,
  },
});
```

All of this code is unchanged from the base kickstart config; the only thing I did is add `eslint = {}` to the `servers` table.

Now, Neovim should highlight ESLint errors as you make changes, and `conform` will auto-fix them before you save.

## That's It!

If all went well, you'll no longer have to worry about formatting your files manually or only during the staging process. Whenever you save a JavaScript file, your editor will auto-format it with ESLint. This helps you move quickly without worrying about little syntax issues; if you save frequently as you type (like I do), you'll find this to be a very productive setup.

## Attributions

The photo used in this post's social media preview is a modified version of the ESLint logo, which is under [the MIT license](https://github.com/eslint/eslint/blob/master/LICENSE) and the copyright of JS Foundation and its contributors.
