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
    speed: number
  }

  static defaultProps = {
    offset: 0,
    speed: 5,
    direction: 'toLeft',
    mode: 'chain',
    move: true
  }

  state = getDefaultState(this.props.offset)
  tickerRef = React.createRef()

  dOnResize = debounce(() => this.onResize(), 150)

  componentDidMount = () => {
    this.setState({ width: this.tickerRef.current.offsetWidth })
    window.addEventListener('resize', this.dOnResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.dOnResize)
  }

  setHeight = (height) => {
    this.setState(prevState => {
      const elements = prevState.elements.map(el => ({ ...el, height }))
      return {
        elements,
        height: getHighest(elements)
      }
    })
  }

  onResize = () => {
    this.setState(getDefaultState(this.props.offset, this.tickerRef.current.offsetWidth))
  }

  onFinish = (id) => {
    this.setState(prevState => ({
      elements: prevState.elements.filter(el => el.id !== id)
    }))
  }

  onNext = (id, offset) => {
    this.setState(prevState => ({
      elements: [...prevState.elements, {
        id: guidGenerator(),
        index: prevState.elements[prevState.elements.length - 1].index + 1,
        height: 0
      }],
      prevOffset: offset
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
          this.state.elements.map(el => {
            return (
              <TickerElement
                direction={this.props.direction}
                id={el.id}
                index={el.index}
                mode={this.props.mode}
                move={this.props.move}
                onFinish={this.onFinish}
                onNext={this.onNext}
                prevOffset={this.state.prevOffset}
                key={el.id}
                speed={this.props.speed}
                setHeight={this.setHeight}
                width={this.state.width}
              >
                {this.props.children}
              </TickerElement>
            )
          })
        }
      </div >
    )
  }
}
