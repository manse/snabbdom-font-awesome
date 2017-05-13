# snabbdom-font-awesome

Draw [font-awesome](https://github.com/FortAwesome/Font-Awesome) svg with snabbdom.

![SS](https://cloud.githubusercontent.com/assets/443965/26023256/084da0dc-37f3-11e7-911f-a19f7dc30e1a.png)

## Usage

```sh
npm install snabbdom-font-awesome
```

```ts
import {fa} from 'snabbdom-font-awesome';

const vnode = h('button.btn', [
  fa.heart(),
  'Like'
]);
```

```css
.btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}
```

## License
- Font-Awesome font: [SIL OFL 1.1](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)
- snabbdom-font-awesome: MIT
