import React from 'react'
import { func, node, number, object, string } from 'prop-types'
import { Spring, animated } from 'react-spring'

function getNextTriggerPosition({ startPosition, rect, windowWidth }) {
  const startPos = startPosition || 0
  return rect.right + startPos > windowWidth
    ? windowWidth - rect.right
    : windowWidth - rect.left - rect.width
}

function getDuration({ startPosition, windowWidth, duration, rect, endPos }) {
  const factor = typeof startPosition === 'number' &&
    ((startPosition + endPos) * 100) / ((windowWidth - rect.left) + endPos)

  return factor
    ? Math.round(duration * (factor / 100))
    : duration
}

class TickerElement extends React.Component {
  static propTypes = {
    startPosition: number,
    duration: number.isRequired,
    setRect: func.isRequired,
    onNext: func.isRequired,
    onFinish: func.isRequired,
    windowWidth: number.isRequired,
    children: node.isRequired,
    id: string.isRequired,
    rect: object
  }

  static defaultProps = {
    startPosition: undefined,
    rect: null
  }

  elementRef = React.createRef()

  nextTriggered = false

  state = {
    values: { from: undefined, to: undefined, next: undefined },
    duration: undefined,
    nextTriggerOnMount: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.rect || !nextProps.rect) return null

    const { rect, startPosition, windowWidth, id, onNext, duration } = nextProps

    const nextTriggerOnMount = typeof startPosition === 'number' &&
      rect.right + startPosition <= windowWidth

    if (nextTriggerOnMount) {
      onNext(id, startPosition + rect.width)
    }

    const endPos = rect.left + rect.width

    return {
      rect,
      values: {
        from: typeof startPosition === 'number'
          ? startPosition
          : windowWidth - rect.left,
        to: -endPos,
        next: getNextTriggerPosition({ startPosition, rect, windowWidth })
      },
      duration: getDuration({ startPosition, windowWidth, duration, rect, endPos }),
      nextTriggerOnMount
    }
  }

  componentDidMount = () => {
    const { rect } = this.props
    if (!rect) {
      this.props.setRect(this.elementRef.current.getBoundingClientRect())
    }
  }

  onFrame = ({ x }) => {
    if (!this.nextTriggered && x <= this.state.values.next) {
      this.nextTriggered = true
      if (this.state.nextTriggerOnMount) return
      this.props.onNext(this.props.id, { rect: this.state.rect })
    }
  }

  render = () => this.props.rect
    ? (
      <Spring
        from={{ x: this.state.values.from }}
        to={{ x: this.state.values.to }}
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
            {this.props.children}
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
        {this.props.children}
      </div>
    )
}

export default TickerElement
