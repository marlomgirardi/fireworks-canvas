const ATTRIBUTES = Symbol('Attributes');

/**
 * @description Parse XML to JSON
 * To access attributes a method called `attr` must be used.
 * @param {XMLDocument} xml Holds the XML data
 * @returns {object}
 */
export function xmlToJson(xml) {
  let obj = {};

  if (xml.nodeType == 1) {
    if (xml.attributes.length > 0) {
      obj[ATTRIBUTES] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attr = xml.attributes.item(j);
        obj[ATTRIBUTES][attr.nodeName] = attr.nodeValue;
      }
      obj.attr = getAttr.bind(obj);
    }
  } else if (xml.nodeType == 3) {
    obj = xml.nodeValue;
  }

  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      // We only want to parse attributes and not content.
      if (nodeName === '#text') continue;

      if (obj[nodeName] === undefined) {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push !== 'function') {
          const old = obj[nodeName];
          obj[nodeName] = [old];
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }

  return obj;
}

/**
 * Responsible to parse the Fireworks data and provided
 *
 * @param {XMLDocument} fireworksXml Holds the XML data
 * @returns {array}
 */
export function parseFireworks(fireworksXml) {
  try {
    const data = xmlToJson(fireworksXml);

    if ((data && data.html) || !data.FireworkDisplay || !data.FireworkDisplay.Firework) {
      throw new Error('Invalid configuration');
    }

    const fireworks = data.FireworkDisplay.Firework.map(firework => {
      if (firework.Position === undefined || firework.Position === null) {
        throw 'Firework must have position property';
      }

      const obj = {
        type: firework.attr('type'),
        begin: parseInt(firework.attr('begin')),
        duration: parseInt(firework.attr('duration')),
        colour: firework.attr('colour'),
        position: {
          x: parseInt(firework.Position.attr('x')),
          y: parseInt(firework.Position.attr('y')),
        },
      };

      if ((firework.Velocity === undefined || firework.Velocity === null) && firework.attr('type') === 'Rocket') {
        throw 'Rocket must have velocity property';
      }

      if (firework.attr('type') === 'Rocket') {
        obj.velocity = {
          x: parseInt(firework.Velocity.attr('x')),
          y: parseInt(firework.Velocity.attr('y')),
        };
      }

      return obj;
    });

    return fireworks;
  } catch (e) {
    let msg = 'Invalid configuration';

    console.error(e);

    if (typeof e === 'string') {
      msg = e;
    }
    alert(msg);
    return [];
  }
}

/**
 * @description Get attribute from XML node.
 * @example
 *   node.attr = getAttr.bind(toThis);
 *   node.attr("someKey"); // "some result"
 * @param attr Holds the attribute key
 * @returns {string|undefined}
 */
function getAttr(attr) {
  return this[ATTRIBUTES] ? this[ATTRIBUTES][attr] : undefined;
}
