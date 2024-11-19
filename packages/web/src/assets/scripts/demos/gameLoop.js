function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Returns the Cartesian length of this vector. */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * @param {number} scalar
   */
  scaled(scalar) {
    const scaled = new Vector(this.x, this.y);
    scaled.x *= scalar;
    scaled.y *= scalar;
    return scaled;
  }

  /** Returns a new vector that's the result of normalizing this vector (i.e., a unit vector of length `1` in the same direction). */
  normalized() {
    const unitVector = new Vector(this.x, this.y);
    return unitVector.scaled(1 / unitVector.length);
  }

  /** Returns a new vector that's the result of rotating this vector by the given change in angle, in radians.
   * @param {number} angleDeltaRadians
   */
  rotated(angleDeltaRadians) {
    const rotated = new Vector(this.x, this.y);
    rotated.x = this.x * Math.cos(angleDeltaRadians) - this.y * Math.sin(angleDeltaRadians);
    rotated.y = this.x * Math.sin(angleDeltaRadians) + this.y * Math.cos(angleDeltaRadians);
    return rotated;
  }
}

class Player {
  /** @type {number} */
  radius;
  /** @type {Vector} */
  position;
  /** @type {Vector} */
  direction;
  /** @type {number} */
  speed;

  /**
   *
   * @param {{ position: Vector; direction: Vector; speed: number; radius: number }} props
   */
  constructor({ position, direction, speed, radius }) {
    this.position = position;
    this.direction = direction;
    this.speed = speed;
    this.radius = radius;
  }

  /** Moves the player at its current speed in the the specified direction.
   * @param {Vector} direction
   */
  move(direction) {
    this.position.x += direction.x * this.speed;
    this.position.y += direction.y * this.speed;
  }

  /**
   * Rotates this player by the given change in angle, in radians.
   * @param {number} angleDeltaRadians
   */
  rotate(angleDeltaRadians) {
    this.direction = this.direction.rotated(angleDeltaRadians);
  }
}

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

  /** Clears all drawings from the canvas. */
  clear() {
    this.#ctx.clearRect(0, 0, this.width, this.height);
  }

  /** Fills the canvas with a solid color.
   * @param {string} color
   */
  fill(color) {
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

class GameLoop extends HTMLElement {
  /** @type {Set<string>} */
  pressedKeys;
  /** @type {Player} */
  player;
  /** @type {Canvas} */
  canvas;

  constructor() {
    super();
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    const canvas = document.createElement('canvas');
    canvas.style.border = 'solid 1px';
    canvas.style.width = '100%';
    canvas.width = Number(width);
    canvas.height = Number(height);
    this.canvas = new Canvas(canvas);
    this.player = new Player({
      position: new Vector(width / 2, height / 2),
      direction: new Vector(1, 0).normalized(),
      speed: 4,
      radius: 8,
    });
    const label = this.getAttribute('title');
    this.removeAttribute('title');
    canvas.setAttribute('tabindex', 0);
    canvas.setAttribute('role', 'region');
    canvas.setAttribute('aria-label', label);
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(canvas);
  }

  connectedCallback() {
    this.pressedKeys = new Set();
    this.addEventListener('keydown', (e) => this.pressedKeys.add(e.key));
    this.addEventListener('keyup', (e) => this.pressedKeys.delete(e.key));
    this.#update();
  }

  /**
   * @param {string} key
   */
  #isKeyDown(key) {
    return this.pressedKeys.has(key);
  }

  #checkUserInput() {
    if (this.#isKeyDown('w')) {
      this.player.move(this.player.direction);
    }
    if (this.#isKeyDown('s')) {
      this.player.move(this.player.direction.scaled(-1));
    }
    if (this.#isKeyDown('a')) {
      this.player.rotate(toRadians(-4));
    }
    if (this.#isKeyDown('d')) {
      this.player.rotate(toRadians(4));
    }
  }

  #draw() {
    this.canvas.clear();
    this.canvas.fill('white');
    this.canvas.circle({
      x: this.player.position.x,
      y: this.player.position.y,
      radius: this.player.radius,
      color: 'black',
    });
    const direction = this.player.direction.scaled(20);
    this.canvas.line({
      x1: this.player.position.x,
      y1: this.player.position.y,
      x2: this.player.position.x + direction.x,
      y2: this.player.position.y + direction.y,
      color: 'black',
      strokeWidth: '2',
    });
  }

  #update() {
    requestAnimationFrame(() => {
      this.#checkUserInput();
      this.#draw();
      this.#update();
    });
  }
}

window.customElements.define('game-loop', GameLoop);
