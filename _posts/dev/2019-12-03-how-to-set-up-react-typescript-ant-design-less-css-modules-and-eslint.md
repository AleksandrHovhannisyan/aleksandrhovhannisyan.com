---
title: 'How to Set Up Create React App with TypeScript, Ant Design, LESS, CSS Modules, and ESLint'
description: Enjoy a better dev experience by setting up React with TypeScript, customizing the Ant Design theme with LESS and CSS Modules, and formatting your code with ESLint, all without ejecting from CRA.
keywords: ['create react app with typescript', 'customize ant design theme', 'create react app css modules and typescript']
isCanonical: true
---

Let's skip the BS and just jump right in. I'll use VS Code to make my life easier; I recommend that you do the same. Note that I'll be using yarn as my package manager, but you can also use npm.

{% include linkedHeading.html heading="1. Setting up Create React App with TypeScript 💻" level=2 %}

Switch to your target project directory and run this command:

```bash
npx create-react-app . --typescript
```

This uses Facebook's [create-react-app](https://create-react-app.dev/) to initialize a React project with TypeScript. React by itself is pretty powerful, but React with TypeScript is a much, *much* better dev experience, in my opinion.

Here's what your directory structure and `package.json` should roughly look like once that's done:

{% include posts/picture.html img="structure" ext="PNG" alt="The directory structure of a CRA project." %}

Version numbers may obviously differ.

Beyond this point, most people have trouble overriding Create React App's Webpack configs without ejecting. Fortunately, as we'll see shortly, it's not all that difficult!

{% include linkedHeading.html heading="2. Setting Up Ant Design and LESS 🎨" level=2 %}

Ant Design is a fantastic library for React and other JavaScript frameworks that provides reusable and customizable components, like date pickers, lists, SVG icons, and _lots_ of other cool stuff. Let's set it up.

### Installing Ant Design

Run this command:

```bash
yarn add antd
```

Note that `antd` already comes with type definitions, so no need to worry about installing `@types/` for it.

### Importing Antd Components on Demand

Typically, to use an Ant Design component, you'd have to import the component from a specific directory under `antd` as well as import its accompanying stylesheet:

```javascript
import Button from 'antd/es/button';
import 'antd/es/button/style';
```

Urgh. This kinda sucks.

