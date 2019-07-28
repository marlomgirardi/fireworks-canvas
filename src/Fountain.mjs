import Firework from './Firework.mjs';
import Particle from './Particle.mjs';

export default class Fountain extends Firework {
  constructor(data, context) {
    super(data, context);

    /**
     * @description Amount of particles allowed in the canvas at the same time
     * @type {number}
     */
    this.maxParticles = 50;
  }

  /**
   * @description Update rocket state
   * @param {number} timestampPassed Diff time from last frame in milliseconds
   */
  update(timestampPassed) {
    this.counter -= timestampPassed;

    if (this.counter > 0) {
      for (let i = 0; i < this.maxParticles - this.particles.length; i++) {
        const particle = new Particle(this.position, this.context);
        const fortyFiveDegrees = -Math.PI / 4;
        const angle = Math.random() * fortyFiveDegrees + fortyFiveDegrees * 1.5;
        const speed = Math.cos((Math.random() * -Math.PI) / 2) * 15;

        particle.velocity.x = Math.cos(angle) * speed;
        particle.velocity.y = Math.sin(angle) * speed;

        particle.radius = 20;
        particle.gravity = 0.03;
        particle.resistance = 0.96;
        particle.shrink = Math.random() * 0.05 + 0.9;

        particle.flick = true;
        particle.color = this.color;

        this.particles.push(particle);
      }
    }

    this.particles.forEach(p => p.update());
  }

  /**
   * @description Renders the fountain
   * @param {number} time Diff time from last frame in milliseconds
   */
  render(time) {
    this.update(time);

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
