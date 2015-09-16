import React, { Component, PropTypes } from 'react';
import { Spring } from 'react-motion';
import { Transition, UIPack } from '../src/react-motion-ui-pack';
import Measure from 'react-measure';

import './main.scss';

class ToDos extends Component {

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
    const items = this.state.items.map((item, index) => {
      return(
          <div key={item} className="todo">
            <div className="todo__inner">
              {item}
              <div className="todo__remove" onClick={this.removeItem.bind(this, index)}>×</div>
            </div>
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
            scale: {val: 1},
            opacity: {val: 1}
          }}
          leave={{
            height: {val: 0},
            scale: {val: 0.5},
            opacity: {val: -0.75}
          }}
        >
          {items}
        </Transition>
      </div>
      );
  }
}

class TodosApp extends Component {

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
        <ToDos />
        <button className="modal-trigger" onClick={this._toggleModal}>
          <i>+</i>
        </button>
        <aside className={modalClasses}>
          <Transition 
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
  
  constructor() {
    super();
    this.state = {
      items: ['Apples', 'Pears', 'Oranges']
    }
  }
  
  _create() {
    let input = this.refs.input.getDOMNode();
    let items = [input.value].concat(this.state.items);

    this.setState({items: items}, () => {
      input.value = '';
      input.focus();
    });
  }
  
  _destroy(id) {
    let items = [...this.state.items];
    const pos = items.indexOf(id);
    if (pos > -1) {
      items.splice(pos, 1);
    }
    this.setState({items});
  }
  
  _handleSubmit(e) {
    e.preventDefault();
    this._create();
  }
  
  render() {
    
    const items = this.state.items.map(item => {
      return(
        <li
          key={item}
          className="tag tag-item"
          onClick={this._destroy.bind(this, item)}
        >
          <div className="tag__inner">
            {item}
          </div>
        </li>
      );
    });
    
    // push button to the end of items
    items.push(
      <li key="form" className="tag-item"> 
        <form className="add-tag" onSubmit={this._handleSubmit.bind(this)}>
          <input ref="input" type="text" className="add-tag__input" placeholder="Add Name"/>
        </form>
      </li>
    );
    
    return(
      <Measure>
        {dimensions =>
          <Spring
            defaultValue={0}
            endValue={dimensions.height}
          >
            {height =>
              <div className="tag-app" style={{height}}>
                <Transition
                  component="ul"
                  className="tags"
                  enter={{
                    width: {val: 'auto'},
                  }}
                  leave={{
                    width: {val: 0},
                  }}
                >
                  {items}
                </Transition>
              </div>
            }
          </Spring>
        }
      </Measure>
    );
  }
}

React.render(<TodosApp />, document.body);