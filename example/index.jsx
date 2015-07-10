import React from 'react';
import Spring from 'react-motion';

import './main.scss';

class FadeUpIn {

  state = {
    mouse: [12, 24]
  }

  range(start, afterStop) {
    if (afterStop == null) {
      afterStop = start;
      start = 0;
    }
    const ret = [];
    for (let i = start; i < afterStop; i++) {
      ret.push(i);
    }
    return ret;
  }

  getValues(currentPositions) {
    
    // currentPositions of `null` means it's the first render for Spring
    if (currentPositions == null) {
      return {val: this.range(6).map(() => [0, 0])};
    }
    let endValue = currentPositions.val.map((_, i) => {
      // hack. We're getting the currentPositions of the previous ball, but in
      // reality it's not really the "current" position. It's the last render's.
      // If we want to get the real current position, we'd have to compute it
      // now, then read into it now. This gets very tedious with this API.
      return i === 0 ? this.state.mouse : currentPositions.val[i - 1];
    });
    return {val: endValue, config: [120, 17]};
  }

  render() {
    return(
      <Spring className="demo0" endValue={this.getValues.bind(this)}>
          {({translateY, opacity}) =>
            <div>
              {this.props.children}
            </div>
          }
      </Spring>
    );
  }
}

let Demo = React.createClass({
  getInitialState() {
    return {open: false};
  },

  handleMouseDown() {
    this.setState({open: !this.state.open});
  },

  render() {
    return (
      <div>
        <button onMouseDown={this.handleMouseDown}>Toggle</button>
        <FadeUpIn open={this.state.open} >
          <div className="block"></div>
          <div className="block"></div>
        </FadeUpIn>
      </div>
    );
  }
});

React.render(<Demo />, document.body);