import React, { Component, PropTypes } from 'react';
import Spring, { TransitionSpring } from 'react-motion';

import './demo.scss';

export default class App extends Component {

  state = {
    links: [],
    toggle: true
  }
  
  getEndValues(currValue) {
    
    let opacityValue = !currValue ? 0 : 1;
    let configs = {};

    let endValue = Object.keys(this.state.links).map(link => {
      return link ===0 ? 1 : currValue.val[link - 1];
    });

    console.log(endValue);

    return {val: endValue, config: [120, 17]};
  }
  
  willEnter() {
    return {
      opacity: {val: 0}
    };
  }
  
  willLeave(key, endValues, currVals) {
    if(currVals[key].opacity.val > 0) {
      return {
        opacity: {val: 0}
      };
    }
  }

  handleClick() {

    let links = this.state.toggle ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [];

    this.setState({
      links: links,
      toggle: !this.state.toggle
    });
  }
  
  render() {
    return(
      <div>
        <button onClick={::this.handleClick}>Toggle</button>
        <TransitionSpring
          endValue={::this.getEndValues}
          willEnter={::this.willEnter}
          willLeave={::this.willLeave}
        >
          {currValues =>
            this.state.links.map(link => {
              return <div 
                key={link}
                className="fake-link"
                style={{
                  opacity: currValues.val
                }}
              >
              </div>
            })
          }
        </TransitionSpring>
      </div>
    );
  }
}