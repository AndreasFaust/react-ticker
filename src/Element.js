import React from 'react'
import { bool, func, node, number, object, oneOfType, string } from 'prop-types'

import shouldNextTriggerOnMount from './utils/shouldNextTriggerOnMount'
import getPosition from './utils/getPosition'
import getNextOffset from './utils/getNextOffset'
import getStartOffset from './utils/getStartOffset'

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
    setRect: func.isRequired,
    start: bool.isRequired,

    offset: oneOfType([number, string]),
    prevRect: object,
    width: number
  }

  static defaultProps = {
    offset: undefined,
    width: undefined,
    prevRect: null
  }

  state = {
    children: this.props.children({
      index: this.props.index
    }),
    move: this.props.move,
    position: { from: undefined, to: undefined, next: undefined },
    offset: this.props.offset,
    rect: null
  }
  x = 0
  isMoving = false
  nextTriggered = false
  elementRef = React.createRef()
  raf = null

  componentDidMount = () => {
    this.setPosition(true)
    this.observer = new MutationObserver(this.onMutation)
    this.observer.observe(this.elementRef.current, { characterData: true, childList: true, subtree: true })
  }

  componentWillUnmount = () => {
    this.observer.disconnect()
  }

  onMutation = () => {
    this.setPosition()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.x && prevState.position.from !== this.state.position.from) {
      this.x = this.state.position.from
      this.elementRef.current.style.transform = `translate3d(${this.x}px, 0, 0)`
    }
    if (this.x !== this.state.position.from &&
      prevProps.prevRect &&
      this.props.prevRect &&
      prevProps.prevRect.width !== this.props.prevRect.width) {
      if (this.props.offset) {
        this.x = this.x + (this.props.offset - prevProps.offset)
      } else {
        this.x = this.x + (this.props.prevRect.width - prevProps.prevRect.width)
      }
      this.elementRef.current.style.transform = `translate3d(${this.x}px, 0, 0)`
    }
    if (this.props.move && !prevProps.start && this.props.start) {
      this.animate()
    }
    if (this.props.start && !prevProps.move && this.props.move) {
      this.animate()
    }
    if (prevProps.move && !this.props.move) {
      this.isMoving = false
      window.cancelAnimationFrame(this.raf)
    }
  }

  setPosition = (isMount) => {
    const {
      mode,
      width,
      id,
      onNext,
      direction,
      index,
      setRect
    } = this.props

    const rect = this.elementRef.current.getBoundingClientRect()
    if (rect.width === 0) return

    const offset = this.props.index === 0
      ? getStartOffset({ offset: this.props.offset, rect, direction, width })
      : this.props.offset

    const position = getPosition({ mode, rect, index, offset, width, direction })

    setRect({
      index: this.props.index,
      rect,
      offset,
      nextOffset: getNextOffset({ from: position.from, rect, direction })
    })

    if (isMount) {
      const nextTriggerOnMount = shouldNextTriggerOnMount({ mode, rect, position, offset, direction, width })
      if (nextTriggerOnMount) {
        onNext({
          id,
          index,
          rect,
          nextOffset: getNextOffset({ from: position.from, rect, direction })
        })
      }
      if (!nextTriggerOnMount && (offset || index === 0)) {
        onNext({ id, index, rect })
      }
      this.nextTriggered = nextTriggerOnMount
    }

    this.setState({
      rect,
      offset,
      position
    })
  }

  shouldTriggerNext = () => {
    if (this.nextTriggered) return false
    return this.props.direction === 'toLeft'
      ? this.x <= this.state.position.next
      : this.x >= this.state.position.next
  }

  triggerNext = () => {
    if (this.shouldTriggerNext()) {
      // if (this.props.index === 5) console.log(this.x)
      this.nextTriggered = true
      this.props.onNext({
        id: this.props.id,
        index: this.props.index,
        rect: this.state.rect
      })
    }
  }

  shouldFinish = () => {
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
      if (!this.isMoving) return
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
        this.props.onFinish(this.props.id)
      } else {
        prevTimestamp = timestamp
        this.raf = window.requestAnimationFrame(step)
      }
    }
    this.raf = window.requestAnimationFrame(step)
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
