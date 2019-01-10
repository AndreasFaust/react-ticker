import React from 'react'
import { bool, func, node, number, object, oneOfType, string } from 'prop-types'
import { Spring, animated } from 'react-spring'
import calculatePositionDuration from './utils/calculatePositionDuration'
import getDuration from './utils/getDuration'

class TickerElement extends React.Component {
  static propTypes = {
    children: oneOfType([node, func]).isRequired,
    direction: string.isRequired,
    duration: number.isRequired,
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
    duration: undefined,
    move: this.props.move,
    nextTriggerOnMount: false,
    nextTriggered: false,
    position: { from: undefined, to: undefined, next: undefined },
    rect: null,
    width: null,
    x: undefined
  }
  x = 0
  elementRef = React.createRef()

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.width !== prevState.width && prevState.rect) {
      return calculatePositionDuration(nextProps, prevState)
    }
    if (nextProps.move !== prevState.move) {
      const { width, direction, duration, move } = nextProps
      const { position, rect } = prevState
      return {
        duration: getDuration({
          position: { ...position, from: prevState.x },
          width,
          direction,
          duration,
          rect
        }),
        move
      }
    }
    return null
  }

  componentDidMount = () => {
    this.setState({
      rect: this.elementRef.current.getBoundingClientRect()
    })
  }

  shouldTriggerNext = (x) => {
    return this.props.direction === 'toLeft'
      ? x <= this.state.position.next
      : x >= this.state.position.next
  }

  onFrame = ({ x }) => {
    this.x = x
    if (this.state.nextTriggered || this.state.nextTriggerOnMount) return
    if (this.shouldTriggerNext(x)) {
      this.setState({ nextTriggered: true })
      this.props.onNext(this.props.id)
    }
  }

  render = () => this.state.rect && this.props.width
    ? (
      <Spring
        from={{ x: this.state.position.from }}
        to={{
          x: this.props.move
            ? this.state.position.to
            : this.x
        }}
        config={{ duration: this.state.duration }}
        native
        onRest={() => {
          if (this.x !== this.state.position.to) {
            this.setState({ x: this.x })
            return
          }
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
