import { getFireworks, prepareFirework } from './utils/helpers.mjs';
import { prepareCanvas } from './utils/canvas.mjs';

import config from './config.mjs';

/** @type {CanvasRenderingContext2D} */
const context = prepareCanvas({
  width: config.WIDTH,
  height: config.HEIGHT,
});

let fireworks = [];

getFireworks(config.DATA_URL).then(rawFireworks => {
  const fireworksByTiming = rawFireworks.reduce((accumulator, firework) => {
    if (!accumulator[firework.begin]) {
      accumulator[firework.begin] = [firework];
      return accumulator;
    }

    accumulator[firework.begin].push(firework);
    return accumulator;
  }, {});

  const beginTime = Object.keys(fireworksByTiming).map(f => parseInt(f));

  let startTimestamp = null;
  let executionTimestamp = null;
  let lastExec = 0;
  let lastTime = 0;
  let usedFireworks = 0;

  function tick(timestamp) {
    context.clearRect(0, 0, config.WIDTH, config.HEIGHT);

    context.globalCompositeOperation = 'lighter';

    if (!startTimestamp) startTimestamp = timestamp;
    executionTimestamp = timestamp - startTimestamp;
    const timeSinceLastTick = executionTimestamp - lastTime;

    const time = beginTime.find((f, i) => f < beginTime[i + 1] && f <= executionTimestamp && f > lastExec);

    if (time) {
      fireworks.push(...fireworksByTiming[time].map(firework => prepareFirework(firework, context)));
      lastExec = time;
    }

    if (fireworks.length > 0) {
      fireworks = fireworks.filter(firework => {
        firework.render(timeSinceLastTick);

        if (!firework.exists()) {
          usedFireworks += 1;
          return false;
        }

        return true;
      });
    } else if (usedFireworks > 0 && fireworks.length === 0) {
      restart();
    }

    lastTime = executionTimestamp;
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);

  function restart() {
    startTimestamp = null;
    executionTimestamp = null;
    lastExec = 0;
    lastTime = 0;
    usedFireworks = 0;
  }
});

window.onerror = function(message, source, lineno, colno, error) {
  context.clearRect(0, 0, config.WIDTH, config.HEIGHT);
  alert('Oops! Unfortunately you will need to wait until the new year to see more fireworks :(');
  console.error(error);
};
