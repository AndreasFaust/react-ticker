import * as React from 'react'

type Props = {
  direction?: string,
  mode?: string,
  move?: boolean,
  offset?: number | string,
  speed?: number,
  height?: number | string
}

export default class Ticker extends React.Component<Props> {}
