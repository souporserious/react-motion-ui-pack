import React, { Component, PropTypes } from 'react';
import { Transition, UIPack } from '../src/react-motion-ui-pack';

import './main.scss';

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
        <Transition
          enter={{
            height: {val: 'auto'},
            opacity: {val: 1}
          }}
          leave={{
            height: {val: 0},
            opacity: {val: 0}
          }}
        >
          {items}
        </Transition>
      </div>
      );
  }
}

class App extends Component {

  state = {
    modalOpen: false
  }

  _toggleModal() {
    this.setState({modalOpen: !this.state.modalOpen});
  }

  render() {

    var modalClasses = this.state.modalOpen ? 'modal modal--open' : 'modal';

    return(
      <div>
        <ToDo />
        <button onClick={::this._toggleModal}>Open Modal</button>
        <aside className={modalClasses}>
          <Transition 
            enter={{
              opacity: {val: 1},
              translateY: {val: 0, config: [400, 10]}
            }}
            leave={{
              opacity: {val: 0},
              translateY: {val: 300}
            }}
          >
            {
              this.state.modalOpen &&
              <div key="modal" className="modal__content">
                Hey I'm a modal!
                <a onClick={::this._toggleModal} className="modal__close"></a>
              </div>
            }
          </Transition>
        </aside>
      </div>
    );
  }
}

React.render(<App />, document.body);