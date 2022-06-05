---
title: How to Format Code on Save in VS Code with ESlint
description: Never worry about manually formatting your code again. Improve your developer experience by setting up ESLint to format code on save in VS Code.
keywords: [format code on save, auto-format code on save, auto-formatting code, eslint, vs code, prettier]
categories: [eslint, vscode, tooling]
commentsId: 80
thumbnail: ./images/thumbnail.png
lastUpdated: 2021-10-29
---

I've read my fair share of posts on what you'd think would be a simple task: how to format code on save in VS Code with ESLint. Unfortunately, many of the answers you'll find online are outdated or simply don't work anymore.

I don't know about you, but I'm tired of falling down this rabbit hole every time. Actually, at this point, they're just holes—all the rabbits have hopped off to greener and saner pastures, where you don't have to install ten different packages just so you can lint your code.

So, having suffered through this process enough times myself, I've put together this guide in case you forget how to set up ESLint to play nicely with VS Code. This tutorial will cover:

1. Installing the core ESLint packages.
2. Setting up a basic ESLint config.
3. Configuring VS Code to auto-format code on save.

If you already have a project with ESLint configured, feel free to jump to the section on [setting up VS Code to format code on save](#3-formatting-on-save-in-vs-code-with-eslint).

{% include toc.md %}

## 1. Installing ESLint (Optional: Prettier)

Since we want to use ESLint to format JavaScript, we'll need to install the `eslint` package (*gasp*). You can also optionally install Prettier and its associated ESLint plugins. By itself, Prettier is just a code formatter that enforces certain code style rules; people typically use both ESLint and Prettier together, extending ESLint with Prettier's recommended rules. If you want to use Prettier with ESLint, you'll also need these packages:

- `prettier` (Prettier itself)
- `eslint-plugin-prettier` (exposes Prettier-specific options as ESLint rules)
- `eslint-config-prettier` (turns off some conflicting ESLint rules)

Run this command to install ESLint with Prettier:

``` {data-copyable=true}
yarn add -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

If you're linting TypeScript, you'll also want these packages in addition to the ones above:

- `@typescript-eslint/eslint-plugin` (rules specific to TypeScript)
- `@typescript-eslint/parser` (the ESLint parser for TypeScript)

Install them like so:

``` {data-copyable=true}
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

And if you're linting React, throw these must-haves into the mix:

- `eslint-plugin-react` (rules specific to React and JSX)
- `eslint-plugin-react-hooks` (ESLint rules to enforce the rules of hooks)

You get the idea:

``` {data-copyable=true}
yarn add -D eslint-plugin-react eslint-plugin-react-hooks
```

Install all of your packages as dev dependencies as noted above.

If you already have the ESLint extension installed, VS Code may show a prompt asking if you want to use the ESLint executable you just installed in `node_modules`. You want to do this, if it prompts you. We'll look at how to install and configure the extension [in a later section](#installing-the-eslint-extension-for-vs-code).

### Optional: `husky`, `lint-staged`, and Precommit Hooks

If you haven't already done so, you can update your `package.json` scripts to include a script to lint files via the command line. This is useful in case you want to set up lint-staged rules with [husky](https://www.npmjs.com/package/husky) and git hooks:

```json {data-file="package.json" data-copyable=true}
{
  "scripts": {
    "lint": "eslint --cache \"src/**/*.{js,jsx,ts,tsx}\"",
    "lint:fix": "eslint --cache --fix \"src/**/*.{js,jsx,ts,tsx}\""
  }
}
```

(Adjust the paths to your source files accordingly.)

Install `husky` and `lint-staged`:

``` {data-copyable=true}
yarn add -D lint-staged husky
```

And configure them in your `package.json` to use the `lint:fix` script you defined:

```json {data-file="package.json" data-copyable=true}
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "yarn run lint:fix"
  },
}
```

People typically only do this if some developers on their team are using a different editor that maybe doesn't support formatting code on save. That way, their code will still be linted when they commit their changes.

## 2. Configuring ESLint and Prettier Rules

You've installed ESLint, but now you need to configure it to tell it how to lint your files, what rules to enforce, what files to exclude, and what plugins to extend. To do this, you'll need to create an ESLint config file at the root of your project.

Here are some names you can use for ESLint:

- `.eslintrc`
- `.eslintrc.json`
- `.eslintrc.js`
- etc.

And for Prettier:

- `.prettierrc`
- `.prettierrc.json`
- `.prettierrc.js`
- `.prettier.config.js`
- etc.

The file extension usually doesn't matter—most linters (ESLint included) follow the convention of `.[linter][rc][.optionalExtension]`. The file extension is useful if you want formatting or syntax highlighting. JavaScript configs can be particularly useful, but we'll stick with JSON for this post.

In this section, I'll provide three different starter ESLint configs to cover popular use cases:

- [JavaScript](#javascript-eslint-config)
- [TypeScript](#typescript-eslint-config)
- [React (JS or TS)](#react-eslint-config-javascript-or-typescript)

Before we move on, note that ESLint rules can take one of three values:

- `"off"` (`0`): this rule won't be enforced for your code.
- `"warn"` (`1`): violations of this rule issue a warning but not an error.
- `"error"` (`2`): violations of this rule throw an error; ESLint exits with an error (in your CLI).

Some people use the numerical aliases, but I prefer to use the strings to be explicit.

### Basic Prettier Config (All)

Since we're using Prettier to supplement ESLint's formatting rules, we'll need to configure Prettier. You can use this config file for any type of project. Adjust the settings according to your needs:

```json {data-file=".prettierrc" data-copyable=true}
{
  "useTabs": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "es5"
}
```

You can find an [exhaustive list of Prettier options](https://prettier.io/docs/en/options.html) in their docs. Note that you can also specify these Prettier rules in your ESLint `rules` section, but [the plugin maintainers do not recommend doing this](https://www.npmjs.com/package/eslint-plugin-prettier) (see the section on `Options`).

With that out of the way, let's now look at how to configure ESLint for different types of projects. This assumes that you've already installed the correct plugins and formatters as instructed in an earlier section.

### JavaScript ESLint Config

If you're working in a JavaScript or Node environment, you can either rely on the default ESLint parser or [specify a custom parser](https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser) (e.g., `babel-eslint`).

Note that if you're using the default ESLint parser (i.e., no `parser` set), you can set `ecmaVersion` to `"latest"` [as of ESLint v7.30.0](https://eslint.org/blog/2021/07/eslint-v7.30.0-released#highlights). Otherwise, set it to [one of the accepted values](https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments).

```json {data-file=".eslintrc.json" data-copyable=true}
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "prettier"
  ],
  "rules": {
    "eqeqeq": "error",
    "no-console": "warn",
    "prettier/prettier": "error"
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "latest"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "ignorePatterns": [
    "node_modules",
    "build",
    "dist",
    "public"
  ]
}
```

This should cover most bases. You can extend the rules and environments as needed or even install additional ESLint plugins. See the ESLint docs for [the full list of rules](https://eslint.org/docs/rules/).

{% aside %}
  **Heads up**: Don't add trailing commas to your ESLint config if you're writing it in JSON.
{% endaside %}

### TypeScript ESLint Config

With TypeScript, only a few things need to change from the basic ESLint config above. For starters, we need to use the `@typescript-eslint` plugin and also specify the TypeScript parser for ESLint so that it recognizes TypeScript's grammar. There are also some clashes between ESLint's rules and TypeScript's built-in rules, like errors for undefined or unused variables; you'll want to turn off the ESLint rules but keep the TypeScript ones so that you don't get twice the number of errors.

See the `@typescript-eslint/eslint-plugin` docs for [the full list of rules](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) and additional instructions on how you can customize this plugin.


```json {data-file=".eslintrc.json" data-copyable=true}
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "prettier",
    "@typescript-eslint"
  ],
  "rules": {
    "eqeqeq": "error",
    "no-console": "warn",
    "no-undef": "off",
    "no-unused-vars": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "ignorePatterns": [
    "node_modules",
    "build",
    "dist",
    "public"
  ]
}
```

Note that we're disabling `@typescript-eslint/explicit-module-boundary-types` and `@typescript-eslint/explicit-function-return-type` since TypeScript's type inference is usually good enough that we don't need to enforce these two rules.

### React ESLint Config (JavaScript or TypeScript)

Finally, if you're using ESLint to format React code, you can use either one of the configs from above and just add some React-specific rules on top of it. Otherwise, if you're using TypeScript, leave the parser as `@typescript-eslint/parser`.

One important change needs to be made to the `parserOptions` object: We'll need to specify an `ecmaFeatures` object with `"jsx": true` so that ESLint recognizes JSX and formats it correctly, rather than flagging it as an unknown syntax.

```json {data-file=".eslintrc.json" data-copyable=true}
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "prettier",
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  "rules": {
    "eqeqeq": "error",
    "no-console": "warn",
    "prettier/prettier": "error",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    // if you use React 17+; otherwise, turn this on
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jest": true
  },
  "ignorePatterns": [
    "node_modules",
    "build",
    "dist",
    "public"
  ]
}
```

{% aside %}
  I've disabled the `react-in-jsx-scope` rule, as it tends to be annoying if you're using React 17+ (where you [don't have to explicitly import React](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)). If you're working with a lower version number, you'll want to enable this rule and import React anytime you need to render JSX.
{% endaside %}

## 3. Formatting on Save in VS Code with ESLint

Now that we've installed and configured ESLint, all that remains is to tell VS Code how to format your code on save.

### Installing the ESLint Extension for VS Code

The first step is easy—just head over to the extensions tab in VS Code's sidebar and search for the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (`dbaeumer.vscode-eslint`):

{% include postImage.html src: "./images/eslint-extension.png", alt: "Viewing the ESLint extension in the VS Code extension marketplace." %}

You may see a prompt to reload VS Code after installing the extension.

At this point, you may also be asked if you want to give the ESLint extension permission to load and use the ESLint executable installed in `node_modules`. A notification will pop up saying something like this:

> The ESLint extension will use node_modules/eslint for validation, which is installed locally in folder 'your-folder'. Do you allow the execution of the ESLint version including all plugins and configuration files it will load on your behalf?

Click `Allow` (or `Allow everywhere`). If the notification doesn't appear and you're seeing squiggly lines in any of your files, you may need to open the lightbulb menu (put your cursor over the squiggly lines and use the keyboard shortcuts `Ctrl+.` or `Cmd+.`) and choose `ESLint: Manage Library Execution`.

#### Optional: Recommended Workspace Extensions

If you're setting up ESLint in a shared repo, you can also configure the recommended extensions for your project workspace. This will prompt other team members to install the ESLint extension if they don't already have it when they open your workspace in VS Code. To do so, open your command palette and run the command `Configure Recommended Extensions (Workspace Folder)`. This creates an `extensions.json` file in a `.vscode/` folder at the root of your project. Add the string ID for the ESLint extension that you installed:

```json {data-file="extensions.json" data-copyable=true}
{
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
}
```

Commit the file so that other developers on your team receive the prompt to install ESLint.

### Automatically Formatting Code on Save

Finally, it's time to configure VS Code to auto-format code with ESLint whenever you save a file. You can do this in one of two ways:

- **User settings**: applied to all workspaces.
- **Workspace settings**: only applied to the current workspace.

Open your command palette (`Ctrl+Shift+P` on Windows and `Cmd+Shift+P` on Mac) and search for `settings`. Look for these two options, depending on which one you want to configure:

- User settings: `Preferences: Open Settings (JSON)`
- Workspace settings: `Preferences: Open Workspace Settings (JSON)`

{% include postImage.html src: "./images/settings.png", alt: "Searching for 'settings' via VS Code's command palette." %}

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
    "source.fixAll.eslint": true,
  },
}
```

Here's a brief rundown of these options:

- `eslint.validate` tells the ESLint extension which languages it should check.
- `editor.codeActionsOnSave` is a hook into VS Code's save event.
- `source.fixAll.eslint` says to fix any issues in the file being saved.

You can remove any languages that you don't want ESLint to check from the validation list.

### Reloading VS Code for Changes to Take Effect

To make sure these settings kick in for your project, you'll want to:

1. Open a JavaScript or TypeScript file (it doesn't matter which).
2. Open your VS Code command palette.
3. Search for the command `TypeScript: Restart TS Server` (even if your file is JavaScript).

Run the command; you should see a loader pop up on VS Code's status bar saying `Initializing JS/TS language features`. Once it disappears, you should be good to go:

{% include postImage.html src: "./images/initializing-language-features.png", alt: "The VS Code status bar displays the text Initializing JS/TS language features next to a loading spinner." %}

Now, just open up a file and mess it up on purpose; you should see squiggly red lines if the violation is treated as an error and orange if it's a warning. VS Code will auto-format your code with ESLint when you save the file.

If that doesn't work, try the command `Developer: Reload Window` instead. This reloads your VS Code window rather than restarting the JavaScript and TypeScript language servers.

## ESLint Still Not Formatting on Save?

I've gone through this process myself enough times to be reasonably confident that it will work. But tooling can be tricky, especially in JavaScript's massive ecosystem. Sometimes, things do go wrong during the process of setting up your project. But don't panic!

If ESLint is unable to lint your files for whatever reason, check the bottom-right corner of your VS Code status bar. If ESLint encountered an error, you should see `ESLint` with a warning triangle next to it. Click it to open your `Output` pane; any errors will be listed there.

Usually, ESLint will encounter errors for one of the following reasons:

1. You're trying to use an ESLint plugin that isn't installed.
2. You're using JSON for your ESLint config and have trailing commas somewhere.
3. You're using a rule that ESLint does not recognize.

Debugging these issues is beyond the scope of this guide.

## That's It!

If all went well, you'll no longer have to worry about formatting your files manually or only during the staging process. Whenever you save a file, ESLint will auto-format it according to the configurations you specified, right in front of your eyes. This helps you move quickly without worrying about little syntax issues; if you save frequently as you type (like I do), you'll find this to be a very productive setup.

## Attributions

The photo used in this post's social media preview is a modified version of the ESLint logo, which is under [the MIT license](https://github.com/eslint/eslint/blob/master/LICENSE) and the copyright of JS Foundation and its contributors.
