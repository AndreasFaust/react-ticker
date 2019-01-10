
//   duration                  x
// ------------  =  -----------------------------
//  width                  width + element.width

function getDuration({ position, width, direction, duration, rect }) {
  switch (direction) {
    case 'toRight': {
      return (duration * (width - position.from)) / width
    }
    case 'toLeft':
    default: {
      return (duration * (width - (width - position.from) + rect.width)) / width
    }
  }
}

export default ({ position, width, direction, duration, rect }) => {
  const durationNormalized = getDuration({ position, width, direction, duration, rect })
  return (durationNormalized * width) / 2000
}
