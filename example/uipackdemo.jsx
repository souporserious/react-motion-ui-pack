import React, { Component, PropTypes } from 'react';
import { Transition, UIPack } from '../src/react-motion-ui-pack';

// inspired by: http://julian.com/research/velocity/#uiPack
class TransitionUIList extends Component {
  render() {
    return(
      <select id="dataBody-UIPackSelEffect">
        <option value="" selected="" disabled="">Effect</option>
        <option value="fadeIn">fadeIn</option>
        <option value="fadeOut">fadeOut</option>
        <option value="flipXIn">flipXIn</option>
        <option value="flipXOut">flipXOut</option>
        <option value="flipYIn">transition.flipYIn</option>
        <option value="flipYOut">flipYOut</option>
        <option value="flipBounceXIn">flipBounceXIn</option>
        <option value="flipBounceXOut">flipBounceXOut</option>
        <option value="flipBounceYIn">flipBounceYIn</option>
        <option value="flipBounceYOut">flipBounceYOut</option>
        <option value="swoopIn">swoopIn</option>
        <option value="swoopOut">swoopOut</option>
        <option value="whirlIn">whirlIn</option>
        <option value="whirlOut">whirlOut</option>
        <option value="shrinkIn">shrinkIn</option>
        <option value="shrinkOut">shrinkOut</option>
        <option value="expandIn">expandIn</option>
        <option value="expandOut">expandOut</option>
        <option value="bounceIn">bounceIn</option>
        <option value="bounceOut">bounceOut</option>
        <option value="bounceUpIn">bounceUpIn</option>
        <option value="bounceUpOut">bounceUpOut</option>
        <option value="bounceDownIn">bounceDownIn</option>
        <option value="bounceDownOut">bounceDownOut</option>
        <option value="bounceLeftIn">bounceLeftIn</option>
        <option value="bounceLeftOut">bounceLeftOut</option>
        <option value="bounceRightIn">bounceRightIn</option>
        <option value="bounceRightOut">bounceRightOut</option>
        <option value="slideUpIn">transition.slideUpIn</option>
        <option value="slideUpOut">transition.slideUpOut</option>
        <option value="slideDownIn">slideDownIn</option>
        <option value="slideDownOut">slideDownOut</option>
        <option value="slideLeftIn">slideLeftIn</option>
        <option value="slideLeftOut">slideLeftOut</option>
        <option value="slideRightIn">slideRightIn</option>
        <option value="slideRightOut">slideRightOut</option>
        <option value="slideUpBigIn">slideUpBigIn</option>
        <option value="slideUpBigOut">slideUpBigOut</option>
        <option value="slideDownBigIn">slideDownBigIn</option>
        <option value="slideDownBigOut">slideDownBigOut</option>
        <option value="slideLeftBigIn">slideLeftBigIn</option>
        <option value="slideLeftBigOut">slideLeftBigOut</option>
        <option value="slideRightBigIn">slideRightBigIn</option>
        <option value="slideRightBigOut">slideRightBigOut</option>
        <option value="perspectiveUpIn">perspectiveUpIn</option>
        <option value="perspectiveUpOut">perspectiveUpOut</option>
        <option value="perspectiveDownIn">perspectiveDownIn</option>
        <option value="perspectiveDownOut">perspectiveDownOut</option>
        <option value="perspectiveLeftIn">perspectiveLeftIn</option>
        <option value="perspectiveLeftOut">perspectiveLeftOut</option>
        <option value="perspectiveRightIn">perspectiveRightIn</option>
        <option value="perspectiveRightOut">perspectiveRightOut</option>
      </select>
    );
  }
}