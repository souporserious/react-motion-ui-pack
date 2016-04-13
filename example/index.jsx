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
    this.state = {
      showTodos: true,
      items: ['apples', 'oranges', 'bananas', 'pears', 'kiwis']
    }
  }

  addItem() {
    let newItems = this.state.items.concat([prompt('Enter some text')]);
    this.setState({ items: newItems });
  }

  addRandom = () => {
    const add = Math.random() > 0.5
    if (add) {
      let newItems = this.state.items.concat([Math.random()])
      this.setState({ items: newItems })
    }
    setTimeout(this.addRandom, 400)
  }

  removeItem = (index) => {
    let newItems = this.state.items;
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  }

  render() {
    const { showTodos } = this.state
    const items = this.state.items.map((item, index) => {
      return <Todo key={item} item={item} index={index} onDelete={this.removeItem} />
    });

    return (
      <div className="todo-app">
        <div className="buttons">
          <button onClick={() => this.addItem()}>Add Item</button>
          <button onClick={() => this.setState({ showTodos: !showTodos })}>Toggle</button>
          <button onClick={() => this.addRandom()}>Random</button>
        </div>
        { showTodos &&
          <Transition
            runOnMount={false}
            className="todos"
            enter={{
              height: spring(300, { stiffness: 300, damping: 40 }),
              scale: 1,
              opacity: 1
            }}
            leave={{
              height: 0,
              scale: 0.5,
              opacity: -1
            }}
            onEnter={(styles) => {
              //console.log(styles)
            }}
            onLeave={(styles) => {
              //console.log(styles)
            }}
          >
            {items}
          </Transition>
        }
      </div>
      );
  }
}

class Menu extends Component {
  state = {
    isOpen: false,
    extraContent: false
  }

  render() {
    const { isOpen, extraContent } = this.state

    return (
      <div className="menu-container">
        <button
          className="menu-button"
          onClick={() => this.setState({isOpen: !isOpen})}
        >
          {isOpen ? 'Close' : 'Open'}
        </button>
        <Transition
          component={false}
          enter={{scale: 1}}
          leave={{scale: 0}}
        >
          {
            isOpen &&
            <div key="menu" className="menu">
              <div style={{padding: 12}}>
                There should be some content here
              </div>
              <button onClick={() => this.setState({extraContent: !extraContent})}>
                Toggle Extra Content
              </button>
              <Transition
                component={false}
                enter={{height: 'auto'}}
                leave={{height: 0}}
              >
                {
                  extraContent &&
                  <div key="menu-content">Extra Menu Contnt</div>
                }
              </Transition>
            </div>
          }
        </Transition>
      </div>
    )
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
              <div key="modal" className="modal__content" style={{background: '#F1F2F3'}}>
                Hey I am a modal!
                <a onClick={this._toggleModal} className="modal__close"></a>
              </div>
            }
          </Transition>
        </aside>
      </div>
    );
  }
}

class Alert extends Component {
  render() {
    const { type, text } = this.props
    return (
      <Transition
        component={false}
        enter={{
          opacity: 1,
          translateY: 0
        }}
        leave={{
          opacity: 0,
          translateY: 80
        }}
      >
        {
          text &&
          <div
            key="alert"
            className={"alert" + (type && ` alert--${type}`)}
          >
            {text}
          </div>
        }
      </Transition>
    )
  }
}

class App extends Component {
  render() {
    return(
      <div>
        <Alert type="warning" text="Please figure out what is wrong." />
        <ToDos/>
        <Menu/>
        <Modal/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
