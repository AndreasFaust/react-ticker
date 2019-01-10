export default function getPrevOffset({ position, rect, direction }) {
  switch (direction) {
    case 'toRight': {
      return position.from
    }
    case 'toLeft':
    default: {
      return position.from + rect.width
    }
  }
}
