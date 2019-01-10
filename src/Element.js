import React from 'react'
import { func, node, number, object, oneOfType, string } from 'prop-types'
import { Spring, animated } from 'react-spring'
import getDuration from './utils/getDuration'
import shouldNextTriggerOnMount from './utils/shouldNextTriggerOnMount'
import getPosition from './utils/getPosition'
import getPrevOffset from './utils/getPrevOffset'
import getStartOffset from './utils/getStartOffset'

class TickerElement extends React.Component {
  static propTypes = {
    prevOffset: oneOfType([number, string]),
    duration: number.isRequired,
    mode: string.isRequired,
    setHeight: func.isRequired,
    onNext: func.isRequired,
    onFinish: func.isRequired,
    windowWidth: number.isRequired,
    id: string.isRequired,
    index: number.isRequired,
    rect: object,
    direction: string.isRequired,
    children: oneOfType([node, func]).isRequired
  }

  static defaultProps = {
    prevOffset: undefined,
    rect: null
  }

  elementRef = React.createRef()

  state = {
    position: { from: undefined, to: undefined, next: undefined },
    duration: undefined,
    nextTriggerOnMount: false,
    nextTriggered: false,
    rect: null,
    children: this.props.children(this.props.index)
  }

  componentDidMount = () => {
    const {
      mode,
      prevOffset,
      windowWidth,
      id,
      onNext,
      duration,
      direction,
      index
    } = this.props

    const rect = this.elementRef.current.getBoundingClientRect()
    const offset = getStartOffset({ prevOffset, rect, direction, windowWidth })
    const position = getPosition({ mode, rect, index, offset, windowWidth, direction })
    const nextTriggerOnMount = shouldNextTriggerOnMount({ mode, rect, offset, direction, windowWidth })

    if (nextTriggerOnMount) {
      onNext(id, getPrevOffset({ position, rect, direction }))
    }

    this.props.setHeight(rect.height)

    this.setState({
      rect,
      position,
      duration: getDuration({
        position,
        windowWidth,
        direction,
        duration,
        rect
      }),
      nextTriggerOnMount
    })
  }

  shouldTriggerNext = (x) => {
    return this.props.direction === 'toLeft'
      ? x <= this.state.position.next
      : x >= this.state.position.next
  }

  onFrame = ({ x }) => {
    if (this.state.nextTriggered || this.state.nextTriggerOnMount) return
    if (this.shouldTriggerNext(x)) {
      this.setState({ nextTriggered: true })
      this.props.onNext(this.props.id)
    }
  }

  render = () => this.state.rect
    ? (
      <Spring
        from={{ x: this.state.position.from }}
        to={{ x: this.state.position.to }}
        config={{ duration: this.state.duration }}
        native
        onRest={() => {
          this.props.onFinish(this.props.id)
        }}
        onFrame={this.onFrame}
      >
        {({ x }) => (
          <animated.div
            className='ticker__element'
            style={{
              willChange: 'transform',
              position: 'absolute',
              top: 0,
              left: 0,
              transform: x.interpolate(x => `translate3d(${x}px, 0, 0)`)
            }}
          >
            {this.state.children}
          </animated.div>
        )}
      </Spring>
    ) : (
      <div
        className='ticker__element'
        style={{
          willChange: 'transform',
          position: 'absolute',
          left: 0,
          top: 0
        }}
        ref={this.elementRef}
      >
        {this.state.children}
      </div>
    )
}

export default TickerElement
