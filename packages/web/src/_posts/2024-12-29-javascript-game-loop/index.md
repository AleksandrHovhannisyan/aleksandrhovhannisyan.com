---
title: Performant Game Loops in JavaScript
description: A look at some best practices for creating performant game animations in JavaScript.
categories: [game-dev, javascript, webperf]
scripts:
  - type: module
    src: src/assets/scripts/components/gameLoop.ts
---

Below is a demo of a basic game implemented with an HTML canvas and some JavaScript. The character is represented by the black circle, and its direction of movement is indicated by the line. Click or tab to the game area to begin; use <kbd>W</kbd> to move forward, <kbd>S</kbd> to move backward, <kbd>A</kbd> to rotate left, and <kbd>D</kbd> to rotate right.

<game-loop width="600" height="300" title="Game loop demo" class="flex" style="aspect-ratio: 600/300" player-move-speed="5" player-turn-speed="5" max-fps="60"></game-loop>

Let's learn how to create silky-smooth game animations like this in JavaScript.

## Implementing a Game Loop

The term <dfn>game loop</dfn> refers to the logic that runs during each animation frame of a game. Frames are responsible for drawing all objects, handling user input, checking for collisions, and so on. In code, a game "loop" is rarely a busy `while(true)` loop, even if it may seem like one. Instead, it's a function that calls other subroutines, and this function is repeatedly invoked by the game engine runtime at a fixed rate:

```js
// run this N times per second
function update() {
  updatePhysics();
  draw();
}
```

So how do we implement something like this in JavaScript?

### The Wrong Approach

You might be tempted to use `setTimeout` or `setInterval`:

```js
const MAX_FPS = 60;
const FRAME_INTERVAL_MS = 1000 / MAX_FPS;

function update() {
  setTimeout(() => {
    updatePhysics();
    draw();
    update();
  }, FRAME_INTERVAL_MS);
}
```

