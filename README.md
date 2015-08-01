## react-motion-ui-pack 0.1.7

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
    opacity: {val: 1},
    translateY: {val: 0, config: [400, 10]}
  }}
  leave={{
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

## TODOS:

- [ ] add tests
- [x] fix transition out
- [x] add browser prefixing