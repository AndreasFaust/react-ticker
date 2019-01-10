import React, { Component } from 'react'

import Ticker from 'react-ticker'

function rand(min, max) {
  var offset = min
  var range = (max - min) + 1
  var randomNumber = Math.floor(Math.random() * range) + offset
  return randomNumber
}

// const quotes = [
//   '“We are convinced that liberty without socialism is privilege, injustice; and that socialism without liberty is slavery and brutality.”',
//   '“Private capital tends to become concentrated in few hands, partly because of competition among the capitalists, and partly because technological development and the increasing division of labor encourage the formation of larger units of production at the expense of smaller ones. The result of these developments is an oligarchy of private capital the enormous power of which cannot be effectively checked even by a democratically organized political society. This is true since the members of legislative bodies are selected by political parties, largely financed or otherwise influenced by private capitalists who, for all practical purposes, separate the electorate from the legislature. The consequence is that the representatives of the people do not in fact sufficiently protect the interests of the underprivileged sections of the population. Moreover, under existing conditions, private capitalists inevitably control, directly or indirectly, the main sources of information (press, radio, education). It is thus extremely difficult, and indeed in most cases quite impossible, for the individual citizen to come to objective conclusions and to make intelligent use of his political rights.”',
//   '“Freedom is always the freedom of the dissenter.”',
//   '“Civil government, so far as it is instituted for the security of property, is in reality instituted for the defense of the rich against the poor, or of those who have some property against those who have none at all.”',
//   '“For the recognition of private property has really harmed Individualism, and obscured it, by confusing a man with what he possesses.”',
//   '“Everyone should be able to attend to his religious as well as his bodily needs without the police sticking their nose in.”',
//   '“Philosophers have hitherto interpreted the world in various ways; the point, however, is to change it.”',
//   '“Money is the alienated essence of man’s labor and life; and this alien essence dominates him as he worships it.',
// ]
const quotes = [
  '“Ich bin ein langer Test 1',
  '“Ich bin ein langer langer Test 2',
  '“Ich bin ein langer langer langer langer Test 3',
  '“Ich bin ein Test 4',
]

export default class App extends Component {
  state = { move: true }
  onClick = () => {
    this.setState(prevState => ({
      move: !prevState.move
    }))
  }
  render() {
    return (
      <div>
        {/* <Ticker
          direction='toRight'
          speed={3}
          offset="25%"
          mode="smooth"
          move={this.state.move}
        >
          {(index) => (
            <h1>{quotes[rand(0, quotes.length - 1)]}</h1>
          )}
        </Ticker> */}
        <Ticker
          offset="50%"
          move={this.state.move}
        >
          {(index) => (
            <h1>{quotes[rand(0, quotes.length - 1)]}</h1>
          )}
        </Ticker>
        <button onClick={this.onClick}>Start and Stop</button>
      </div>
    )
  }
}
