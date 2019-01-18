function getFromOffset({ rect, offset, direction }) {
  switch (direction) {
    case 'toRight':
      return offset - rect.width
    case 'toLeft':
    default:
      return offset
  }
}

function getFrom({ index, rect, offset, width, direction }) {
  if (index === 0) return offset

  if (typeof offset === 'number') {
    return getFromOffset({ rect, offset, direction })
  }

  switch (direction) {
    case 'toRight':
      return -rect.width
    case 'toLeft':
    default:
      return width
  }
}

function getTo({ rect, width, direction }) {
  switch (direction) {
    case 'toRight':
      return width
    case 'toLeft':
    default:
      return -rect.width
  }
}

function getNext({ mode, from, direction, rect, width }) {
  const start = from || 0

  switch (mode) {
    case 'await':
      switch (direction) {
        case 'toRight':
          return width
        case 'toLeft':
        default:
          return -rect.width
      }
    case 'smooth':
      switch (direction) {
        case 'toRight':
          return rect.width > width
            ? 0
            : width - rect.width
        case 'toLeft':
        default:
          return rect.width > width
            ? width - rect.width
            : 0
      }
    case 'chain':
    default:
      switch (direction) {
        case 'toRight':
          return 0
        case 'toLeft':
        default:
          return rect.width + start > width
            ? width - rect.width
            : width - rect.left - rect.width
      }
  }
}

export default ({ mode, index, rect, offset, width, direction }) => {
  const from = getFrom({ index, rect, offset, width, direction })
  const to = getTo({ rect, width, direction })
  return {
    from,
    to,
    next: getNext({ mode, from, direction, rect, width })
  }
}
