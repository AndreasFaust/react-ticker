import React from 'react'
import { func, node, number, oneOfType, string } from 'prop-types'
import debounce from 'lodash/debounce'
import guidGenerator from './utils/guidGenerator'
import getHighest from './utils/getHighest'
import TickerElement from './Element'
import getDefaultState from './utils/getDefaultState'

export default class Ticker extends React.Component {
  static propTypes = {
    offset: oneOfType([number, string]),
    speed: number,
    children: oneOfType([node, func]).isRequired,
    direction: string,
    mode: string
  }

  static defaultProps = {
    offset: 0,
    speed: 5,
    direction: 'toLeft',
    mode: 'chain'
  }

  state = getDefaultState(this.props.offset)

  dOnResize = debounce(() => this.onResize(), 150)

  componentDidMount = () => {
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
    this.setState(getDefaultState(this.props.offset))
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

  render = () => (
    <div
      className='ticker'
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: this.state.height && `${this.state.height}px`
      }}
    >
      {this.state.elements.map(el => {
        return (
          <TickerElement
            key={el.id}
            id={el.id}
            index={el.index}
            duration={100000 / this.props.speed}
            direction={this.props.direction}
            prevOffset={this.state.prevOffset}
            setHeight={this.setHeight}
            windowWidth={this.state.windowWidth}
            onFinish={this.onFinish}
            onNext={this.onNext}
            mode={this.props.mode}
          >
            {this.props.children}
          </TickerElement>
        )
      })}
    </div>
  )
}
