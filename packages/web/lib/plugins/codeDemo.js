const consoleHTML = `
<footer id="output-root">
    <div id="output-header">
        <p id="output-label">Console output</p>
        <button id="clear-button">Clear console</button>
    </div>
    <div id="output-wrapper" role="region" tabindex="0" aria-labelledby="output-label">
        <ol id="output" aria-live="polite" aria-atomic="true" aria-relevant="additions"></ol>
    </div>
</footer>
`;

const consoleCSS = `
* {
    box-sizing: border-box;
    margin: 0;
}
:root {
    --color-border: hsl(0, 0%, 80%);
    --color-surface-1: hsl(0, 0%, 95%);
    --color-surface-2: hsl(0, 0%, 88%);
    --color-text-soft: hsl(0, 0%, 40%);
}
html,
body {
    background-color: white;
    height: 100%;
}
body {
    padding: 0;
    font-family: sans-serif;
    display: grid;
    grid-template-rows: 1fr 50%;
}
body:not(:has(#html)) {
    grid-template-rows: 1fr;
    overflow: hidden;
}
button {
    cursor: pointer;
    font: inherit;
}
#html {
    display: grid;
    place-content: center;
    padding: 1rem;
    overflow-y: auto;
}
#output-root {
    font-size: medium;
    background-color: var(--color-surface-1);
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto;
}
#output-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-block: solid 1px var(--color-border-0);
    padding: 0.5rem;
    background-color: var(--color-surface-2);
}
#clear-button {
    background: transparent;
    font-size: inherit;
    border: none;
    padding: 0.25rem;
    text-decoration: underline;
}
#output-wrapper {
    padding: 0.5rem;
    background-color: inherit;
    overflow-y: auto;
}
#output {
    list-style: none;
    display: block;
    font-family: monospace;
    padding: 0;
}
#output > * {
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 0.25rem;
    padding-inline-end: 0.5rem;
}
#output time {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-soft);
}`;

const consoleJS = `
(function initConsole(){
    const outputRoot = document.querySelector('#output-root');
    const output = outputRoot.querySelector('#output');
    const outputScrollContainer = outputRoot.querySelector('[tabindex]');
    const clearButton = outputRoot.querySelector('#clear-button');

    console.log = (...args) => {
      const li = document.createElement('li');
      const time = document.createElement('time');
      const now = new Date();
      time.setAttribute('datetime', now.toISOString());
      time.innerHTML = Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(now);
      li.append([...args].map((arg) => {
        const isUndefined = typeof arg === 'undefined';
        return isUndefined ? 'undefined' : JSON.stringify(arg);
      }).join(" "));
      li.appendChild(time);
      output.appendChild(li);
      outputScrollContainer.scrollBy({ top: outputScrollContainer.scrollHeight });
    };

    outputRoot.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Use capturing listener to preempt any other capturing listeners in the code demo itself
    window.addEventListener('click', (e) => {
        // Prevent clicks on output region from triggering logs
        if (e.target === outputRoot || outputRoot.contains(e.target)) {
            e.stopImmediatePropagation();
        }
        if (e.target === clearButton) {
            output.innerHTML = '';
        }
    }, { capture: true });
})();
`;

/**
 * @type {import('eleventy-plugin-code-demo/src/typedefs').EleventyPluginCodeDemoOptions}
 */
export const codeDemoOptions = {
  name: 'codeDemo',
  renderDocument: ({ html, css, js }) => `
    <!DOCTYPE html>
  <html>
    <head>
        <style>${consoleCSS}${css}</style>
    </head>
    <body>
        ${html ? `<main id="html">${html}</main>` : ''}
        ${consoleHTML}
        <script>${consoleJS}${js}</script>
    </body>
  </html>
    `,
  iframeAttributes: {
    class: 'code-preview',
    height: '308',
    style: 'width: 100%;',
  },
};
