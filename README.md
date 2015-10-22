## React Motion UI Pack 0.5.0

[React Motion](https://github.com/chenglou/react-motion) is an amazing animation library for React. React Motion UI Pack tries to help ease entry level / common use cases with React Motion by providing a higher level way to work with it and create common UI transitions easier. If you need more complex animations I suggest using React Motion directly.

## Install

`npm install react-motion-ui-pack --save`

`bower install react-motion-ui-pack --save`

## Example Usage

```js

import Transition from 'react-motion-ui-pack';

// Animate a modal
<Transition
  onlyChild={true}
  enter={{
    opacity: 1,
    translateY: spring(0, [400, 10])
  }}
  leave={{
    opacity: 0,
    translateY: 250
  }}
>
  {this.state.modalOpen &&
  <div key="modal" className="modal__content">
    // modal code
  </div>}
</Transition>

// Animate a list of items as they are added
<Transition
  component={'ul'}
  enter={{
    height: 'auto',
    opacity: 1,
  }}
  leave={{
    height: 0,
    opacity: 0,
  }}
>  
  {this.state.items.map(item => <li key={item.id}>{item.content}</li>)}
</Transition>
```

## Props
**component:** define the wrapping tag around the children passed in

**onlyChild:** useful if you only want to transition in/out 1 element rather than a list

**measure:** pass true to use React Measure and get child dimensions to use with your animations. Useful for needing to know things like the offset of an element (note: you need to include React Measure on your own)

**runOnMount:** Determines whether the animation runs on mount or not

**appear:** Where the animation starts, defaults to leave value if nothing passed

**enter:** The resting state of the animation

**leave:** The ending value of the animation

**onEnter:** Callback right before an element enters, passes in your current animating values `onEnter={currentValues => /* do something */}` called only once.

**onLeave:** Same as `onEnter`, but fires as an element is leaving

## Control where values are applied
If you decide to use a custom component as a child, `style` and `dimensions` props will be passed into that component for you to use however you want. If you don't pass anything, `<Transition />` will take care of applying the values for you to a `span` wrapper. This tag can be changed to any tag you need using the `component` prop provided on the `<Transition />` component.

## Quirks
When using auto width/height values, [React Measure](https://github.com/souporserious/react-measure) must be included in order to obtain proper dimensions to animate to.

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