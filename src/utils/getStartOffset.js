export default function getStartOffset({ offset, rect, direction, width }) {
  if (offset === 'run-in') {
    switch (direction) {
      case 'toRight':
        return -rect.width
      case 'toLeft':
      default:
        return width
    }
  }
  if (typeof offset === 'string') {
    const offsetRelative = Number(offset.replace('%', ''))
    if (offsetRelative) return (width / 100) * offsetRelative
  }
  return offset
}
