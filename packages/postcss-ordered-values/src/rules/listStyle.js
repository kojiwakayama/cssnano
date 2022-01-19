import valueParser from 'postcss-value-parser';
import listStyleTypes from './listStyleTypes.json';

const definedTypes = new Set(listStyleTypes['list-style-type']);

const definedPosition = new Set(['inside', 'outside']);
export default function listStyleNormalizer(listStyle) {
  const order = { type: '', position: '', image: '' };

  listStyle.walk((decl) => {
    if (decl.type === 'word') {
      if (definedTypes.has(decl.value)) {
        // its a type field
        order.type = `${order.type} ${decl.value}`;
      } else if (definedPosition.has(decl.value)) {
        order.position = `${order.position} ${decl.value}`;
      } else if (decl.value === 'none') {
        if (
          order.type
            .split(' ')
            .filter((e) => e !== '' && e !== ' ')
            .includes('none')
        ) {
          order.image = `${order.image} ${decl.value}`;
        } else {
          order.type = `${order.type} ${decl.value}`;
        }
      } else {
        order.type = `${order.type} ${decl.value}`;
      }
    }
    if (decl.type === 'function') {
      order.image = `${order.image} ${valueParser.stringify(decl)}`;
    }
  });

  return `${order.type.trim()} ${order.position.trim()} ${order.image.trim()}`.trim();
}
