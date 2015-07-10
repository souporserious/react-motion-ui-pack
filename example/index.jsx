import React from 'react';
import Spring from 'react-motion';

//import './main.scss';

class FadeUpIn {
  render() {
    return(
      <Spring className="demo0" endValue={{
            translateY: {val: this.props.open ? 0 : 25 },
            opacity: {val: this.props.open ? 1 : 0 }
          }}>
          {({translateY, opacity}) =>
            <div style={{
              transform: `translate3d(0, ${translateY.val}px, 0)`,
              opacity: opacity.val
            }}>
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
        </FadeUpIn>
      </div>
    );
  }
});

React.render(<Demo />, document.body);