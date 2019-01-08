import React, { Component } from 'react'

import Ticker from 'react-ticker'

export default class App extends Component {
  render() {
    return (
      <div>
        <Ticker
          duration={50000}
        >
          <h1>Hallo, ich bin ein Text!!!!</h1>
        </Ticker>
        <Ticker>
          <h1>Hallo, ich bin ein ganz langer, langer, langer, langer, langer, langer, langer Text!!!!</h1>
        </Ticker>

      </div>
    )
  }
}
