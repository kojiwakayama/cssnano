import getParsed from '../lib/getParsed';

// flex-flow: <flex-direction> || <flex-wrap>
const flexFlowProps = [
    'flex-flow',
];

const flexDirection = [
    'row',
    'row-reverse',
    'column',
    'column-reverse',
];

const flexWrap = [
    'nowrap ',
    'wrap',
    'wrap-reverse',
];

export default function normalizeFlexFlow (decl) {
    if (!~flexFlowProps.indexOf(decl.prop)) {
        return;
    }
    let flexFlow = getParsed(decl);
    if (flexFlow.nodes.length > 2) {
        let order = {
            direction: '',
            wrap: '',
        };
        let abort = false;
        flexFlow.walk(node => {
            if (
                node.type === 'comment' ||
                node.type === 'function' && node.value === 'var'
            ) {
                abort = true;
                return;
            }
            if (~flexDirection.indexOf(node.value)) {
                order.direction = node.value;
                return;
            }
            if (~flexWrap.indexOf(node.value)) {
                order.wrap = node.value;
                return;
            }
        });
        if (!abort) {
            decl.value = `${order.direction} ${order.wrap}`.trim();
        }
    }
};
