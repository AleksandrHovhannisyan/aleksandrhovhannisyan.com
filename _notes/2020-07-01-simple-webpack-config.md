---
title: A Simple Webpack Config
description: Bundle your JavaScript code with this simple Webpack config.
keywords: [simple webpack config]
---

Let's assume your directory structure looks like this for a JavaScript project:

```
.
├── config/
│   └── webpack.config.js
├── dist/
├── node_modules/
├── src
│   ├── components/
│   ├── util/
│   └── index.js
├── package.json
├── yarn.lock
├── index.html
```

And all you want is a simple webpack config that creates a single bundled JavaScript file.

First, install webpack if you haven't already done so:

{% capture code %}yarn add webpack webpack-cli{% endcapture %}
{% include code.html code=code lang="bash" %}

Once that's done, add this script to your `package.json`:

{% capture code %}"scripts": {
    "build": "webpack --config config/webpack.config.js --mode production"
}{% endcapture %}
{% include code.html file="package.json" code=code lang="json" %}

And then create this simple webpack config under `config/`:

{% capture code %}const path = require('path');

module.exports = {
  context: path.resolve('src/'),
  // Start here: /src/app.js
  entry: {
    main: path.resolve(__dirname, '../src/index.js'),
  },
  // Put the bundled code here: /dist/app.bundle.js
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'app.bundle.js',
  },
};
{% endcapture %}
{% include code.html file="webpack.config.js" code=code lang="javascript" %}

Here's how it works:

1. `entry` tells webpack where to look for your app's entry point. In this case, that's `index.js`. Note that it expects an absolute path to the file, hence why we need `path.resolve`.

2. `output` tells webpack where to put the bundled JavaScript. In this case, we'll put it under `dist/app.bundle.js`. Note that the `dist/` directory must exist; it won't get created for you.

Run `yarn build` to bundle your code. Here's some sample output:

```
yarn run v1.22.4
$ webpack --config config/webpack.config.js --mode production
Hash: d60fd368c37fd04c102f
Version: webpack 4.43.0
Time: 209ms
Built at: 07/01/2020 7:59:18 AM
        Asset      Size  Chunks             Chunk Names
app.bundle.js  1.08 KiB       0  [emitted]  main
Entrypoint main = app.bundle.js
[0] ./index.js + 3 modules 499 bytes {0} [built]
    | ./index.js 188 bytes [built]
    | ./util/log.js 70 bytes [built]
    |     + 2 hidden modules
Done in 2.47s.
```

Now you can include the bundled code in your HTML file:

{% capture code %}<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A Simple Webpack Config</title>
</head>
<body>    
    <script src="dist/app.bundle.js"></script>
</body>
</html>{% endcapture %}
{% include code.html file="index.html" code=code lang="html" %}

And that's all you need for a simple webpack config!

## Webpack Absolute Imports

Relative imports can get pretty nasty: `import X from '../../../'`.

To use absolute imports in webpack, we'll set up import aliases. Here's the new webpack config:

{% capture code %}const path = require('path');

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      util: path.resolve(__dirname, '../src/util'),
    },
  },
  entry: {
    main: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'app.bundle.js',
  },
};{% endcapture %}
{% include code.html file="config/webpack.config.js" code=code lang="javascript" %}

So imports like this:

```javascript
import Module from '../../components/Module';
```

Become this:

```javascript
import Module from 'components/Module';
```

If you're using VS Code, you can take this one step further and create a `jsconfig.json`:

{% capture code %}{
    "compilerOptions": {
        "baseUrl": "./src/",
        "paths": {
            "components/*": ["components/*"],
            "util/*": ["util/*"],
        }
    }
}{% endcapture %}
{% include code.html file="jsconfig.json" code=code lang="json" %}

So now, if you start typing the name of a non-imported module, VS Code will look it up and automatically import it for you.

{% include picture.html path="/assets/img/notes/simple-webpack-config/" img="vscode" ext="GIF" alt="Auto-importing modules in VS Code" shadow=false %}

I hope this helps!
