import React from 'react'
import { bool, func, node, number, oneOfType, string } from 'prop-types'
import debounce from './utils/debounce'
import guidGenerator from './utils/guidGenerator'
import getHighest from './utils/getHighest'
import TickerElement from './Element'
import getDefaultState from './utils/getDefaultState'

export default class Ticker extends React.Component {
  static propTypes = {
    children: oneOfType([node, func]).isRequired,

    direction: string,
    mode: string,
    move: bool,
    offset: oneOfType([number, string]),
    speed: number,
    height: oneOfType([number, string])
  }

  static defaultProps = {
    offset: 0,
    speed: 5,
    direction: 'toLeft',
    mode: 'chain',
    move: true,
    height: undefined
  }
  next = null
  state = getDefaultState(this.props.offset)
  tickerRef = React.createRef()

  dOnResize = debounce(() => this.onResize(), 150)

  componentDidMount = () => {
    this.setState({
      width: this.tickerRef.current.offsetWidth,
      height: this.props.height
    })
    window.addEventListener('resize', this.dOnResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.dOnResize)
  }

  setRect = ({ index, rect, offset, nextOffset }) => {
    this.setState(prevState => {
      const elements = prevState.elements.map(el => {
        const newEl = el
        if (el.index === index) newEl.rect = rect
        // next element
        if (el.index === index + 1) {
          newEl.prevRect = rect
          if (newEl.offset) {
            newEl.offset = nextOffset
          }
        }
        return newEl
      })
      return {
        elements,
        height: this.props.height
          ? prevState.height
          : getHighest(elements)
      }
    })
  }

  onResize = () => {
    if (!this.tickerRef.current || this.tickerRef.current.offsetWidth === this.state.width) return
    this.setState({
      ...getDefaultState(this.props.offset, this.tickerRef.current.offsetWidth),
      height: this.props.height
    })
  }

  onFinish = (id) => {
    this.setState(prevState => ({
      elements: prevState.elements.filter(el => el.id !== id)
    }))
  }

  onNext = ({ id, index, rect, nextOffset }) => {
    this.setState(prevState => ({
      elements: [
        // start next element
        ...prevState.elements.map(el => {
          const newEl = el
          if (el.index === index) newEl.rect = rect
          if (el.index === 0 || el.offset || newEl.index === index + 1) {
            newEl.start = true
          }
          return newEl
          // create new element
        }), {
          id: guidGenerator(),
          index: prevState.elements[prevState.elements.length - 1].index + 1,
          height: 0,
          start: false,
          offset: nextOffset,
          rect: null,
          prevRect: rect
        }
      ]
    }))
  }

  render() {
    return (
      <div
        className='ticker'
        ref={this.tickerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: this.state.height && `${this.state.height}px`
        }}
      >
        {
          this.state.width && this.state.elements.map(el => {
            return (
              <TickerElement
                key={el.id}
                id={el.id}
                index={el.index}
                start={el.start}
                offset={el.offset}
                prevRect={el.prevRect}

                direction={this.props.direction}
                mode={this.props.mode}
                move={this.props.move}
                speed={this.props.speed}

                onFinish={this.onFinish}
                onNext={this.onNext}
                setRect={this.setRect}
                width={this.state.width}
              >
                {this.props.children}
              </TickerElement>
            )
          })
        }
      </div>
    )
  }
}
