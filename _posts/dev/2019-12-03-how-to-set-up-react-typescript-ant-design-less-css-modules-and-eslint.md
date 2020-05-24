---
title: 'How to Set up Create React App with TypeScript, Ant Design, LESS, CSS Modules, and ESLint'
description: Enjoy a better dev experience by setting up React with TypeScript, customizing the Ant Design theme with LESS and CSS Modules, and formatting your code with ESLint, all without ejecting from CRA.
keywords: ['create react app with typescript', 'customize ant design theme', 'create react app css modules and typescript']
tags: [dev, frontend, react]
isCanonical: true
lastUpdated: 2020-03-24
---

Let's skip the exposition and just jump right in. I'll use VS Code to make my life easier; I recommend that you do the same. Note that I'll be using yarn as my package manager, but you can also use npm.

{% include linkedHeading.html heading="1. Setting up Create React App with TypeScript 💻" level=2 %}

Switch to your target project directory and run this command:

{% capture code %}npx create-react-app . --template typescript{% endcapture %}
{% include code.html code=code lang="bash" %}

Alternatively, if your project directory does not yet exist, you can create it in one go:

{% capture code %}npx create-react-app new-project-dir-name --template typescript{% endcapture %}
{% include code.html code=code lang="bash" %}

This uses Facebook's [create-react-app](https://create-react-app.dev/) to initialize a React project with TypeScript. React by itself is pretty powerful, but React with TypeScript is a much, *much* better dev experience, in my opinion.

> **Note**: You may come across older tutorials that simply pass in the `--typescript` flag to this command. That used to work, but [it was recently deprecated](https://github.com/facebook/create-react-app/tree/master/packages/cra-template-typescript). CRA now uses the template flag.

Here's what your directory structure and `package.json` should roughly look like once that's done:

{% include picture.html img="structure" ext="JPG" alt="The directory structure of a CRA project." %}

Version numbers may obviously differ.

Beyond this point, most people have trouble overriding Create React App's Webpack configs without ejecting. Fortunately, as we'll see shortly, it's not all that difficult!

{% include linkedHeading.html heading="2. Setting Up Ant Design and LESS 🎨" level=2 %}

Ant Design is a fantastic library for React and other JavaScript frameworks that provides reusable and customizable components, like date pickers, lists, SVG icons, and _lots_ of other cool stuff. Let's set it up.

### Installing Ant Design

Run this command:

{% capture code %}yarn add antd{% endcapture %}
{% include code.html code=code lang="bash" %}

Note that `antd` already comes with type definitions, so there's no need to install `@types/` for it.

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

{% capture code %}yarn add -D babel-plugin-import{% endcapture %}
{% include code.html code=code lang="bash" %}

Then install the `react-app-rewired` and `customize-cra` packages:

{% capture code %}yarn add react-app-rewired customize-cra{% endcapture %}
{% include code.html code=code lang="bash" %}

These allow us to customize create-react-app without ejecting.

Change the scripts in your `package.json` to use `react-app-rewired`:

{% capture code %}"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}{% endcapture %}
{% include code.html file="package.json" code=code lang="json" %}

Create a file named `config-overrides.js` at the root of your project directory with this code:

{% capture code %}const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
);{% endcapture %}
{% include code.html file="config-overrides.js" code=code lang="javascript" %}

Now, you can import antd components in your source files like you would from any other package, without having to additionally specify the stylesheet or the specific lib path to import from.

Let's try it out. Open up your `App.tsx` and replace it with the following:

{% capture code %}{% raw %}import React from 'react';
import { Button } from 'antd';

const App = () => {
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

export default App;{% endraw %}{% endcapture %}

{% include code.html file="src/App.tsx" code=code lang="jsx" %}

If your app was already running, you'll need to restart it to observe these new changes.

Here's the result once you do that:

{% include picture.html img="button1" ext="JPG" alt="An Ant Design button and anchor." %}

### Customize the Ant Design Theme with LESS

Let's say you want to use a different primary color or base font size. Easy peasy!

First, install the `less` and `less-loader` packages:

{% capture code %}yarn add less less-loader{% endcapture %}
{% include code.html code=code lang="bash" %}

> **Warning**: Be sure to check [this issue on GitHub](https://github.com/arackaf/customize-cra/issues/226) regarding a conflict between `customize-cra` and `css-loader`. The temporary solution, until `customize-cra@1.0` is released, is to run `yarn upgrade customize-cra@next`. I had the same problem; the suggested solution worked for me.

Then, simply add a LESS loader to your config overrides:

{% capture code %}const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#f48549', // customize as needed
      '@link-color': '#e6a07c', // customize as needed
      '@font-size-base': '18px' // customize as needed
    }
  })
);{% endcapture %}
{% include code.html file="config-overrides.js" code=code lang="javascript" %}