Instead, we can follow [Ant Design's guide](https://ant.design/docs/react/getting-started#Import-on-Demand) in order to load components with a simple import like this:

```javascript
import { Button } from 'antd';
```

First, install the `babel-plugin-import` package:

```bash
yarn add -D babel-plugin-import
```

Then install the `react-app-rewired` and `customize-cra` packages:

```bash
yarn add react-app-rewired customize-cra
```

These allow us to customize create-react-app without ejecting.

Change the scripts in your `package.json` to use `react-app-rewired`:

{% include posts/codeHeader.html name="package.json" %}
```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
}
```

Create a file named `config-overrides.js` at the root of your project directory, and paste in these contents:

{% include posts/codeHeader.html name="config-overrides.js" %}
```javascript
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
);
```

Now, you can import antd components in your source files like you would from any other package, without having to additionally specify the stylesheet or the specific lib path to import from.

Let's try it out. Open up your `App.tsx` and replace it with the following:

{% include posts/codeHeader.html name="src/App.tsx" %}
{% raw %}
```jsx
import React from 'react';
import { Button } from 'antd';

const App: React.FC = () => {
  return (
    <main
      style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Button type="primary">Hello, Ant Design!</Button>
      <a href="foo.bar">I'm a link. Click me, please!</a>
    </main>
  );
};

export default App;
```
{% endraw %}

At this point, if you were already running `yarn start`, you'll need to restart it for these changes to be observable.

Here's the result once you do that:

{% include posts/picture.html img="button1" ext="PNG" alt="An Ant Design button and anchor." %}

### Customize Ant Design Theme with LESS

Let's say you want to customize the Ant Design theme to use a different primary color or base font size.

Easy peasy!

First, install the `less` and `less-loader` packages:

```bash
yarn add less less-loader
```

Then we add a LESS loader to our config overrides:

{% include posts/codeHeader.html name="config-overrides.js" %}
```javascript
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#3c66a3', // customize as needed
      '@link-color': '#1890ff', // customize as needed
      '@font-size-base': '18px' // customize as needed
    }
  })
);
```

That's it! Re-run `yarn start` to see the new results in your browser:

{% include posts/picture.html img="button2" ext="PNG" alt="An Ant Design button and anchor, styled using a custom color." %}

The best part is that Ant Design's UI is consistent, using shades of this primary color for all of its components.

If you want to customize Ant Design's theme even more, [check out their list of supported variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less).

{% include linkedHeading.html heading="3. Create React App CSS Modules and TypeScript 📦" level=2 %}

By default, create-react-app v2 ships with CSS Modules out of the box.

But... How do we use CSS Modules with TypeScript?

This was an absolute headache to deal with before. But now, there's a package that does just what we want, and it's [made by a tech lead on Facebook's CRA team](https://github.com/mrmckeb)!

```bash
yarn add -D typescript-plugin-css-modules
```

After it's installed, add the plugin to your `tsconfig.json`:

{% include posts/codeHeader.html name="tsconfig.json" %}
```json
{
  "compilerOptions": {
    "plugins": [{ "name": "typescript-plugin-css-modules" }]
  }
}
```

Next, create a file named `global.d.ts` under your `src` directory. You don't have to name it `global`, by the way; you can name the file whatever you want, as long as it has the `.d.ts` extension. Enter these contents:

{% include posts/codeHeader.html name="src/global.d.ts" %}
```javascript
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
```

If you want to also use SASS or CSS, simply add more module declarations and change the `.less` extension.

We're almost done! Per the plugin's [usage instructions](https://www.npmjs.com/package/typescript-plugin-css-modules#visual-studio-code), if you want intellisense to work in VS Code, you'll need to force VS Code to use your workspace version of TypeScript instead of the globally installed version. Remember when we installed TypeScript via CRA at the very beginning? That's our workspace version of TypeScript.

Here's how to use the workspace version of TypeScript in VS Code:

1. Open any TypeScript file.
2. Click the version number on the blue status bar at the bottom of VS Code.
3. Select `Use Workspace Version` (3.7.3 as of this writing).

Here's a screenshot to make that clearer:

{% include posts/picture.html img="workspace-version" ext="PNG" alt="Using the workspace version of TypeScript in VS Code." %}

Once you do that, VS Code will create a `.vscode` directory in your project for workspace settings.

With that out of the way, let's now create a LESS stylesheet for our `App` component to move all the styles from before out of our JS. Name it `App.module.less` and fill it with these rules:

{% include posts/codeHeader.html name="src/App.module.less" %}
```css
.app {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 500px;
    justify-content: center;
}
```

Then, import it like this in `App.tsx`:

```javascript
import styles from './App.module.less';
```

With VS Code's intellisense, you won't have to guess or remind yourself what you named your CSS classes/IDs:

{% include posts/picture.html img="intellisense" ext="PNG" alt="VS Code autocomplete for TypeScript CSS Modules." %}

Awesome! 😎

Refresh the page, and you'll see that it looks exactly the same, except we now get to take advantage of CSS Modules and LESS (as well as potentially SASS or vanilla CSS, if you'd like to use those instead).

{% include linkedHeading.html heading="4. Using ESLint with Create React App and Prettier 💅" level=2 %}

We *could* stop there, and put up with garbo code formatting and inconsistencies, and create more work for our collaborators as they try to reconcile several people's style preferences.

{% include posts/picture.html img="but-why" ext="GIF" alt="But why, why would you do that? Why would you do any of that?" shadow=false %}

Or we could set up ESLint with Prettier to format our code consistently 🙂

First, install these packages:

```bash
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-config-react eslint-plugin-prettier prettier
```

(Credit goes to [Ben Weiser](https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675) for figuring this part out.)

Next, create a file named `.eslintrc.json` at the root of your project directory, and copy-paste this into it:

{% include posts/codeHeader.html name=".eslintrc.json" %}
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "env": {
    "browser": true,
    "jasmine": true,
    "jest": true
  },
  "rules": {
    "prettier/prettier": ["error"]
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "parser": "@typescript-eslint/parser"
}
```

Create another file named `.prettierrc` at the root of your project directory with these contents:

{% include posts/codeHeader.html name=".prettierrc" %}
```json
{
  "singleQuote": true,
  "printWidth": 80,
  "trailingComma": "es5"
}
```

This is where you'll define all your Prettier formatting rules. You *could* technically define these under `rules` in your `eslintrc` file, but I prefer to keep them separate. Also, note that you don't have to use these exact rules; you can change them if you'd like to.

### If You're Not Using VS Code

Add a `lint:fix` script to your `package.json` so you can fix linting errors as needed (you can name this something else if you'd like to). This is what your scripts should look like if you've been following along so far:

{% include posts/codeHeader.html name="package.json" %}
```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject",
    "lint:fix": "eslint --fix './src/**/*.{ts,tsx}'"
  }
}
```

Then, you can simply run `yarn lint:fix` from your terminal.

### If You Are Using VS Code

You can still use the above script, but I highly recommend that you also install these two VS Code extensions:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

At this point, you may not see any linting errors in VS Code—that's because we need to edit our user settings.

Open up the command palette (`Ctrl+Shift+P` if you're on Windows) and type `settings`.

Then, click on `Preferences: Open Settings (JSON)`:

{% include posts/picture.html img="command-palette" ext="PNG" alt="Opening user settings via the VS Code command palette." %}

Stick this in the JSON blob somewhere:

```json
"[typescript]": {
  "editor.formatOnSave": true,
  "editor.tabSize": 2
},
"[typescriptreact]": {
  "editor.formatOnSave": true
},
"eslint.enable": true,
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
],
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

> **Note**: You could also just put this in your workspace settings, but then you'd have to do that for every project. If you only want to lint for this project, then select `Preferences: Open Workspace Settings` instead.

If all went well, VS Code should now complain whenever it sees linting errors.

Let's mess up `App.tsx` on purpose to see that in action:

{% include posts/picture.html img="linting-errors" ext="PNG" alt="Linting errors in VS Code." %}

Go ahead and save the file to automatically fix those errors.

At this point, you can also create a separate folder for your components and rearrange your files as you please.

## That About Does It! 🎉

You're all set for a more pleasant dev experience with create-react-app.

I hope you found this tutorial helpful!