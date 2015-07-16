import React, { Component, PropTypes } from 'react';
import Spring, { TransitionSpring } from 'react-motion';
import { Transition } from '../src/ReactMotionUIPack';

import './main.scss';

// Transition.register('slideUpIn', {
//   translateY: {val: 0},
//   opacity: {val: 1}
// }, {
//   translateY: {val: 25},
//   opacity: {val: 0}
// });

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
        <Transition appear={true}>
          {items}
        </Transition>
      </div>
      );
  }
}

React.render(<ToDo />, document.body);