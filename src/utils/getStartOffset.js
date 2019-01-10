export default function getStartOffset({ prevOffset, rect, direction, width }) {
  if (prevOffset === 'run-in') {
    switch (direction) {
      case 'toRight':
        return -rect.width
      case 'toLeft':
      default:
        return width
    }
  }
  if (typeof prevOffset === 'string') {
    const offsetRelative = Number(prevOffset.replace('%', ''))
    if (offsetRelative) return (width / 100) * offsetRelative
  }
  return prevOffset
}
