## React Motion UI Pack

[![npm version](https://badge.fury.io/js/react-motion-ui-pack.svg)](https://badge.fury.io/js/react-motion-ui-pack)
[![Dependency Status](https://david-dm.org/souporserious/react-motion-ui-pack.svg)](https://david-dm.org/souporserious/react-motion-ui-pack)
[![CDNJS](https://img.shields.io/cdnjs/v/react-motion-ui-pack.svg)](https://cdnjs.com/libraries/react-motion-ui-pack)

[React Motion](https://github.com/chenglou/react-motion) is an amazing animation library for React. React Motion UI Pack tries to help ease entry level / common use cases with React Motion by providing a higher level way to work with it and create common UI transitions easier. If you need more complex animations I suggest using React Motion directly.

### Usage

`yarn add react-motion-ui-pack`

`npm install react-motion-ui-pack --save`

```html
<script src="https://unpkg.com/react-motion-ui-pack/dist/react-motion-ui-pack.js"></script>
(UMD library exposed as `Transition`)
```

### Example

```js

import Transition from 'react-motion-ui-pack'

// Animate a list of items as they are added
<Transition
  component="ul"
  enter={{
    opacity: 1,
  }}
  leave={{
    opacity: 0,
  }}
>  
  { this.state.items.map(item =>
      <li key={item.id}>{item.content}</li>
    )
  }
</Transition>

// Animate a modal
<Transition
  component={false} // don't use a wrapping component
  enter={{
    opacity: 1,
    translateY: spring(0, {stiffness: 400, damping: 10})
  }}
  leave={{
    opacity: 0,
    translateY: 250
  }}
>
  { this.state.modalOpen &&
    <div key="modal" className="modal__content">
      // modal code
    </div>
  }
</Transition>
```

## Props

#### `component`: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, isElement])

Define the wrapping tag/component around the children passed in, pass `false` to not use a wrapping component at all for only child components.

#### `runOnMount`: PropTypes.bool

Determines whether the animation runs on mount or not

#### `appear`: PropTypes.object

Where the animation starts, defaults to leave value if nothing passed

#### `enter`: PropTypes.object

The resting state of the animation

#### `leave`: PropTypes.object

The ending value of the animation

#### `onEnter`: PropTypes.func

Callback right before an element enters, passes in your current animating values `onEnter={currentValues => /* do something */}` called only once.

#### `onLeave`: PropTypes.func

Same as `onEnter`, but fires multiple times as an element is leaving.

## FAQ

#### How `appear`, `enter`, & `leave` work

These values are automatically wrapped in a React Motion `spring` to keep the API simple. If you need a custom config you can pass your own spring e.g. `spring(22, { stiffness: 30, damping: 300 })`.

#### My animation values aren't being applied to any elements

If you decide to use a custom component as a child, `style` and `dimensions` props will be passed into that component for you to use however you want. If you pass a regular React DOM element, `<Transition/>` will take care of applying the values for you by cloning your element and passing it in.

## Running Locally

clone repo

`git clone git@github.com:souporserious/react-motion-ui-pack.git`

move into folder

`cd ~/react-motion-ui-pack`

install dependencies

`npm install`

run dev mode

`npm run dev`

open your browser and visit: `http://localhost:8080/`
