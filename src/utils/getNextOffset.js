export default function getNextOffset({ from, rect, direction }) {
  switch (direction) {
    case 'toRight': {
      return from
    }
    case 'toLeft':
    default: {
      return from + rect.width
    }
  }
}
