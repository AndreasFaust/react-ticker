
import guidGenerator from './guidGenerator'

const getDefaultState = (offset, width) => ({
  elements: [{
    id: guidGenerator(),
    index: 0,
    height: 0
  }],
  width,
  prevOffset: offset,
  height: 0
})

export default getDefaultState
