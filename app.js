window.addEventListener("load", () => {
  const images = document.querySelectorAll(".image");

  const imageOverlay = document.querySelector(".image-overlay");

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function toggleImageOverlay(imageOverlay) {
    imageOverlay.classList.toggle("show");
  }

  function nextTick() {
    return new Promise((resolve) => setTimeout(resolve));
  }

  images.forEach((image) => {
    image.addEventListener("click", imageHandler);
  });

  function animateFrom(el, start, end) {
    let startTime = 0;
    const duration = 3000;
    const startScale = start.width / end.width;
    const startX = end.x - start.x;
    const startY = end.y - start.y;
    el.style.position = "absolute";
    el.style.top = 0;
    el.style.left = 0;
    el.transformOrigin = "center";
    el.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(${startScale})`;
    console.log("startX :>> ", startX);
    console.log("startY :>> ", startY);
    const transform = {
      x: end.x - start.x,
      y: end.y - start.y,
      scale: 1 - startScale,
    };
    // x: 32 -> 0
    // y:
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      const value = Math.min(Math.max(progress, 0), 1);
      const x = startX + transform.x * value;
      const y = startY + transform.y * value;
      const scale = startScale + transform.scale * value;
      // console.log("x :>> ", x);
      // console.log("y :>> ", y);
      // console.log("scale :>> ", scale);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      if (progress <= 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  async function imageHandler(e) {
    const target = e.currentTarget;
    const startRect = target.getBoundingClientRect();
    toggleImageOverlay(imageOverlay);
    target.style.opacity = 0;
    console.log("startRect :>> ", startRect);
    const newImage = document.createElement("img");
    newImage.src = target.src;
    console.log("newImage :>> ", newImage);
    imageOverlay.appendChild(newImage);
    const newImageRect = newImage.getBoundingClientRect();
    console.log("newImage :>> ", newImageRect);
    animateFrom(newImage, startRect, newImageRect);
  }

  imageOverlay.addEventListener("click", () => {
    toggleImageOverlay(imageOverlay);
    removeAllChildNodes(imageOverlay);
  });
});
