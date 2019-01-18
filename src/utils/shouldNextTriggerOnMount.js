export default function nextTriggerOnMount({ rect, mode, prevOffset, position, direction, width }) {
  if (mode !== 'chain') return false
  switch (direction) {
    case 'toRight':
      return position.from > 0
    case 'toLeft':
    default:
      return rect.width + position.from <= width
  }
}
