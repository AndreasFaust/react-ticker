import * as React from 'react'

type Props = {
  children: ({ index }: { index: number }) => React.ReactNode
  direction?: string,
  mode?: string,
  move?: boolean,
  offset?: number | string,
  speed?: number,
  height?: number | string
}

export default class Ticker extends React.Component<Props> {}
