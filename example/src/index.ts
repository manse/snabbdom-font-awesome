import {init} from 'snabbdom';
import {h} from 'snabbdom/h';
import ClassModule from 'snabbdom/modules/class';
import PropsModule from 'snabbdom/modules/props';
import AttrsModule from 'snabbdom/modules/attributes';
import {fa} from '../../index';

const patch = init([
    ClassModule, PropsModule, AttrsModule
]);
const container = document.getElementById('container');
const vnode = h('div#container', Object.keys(fa).map((name) => {
    return h('div.box', [
        fa[name](),
        h('strong', [name])
    ])
}));

patch(container, vnode);
