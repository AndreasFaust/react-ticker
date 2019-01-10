import getDuration from './getDuration'
import shouldNextTriggerOnMount from './shouldNextTriggerOnMount'
import getPosition from './getPosition'
import getPrevOffset from './getPrevOffset'
import getStartOffset from './getStartOffset'

export default function calculatePositionDuration(nextProps, prevState) {
  const {
    mode,
    prevOffset,
    width,
    id,
    onNext,
    duration,
    direction,
    index,
    setHeight
  } = nextProps

  const { rect } = prevState

  const offset = getStartOffset({ prevOffset, rect, direction, width })
  const position = getPosition({ mode, rect, index, offset, width, direction })
  const nextTriggerOnMount = shouldNextTriggerOnMount({ mode, rect, offset, direction, width })

  if (nextTriggerOnMount) {
    onNext(id, getPrevOffset({ position, rect, direction }))
  }

  setHeight(rect.height)

  return {
    rect,
    position,
    duration: getDuration({
      position,
      width,
      direction,
      duration,
      rect
    }),
    nextTriggerOnMount,
    width
  }
}
