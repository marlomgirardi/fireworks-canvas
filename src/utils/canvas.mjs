import config from '../config.mjs';

/**
 * @description Prepare canvas
 * @param {object} options
 * @param {number} options.width Canvas width
 * @param {number} options.height Canvas height
 * @param {string} [options.backgroundColor = "black"] black Background color
 * @returns {CanvasRenderingContext2D} Canvas context
 */
export function prepareCanvas(options) {
  const canvas = document.createElement('canvas');

  canvas.width = options.width;
  canvas.height = options.height;
  canvas.style.backgroundColor = options.backgroundColor || 'black';

  document.body.appendChild(canvas);

  return canvas.getContext('2d');
}

/**
 * @description Draw a circle with a radial gradient based in a color
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color
 * @param {string} [alpha="FF"]
 * @param {boolean} solid
 */
export function createPoint(context, x, y, radius, color, alpha = 'FF', solid = false) {
  if (solid) {
    context.fillStyle = color + '7F';
  } else {
    const radialColor = context.createRadialGradient(x, y, 0.1, x, y, radius);

    radialColor.addColorStop(0, `${color}${alpha}`);
    radialColor.addColorStop(1, `${color}00`);

    context.fillStyle = radialColor;
  }

  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}

/**
 * @description Get position based on canvas center
 * @param {{ x: number, y: number}} pos
 * @returns {{ x: number, y: number}}
 */
export function positionFromCenter(pos) {
  return {
    x: config.WIDTH / 2 + pos.x,
    y: config.HEIGHT / 2 - pos.y,
  };
}
