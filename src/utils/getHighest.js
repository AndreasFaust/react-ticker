export default function getHighest(elements) {
  let highest = 0
  elements.forEach(el => {
    if (el.rect && el.rect.height > highest) {
      highest = el.rect.height
    }
  })
  return highest
}
