## react-motion-ui-pack 0.2.1

Addon component wrappers for common UI transitions using [React Motion](https://github.com/chenglou/react-motion).

## Install

`npm install react-motion-ui-pack --save`

`bower install react-motion-ui-pack --save`

## Example Usage

```javascript

import { Transition } from 'react-motion-ui-pack';

<Transition
  component="div"
  appear={true}
  enter={{
    width: {val: 'auto'},
    height: {val: 'auto'},
    opacity: {val: 1},
    translateY: {val: 0, config: [400, 10]}
  }}
  leave={{
    width: {val: 0},
    height: {val: 0},
    opacity: {val: 0},
    translateY: {val: 250}
  }}
>
  {this.state.modalOpen &&
  <div key="modal" className="modal__content">
    // modal code
  </div>}
</Transition>
```

## Control where values are applied
If you decide to use a custom component as a child, `style` and `dimensions` props will be passed into that component for you to use however you want. If you don't pass anything, `<Transition />` will take care of applying the values for you to a `span` wrapper. This tag can be changed to any tag you need using the `component` prop provided on the `<Transition />` component.

## Run Example

clone repo

`git clone git@github.com:souporserious/react-motion-ui-pack.git`

move into folder

`cd ~/react-motion-ui-pack`

install dependencies

`npm install`

run dev mode

`npm run dev`

open your browser and visit: `http://localhost:8080/`

## CHANGELOG
### 0.2.1
  Updated to React Measure 0.0.4
### 0.2.0
  Dependent upon [React Measure](https://github.com/souporserious/react-measure) now