import { createPoint, positionFromCenter } from './utils/canvas.mjs';
import Firework from './Firework.mjs';
import Particle from './Particle.mjs';

export default class Rocket extends Firework {
  constructor(data, context) {
    super(data, context);

    /**
     * @description How many pixels the rocket travels per millisecond
     * @type {{
     *   x: number,
     *   y: number
     * }}
     */
    this.velocity = {
      x: data.velocity.x / 1000,
      y: data.velocity.y / 1000,
    };

    /**
     * @description Holds the has exploded property of the rocket
     * @type {boolean}
     */
    this.hasExploded = false;
  }

  /**
   * @description Explode the rocket and generate particles
   */
  explode() {
    this.velocity.x = 0;
    this.velocity.y = 0;
    const count = 90;

    for (let i = 0; i < count; i++) {
      const particle = new Particle(this.position, this.context);
      const angle = Math.random() * Math.PI * 2;

      const speed = Math.cos((Math.random() * Math.PI) / 2) * 15;

      particle.velocity.x = Math.cos(angle) * speed;
      particle.velocity.y = Math.sin(angle) * speed;

      particle.radius = 8;

      particle.gravity = 0.15;
      particle.resistance = 0.9;
      particle.shrink = Math.random() * 0.05 + 0.91;

      particle.flick = true;
      particle.solid = true;
      particle.color = this.color;

      this.particles.push(particle);
    }

    this.hasExploded = true;
  }

  /**
   * @description Update rocket state
   * @param {number} timestampPassed Diff time from last frame in milliseconds
   */
  update(timestampPassed) {
    this.counter -= timestampPassed;

    if (!this.hasExploded && this.counter <= 0) {
      this.explode();
    }

    if (!this.hasExploded) {
      this.position.x += this.velocity.x * timestampPassed;
      this.position.y -= this.velocity.y * timestampPassed;

      return;
    }

    this.particles.forEach(p => p.update());
  }

  /**
   * @description Check if the rocket still available
   * @returns {boolean}
   */
  exists() {
    return !this.hasExploded || this.particles.length > 0;
  }

  /**
   * @description Renders the rocket
   * @param {number} time Diff time from last frame in milliseconds
   */
  render(time) {
    if (!this.exists()) {
      return;
    }

    this.update(time);

    if (!this.hasExploded) {
      createPoint(this.context, this.position.x, this.position.y, this.size / 2, this.color);
    } else {
      this.renderParticles();
    }
  }

  /**
   * @description Renders the particles
   */
  renderParticles() {
    let hasParticleToRemove = false;

    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].exists()) {
        this.particles[i].render();
      } else if (!hasParticleToRemove) {
        hasParticleToRemove = true;
      }
    }

    if (hasParticleToRemove) {
      this.particles = this.particles.filter(p => p.exists());
    }
  }
}
