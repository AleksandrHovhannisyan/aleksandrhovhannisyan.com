function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/** Two-dimensional vector. */
export default class Vector2 {
  /** @type {number} */
  x;
  /** @type {number} */
  y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Returns the Cartesian length of this vector. */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /** Returns this vector's angle, in radians. */
  get angle() {
    return Math.atan2(this.y, this.x);
  }

  /** Returns a new vector that's the result of scaling this vector by the given scalar.
   * @param {number} scalar
   */
  scaled(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /** Returns a new vector that's the result of normalizing this vector (i.e., a unit vector of length `1` in the same direction). */
  normalized() {
    return Vector2.from(this).scaled(1 / this.length);
  }

  /** Returns a new vector that's the result of rotating this vector by the given change in angle, in radians.
   * @param {number} angleDeltaRadians
   */
  rotated(angleDeltaRadians) {
    return new Vector2(
      this.x * Math.cos(angleDeltaRadians) - this.y * Math.sin(angleDeltaRadians),
      this.x * Math.sin(angleDeltaRadians) + this.y * Math.cos(angleDeltaRadians)
    );
  }

  /**
   * Returns a copy of a vector.
   * @param {Vector2} vector
   */
  static from(vector) {
    return new Vector2(vector.x, vector.y);
  }

  /**
   * Returns a new vector constructed from the given angle.
   * @param {number} angleRadians
   */
  static fromAngle(angleRadians) {
    return new Vector2(Math.cos(angleRadians), Math.sin(angleRadians));
  }

  /**
   * Returns the dot product of two vectors.
   * @param {Vector2} a
   * @param {Vector2} b
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
}

/**
 * Helper around `HTMLCanvasElement`. Pass a canvas to it and it provides methods for drawing.
 */
class Canvas {
  /** @type {HTMLCanvasElement} */
  #canvas;
  /** @type {CanvasRenderingContext2D} */
  #ctx;

  /** @type {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = this.#canvas.getContext('2d');
  }

  get width() {
    return this.#canvas.width;
  }

  get height() {
    return this.#canvas.height;
  }

  /** Clears the canvas with a solid color.
   * @param {string} color
   */
  clear(color) {
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(0, 0, this.width, this.height);
  }

  /** Draws a circle on the canvas at the specified coordinates.
   * @param {{ x: number; y: number; radius: number; color: string }}
   */
  circle({ x, y, radius, color }) {
    this.#ctx.fillStyle = color;
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.#ctx.fill();
  }

  /** Draws a line on the canvas from `(x1, y1)` to `(x2, y2)`.
   * @param {{ x1: number; y1: number; x2: number; y2: number; color: string; strokeWidth: number }}
   */
  line({ x1, y1, x2, y2, color, strokeWidth = 1 }) {
    this.#ctx.strokeStyle = color;
    this.#ctx.lineWidth = strokeWidth;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.stroke();
  }
}
class Player {
  /** @type {number} */
  radius;
  /** @type {Vector2} */
  position;
  /** @type {Vector2} */
  direction;
  /** @type {number} */
  #moveSpeed;
  /** @type {number} */
  #turnRadiansPerMs;

  /**
   * @param {{ position: Vector2; direction: Vector2; moveSpeed?: number; turnSpeedDegrees?: number; radius: number }} props
   */
  constructor({ position, direction, moveSpeed, turnSpeedDegrees, radius }) {
    this.position = position;
    this.direction = direction;
    this.radius = radius;
    if (moveSpeed) {
      this.setMoveSpeed(moveSpeed);
    }
    if (turnSpeedDegrees) {
      this.setTurnSpeed(toRadians(turnSpeedDegrees));
    }
  }

  /**
   * @param {number} moveSpeed
   */
  setMoveSpeed(moveSpeed) {
    this.#moveSpeed = Number(moveSpeed);
  }

  /**
   * @param {number} turnSpeedRadians
   */
  setTurnSpeed(turnSpeedRadians) {
    this.#turnRadiansPerMs = turnSpeedRadians;
  }

  /** Moves the player at its current speed in its current direction.
   * @param {-1|1} directionSign
   */
  move(directionSign) {
    const direction = this.direction.scaled(directionSign);
    this.position.x += direction.x * this.#moveSpeed;
    this.position.y += direction.y * this.#moveSpeed;
  }

  /**
   * Rotates this player at its .
   * @param {-1|1} directionSign
   */
  turn(directionSign) {
    this.direction = this.direction.rotated(directionSign * this.#turnRadiansPerMs);
  }
}

class GameLoop extends HTMLElement {
  /** @type {Set<string>} */
  #pressedKeys;
  /** @type {Player} */
  #player;
  /** @type {Canvas} */
  #canvas;
  /** @type {{ maxMsPerFrame: number; previousTimeMs: number }} */
  #timing;

  static observedAttributes = ['player-move-speed', 'player-turn-speed', 'max-fps'];

  constructor() {
    super();
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    const canvas = document.createElement('canvas');
    canvas.style.border = 'solid 1px';
    canvas.style.width = '100%';
    canvas.width = Number(width);
    canvas.height = Number(height);
    this.#canvas = new Canvas(canvas);
    this.#player = new Player({
      position: new Vector2(width / 2, height / 2),
      direction: new Vector2(1, 0).normalized(),
      radius: 8,
    });
    this.#timing = { maxMsPerFrame: 0, previousTimeMs: 0 };
    const label = this.getAttribute('title');
    this.removeAttribute('title');
    canvas.setAttribute('tabindex', 0);
    canvas.setAttribute('role', 'region');
    canvas.setAttribute('aria-label', label);
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(canvas);
  }

  connectedCallback() {
    this.#pressedKeys = new Set();
    this.addEventListener('keydown', (e) => this.#pressedKeys.add(e.key));
    this.addEventListener('keyup', (e) => this.#pressedKeys.delete(e.key));
    this.#update();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'max-fps') {
      const maxFps = Number(newValue);
      this.#timing.maxMsPerFrame = 1000 / maxFps;
      return;
    }
    if (name === 'player-turn-speed') {
      this.#player.setTurnSpeed(toRadians(Number(newValue)));
      return;
    }
    if (name === 'player-move-speed') {
      this.#player.setMoveSpeed(Number(newValue));
      return;
    }
  }

  /**
   * @param {string} key
   */
  #isKeyDown(key) {
    return this.#pressedKeys.has(key);
  }

  #updatePhysics() {
    if (this.#isKeyDown('w') || this.#isKeyDown('W')) {
      this.#player.move(1);
    }
    if (this.#isKeyDown('s') || this.#isKeyDown('S')) {
      this.#player.move(-1);
    }
    if (this.#isKeyDown('a') || this.#isKeyDown('A')) {
      this.#player.turn(-1);
    }
    if (this.#isKeyDown('d') || this.#isKeyDown('D')) {
      this.#player.turn(1);
    }
  }

