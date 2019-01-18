
import guidGenerator from './guidGenerator'

const getDefaultState = (offset, width) => ({
  elements: [{
    id: guidGenerator(),
    index: 0,
    height: 0,
    start: false,
    offset: offset,
    rect: null,
    prevRect: null
  }],
  width,
  height: 0
})

export default getDefaultState
