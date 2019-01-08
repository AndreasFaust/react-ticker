import React from 'react'
import { node, number } from 'prop-types'
import debounce from 'lodash/debounce'
import guidGenerator from './utils/guidGenerator'
import TickerElement from './utils/element'

export default class Ticker extends React.Component {
  static propTypes = {
    startPosition: number,
    duration: number,
    children: node
  }

  static defaultProps = {
    startPosition: 0,
    duration: 15000
  }

  state = {
    elements: [guidGenerator()],
    windowWidth: window.innerWidth,
    startPosition: this.props.startPosition,
    rect: null
  }

  dOnResize = debounce(() => this.onResize(), 150)

  componentDidMount = () => {
    window.addEventListener('resize', this.dOnResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.dOnResize)
  }

  setRect = (rect) => {
    this.setState({ rect })
  }

  onResize = () => {
    this.setState({
      elements: [guidGenerator()],
      startPosition: this.props.startPosition,
      windowWidth: window.innerWidth,
      rect: null
    })
  }

  onFinish = (id) => {
    this.setState(prevState => ({
      elements: prevState.elements.filter(el => el !== id)
    }))
  }

  onNext = (id, startPosition) => {
    this.setState(prevState => ({
      elements: [...prevState.elements, guidGenerator()],
      startPosition
    }))
  }

  render = () => (
    <div
      className='ticker'
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: this.state.rect && `${this.state.rect.height}px`
      }}
    >
      {this.state.elements.map(el => (
        <TickerElement
          key={el}
          id={el}
          duration={this.props.duration}
          startPosition={this.state.startPosition}
          rect={this.state.rect}
          setRect={this.setRect}
          windowWidth={this.state.windowWidth}
          onFinish={this.onFinish}
          onNext={this.onNext}
        >
          {this.props.children}
        </TickerElement>
      ))}
    </div>
  )
}
