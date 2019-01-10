export default function shouldNextTriggerOnMount({ rect, mode, offset, direction, width }) {
  if (mode !== 'chain' || !offset) return false
  switch (direction) {
    case 'toRight':
      return offset > 0
    case 'toLeft':
    default:
      return rect.right + offset <= width
  }
}
