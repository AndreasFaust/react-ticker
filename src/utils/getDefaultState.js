
import guidGenerator from './guidGenerator'

const getDefaultState = (offset) => ({
  elements: [{
    id: guidGenerator(),
    index: 0,
    height: 0
  }],
  windowWidth: window.innerWidth,
  prevOffset: offset,
  height: 0
})

export default getDefaultState
