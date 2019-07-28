import { parseFireworks } from './parser.mjs';
import Rocket from '../Rocket.mjs';
import Fountain from '../Fountain.mjs';

/**
 * @description Get fireworks data
 * @param {string} url Holds the xml fireworks
 * @returns {Promise.<array>}
 */
export async function getFireworks(url) {
  const xml = await fetch(url)
    .then(response => {
      if (response.status < 400) {
        return response.text();
      }

      throw new Error(`Was not possible to fetch the configuration (${response.statusText}).`);
    })
    .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then(parseFireworks)
    .catch(e => {
      alert(e.message);
    });

  if (xml) {
    return xml.sort((fireworkA, fireworkB) => fireworkA.begin - fireworkB.begin);
  }

  return [];
}

/**
 * @description Prepare the firework based on the type
 * @param {object} firework
 * @param {CanvasRenderingContext2D} context
 * @returns {Fountain|Rocket|undefined}
 */
export function prepareFirework(firework, context) {
  switch (firework.type) {
    case 'Fountain':
      return new Fountain(firework, context);
    case 'Rocket':
      return new Rocket(firework, context);
    default:
      return undefined;
  }
}
