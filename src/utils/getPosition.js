function getFromOffset({ rect, offset, direction }) {
  switch (direction) {
    case 'toRight':
      return offset - rect.width
    case 'toLeft':
    default:
      return offset
  }
}

function getFrom({ index, rect, offset, windowWidth, direction }) {
  if (index === 0) return offset

  if (typeof offset === 'number') {
    return getFromOffset({ rect, offset, direction })
  }

  switch (direction) {
    case 'toRight':
      return -rect.width
    case 'toLeft':
    default:
      return windowWidth
  }
}

function getTo({ rect, windowWidth, direction }) {
  switch (direction) {
    case 'toRight':
      return windowWidth
    case 'toLeft':
    default:
      return -rect.width
  }
}

function getNext({ mode, from, direction, rect, windowWidth }) {
  const start = from || 0

  switch (mode) {
    case 'await':
      switch (direction) {
        case 'toRight':
          return windowWidth
        case 'toLeft':
        default:
          return -rect.width
      }
    case 'smooth':
      switch (direction) {
        case 'toRight':
          return rect.width > windowWidth
            ? 0
            : windowWidth - rect.width
        case 'toLeft':
        default:
          return rect.width > windowWidth
            ? windowWidth - rect.width
            : 0
      }
    case 'chain':
    default:
      switch (direction) {
        case 'toRight':
          return 0
        case 'toLeft':
        default:
          return rect.right + start > windowWidth
            ? windowWidth - rect.right
            : windowWidth - rect.left - rect.width
      }
  }
}

export default ({ mode, index, rect, offset, windowWidth, direction }) => {
  const from = getFrom({ index, rect, offset, windowWidth, direction })
  const to = getTo({ rect, windowWidth, direction })
  return {
    from,
    to,
    next: getNext({ mode, from, direction, rect, windowWidth })
  }
}
