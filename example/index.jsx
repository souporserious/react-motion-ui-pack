import React, { Component, PropTypes } from 'react';
import { Spring } from 'react-motion';
import { Transition, UIPack } from '../src/react-motion-ui-pack';
import Measure from 'react-measure';

import './main.scss';

class Todo extends Component {
  _handleDelete(index) {
    this.props.onDelete(index);
  }

  render() {
    const { item, index, style } = this.props;

    return(
      <div className="todo" style={style}>
        <div className="todo__inner">
          {item}
          <div
            className="todo__remove"
            onClick={this._handleDelete.bind(this, index)}
          >
            ×
          </div>
        </div>
      </div>
    );
  }
}

class ToDos extends Component {
  constructor(props) {
    super(props);
    this.state = { items: ['apples', 'oranges', 'bananas', 'pears', 'kiwis'] };
  }

  addItem() {
    let newItems = this.state.items.concat([prompt('Enter some text')]);
    this.setState({ items: newItems });
  }

  removeItem = (index) => {
    let newItems = this.state.items;
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  }

  render() {
    const items = this.state.items.map((item, index) => {
      return <Todo key={item} item={item} index={index} onDelete={this.removeItem} />
    });

    return(
      <div className="todo-app">
        <div className="buttons">
          <button onClick={this.addItem.bind(this)}>Add Item</button>
        </div>
        <Transition
          component="div"
          className="todos"
          enter={{
            height: {val: 'auto'},
            scale: {val: 1},
            translateY: {val: 0},
            opacity: {val: 1}
          }}
          leave={{
            height: {val: 0},
            scale: {val: 0.5},
            translateY: {val: 0},
            opacity: {val: -0.75}
          }}
        >
          {items}
        </Transition>
      </div>
      );
  }
}

class Modal extends Component {
  state = {
    modalOpen: false
  }

  _toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen});
  }

  render() {
    const modalClasses = this.state.modalOpen ? 'modal modal--open' : 'modal';

    return(
      <div>
        <button className="modal-trigger" onClick={this._toggleModal}>
          <i>+</i>
        </button>
        <aside className={modalClasses}>
          <Transition 
            onlyChild={true}
            enter={{
              opacity: {val: 1},
              scale: {val: 1},
              rotate: {val: 0}
            }}
            leave={{
              opacity: {val: 0},
              scale: {val: 0},
              rotate: {val: 360}
            }}
          >
            {
              this.state.modalOpen &&
              <div key="modal" className="modal__content">
                Hey I'm a modal!
                <a onClick={this._toggleModal} className="modal__close"></a>
              </div>
            }
          </Transition>
        </aside>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return(
      <div>
        <ToDos />
        <Modal />
      </div>
    );
  }
}

React.render(<App />, document.body);