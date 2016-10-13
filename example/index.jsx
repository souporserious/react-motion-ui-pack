import React, { Component, PropTypes, Children } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react/lib/shallowCompare'
import { spring } from 'react-motion'
import Transition from '../src/react-motion-ui-pack'

import './main.scss';

const HappyFaceSVG = ({ blink }) => (
  <svg width="90.5px" height="90.5px" viewBox="0 0 90.5 90.5">
    <circle fill="#FFF200" stroke="#231F20" cx="45.2" cy="45.2" r="44.7"/>
    <path fill="none" stroke="#231F20" strokeWidth="3" d="M75.7,45.2c0,16.8-13.7,30.5-30.5,30.5S14.7,62.1,14.7,45.2"/>
    <g>
    	<ellipse fill="#231F20" cx="32.6" cy="30.2" rx="5" ry="10.8"/>
      <Transition
        component={false}
        enter={{
          opacity: 1,
          scaleY: 1
        }}
        leave={{
          opacity: 0,
          scaleY: 0
        }}
      >
        { blink &&
          <ellipse key="eye" fill="#231F20" cx="57.9" cy="30.2" rx="5" ry="10.8"/>
        }
      </Transition>
    </g>
  </svg>
)

class Alert extends Component {
  static defaultPops = {
    type: ''
  }

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
        { text !== '' &&
          <div key="alert" className={"alert" + (type && ` alert--${type}`)}>
            {text}
          </div>
        }
      </Transition>
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
            { this.state.modalOpen &&
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
        {/*<Alert type="warning" text={alert}/>*/}
        <HappyFaceSVG blink={alert}/>
        <Modal/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
