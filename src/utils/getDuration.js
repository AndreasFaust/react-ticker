
//   duration                  x
// ------------  =  -----------------------------
//  windowWidth     windowWidth + element.width

function getDuration({ position, windowWidth, direction, duration, rect }) {
  switch (direction) {
    case 'toRight': {
      return (duration * (windowWidth - position.from)) / windowWidth
    }
    case 'toLeft':
    default: {
      return (duration * (windowWidth - (windowWidth - position.from) + rect.width)) / windowWidth
    }
  }
}

export default ({ position, windowWidth, direction, duration, rect }) => {
  const durationNormalized = getDuration({ position, windowWidth, direction, duration, rect })
  return (durationNormalized * windowWidth) / 2000
}
