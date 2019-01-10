export default function getStartOffset({ prevOffset, rect, direction, windowWidth }) {
  if (prevOffset === 'run-in') {
    switch (direction) {
      case 'toRight':
        return -rect.width
      case 'toLeft':
      default:
        return windowWidth
    }
  }
  if (typeof prevOffset === 'string') {
    const offsetRelative = Number(prevOffset.replace('%', ''))
    if (offsetRelative) return (windowWidth / 100) * offsetRelative
  }
  return prevOffset
}
