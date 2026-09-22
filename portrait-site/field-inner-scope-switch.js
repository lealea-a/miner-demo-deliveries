const MASTHEAD_AUTHORED_ROOT = 4;
const SOURCE_TEXT = 'TIME SLICE';

const TARGET_LINE_HEIGHT = 14;
const TARGET_BUTTON_HEIGHT = 25;
const MOTION_DURATION = 250;
const INDICATOR_FADE_PX = 0;

function fail(code) {
  throw new Error(code);
}

function roundToThousandth(value) {
  return Math.round(value * 1000) / 1000;
}

export async function mountFieldScopeSwitch({
  surface,
  nodeByAuthoredRoot,
  onScopeChange,
}) {
  if (!(surface instanceof HTMLElement)) {
    fail('FIELD_SCOPE_SURFACE_MISSING');
  }

  if (!(nodeByAuthoredRoot instanceof Map)) {
    fail('FIELD_SCOPE_AUTHORITY_MAP_MISSING');
  }

  if (typeof onScopeChange !== 'function') {
    fail('FIELD_SCOPE_CHANGE_CALLBACK_MISSING');
  }

  const mastheadRoot =
    nodeByAuthoredRoot.get(MASTHEAD_AUTHORED_ROOT);

  if (!(mastheadRoot instanceof SVGElement)) {
    fail('FIELD_SCOPE_MASTHEAD_ROOT_MISSING');
  }

  const sourceMatches =
    Array.from(mastheadRoot.querySelectorAll('text'))
      .filter(
        (node) =>
          node.textContent.trim() === SOURCE_TEXT
      );

  if (sourceMatches.length !== 1) {
    fail(
      `FIELD_SCOPE_SOURCE_TEXT_COUNT_FAILED:` +
      `${sourceMatches.length}`
    );
  }

  const sourceText = sourceMatches[0];
  const group =
    surface.querySelector('[data-field-scope-switch]');
  const indicator =
    group?.querySelector('[data-field-scope-indicator]');
  const options =
    Array.from(
      group?.querySelectorAll(
        '[data-field-scope-option]'
      ) ?? []
    );

  if (!(group instanceof HTMLElement)) {
    fail('FIELD_SCOPE_GROUP_MISSING');
  }

  if (!(indicator instanceof HTMLElement)) {
    fail('FIELD_SCOPE_INDICATOR_MISSING');
  }

  if (
    options.length !== 2 ||
    options.some(
      (option) =>
        !(option instanceof HTMLButtonElement)
    )
  ) {
    fail('FIELD_SCOPE_OPTIONS_INVALID');
  }

  const labels = options.map((option) =>
    option.querySelector('.fm-scope-label')
  );

  if (
    labels.some(
      (label) =>
        !(label instanceof HTMLElement)
    )
  ) {
    fail('FIELD_SCOPE_LABEL_MISSING');
  }

  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

  let activeIndex = 0;
  let left = 0;
  let right = 0;
  let frame = 0;

  function alignToAuthority() {
    const surfaceRect =
      surface.getBoundingClientRect();
    const sourceRect =
      sourceText.getBoundingClientRect();
    const scale =
      surfaceRect.width / surface.offsetWidth;

    const nextLeft =
      (
        sourceRect.left - surfaceRect.left
      ) / scale;

    const nextTop =
      (
        sourceRect.top -
        surfaceRect.top
      ) /
        scale -
        (
          TARGET_BUTTON_HEIGHT -
          TARGET_LINE_HEIGHT
        ) / 2;

    if (
      !Number.isFinite(nextLeft) ||
      !Number.isFinite(nextTop) ||
      sourceRect.width <= 0 ||
      sourceRect.height <= 0
    ) {
      fail('FIELD_SCOPE_SOURCE_GEOMETRY_INVALID');
    }

    group.style.left =
      `${roundToThousandth(nextLeft)}px`;

    group.style.top =
      `${roundToThousandth(nextTop)}px`;
  }

  function targetEdges(index) {
    const groupRect =
      group.getBoundingClientRect();

    const labelRect =
      labels[index].getBoundingClientRect();

    const surfaceRect =
      surface.getBoundingClientRect();

    const scale =
      surfaceRect.width / surface.offsetWidth;

    return {
      left:
        (
          labelRect.left -
          groupRect.left
        ) / scale,

      right:
        (
          labelRect.right -
          groupRect.left
        ) / scale,
    };
  }

  function paint(nextLeft, nextRight) {
    left = nextLeft;
    right = nextRight;

    const coreWidth =
      Math.max(
        0,
        nextRight - nextLeft
      );

    const paintLeft =
      nextLeft -
      INDICATOR_FADE_PX;

    const paintWidth =
      coreWidth +
      INDICATOR_FADE_PX * 2;

    indicator.style.width =
      `${paintWidth}px`;

    indicator.style.transform =
      `translate3d(${paintLeft}px, 0, 0)`;
  }

  function setSelectedState(index) {
    options.forEach(
      (option, optionIndex) => {
        const selected =
          optionIndex === index;

        option.setAttribute(
          'aria-checked',
          String(selected)
        );

        option.tabIndex =
          selected ? 0 : -1;
      }
    );

    surface.dataset.scopePreview =
      options[index].dataset
        .fieldScopeOption;
  }

  function moveTo(
    index,
    focusOption = false
  ) {
    if (
      index === activeIndex &&
      right > left
    ) {
      if (focusOption) {
        options[index].focus();
      }

      return;
    }

    const nextScope =
      options[index].dataset.fieldScopeOption;

    onScopeChange(nextScope);

    cancelAnimationFrame(frame);

    const fromLeft = left;
    const fromRight = right;
    const target = targetEdges(index);
    const movingRight =
      target.left > fromLeft;

    activeIndex = index;
    setSelectedState(index);

    if (focusOption) {
      options[index].focus();
    }

    if (reduceMotion.matches) {
      paint(target.left, target.right);
      return;
    }

    const startedAt = performance.now();

    function animate(now) {
      const t =
        Math.min(
          1,
          (now - startedAt) /
            MOTION_DURATION
        );

      const decelerate =
        Math.sin(Math.PI * 0.5 * t);

      const accelerate =
        1 -
        Math.cos(Math.PI * 0.5 * t);

      const leftT =
        movingRight
          ? accelerate
          : decelerate;

      const rightT =
        movingRight
          ? decelerate
          : accelerate;

      paint(
        fromLeft +
          (
            target.left -
            fromLeft
          ) *
            leftT,
        fromRight +
          (
            target.right -
            fromRight
          ) *
            rightT
      );

      if (t < 1) {
        frame =
          requestAnimationFrame(animate);
      }
    }

    frame =
      requestAnimationFrame(animate);
  }

  options.forEach(
    (option, index) => {
      option.addEventListener(
        'click',
        () => moveTo(index)
      );

      option.addEventListener(
        'keydown',
        (event) => {
          if (
            ![
              'ArrowLeft',
              'ArrowRight',
              'Home',
              'End',
            ].includes(event.key)
          ) {
            return;
          }

          event.preventDefault();

          let nextIndex = activeIndex;

          if (event.key === 'ArrowLeft') {
            nextIndex =
              (
                activeIndex -
                1 +
                options.length
              ) %
              options.length;
          }

          if (event.key === 'ArrowRight') {
            nextIndex =
              (
                activeIndex + 1
              ) %
              options.length;
          }

          if (event.key === 'Home') {
            nextIndex = 0;
          }

          if (event.key === 'End') {
            nextIndex =
              options.length - 1;
          }

          moveTo(nextIndex, true);
        }
      );
    }
  );

  group.style.visibility = 'hidden';
  group.hidden = false;

  await document.fonts.ready;

  alignToAuthority();

  const initialTarget =
    targetEdges(activeIndex);

  paint(
    initialTarget.left,
    initialTarget.right
  );

  setSelectedState(activeIndex);

  sourceText.style.visibility = 'hidden';
  sourceText.dataset.fieldScopeSource =
    'hidden';

  group.style.visibility = 'visible';

  const realign = () => {
    alignToAuthority();

    const target =
      targetEdges(activeIndex);

    paint(target.left, target.right);
  };

  window.addEventListener(
    'resize',
    realign,
    { passive: true }
  );

  surface.addEventListener(
    'fieldframechange',
    realign
  );

  const resizeObserver =
    new ResizeObserver(realign);

  resizeObserver.observe(surface);

  return Object.freeze({
    select(index) {
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= options.length
      ) {
        fail(
          `FIELD_SCOPE_INDEX_INVALID:${index}`
        );
      }

      moveTo(index);
    },
  });
}
