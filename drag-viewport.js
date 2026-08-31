const dragViewports = document.querySelectorAll('.case-dragviewport');

dragViewports.forEach((viewport) => {
  const track = viewport.querySelector('.case-dragviewport__track');
  const image = viewport.querySelector('.case-dragviewport__track img');
  if (!track || !image) return;

  const scale = 1.7;

  const state = {
    x: 0,
    y: 0,
    isDragging: false,
    pointerStartX: 0,
    pointerStartY: 0,
    dragStartX: 0,
    dragStartY: 0,
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getLimits = () => {
    const imgWidth = image.offsetWidth * scale;
    const imgHeight = image.offsetHeight * scale;
    const maxX = Math.max((imgWidth - viewport.clientWidth) / 2, 0);
    const maxY = Math.max((imgHeight - viewport.clientHeight) / 2, 0);
    return { maxX, maxY };
  };

  const applyTransform = () => {
    const { maxX, maxY } = getLimits();
    state.x = clamp(state.x, -maxX, maxX);
    state.y = clamp(state.y, -maxY, maxY);
    track.style.transform = `translate(${state.x}px, ${state.y}px) scale(${scale})`;
    track.style.transformOrigin = 'center center';
  };

  const setInitialPosition = () => {
    const { maxX, maxY } = getLimits();
    state.x = -Math.min(maxX, 120);
    state.y = -Math.min(maxY, 80);
    applyTransform();
  };

  const onPointerDown = (event) => {
    state.isDragging = true;
    viewport.classList.add('is-dragging');
    state.pointerStartX = event.clientX;
    state.pointerStartY = event.clientY;
    state.dragStartX = state.x;
    state.dragStartY = state.y;
    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!state.isDragging) return;

    const { maxX, maxY } = getLimits();
    const dx = event.clientX - state.pointerStartX;
    const dy = event.clientY - state.pointerStartY;

    state.x = clamp(state.dragStartX + dx, -maxX, maxX);
    state.y = clamp(state.dragStartY + dy, -maxY, maxY);
    applyTransform();
  };

  const onPointerUp = (event) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    viewport.classList.remove('is-dragging');
    if (event.pointerId !== undefined) {
      viewport.releasePointerCapture(event.pointerId);
    }
  };

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointerleave', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);

  if (image.complete) {
    setInitialPosition();
  } else {
    image.addEventListener('load', setInitialPosition, { once: true });
  }
});
