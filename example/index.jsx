import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react/lib/shallowCompare'
import { spring } from 'react-motion'
import Transition from '../src/react-motion-ui-pack'

import './main.scss';

class Todo extends Component {
  state = {
    isOpen: false
  }

  _handleDelete(index, e) {
    e.stopPropagation()
    this.props.onDelete(index)
  }

  render() {
    const { item, index, style } = this.props
    const { extraContent } = this.state

    return(
      <div className="todo" style={style}>
        <div
          className="todo__inner"
          onClick={() => {this.setState({extraContent: !extraContent})}}
        >
          {item}
          <div
            className="todo__remove"
            onClick={this._handleDelete.bind(this, index)}
          >
            ×
          </div>
          {
            extraContent &&
            <div style={{height: 150}} />
          }
        </div>
      </div>
    )
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
          measure={true}
          enter={{
            height: 'auto',
            scale: 1,
            translateY: 0,
            opacity: 1
          }}
          leave={{
            height: 0,
            scale: 0.5,
            translateY: 0,
            opacity: -1
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
              opacity: 1,
              scale: 1,
              rotate: 0
            }}
            leave={{
              opacity: 0,
              scale: 0,
              rotate: 360
            }}
          >
            {
              this.state.modalOpen &&
              <div className="modal__content" style={{background: '#F1F2F3'}}>
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

ReactDOM.render(<App />, document.getElementById('app'))