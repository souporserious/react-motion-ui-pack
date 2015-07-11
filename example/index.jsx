import React, { Component, PropTypes } from 'react';
import Spring, { TransitionSpring } from 'react-motion';

import './main.scss';

class FadeUpIn {

  static defaultProps = {
    translateY: 25
  }
  
  getEndValues() {

    let configs = [];

    React.Children.forEach(this.props.children, (child, i) => {
      configs[i] = {
        translateY: {val: 0},
        opacity: {val: 1}
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

  willLeave(key, endValue, currValue) {
    if(currValue[key].opacity.val > 0) {
      return {
        translateY: {val: this.props.translateY},
        opacity: {val: 0}
      }
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
          React.Children.map(this.props.children, (child, i) =>
            React.cloneElement(child, {
              style: {
                transform: `translateY(${currValue[i].translateY.val}px)`,
                opacity: currValue[i].opacity.val
              }
            })
          )
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
                <FadeUpIn>
                  {items}
                </FadeUpIn>
            </div>
        );
    }
}

React.render(<ToDo />, document.body);