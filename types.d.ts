import { Component, ComponentClass } from 'react'

export interface TransitionProps {
    component?: string | boolean | ComponentClass<any>
    runOnMount?: boolean
    appear?: Object
    enter?: Object
    leave?: Object
    onEnter?: (currentValues: Object) => void
    onLeave?: (currentValues: Object) => void
}

export default class Transition extends Component<TransitionProps, any> {}
