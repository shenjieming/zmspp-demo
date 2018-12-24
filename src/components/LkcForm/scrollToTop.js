function computedStyle(el, prop) {
  const getComputedStyle = window.getComputedStyle
  const style =
    getComputedStyle
      ? getComputedStyle(el)
      : el.currentStyle
  if (style) {
    return style[
      prop.replace(/-(\w)/gi, (word, letter) => letter.toUpperCase())
    ]
  }
  return undefined
}

function getScrollableContainer(n) {
  let node = n
  let nodeName
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    const overflowY = computedStyle(node, 'overflowY')
    if (node !== n && (overflowY === 'auto' || overflowY === 'scroll')) {
      return node
    }
    node = node.parentNode
  }
  return nodeName === 'body' ? node.ownerDocument : node
}

const scrollToTop = (id) => {
  const node = document.getElementById(id)
  if (node) {
    const Container = getScrollableContainer(node)
    Container.scrollTop = 0
  }
}

export default scrollToTop
