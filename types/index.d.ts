import * as React from 'react'

type Props = {
  direction?: string,
  mode?: string,
  move?: bool,
  offset?: Array<number> | Array<string>,
  speed?: number,
  height?: Array<number> | Array<string>
}

export default class Ticker extends React.Component<Props> {
}
