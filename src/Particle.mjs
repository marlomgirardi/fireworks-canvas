import { createPoint } from './utils/canvas.mjs';

export default class Particle {
  constructor(data, context) {
    /**
     * @description The canvas context
     * @type {CanvasRenderingContext2D}
     */
    this.context = context;

    /**
     * @description Particle position
     * @type {{
     *   x: number,
     *   y: number
     * }}
     */
    this.position = { x: data.x, y: data.y };

    /**
     * @description How many pixels the particle travels per millisecond
     * @type {{
     *   x: number,
     *   y: number
     * }}
     */
    this.velocity = { x: 0, y: 0 };

    /**
     * @description Radius in pixels
     * @type {number}
     */
    this.radius = 4;

    /**
     * @description The color of the particles in a 24 bit RGB format (8 bits per colour)
     * @type {string}
     */
    this.color = '#FFFFFF';

    /**
     * @description Resistance from the center point.
     * The recommended value is between 0 and 1
     * @type {number}
     */
    this.resistance = 1;

    /**
     * @description Shrink the particle
     * The recommended value is between 0 and 1
     * @type {number}
     */
    this.shrink = 0.97;

    /**
     * @description Gravity of the particle
     * The recommended value is between 0 and 1
     * @type {number}
     */
    this.gravity = 0;

    /**
     * @description Make the particle flick like an real firework particle
     * @type {boolean}
     */
    this.flick = false;

    /**
     * @description Make the particle solid (without gradient)
     * @type {boolean}
     */
    this.solid = false;

    /**
     * @description Holds the alpha value
     * @type {number}
     */
    this.alpha = 1;

    /**
     * @description alpha decay by frame
     * @type {number}
     */
    this.fade = 0;
  }

  /**
   * @description Update particle state
   */
  update() {
    this.velocity.x *= this.resistance;
    this.velocity.y *= this.resistance;

    this.velocity.y += this.gravity;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.radius *= this.shrink;

    this.alpha -= this.fade;
  }

  /**
   * @description Renders the particles
   */
  render() {
    if (!this.exists()) {
      return;
    }

    const { x, y } = this.position;
    const radius = this.flick ? Math.random() * this.radius : this.radius;

    createPoint(this.context, x, y, radius, this.color, Math.floor(255 * this.alpha).toString(16), this.solid);
  }

  /**
   * @description Check if the particle still available
   * @returns {boolean}
   */
  exists() {
    return this.alpha >= 0.1 && this.radius >= 1;
  }
}