  #draw() {
    this.#canvas.clear('white');
    this.#canvas.circle({
      x: this.#player.position.x,
      y: this.#player.position.y,
      radius: this.#player.radius,
      color: 'black',
    });
    const direction = this.#player.direction.scaled(20);
    this.#canvas.line({
      x1: this.#player.position.x,
      y1: this.#player.position.y,
      x2: this.#player.position.x + direction.x,
      y2: this.#player.position.y + direction.y,
      color: 'black',
      strokeWidth: 2,
    });
  }

  #update() {
    requestAnimationFrame((currentTimeMs) => {
      // NOTE: physics should be capped to a max FPS. It should not scale with user's refresh rate.
      // Otherwise, players on a 120 Hz screen will move faster than players on a 60 Hz screen.
      const deltaTimeMs = currentTimeMs - this.#timing.previousTimeMs;
      // Not just === because a frame could've taken longer, leading to dropped frame rate
      if (deltaTimeMs >= this.#timing.maxMsPerFrame) {
        this.#timing.previousTimeMs =
          currentTimeMs -
          // Ensure the next frame starts on schedule/at the next multiple of maxMsPerFrame.
          // If we don't "rewind the clock," we'll have to wait longer for the next frame to run.
          (deltaTimeMs % this.#timing.maxMsPerFrame);
        // Update all physics (e.g., player movement)
        this.#updatePhysics();
      }
      // It's okay (and even desirable) to draw/paint at the native refresh rate, as long as the draw()
      // logic is performant enough to run at the native refresh rate without significant frame drops.
      this.#draw();
      this.#update();
    });
  }
}

window.customElements.define('game-loop', GameLoop);
