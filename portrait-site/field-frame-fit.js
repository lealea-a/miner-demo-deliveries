export const FIELD_FRAME_WIDTH = 390;
export const FIELD_FRAME_HEIGHT = 844;

const FIELD_FRAME_RATIO =
  FIELD_FRAME_WIDTH / FIELD_FRAME_HEIGHT;

let currentFrame = null;

function requirePositiveFinite(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`FIELD_FRAME_${name}_INVALID:${value}`);
  }
}

export function computeFieldFrame(
  viewportWidth,
  viewportHeight
) {
  requirePositiveFinite(viewportWidth, 'VIEWPORT_WIDTH');
  requirePositiveFinite(viewportHeight, 'VIEWPORT_HEIGHT');

  const viewportRatio =
    viewportWidth / viewportHeight;

  let displayWidth;
  let displayHeight;

  if (FIELD_FRAME_RATIO > viewportRatio) {
    displayWidth = viewportWidth;
    displayHeight = viewportWidth / FIELD_FRAME_RATIO;
  } else if (FIELD_FRAME_RATIO < viewportRatio) {
    displayHeight = viewportHeight;
    displayWidth = viewportHeight * FIELD_FRAME_RATIO;
  } else {
    displayWidth = viewportWidth;
    displayHeight = viewportHeight;
  }

  const scale = displayWidth / FIELD_FRAME_WIDTH;
  const left = Math.floor(
    (viewportWidth - displayWidth) / 2
  );
  const top = Math.floor(
    (viewportHeight - displayHeight) / 2
  );

  return Object.freeze({
    viewportWidth,
    viewportHeight,
    displayWidth,
    displayHeight,
    scale,
    left,
    top,
  });
}

export function mountFieldFrame(host, stage) {
  if (!(host instanceof HTMLElement)) {
    throw new Error('FIELD_FRAME_HOST_MISSING');
  }

  if (!(stage instanceof HTMLElement)) {
    throw new Error('FIELD_FRAME_STAGE_MISSING');
  }

  function applyFrame() {
    const hostRect = host.getBoundingClientRect();
    const nextFrame = computeFieldFrame(
      hostRect.width,
      hostRect.height
    );

    stage.style.left = `${nextFrame.left}px`;
    stage.style.top = `${nextFrame.top}px`;
    stage.style.transform = `scale(${nextFrame.scale})`;
    stage.style.transformOrigin = '0 0';

    currentFrame = nextFrame;

    stage.dispatchEvent(
      new CustomEvent('fieldframechange', {
        bubbles: true,
        detail: nextFrame,
      })
    );

    return nextFrame;
  }

  const onResize = () => {
    applyFrame();
  };

  window.addEventListener('resize', onResize, {
    passive: true,
  });

  window.visualViewport?.addEventListener(
    'resize',
    onResize,
    { passive: true }
  );

  applyFrame();

  return Object.freeze({
    get frame() {
      return currentFrame;
    },
    destroy() {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener(
        'resize',
        onResize
      );
    },
  });
}

export function toLogicalDelta(deltaX, deltaY) {
  if (!currentFrame) {
    throw new Error('FIELD_FRAME_NOT_MOUNTED');
  }

  if (
    !Number.isFinite(deltaX) ||
    !Number.isFinite(deltaY)
  ) {
    throw new Error('FIELD_FRAME_DELTA_INVALID');
  }

  return Object.freeze({
    x: deltaX / currentFrame.scale,
    y: deltaY / currentFrame.scale,
  });
}

export function getFieldFrameViewport(stage) {
  if (!(stage instanceof HTMLElement)) {
    throw new Error('FIELD_FRAME_STAGE_MISSING');
  }

  if (
    stage.offsetWidth !== FIELD_FRAME_WIDTH ||
    stage.offsetHeight !== FIELD_FRAME_HEIGHT
  ) {
    throw new Error(
      `FIELD_FRAME_LOGICAL_SIZE_INVALID:` +
      `${stage.offsetWidth}x${stage.offsetHeight}`
    );
  }

  const rect = stage.getBoundingClientRect();
  const scaleX = rect.width / stage.offsetWidth;
  const scaleY = rect.height / stage.offsetHeight;

  if (
    ![
      rect.left,
      rect.top,
      rect.right,
      rect.bottom,
      rect.width,
      rect.height,
      scaleX,
      scaleY,
    ].every(Number.isFinite) ||
    scaleX <= 0 ||
    scaleY <= 0 ||
    Math.abs(scaleX - scaleY) > 1e-6
  ) {
    throw new Error('FIELD_FRAME_VIEWPORT_GEOMETRY_INVALID');
  }

  return Object.freeze({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    scale: scaleX,
  });
}

export function logicalRectToViewport(frame, logicalRect) {
  const values = [
    frame?.left,
    frame?.top,
    frame?.scale,
    logicalRect?.x,
    logicalRect?.y,
    logicalRect?.width,
    logicalRect?.height,
  ];

  if (
    !values.every(Number.isFinite) ||
    frame.scale <= 0 ||
    logicalRect.width < 0 ||
    logicalRect.height < 0
  ) {
    throw new Error('FIELD_FRAME_LOGICAL_RECT_INVALID');
  }

  const x = frame.left + logicalRect.x * frame.scale;
  const y = frame.top + logicalRect.y * frame.scale;
  const width = logicalRect.width * frame.scale;
  const height = logicalRect.height * frame.scale;

  return Object.freeze({
    x,
    y,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    width,
    height,
  });
}
