## CHANGELOG
### 0.10.3
Use prop-types package [#77](https://github.com/souporserious/react-motion-ui-pack/pull/77/files)

### 0.10.2
Fix UNPKG files

### 0.10.1
Point to `dist` and `lib` folders

### 0.10.0
Removed auto-height support 😢 please use [react-fluid-container](https://github.com/souporserious/react-fluid-container) or feel free to try and bring support back in the [auto-height](https://github.com/souporserious/react-motion-ui-pack/tree/auto-height) branch

Updated to React Motion 0.4.5

Removed bower support

### 0.9.0
Fixed unknown props being passed to elements [55](https://github.com/souporserious/react-motion-ui-pack/issues/55)

React Measure is now optional, just pass `measure` false to not use it

### 0.8.0
Updated to latest React Measure

Cleaned up `auto` calculation, now accounts for auto width values

### 0.7.4
Fixes `isValidElement` not being defined [50](https://github.com/souporserious/react-motion-ui-pack/issues/50).

### 0.7.3
Revert return `null`. Breaks only child components.

### 0.7.2
Return `null` if children are undefined or false so React Motion doesn't error.

Updated to the latest React Motion.

### 0.7.1
Fixed "other props" not being passed into `Transition` wrapper component.

### 0.7.0
Fixes:
- height transition resulting in an empty string [28](https://github.com/souporserious/react-motion-ui-pack/issues/28)
- `runOnMount` not working with 'auto' values [30](https://github.com/souporserious/react-motion-ui-pack/issues/30)
- passing a custom class as component [36](https://github.com/souporserious/react-motion-ui-pack/issues/36)
- `onEnter` not firing on component mount [44](https://github.com/souporserious/react-motion-ui-pack/issues/44)
- fixed React 15 unitless number warning [46](https://github.com/souporserious/react-motion-ui-pack/issues/46)

Updated React Measure dependency to latest 0.3.5 release

### 0.6.0
Updated to React Motion 0.4.2

### 0.5.2
Moved `get-prefix` out to external lib https://www.npmjs.com/package/get-prefix

Fixed server-side rendering

Removed `overflow: hidden` on auto height to be less opinionated

### 0.5.1
Upgraded to React Measure 0.3.3

Fixed auto height to only be applied to child component mount and unmount

Added ability to pass custom config with auto values

Values are rounded to 4 decimal places now

Removed `onlyChild` prop in favor of just passing `false` to `component` prop

### 0.5.0
Upgraded to React 0.14.0

Upgraded to React Measure 0.2.0

Fixed trying to call document bug when server side rendering

Added `runOnMount` which specifies whether an animation should run on mounting of component or not

### 0.4.2
Fixed bug where a null value would break when tying to convert to flat values for callbacks

Previous set styles are now merged into final style

### 0.4.1
Added `onEnter` and `onLeave` props

### 0.4.0
**Breaking Changes**
Upgraded to React Motion 0.3.0

Simplified how values are passed. Use a custom `spring` or just pass a value and it will use the default config.


### 0.3.1
Updated to work with React Measure 0.1.2

Added prop `measure` to force use of Measure if wanting to use dimensions passed in

### 0.3.0
Fixed build for NPM, now points correctly to lib folder

Only dependant on React Measure if using width/height auto

### 0.2.5
Not exposed as an object anymore, but just as `Transition`

### 0.2.4
UI Pack not included anymore, will move into addons or something similiar

Fixed `appear` prop to work with elements coming in after initial mount

Uses React Measure 0.0.7 now

### 0.2.3
Optimized height & width calculation

Uses React Measure 0.0.6 now

### 0.2.2
Introduced `onlyChild` prop. If only animating one component pass `true` to get rid of the need for a wrapper component

A React Motion friendly object can now be passed to `appear` instead of just a boolean

### 0.2.1
Uses React Measure 0.0.5 now

### 0.2.0
Now dependent upon [React Measure](https://github.com/souporserious/react-measure)
