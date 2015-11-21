## React Motion UI Pack

[![npm version](https://badge.fury.io/js/react-motion-ui-pack.svg)](https://badge.fury.io/js/react-motion-ui-pack)
[![Dependency Status](https://david-dm.org/souporserious/react-motion-ui-pack.svg)](https://david-dm.org/souporserious/react-motion-ui-pack)

[React Motion](https://github.com/chenglou/react-motion) is an amazing animation library for React. React Motion UI Pack tries to help ease entry level / common use cases with React Motion by providing a higher level way to work with it and create common UI transitions easier. If you need more complex animations I suggest using React Motion directly.

## Usage

`npm install react-motion-ui-pack --save`

`bower install react-motion-ui-pack --save`

### Example

```js

import Transition from 'react-motion-ui-pack'

// Animate a list of items as they are added
<Transition
  component="ul"
  enter={{
    height: 'auto',
    opacity: 1,
  }}
  leave={{
    height: 0,
    opacity: 0,
  }}
>  
  {
    this.state.items.map(item =>
      <li key={item.id}>{item.content}</li>
    )
  }
</Transition>

// Animate a modal
<Transition
  component={false} // don't use a wrapping component
  enter={{
    opacity: 1,
    translateY: spring(0, [400, 10]) // pass a custom spring config
  }}
  leave={{
    opacity: 0,
    translateY: 250
  }}
>
  {
    this.state.modalOpen &&
    <div key="modal" className="modal__content">
      // modal code
    </div>
  }
</Transition>
```

#### Props
**component:** define the wrapping tag around the children passed in, pass `false` to not use a wrapping component at all

**runOnMount:** Determines whether the animation runs on mount or not

**appear:** Where the animation starts, defaults to leave value if nothing passed

**enter:** The resting state of the animation

**leave:** The ending value of the animation

**onEnter:** Callback right before an element enters, passes in your current animating values `onEnter={currentValues => /* do something */}` called only once.

**onLeave:** Same as `onEnter`, but fires as an element is leaving

#### How `appear`, `enter`, & `leave` work
These values are automatically wrapped in a React Motion `spring` to keep the API simple. If you need a custom config you can pass your own spring e.g. `spring(22, [30, 300])`.

#### Control where values are applied
If you decide to use a custom component as a child, `style` and `dimensions` props will be passed into that component for you to use however you want. If you don't pass anything, `<Transition />` will take care of applying the values for you to whatever React DOM element you pass it.

#### Dependencies
[React Measure](https://github.com/souporserious/react-measure) must be included in order to obtain proper auto dimensions to animate to.

## FAQ 

#### Stuff is overflowing out of my animating elements! Help?

Add `overflow: hidden` to your container element. This was a breaking change in 0.5.2.

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