That's it! Restart your app again to see the new results in your browser:

{% include picture.html img="button2" ext="JPG" alt="An Ant Design button and anchor, styled using a custom color." %}

The best part is that Ant Design's UI is consistent, using shades of your primary color for all components to give your app a cohesive, branded look.

If you want to customize Ant Design's theme even more, [check out their list of supported variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less).

{% include linkedHeading.html heading="3. Create React App CSS Modules and TypeScript 📦" level=2 %}

By default, create-react-app v2 ships with CSS Modules out of the box.

But how do we use CSS Modules with TypeScript?

This was an absolute headache to deal with before. But now, there's a package that does just what we want, and it's [made by a tech lead on Facebook's CRA team](https://github.com/mrmckeb)!

{% capture code %}yarn add -D typescript-plugin-css-modules{% endcapture %}
{% include code.html code=code lang="bash" %}

After it's installed, add the plugin to your `tsconfig.json`:

{% capture code %}{
  "compilerOptions": {
    "plugins": [{ "name": "typescript-plugin-css-modules" }]
  }
}{% endcapture %}
{% include code.html file="tsconfig.json" code=code lang="json" %}

Next, create a file named `global.d.ts` under your `src` directory. You can actually name this file whatever you want, as long as it has the `.d.ts` extension. Paste in this module declaration:

{% capture code %}declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}{% endcapture %}

{% include code.html file="src/global.d.ts" code=code lang="javascript" %}

Want to use Sass or CSS instead of Less? No problem! Simply replace the `.less` extension.

We're almost done! Per the plugin's [usage instructions](https://www.npmjs.com/package/typescript-plugin-css-modules#visual-studio-code), you'll need to force VS Code to use your workspace version of TypeScript instead of the globally installed version. Remember when we installed TypeScript via CRA at the very beginning? That's our workspace version of TypeScript.

Here's how to use the workspace version of TypeScript in VS Code:

1. Open any TypeScript file.
2. Click the version number on the blue status bar at the bottom of VS Code.
3. Select `Use Workspace Version` (3.7.3 as of this writing).

Here's a screenshot to make that clearer:

{% include picture.html img="workspace-version" ext="JPG" alt="Using the workspace version of TypeScript in VS Code." %}

Once you do that, VS Code will create a `.vscode` directory in your project for workspace settings.

With that out of the way, let's now create a LESS stylesheet for our `App` component to move all the styles from before out of our JS. Name it `App.module.less` and fill it with these rules:

{% capture code %}.app {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 500px;
    justify-content: center;
}{% endcapture %}
{% include code.html file="src/App.module.less" code=code lang="css" %}

Then, import the stylesheet like this in your component file:

{% capture code %}import styles from './App.module.less';{% endcapture %}
{% include code.html file="src/App.tsx" code=code lang="javascript" %}

If you now try to access `styles.app` or `styles.whateverClassOrIDYouWant`, you may not see the auto-complete suggestions immediately. That doesn't mean that your installation is broken, though—this is just a known VS Code issue.

The solution is to simply open up the VS Code command palette (`Ctrl+Shift+P` on Windows and `Cmd+Shift+P` on Mac) and do `Developer: Reload Window`. Then simply wait for VS Code to re-initialize TypeScript intellisense (keep an eye on the bottom-left of the status bar). Here's a demo:

{% include picture.html img="reload" ext="GIF" alt="Reloading VS Code and waiting for TypeScript to initialize." %}

Once that's done, you won't have to guess or remind yourself what you named your CSS classes/IDs:

{% include picture.html img="intellisense" ext="JPG" alt="VS Code autocomplete for TypeScript CSS Modules." %}

Awesome! 😎 Here's what `App.tsx` should look like if you've been following along:

{% capture code %}{% raw %}import React from 'react';
import { Button } from 'antd';
import styles from './App.module.less';

const App = () => {
  return (
    <main className={styles.app}>
      <Button type="primary">Hello, Ant Design!</Button>
      <a href="foo.bar">I'm a link. Click me, please!</a>
    </main>
  );
};

export default App;{% endraw %}{% endcapture %}
{% include code.html file="src/App.tsx" code=code lang="jsx" %}

Refresh the page, and you'll see that it looks exactly the same, except we now get to take advantage of CSS Modules and LESS (as well as potentially SASS or vanilla CSS, if you'd like to use those instead).

