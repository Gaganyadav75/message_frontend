

export const isVisibleInViewport = (element:HTMLParagraphElement|null) => {
    if (element) {
      const rect = element.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
    }
   return false
  }