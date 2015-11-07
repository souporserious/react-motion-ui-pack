import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react/lib/shallowCompare'
import { spring } from 'react-motion'
import Transition from '../src/react-motion-ui-pack'

import './main.scss';

class Todo extends Component {
  state = {
    expand: false
  }

  _handleDelete(index, e) {
    e.stopPropagation()
    this.props.onDelete(index)
  }

  render() {
    const { item, index, style } = this.props
    const { expand } = this.state

    return (
      <div className="todo" style={style}>
        <div className="todo__inner">
          {item}
          <div
            className="todo__remove"
            onClick={this._handleDelete.bind(this, index)}
          >
            ×
          </div>
          <div
            className="todo__expand"
            onClick={() => {this.setState({expand: !expand})}}
          >
            {expand ? '-' : '+'}
          </div>
          {
            expand &&
            <div style={{height: 100}} />
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

    return (
      <div className="todo-app">
        <div className="buttons">
          <button onClick={this.addItem.bind(this)}>Add Item</button>
        </div>
        <Transition
          component="div"
          className="todos"
          measure={true}
          enter={{
            height: spring('auto', [100, 15]),
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

    return (
      <div>
        <button className="modal-trigger" onClick={this._toggleModal}>
          <i>+</i>
        </button>
        <aside className={modalClasses}>
          <Transition 
            component={false}
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

class Menu extends Component {
  state = {
    isOpen: false
  }

  render() {
    const { isOpen } = this.state

    return (
      <div className="menu-container">
        <button
          onClick={() => this.setState({isOpen: !isOpen})}
          className="menu-button"
        >
          {isOpen ? 'Close' : 'Open'}
        </button>
        <Transition
          component={false}
          enter={{height: 'auto'}}
          leave={{height: 0}}
        >
          {
            isOpen &&
            <div className="menu">
              <div>There should be some content here</div>
              <div>There should be some content here</div>
            </div>
          }
        </Transition>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return(
      <div>
        <ToDos/>
        <Modal/>
        <Menu/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))