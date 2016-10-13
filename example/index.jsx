import React, { Component, PropTypes, Children } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react/lib/shallowCompare'
import { spring } from 'react-motion'
import Transition from '../src/react-motion-ui-pack'

import './main.scss';

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
            measure={false}
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
  static defaultPops = {
    type: ''
  }

  render() {
    const { type, text } = this.props
    return (
      <Transition
        component={false}
        measure={false}
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
          text !== '' &&
          <div key="alert" className={"alert" + (type && ` alert--${type}`)}>
            {text}
          </div>
        }
      </Transition>
    )
  }
}

class App extends Component {
  state = {
    alert: ''
  }

  render() {
    const { alert } = this.state
    return (
      <div>
        <button
          onClick={() => this.setState({ alert: alert === '' ? 'Please figure out what is wrong.' : '' })}
        >
          Toggle Alert
        </button>
        <Alert type="warning" text={alert}/>
        <Modal/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