While this would technically work, it wouldn't be performant. Both of these functions schedule their callbacks to run at a later point in time by pushing the callbacks onto the event loop's [macrotask queue](https://javascript.info/event-loop). But the macrotask queue is also responsible for event handling, which is normally considered time sensitive. For example, if the user presses a key and your application has a `keydown` handler, the handler callback won't be executed synchronously. Instead, it'll be pushed onto the macrotask queue, and the event loop will run the callback as soon as other work is finished (asynchronously). If your game loop also pushes animation frames onto the same queue, your rendering and input handling will interfere with each other. If the user fires too many input events, the event callbacks will stack up in the macrotask queue and delay the execution of animation callbacks.

Conversely, if you try to run your game at too high an FPS, user input may feel unresponsive, as input handlers won't get a chance to run as frequently as they normally would. Remember: `setTimeout` doesn't _guarantee_ that the callback will be invoked exactly when you tell it. It only guarantees that the callback will be invoked after `>= delay` time passes.

### Correct Approach: `requestAnimationFrame`

For this reason, the event loop doesn't _just_ process macro- or micro-tasks. Instead, it also reserves special checkpoints at regular intervals—known as a <dfn>render opportunities</dfn>—when the browser's main thread is allowed to switch to doing UI work. Render opportunities are the perfect time for animations because they're scheduled to run right before the browser repaints.

The way we do this is by calling [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) and passing in the callback function that we want to execute during the next render opportunity:

```js {data-copyable="true"}
function update() {
  // ✅ better, but not perfect (more on that shortly)
  requestAnimationFrame(() => {
    updatePhysics();
    draw();
    update();
  });
}

update();
```

In this example, we call a function named `update`, which in turn calls `requestAnimationFrame` and schedules an anonymous callback to run during the next render opportunity. That callback function does three things:

1. It calls some `updatePhysics` function (e.g., to handle player movement).
2. It draws/paints the game scene (e.g., to an HTML canvas).
3. It calls `update` again to continue the game loop indefinitely.

Ordinarily, a function that calls itself synchronously would lead to infinite recursion and overflow the stack, so the above code may seem problematic because it looks like `update` is calling itself. However, the key difference is that it's not calling itself _synchronously_. Instead, it's telling `requestAnimationFrame` to schedule a future `update` call during the next render opportunity. Since every `update` call is allowed to finish without waiting on any other code, the stack never overflows.

Like `setTimeout` and `setInterval`, `requestAnimationFrame` takes a callback that will run at a later point in time. But in this case, that point in time is the next render opportunity, after the browser is done processing macro- and micro-tasks and just before it repaints. These render callbacks don't interfere with other tasks, and they're enqueued at a regular interval: the <dfn>refresh rate</dfn> of the user's display.

For example, a 60 Hz display is one that refreshes 60 times per second, so the event loop will schedule `requestAnimationFrame` callbacks in such a way that 60 of them get a chance to run every second (60 FPS). In other words, each callback will be invoked roughly `1000 ms / 60 = 16.67 ms` after the previous one, meaning each frame will have only ~16.67 ms to do all of its work (your <dfn>animation budget</dfn>). Meanwhile, on a 120 Hz display, the event loop will do its best to ensure that there are 120 render opportunities per second; each animation frame will get roughly `1000 ms / 120 = 8.33 ms` to do all its work. If a frame exceeds its budget, the overall frame rate drops.

While this code is much better than what we started with, it has a major flaw.

### Enforcing a Maximum FPS for Physics

If you were to just run this code as-is, it may seem fine on whatever display you're testing with. On most modern devices, that's likely going to be a 60 Hz display, so you would design your game physics around that to make it feel right. But if someone were to play your game on a 120 Hz display, the `requestAnimationFrame` callbacks would be invoked twice as frequently. This isn't a problem for our `draw()` function, which just paints the current scene onto a canvas. But since the function responsible for updating physics would also be called twice as often, a player on a 120 Hz display would move twice as fast as a player on a 60 Hz display and zoom off screen in the blink of an eye. Not good!

To fix this, we can enforce a maximum allowed FPS for physics. The callback function passed to `requestAnimationFrame` actually receives an argument that can help with this: the "wall clock" timestamp, in milliseconds, relative to when the browser started its internal timer for the current page (usually on or after page load).

```js
let previousTimeMs = 0;

requestAnimationFrame((currentTimeMs) => {
  const deltaTimeMs = currentTimeMs - previousTimeMs;
  previousTimeMs = currentTimeMs;
});
```

The demo below uses this code to count the number of `requestAnimationFrame` callbacks invoked over a fixed time frame and calculate the average FPS. For a 60 Hz monitor, the result should be very close to 60 FPS, give or take. Run the demo below to find out what your refresh rate is and to log the values of `previousTimeMs`, `currentTimeMs`, and `deltaTimeMs`:

{% codeDemo "Demo of requestAnimationFrame timing" %}

```html
<div id="demo">
  <h1>FPS of requestAnimationFrame</h1>
  <p>Tests run over a 5-second interval.</p>
  <div>
    <button id="start-demo">Start recording</button>
  </div>
</div>
```

```css
#demo h1 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 0.5lh;
}
#demo p {
  text-align: center;
  margin-bottom: 1lh;
}
#demo button {
  text-align: center;
  padding: 0.5em;
  display: block;
  margin: 0 auto;
}
#demo button[aria-disabled='true'] {
  opacity: 0.7;
  cursor: not-allowed;
}
```

```js
let isRunning = false;
const MAX_ALLOWED_TIME_MS = 5000;
const startDemoButton = document.querySelector('#demo button');

startDemoButton.addEventListener('click', () => {
  if (isRunning) return;

  isRunning = true;
  startDemoButton.setAttribute('aria-disabled', 'true');
  let demoStartTimeMs = 0;
  let demoEndTimeMs;
  let previousTimeMs = 0;
  let numFrames = 0;

  function update() {
    requestAnimationFrame((currentTimeMs) => {
      numFrames++;
      if (!demoStartTimeMs) {
        demoStartTimeMs = currentTimeMs;
        previousTimeMs = currentTimeMs;
      }
      const deltaTimeMs = currentTimeMs - previousTimeMs;
      previousTimeMs = currentTimeMs;
      demoEndTimeMs = currentTimeMs;
      console.log(
        `previousTimeMs: ${previousTimeMs.toFixed(2)}, currentTimeMs: ${currentTimeMs.toFixed(2)}, deltaTimeMs: ${deltaTimeMs.toFixed(2)}`
      );
      if (currentTimeMs - demoStartTimeMs >= MAX_ALLOWED_TIME_MS) {
        demoEndTimeMs = currentTimeMs;
        const demoTimeElapsedMs = demoEndTimeMs - demoStartTimeMs;
        const averageFPS = ((numFrames - 1) / MAX_ALLOWED_TIME_MS) * 1000;
        console.log(`End of demo. Average recorded FPS: ${Math.floor(averageFPS)}`);
        startDemoButton.setAttribute('aria-disabled', 'false');
        isRunning = false;
      } else {
        update();
      }
    });
  }
  update();
});
```

{% endcodeDemo %}

Let's take this a step further. By keeping track of when the previous frame was called, we can calculate the amount of elapsed time between that frame and the current frame to ensure that we never update our game's physics faster than a maximum FPS:

```js {data-copyable="true"}
const MAX_FPS = 60;
const FRAME_INTERVAL_MS = 1000 / MAX_FPS;
let previousTimeMs = 0;

function update() {
  requestAnimationFrame((currentTimeMs) => {
    const deltaTimeMs = currentTimeMs - previousTimeMs;

    if (deltaTimeMs >= FRAME_INTERVAL_MS) {
      updatePhysics();
      previousTimeMs = currentTimeMs;
    }

    draw();
    update();
  });
}
```

In this code, we first compute the animation budget of each frame. Assuming we want to limit physics updates to 60 FPS, the budget comes out to `1000 ms / 60 = 16.67 ms` per frame. We then keep track of the timestamp when the previous frame executed, calculate the amount of real time that elapsed since then, and only run the game physics if at least that much time has elapsed. So even if the native refresh rate is 120 Hz and `requestAnimationFrame` callbacks are invoked once every 8.3 ms, our `updatePhysics` function will only be called at most once every 16.67 ms, ensuring that player physics never updates faster than 60 FPS.

{% aside %}
We can't just check for strict equality, as a frame may exceed its budget in practice if it's doing a lot of heavy computation.
{% endaside %}

Meanwhile, you'll notice that we're still drawing/painting the game scene at the native refresh rate by calling our `draw` function outside the time check. It's okay—and often desirable—to _repaint_ your game at the native refresh rate to create smoother animations.

### Frame Synchronization

Despite these improvements, there's still another problem with our code. I'll explain the problem with an analogy.

Imagine you're operating a train station where trains are expected to arrive and depart every 30 minutes, and only one train may be present at the station at any given time. The last time a train arrived at the station was at 12:00 pm, so the next train is expected to arrive at 12:30 pm per your schedule. However, due to some technical difficulties, the train arrives late by 15 minutes, at 12:45 pm. When should the next train arrive?

Well, ideally, we want the overall schedule to be consistent and predictable regardless of individual hiccups. So even if one train arrives a little late, we still want the next train to arrive at its originally scheduled time increment of 30 minutes so that we're able to squeeze two train arrivals into a single hour. In this case, that would mean the next train should arrive at `12:30 + 00:30 = 1:00 pm`, not at `12:45 + 00:30 = 1:15 pm`. Otherwise, a single delay would shift the entire schedule over by 15 minutes, and all our passengers would be late.

Now, consider what would happen if we were to use our code as-is to model this train station. All I've done here is rename our variables and functions:

```js
const MAX_TRAIN_ARRIVALS_PER_HOUR = 2;
const TRANSIT_INTERVAL_MINUTES = 60 / MAX_TRAIN_ARRIVALS_PER_HOUR;
let previousTimeMinutes = 0;

function runTrainStation() {
  requestTrain((currentTimeMinutes) => {
    const deltaTimeMinutes = currentTimeMinutes - previousTimeMinutes;

    if (deltaTimeMinutes >= TRANSIT_INTERVAL_MINUTES) {
      receiveTrain();
      previousTimeMinutes = currentTimeMinutes;
    }

    runTrainStation();
  });
}
```

For the train scenario I described, let's pretend that `previousTimeMinutes` was `0`, and `currentTimeMinutes` according to the wall clock was `45` for the train that arrived 15 minutes late; thus, `deltaTimeMinutes` is `45` instead of the expected `30`. If we were to just set `previousTimeMinutes = currentTimeMinutes` like we currently do, those 15 minutes that we lost would delay the arrival time of the next train, and the one after that, and so on. Because now, instead of the next train arriving at an absolute timestamp of `t = 30 + 30 = 60 mins`, it actually won't arrive until at least `t >= 45 + 30 = 75 mins`. Thus, the entire schedule will shift forward by those 15 minutes that we lost, and our transit rate will drop from two trains to just one train in that one-hour window.

Translating this back into game dev terms, it means that if one frame takes longer to complete its work, the next frame will be needlessly delayed, creating a choppy and irregular feel where frames don't arrive at their originally scheduled times. To fix this problem, we need to use some modular arithmetic to "rewind" the clock, so to speak. We'll calculate the excess time (if any) by which the previous frame overshot its budget, and we'll subtract that amount from `currentTimeMs` to ensure that the next frame arrives on time:

```js {data-copyable="true"}
const MAX_FPS = 60;
const FRAME_INTERVAL_MS = 1000 / MAX_FPS;
let previousTimeMs = 0;

function update() {
  requestAnimationFrame((currentTimeMs) => {
    const deltaTimeMs = currentTimeMs - previousTimeMs;

    if (deltaTimeMs >= FRAME_INTERVAL_MS) {
      updatePhysics();
      // Synchronize next frame to arrive on time
      previousTimeMs = currentTimeMs - (deltaTimeMs % FRAME_INTERVAL_MS);
    }

    draw();
    update();
  });
}
```

In other words, we're telling a harmless lie. Yes, it's true that `previousTimeMs` shouldn't _actually_ be `currentTimeMs - (deltaTimeMs % FRAME_INTERVAL_MS)` from the perspective of the wall clock. But when we simulate rewinding the clock to account for any frame delays, the next frame _thinks_ it can still arrive at the next increment of `FRAME_INTERVAL_MS` as originally intended (e.g., at the next increment of ~16.67 ms for 60 FPS).

Our game loop is now complete! But there's still one thing we need to discuss.

## Responsive Input Handling

When making games with JavaScript, a common mistake is to update game state outside of `requestAnimationFrame` in response to user input. Not only does this cause problems if the player wants to press multiple keys, but it can also cause performance problems if the controls are time sensitive, like for player movement:

```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    // ❌ don't do this
    player.moveLeft();
  }
});

function update() {
  // Frame synchronization omitted for brevity
  requestAnimationFrame(() => {
    draw();
    update();
  });
}
```

This code will feel unresponsive since it updates the player position in a keydown handler that's almost certainly going to run slower than the device's refresh rate, outside the animation frame. So even if the player keeps a button pressed continuously, their position will update very slowly compared to all other animations, causing their movement to feel sluggish. In other words, the player will feel like their input can't keep up with the rest of the game.

The correct approach is to use a global event listener to keep track of all keys that are currently pressed and update the game state in the animation frame. There are many ways to do this; here is just one example using a `Set` to keep track of pressed keys:

```js {data-copyable="true"}
const pressedKeys = new Set();
const isKeyDown = (key) => pressedKeys.has(key);
document.addEventListener('keydown', (e) => pressedKeys.add(e.key));
document.addEventListener('keyup', (e) => pressedKeys.delete(e.key));

function updatePhysics() {
  if (isKeyDown('ArrowLeft')) {
    player.moveLeft();
  }
}

function update() {
  requestAnimationFrame(() => {
    // Now we're updating state INSIDE the game loop
    updatePhysics();
    draw();
    update();
  });
}
```

{% aside %}
Again, you would want to limit the FPS of the `updatePhysics` calls as shown before. I've omitted that code here for brevity.
{% endaside %}

Even though these event handlers are still running outside `requestAnimationFrame` like in the first example, those handlers are no longer updating the game state. Instead, they're keeping track of every key that's currently pressed—which, unlike a player's position, is a binary state of either pressed or not pressed. As long as the player doesn't lift up that key, the next animation frame will see that the key is still pressed and update the player's position at the same FPS as the rendering and other game logic. This leads to smoother input handling and responsive player movement that's synchronized with animations.

## Summary

In JavaScript, `requestAnimationFrame` is the preferred way to write performant animation code that's synchronized with the refresh rate of a user's display. With some extra care, we can also ensure that our game physics updates at a predictable rate and that user input is handled smoothly.
