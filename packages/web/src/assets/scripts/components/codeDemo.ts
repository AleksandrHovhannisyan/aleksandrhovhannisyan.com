import { LocalIframe } from 'local-iframe/LocalIframe';

const consoleHTML = `
<footer id="console-root">
    <div id="console-header">
        <p id="console-label">Console output</p>
        <button id="console-clear-button">Clear console</button>
    </div>
    <div id="console-wrapper" role="region" tabindex="0" aria-labelledby="console-label">
        <ol id="console" aria-live="polite" aria-atomic="true" aria-relevant="additions"></ol>
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
    --color-danger: #c10000;
}
html.no-scroll {
    overflow: hidden;
}
html,
body {
    background-color: white;
    min-height: 100%;
    height: 100%;
}
body {
    font-family: sans-serif;
    display: grid;
}
body:has(#console-root) {
    padding: 0;
    grid-template-rows: 1fr 50%;

    main {
        display: grid;
        place-content: center;
        overflow-y: auto;
        margin-block: auto;
    }
}
main {
    padding: 28px;
    height: 100%;
}
button {
    cursor: pointer;
    font: inherit;
    padding: 0.5rem;
}
#console-root {
    font-size: medium;
    background-color: var(--color-surface-1);
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: auto;
}
#console-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-block: solid 1px var(--color-border-0);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    background-color: var(--color-surface-2);
}
#console-clear-button {
    background: transparent;
    font-size: inherit;
    border: none;
    padding: 0.25rem;
    text-decoration: underline;
}
#console-wrapper {
    padding: 0.5rem;
    background-color: inherit;
    overflow-y: auto;
}
#console {
    list-style: none;
    display: block;
    font-family: monospace;
    padding: 0;
}
#console > * {
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 0.25rem;
    padding-inline-end: 0.5rem;
}
#console .error {
    color: var(--color-danger);
}
#console time {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-soft);
}`;

const consoleJS = `
(function initConsole(){
    const consoleRoot = document.querySelector('#console-root');
    const consoleOutput = consoleRoot.querySelector('#console');
    const consoleScrollContainer = consoleRoot.querySelector('[tabindex]');
    const clearButton = consoleRoot.querySelector('#console-clear-button');

    const makeLogger = (level) => (...args) => {
      const li = document.createElement('li');
      const time = document.createElement('time');
      const now = new Date();
      time.setAttribute('datetime', now.toISOString());
      time.innerHTML = Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(now);
      if (level) { li.classList.add(level); }
      li.append([...args].map((arg) => {
        const isUndefined = typeof arg === 'undefined';
        return isUndefined ? 'undefined' : JSON.stringify(arg);
      }).join(" "));
      li.appendChild(time);
      consoleOutput.appendChild(li);
      consoleScrollContainer.scrollBy({ top: consoleScrollContainer.scrollHeight });
    };

    console.log = makeLogger();
    console.warn = console.log;
    console.error = makeLogger("error");

    // Custom unhandled promise rejection logs
    window.addEventListener("unhandledrejection", (event) => {
        console.error('Uncaught (in promise) ' + event.reason);
    }, { capture: true });

    // Use capturing listener to preempt any other capturing listeners in the code demo itself
    window.addEventListener('click', (e) => {
        // Prevent clicks on output region from propagating to avoid interfering with code demos on event propagation.
        // Note: We must run their handlers manually below, see clearButton.
        if (e.target === consoleRoot || consoleRoot.contains(e.target)) {
            e.stopPropagation();
        }
        // why do this here? because in some of my code demos, I stop event propagation in capturing event listeners on body/html,
        // and since the clearButton is a child of those elements, that would effectively prevent its click event handler from running during the targeting phase
        if (e.target === clearButton) {
            consoleOutput.innerHTML = '';
        }
    }, { capture: true });
})();
`;

class CodeDemo extends LocalIframe {
  protected _render(templateHtml: string): string {
    // Not the most rigorous logic, but good enough
    const hasScripts = templateHtml.includes('<script>');
    return `<!DOCTYPE html>
  <html${this.fitContent ? ' class="no-scroll"' : ''}>
    <head>
        <meta charset="utf-8">
        <style>${consoleCSS}</style>
    </head>
    <body>
        <main><div>${templateHtml}</div></main>
        ${hasScripts ? `${consoleHTML}<script>${consoleJS}</script>` : ''}
    </body>
  </html>
    `;
  }
}

window.customElements.define('code-demo', CodeDemo);
