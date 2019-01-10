export default function getHighest(elements) {
  let highest = 0
  elements.forEach(el => {
    if (el.height > highest) {
      highest = el.height
    }
  })
  return highest
}
