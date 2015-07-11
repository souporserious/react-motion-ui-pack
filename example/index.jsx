import React, { Component, PropTypes } from 'react';
import Spring, { TransitionSpring } from 'react-motion';

import './main.scss';

class FadeUpIn {

  static defaultProps = {
    appear: true,
    translateY: 25
  }
  
  getEndValues(currValue) {

    let translateYValue = this.props.appear && !currValue ? this.props.translateY : 0;
    let opacityValue = this.props.appear && !currValue ? 0 : 1;
    let configs = {};

    React.Children.forEach(this.props.children, child => {
      configs[child.key] = {
        translateY: {val: translateYValue},
        opacity: {val: opacityValue}
      };
    });

    return configs;
  }

  willEnter() {
    return {
      translateY: {val: this.props.translateY},
      opacity: {val: 0}
    }
  }

  willLeave(key, endValues, currentValue, currentSpeed) {
    if (currentValue[key].opacity.val === 0 && currentSpeed[key].opacity.val === 0) {
      return null; // kill component when opacity reaches 0
    }
    return {
        translateY: {val: this.props.translateY},
        opacity: {val: 0}
      }
  }

  render() {
    return(
      <TransitionSpring
        endValue={::this.getEndValues}
        willEnter={::this.willEnter}
        willLeave={::this.willLeave}
      >
        {(currValue) =>
          React.Children.map(this.props.children, (child) => {
            if(!currValue[child.key]) {
              return null;
            }
            return React.cloneElement(child, {
              style: {
                WebkitTransform: `translateY(${currValue[child.key].translateY.val}px)`,
                opacity: currValue[child.key].opacity.val
              }
            })
          })
        }
      </TransitionSpring>
    );
  }
}

class ToDo extends Component {

    constructor(props) {
        super(props);
        this.state = { items: ['apples', 'oranges', 'bananas', 'pears', 'kiwis'] };
    }

    addItem() {
        var newItems = this.state.items.concat([prompt('Enter some text')]);
        this.setState({ items: newItems });
    }

    removeItem(index) {
        var newItems = this.state.items;
        newItems.splice(index, 1);
        this.setState({ items: newItems });
    }

    render() {

        let items = this.state.items.map((item, index) => {
            return(
                <div key={item} className="todo" onClick={this.removeItem.bind(this, index)}>
                    {item}
                </div>
            );
        });

        return(
            <div className="todo-app">
                <div className="buttons">
                    <button onClick={this.addItem.bind(this)}>Add Item</button>
                </div>
                <FadeUpIn component="ul">
                  {items}
                </FadeUpIn>
            </div>
        );
    }
}

React.render(<ToDo />, document.body);