function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/** Two-dimensional vector. */
class Vector2 {
  public x: number;
  public y: number;

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

  /** Returns a new vector that's the result of scaling this vector by the given scalar. */
  scaled(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /** Returns a new vector that's the result of normalizing this vector (i.e., a unit vector of length `1` in the same direction). */
  normalized() {
    return Vector2.from(this).scaled(1 / this.length);
  }

  /** Returns a new vector that's the result of rotating this vector by the given change in angle, in radians. */
  rotated(angleDeltaRadians: number) {
    return new Vector2(
      this.x * Math.cos(angleDeltaRadians) - this.y * Math.sin(angleDeltaRadians),
      this.x * Math.sin(angleDeltaRadians) + this.y * Math.cos(angleDeltaRadians)
    );
  }

  /**
   * Returns a copy of a vector.
   */
  static from(vector: Vector2) {
    return new Vector2(vector.x, vector.y);
  }

  /**
   * Returns a new vector constructed from the given angle.
   */
  static fromAngle(angleRadians: number) {
    return new Vector2(Math.cos(angleRadians), Math.sin(angleRadians));
  }

  /**
   * Returns the dot product of two vectors.
   */
  static dot(a: Vector2, b: Vector2) {
    return a.x * b.x + a.y * b.y;
  }
}

/**
 * Helper around `HTMLCanvasElement`. Pass a canvas to it and it provides methods for drawing.
 */
class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  /** Clears the canvas with a solid color.
   */
  clear(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /** Draws a circle on the canvas at the specified coordinates.
   */
  circle({ x, y, radius, color }: { x: number; y: number; radius: number; color: string }) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  /** Draws a line on the canvas from `(x1, y1)` to `(x2, y2)`. */
  line({
    x1,
    y1,
    x2,
    y2,
    color,
    strokeWidth = 1,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    strokeWidth: number;
  }) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
}
class Player {
  public radius: number;
  public position: Vector2;
  public direction: Vector2;
  private moveSpeed: number;
  private turnRadiansPerMs: number;

  constructor({
    position,
    direction,
    moveSpeed,
    turnSpeedDegrees,
    radius,
  }: {
    position: Vector2;
    direction: Vector2;
    moveSpeed?: number;
    turnSpeedDegrees?: number;
    radius: number;
  }) {
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

  setMoveSpeed(moveSpeed: number) {
    this.moveSpeed = Number(moveSpeed);
  }

  setTurnSpeed(turnSpeedRadians: number) {
    this.turnRadiansPerMs = turnSpeedRadians;
  }

  /** Moves the player at its current speed in its current direction.
   */
  move(directionSign: -1 | 1) {
    const direction = this.direction.scaled(directionSign);
    this.position.x += direction.x * this.moveSpeed;
    this.position.y += direction.y * this.moveSpeed;
  }

  /**
   * Rotates this player at its .
   */
  turn(directionSign: -1 | 1) {
    this.direction = this.direction.rotated(directionSign * this.turnRadiansPerMs);
  }
}

class GameLoop extends HTMLElement {
  private pressedKeys: Set<string>;
  private player: Player;
  private canvas: Canvas;
  private timing: { frameIntervalMs: number; previousTimeMs: number };

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
    this.canvas = new Canvas(canvas);
    this.player = new Player({
      position: new Vector2(canvas.width / 2, canvas.height / 2),
      direction: new Vector2(1, 0).normalized(),
      radius: 8,
    });
    this.timing = { frameIntervalMs: 0, previousTimeMs: 0 };
    const label = this.getAttribute('title');
    if (label) {
      this.removeAttribute('title');
      canvas.setAttribute('tabindex', '0');
      canvas.setAttribute('role', 'region');
      canvas.setAttribute('aria-label', label);
    }
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(canvas);
  }

  connectedCallback() {
    this.pressedKeys = new Set();
    this.addEventListener('keydown', (e) => this.pressedKeys.add(e.key));
    this.addEventListener('keyup', (e) => this.pressedKeys.delete(e.key));
    this.update();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'max-fps') {
      const maxFps = Number(newValue);
      this.timing.frameIntervalMs = 1000 / maxFps;
      return;
    }
    if (name === 'player-turn-speed') {
      this.player.setTurnSpeed(toRadians(Number(newValue)));
      return;
    }
    if (name === 'player-move-speed') {
      this.player.setMoveSpeed(Number(newValue));
      return;
    }
  }

  private isKeyDown(key: string) {
    return this.pressedKeys.has(key);
  }

  private updatePhysics() {
    if (this.isKeyDown('w') || this.isKeyDown('W')) {
      this.player.move(1);
    }
    if (this.isKeyDown('s') || this.isKeyDown('S')) {
      this.player.move(-1);
    }
    if (this.isKeyDown('a') || this.isKeyDown('A')) {
      this.player.turn(-1);
    }
    if (this.isKeyDown('d') || this.isKeyDown('D')) {
      this.player.turn(1);
    }
  }

  private draw() {
    this.canvas.clear('white');
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
      strokeWidth: 2,
    });
  }

  private update() {
    requestAnimationFrame((currentTimeMs) => {
      // NOTE: physics should be capped to a max FPS. It should not scale with user's refresh rate.
      // Otherwise, players on a 120 Hz screen will move faster than players on a 60 Hz screen.
      const deltaTimeMs = currentTimeMs - this.timing.previousTimeMs;
      // Not just === because a frame could've taken longer, leading to dropped frame rate
      if (deltaTimeMs >= this.timing.frameIntervalMs) {
        this.timing.previousTimeMs =
          currentTimeMs -
          // Ensure the next frame starts on schedule/at the next multiple of frameIntervalMs.
          // If we don't "rewind the clock," we'll have to wait longer for the next frame to run.
          (deltaTimeMs % this.timing.frameIntervalMs);
        // Update all physics (e.g., player movement)
        this.updatePhysics();
      }
      // It's okay (and even desirable) to draw/paint at the native refresh rate, as long as the draw()
      // logic is performant enough to run at the native refresh rate without significant frame drops.
      this.draw();
      this.update();
    });
  }
}

window.customElements.define('game-loop', GameLoop);
