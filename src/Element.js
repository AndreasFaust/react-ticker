import React from 'react'
import { bool, func, node, number, object, oneOfType, string } from 'prop-types'
import calculatePosition from './utils/calculatePosition'

class TickerElement extends React.Component {
  static propTypes = {
    children: oneOfType([node, func]).isRequired,
    direction: string.isRequired,
    speed: number.isRequired,
    id: string.isRequired,
    index: number.isRequired,
    mode: string.isRequired,
    move: bool.isRequired,
    onNext: func.isRequired,
    onFinish: func.isRequired,
    setHeight: func.isRequired,

    prevOffset: oneOfType([number, string]),
    width: number
  }

  static defaultProps = {
    prevOffset: undefined,
    width: null
  }

  state = {
    children: this.props.children(this.props.index),
    move: this.props.move,
    nextTriggerOnMount: false,
    nextTriggered: false,
    position: { from: undefined, to: undefined, next: undefined },
    rect: null,
    width: null
  }
  x = 0
  isMoving = false
  elementRef = React.createRef()

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.width !== prevState.width && prevState.rect) {
      return calculatePosition(nextProps, prevState)
    }
    return null
  }

  componentDidMount = () => {
    this.setState({
      rect: this.elementRef.current.getBoundingClientRect()
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.position.from && this.state.position.from) {
      this.x = this.state.position.from
      this.animate()
    }
    if (prevProps.move && !this.props.move) {
      this.isMoving = false
    }
    if (!prevProps.move && this.props.move) {
      this.animate()
    }
  }

  shouldTriggerNext = () => {
    return this.props.direction === 'toLeft'
      ? this.x <= this.state.position.next
      : this.x >= this.state.position.next
  }

  triggerNext = () => {
    if (this.state.nextTriggered || this.state.nextTriggerOnMount) return
    if (this.shouldTriggerNext()) {
      this.setState({ nextTriggered: true })
      this.props.onNext(this.props.id)
    }
  }

  shouldFinish = () => {
    if (!this.isMoving) return true
    switch (this.props.direction) {
      case 'toRight':
        return this.x >= this.state.position.to
      case 'toLeft':
      default:
        return this.x <= this.state.position.to
    }
  }

  animate = () => {
    if (this.isMoving) return
    this.isMoving = true

    let prevTimestamp = null

    const step = (timestamp) => {
      if (!this.elementRef.current) return

      const progress = prevTimestamp
        ? timestamp - prevTimestamp
        : 0

      this.x = this.props.direction === 'toLeft'
        ? this.x - (progress / 100 * this.props.speed)
        : this.x + (progress / 100 * this.props.speed)

      this.elementRef.current.style.transform = `translate3d(${this.x}px, 0, 0)`
      this.triggerNext()

      if (this.shouldFinish()) {
        this.isMoving = false
        prevTimestamp = null
      } else {
        prevTimestamp = timestamp
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  render = () => (
    <div
      className='ticker__element'
      style={{
        willChange: 'transform',
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${this.x}px, 0, 0)`
      }}
      ref={this.elementRef}
    >
      {this.state.children}
    </div>
  )
}

export default TickerElement
