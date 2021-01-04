window.addEventListener('load', () => {
  const images = document.querySelectorAll('.image')

  const imageOverlay = document.querySelector('.image-overlay')

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  async function toggleImageOverlay(imageOverlay) {
    if (!imageOverlay.classList.contains('show')) {
      imageOverlay.classList.add('show')
      await nextTick()
      // imageOverlay.style.opacity = 1
    } else {
      // imageOverlay.style.opacity = 0
      imageOverlay.addEventListener('transitionend', removeImageOveralyTransitionend)
    }
  }

  function removeImageOveralyTransitionend(e) {
    this.removeEventListener('transitionend', removeImageOveralyTransitionend)
    removeAllChildNodes(e.currentTarget)
    this.classList.remove('show')
    selectedImageEl.style.opacity = 1
  }

  // setImmediate()

  function nextTick(cb) {
    return new Promise((resolve) => setTimeout(resolve, 10))
  }

  images.forEach((image) => {
    image.addEventListener('click', imageHandler)
  })

  let selectedImageEl

  async function imageHandler(e) {
    const target = (selectedImageEl = e.currentTarget)
    const startRect = target.getBoundingClientRect()
    await toggleImageOverlay(imageOverlay)
    target.style.opacity = 0
    console.log('startRect :>> ', startRect)
    newImage = document.createElement('img')
    newImage.src = target.src
    console.log('newImage :>> ', newImage)
    imageOverlay.appendChild(newImage)
    const newImageRect = newImage.getBoundingClientRect()
    console.log('newImage :>> ', newImageRect)

    const start = createAnimatingData(startRect)
    const end = createAnimatingData(newImageRect)

    from = {
      x: start.x - end.x,
      y: start.y - end.y,
      scale: start.width / end.width,
    }
    newImage.style.transform = `translate3d(${from.x}px, ${from.y}px, 0) scale(${from.scale})`
    await nextTick()
    newImage.style.transition = `transform 0.3s ease-in-out`
    newImage.style.transform = `translate3d(0, 0, 0) scale(1)`
    newImage.addEventListener('transitionend', removeTransition)

    // animateFrom(newImage, start, end);
  }

  function removeTransition() {
    this.style.transition = ''
    this.removeEventListener('transitionend', removeTransition)
  }

  function createAnimatingData(rect) {
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      width: rect.width,
    }
  }

  imageOverlay.addEventListener('click', (e) => {
    const target = e.currentTarget
    const newImage = e.currentTarget.firstChild
    newImage.style.transition = `transform 0.3s ease-in-out`
    newImage.style.transform = `translate3d(${from.x}px, ${from.y}px, 0) scale(${from.scale})`
    newImage.addEventListener('transitionend', removeTransition)
    toggleImageOverlay(target)
  })

  function animateFrom(el, startData, endData) {
    let startTime = 0
    const duration = 1000
    const start = {
      x: startData.x - endData.x,
      y: startData.y - endData.y,
      scale: startData.width / endData.width,
    }
    console.log('start :>> ', start)
    // el.transformOrigin = "center";
    el.style.transform = `translate3d(${start.x}px, ${start.y}px, 0) scale(${start.scale})`
    const transform = {
      x: -start.x,
      y: -start.y,
      scale: 1 - start.scale,
    }
    // x: 32 -> 0
    // y:
    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      const value = Math.min(Math.max(progress, 0), 1)
      const x = start.x + transform.x * value
      const y = start.y + transform.y * value
      const scale = start.scale + transform.scale * value
      // console.log("x :>> ", x);
      // console.log("y :>> ", y);
      // console.log("scale :>> ", scale);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      if (progress <= 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
})
