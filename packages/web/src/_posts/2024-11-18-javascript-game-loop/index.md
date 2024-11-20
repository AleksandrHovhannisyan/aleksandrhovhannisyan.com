---
title: Performant Game Loops in JavaScript
description: A look at some best practices for creating performant game animations in JavaScript.
categories: [game-dev, javascript, webperf]
scripts:
  - type: module
    src: /assets/scripts/demos/gameLoop.js
---

Below is a demo of a very basic game implemented with an HTML canvas and some JavaScript. The character is represented by the black circle, and its direction of movement is indicated by the line. Click or tab to the game area to begin; use <kbd>W</kbd> to move forward, <kbd>S</kbd> to move backward, <kbd>A</kbd> to rotate left, and <kbd>D</kbd> to rotate right.

<game-loop width="600" height="300" title="Game loop demo" class="flex"></game-loop>

Let's learn how to create silky-smooth game animations like this in JavaScript.

## Smooth Animation Frames

The term <dfn>game loop</dfn> refers to the logic that runs during each animation frame of a game. Frames are responsible for drawing all objects, handling user input, checking for collisions, and so on.

In code, a game "loop" is rarely a `for` or a busy `while(true)` loop, even if it may seem like one. Instead, it's a function that calls other subroutines, and this function is repeatedly invoked by the game engine runtime:

```js
// run this N times per second
function update() {
    checkPlayerInput();
    draw();
}
```

In JavaScript, you may be tempted to implement an update loop with `setTimeout` or `setInterval`. While this would technically work, it would be terrible for performance as it would indefinitely tie up the main thread. Both of these functions schedule tasks on the event loop's [macrotask queue](https://javascript.info/event-loop), and tasks run on the main thread. This leads to noticeably degraded performance and interferes with input handling. In fact, the entire page may become unresponsive. So never do this:

```js
const FPS = 60;
function update() {
    // ❌ incorrect
    setTimeout(() => {
        checkPlayerInput();
        draw();
        update();
    }, 1000 / FPS)
}
```

Instead, use [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) to queue callbacks that will run during the next render opportunity in [the event loop](https://html.spec.whatwg.org/multipage/webappapis.html), after the browser is done processing macro- and micro-tasks. These render callbacks are enqueued roughly 60 times per second (60 FPS) and do not interfere with other tasks:

```js {data-copyable="true"}
function update() {
    // ✅ correct
    requestAnimationFrame(() => {
        checkPlayerInput();
        draw();
        update();
    });
}

update();
```

Ordinarily, a function that calls itself synchronously would lead to infinite recursion and overflow the stack, so the above code may seem problematic because it looks like `update` is calling itself. However, it's not calling itself _synchronously_. Instead, it's telling `requestAnimationFrame` to schedule a future `update` call during the next render opportunity. Since every `update` call is allowed to finish without waiting on any other code, the stack never overflows.

This tutorial won't dive into the finer details of how to actually implement a canvas-based game in JavaScript, but there's one more thing worth calling out. You'll want to clear your canvas in each animation frame to wipe away the previous frame and then repaint the shapes for the current frame onto that blank canvas. Most game engines already do this for you. Something like this pseudo-code:

```js
function draw() {
    // 1. Clear canvas
    canvas.clear('desired background color');
    // 2. Draw player, environment, etc.
    player.draw(canvas);
    environment.draw(canvas);
}
```

## Responsive Input Handling

When making games with JavaScript, a common mistake is to update game state outside of `requestAnimationFrame` in response to user input. This can cause performance problems if the controls are time sensitive, like for player movement:

```js
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        // ❌ don't do this
        player.moveLeft();
    }
});

function update() {
    requestAnimationFrame(() => {
        draw();
        update();
    });
}
```

This code will feel unresponsive since it updates the player position in an event handler that runs slower than 60 FPS, outside the animation frame. So even if the player keeps a button pressed continuously, their position will update very slowly compared to all other animations, causing their movement to feel sluggish. In other words, the player will feel like their input can't keep up with the rest of the game.

The correct approach is to keep track of all keys that are currently pressed and update the game state in the animation frame:

```js {data-copyable="true"}
const pressedKeys = new Set();
const isKeyDown = (key) => pressedKeys.has(key);
document.addEventListener('keydown', (e) => pressedKeys.add(e.key));
document.addEventListener('keyup', (e) => pressedKeys.delete(e.key));

function checkPlayerInput() {
    if (isKeyDown('ArrowLeft')) {
        player.moveLeft();
    }
    // etc.
}

function update() {
    requestAnimationFrame(() => {
        // Now we're updating state INSIDE the 
        // game loop, at the same 60 FPS as draw()
        checkPlayerInput();
        draw();
        update();
    });
}
```

Even though these event handlers are still running outside `requestAnimationFrame` like in the first example, those handlers are no longer updating the game state. Instead, they're keeping track of every key that's currently pressed—which, unlike a player's position, is a binary state of either pressed or not pressed. As long as the player doesn't lift up that key, the next animation frame will see that the key is still pressed and update the player's position at the same FPS as the rendering and other game logic. This leads to smoother input handling and responsive player movement that's synchronized with animations.