{% include linkedHeading.html heading="4. Using ESLint with Create React App and Prettier 💅" level=2 %}

We *could* stop there, and put up with garbo code formatting and inconsistencies, and create more work for our collaborators as they try to reconcile several people's style preferences.

{% include picture.html img="but-why" ext="GIF" alt="But why, why would you do that? Why would you do any of that?" shadow=false %}

Or we could set up ESLint with Prettier to format our code consistently 🙂

First, install these packages:

{% capture code %}yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-config-react eslint-plugin-prettier prettier{% endcapture %}
{% include code.html code=code lang="bash" %}

(Credit goes to [Ben Weiser](https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675) for figuring this part out.)

Next, create a file named `.eslintrc.json` at the root of your project directory with this JSON:

{% capture code %}{
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
    "prettier/prettier": ["error"],
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "react/no-unescaped-entities": 0
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "parser": "@typescript-eslint/parser"
}{% endcapture %}
{% include code.html file=".eslintrc.json" code=code lang="json" %}

Create another file named `.prettierrc` at the root of your project directory with these contents:

{% capture code %}{
  "singleQuote": true,
  "printWidth": 80,
  "trailingComma": "es5"
}{% endcapture %}
{% include code.html file=".prettierrc" code=code lang="json" %}

This is where you'll define all your Prettier formatting rules. You *could* technically define these under `rules` in your `eslintrc` file, but I prefer to keep them separate. Also, note that you don't have to use these exact rules; you can change them if you'd like to.

### If You're Not Using VS Code

Add a `lint:fix` script to your `package.json` so you can fix linting errors as needed (you can name this script something else if you'd like to). This is what your scripts should look like:

{% capture code %}"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject",
    "lint:fix": "eslint --fix './src/**/*.{ts,tsx}'"
}{% endcapture %}
{% include code.html file="package.json" code=code lang="json" %}

Then, you can simply run `yarn lint:fix` from your terminal.

### If You Are Using VS Code

You can still use the above script, but I highly recommend that you also install these two VS Code extensions:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

At this point, you may not see any linting errors highlighted in VS Code, no matter how much you try to mess up your files—and that's because we need to add some rules to our VS Code settings.

Open up your command palette again (`Ctrl+Shift+P` on Windows and `Cmd+Shift+P` on Mac) and type `settings`. Then, click on `Preferences: Open Settings (JSON)`:

{% include picture.html img="command-palette" ext="JPG" alt="Opening user settings via the VS Code command palette." %}

Stick this somewhere inside the existing JSON blob:

{% capture code %}"[typescript]": {
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
}{% endcapture %}
{% include code.html code=code lang="json" %}

> **Note**: You could also just put this in your workspace settings, but then you'd have to do that for every project. If you only want to lint for this project, select `Preferences: Open Workspace Settings` instead.

If all went well, VS Code should now underline linting errors with red squiggly lines. And when you save a file with linting errors, ESLint will automatically fix them for you!

Let's mess up `App.tsx` on purpose to see this in action:

{% include picture.html img="fix-on-save" ext="GIF" alt="Auto-fixing linting errors in VS Code." %}

Note that some linting errors may still need to be corrected manually if there are no automatic fixes available. But this works for a majority of errors you'll come across, allowing you to code much more quickly and in whatever style you prefer.

## That About Does It! 🎉

You're all set for a more pleasant dev experience with create-react-app.

With everything set up, you can now create a separate folder for your components and rearrange your files as you please.

I hope you found this tutorial helpful!