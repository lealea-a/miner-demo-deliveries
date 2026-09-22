const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const INFORMATION_ICON_URL = new URL(
  './assets/vendor/carbon/information-16.svg',
  import.meta.url
);
const INFORMATION_ICON_SIZE = 14;
const INFORMATION_ICON_GAP = 8;
const INFORMATION_ICON_TONES = Object.freeze({
  A: '#1A1A1A',
  B: '#4A4A4A',
});
const DEFAULT_INFORMATION_ICON_TONE = 'B';
const TITLE_ROOT = 6;
const CENTERED_TEXT_ROOTS = Object.freeze([9, 12, 13, 17, 23]);
const PHI_ROOT = 21;
const PHI_HEADING_ROOT = 22;
const TITLE_TRANSFORM = 'matrix(1 0 0 1 108.7574 287.5932)';
const TITLE_MAX_ADVANCE = 261.2426;
const REQUIRED_FONT_FACES = Object.freeze([
  Object.freeze({
    weight: 200,
    family: 'SourceHanSansCN-ExtraLight-GBpc-EUC-H',
  }),
  Object.freeze({
    weight: 300,
    family: 'SourceHanSansCN-Light-GBpc-EUC-H',
  }),
  Object.freeze({
    weight: 350,
    family: 'SourceHanSansCN-Normal-GBpc-EUC-H',
  }),
]);

const FONT_VALIDATION_SAMPLE =
  '基础设施硬件旅游体验城市运营形成依据近期方向';

function requireRoot(nodeByAuthoredRoot, root) {
  const rootNode = nodeByAuthoredRoot.get(root);
  if (!(rootNode instanceof SVGElement)) {
    throw new Error(`FIELD_CONTENT_AUTHORITY_ROOT_MISSING: ${root}`);
  }
  return rootNode;
}

function resolveTextNode(nodeByAuthoredRoot, root) {
  const rootNode = requireRoot(nodeByAuthoredRoot, root);
  const textNode = rootNode.matches('text')
    ? rootNode
    : rootNode.querySelector('text');
  if (!(textNode instanceof SVGTextElement)) {
    throw new Error(`FIELD_CONTENT_AUTHORITY_TEXT_MISSING: ${root}`);
  }
  return textNode;
}

function readTextAnchor(textNode) {
  const consolidated = textNode.transform.baseVal.consolidate();
  if (!consolidated) {
    throw new Error('FIELD_CONTENT_TEXT_TRANSFORM_MISSING');
  }
  const matrix = consolidated.matrix;
  const originalAdvance = textNode.getComputedTextLength();
  if (!Number.isFinite(originalAdvance) || originalAdvance <= 0) {
    throw new Error('FIELD_CONTENT_TEXT_ADVANCE_FAILED');
  }
  return Object.freeze({
    centerX: matrix.e + originalAdvance / 2,
    baselineY: matrix.f,
  });
}

function setCenteredText(textNode, nextText, anchor) {
  textNode.textContent = nextText;
  const nextAdvance = textNode.getComputedTextLength();
  if (!Number.isFinite(nextAdvance) || nextAdvance <= 0) {
    throw new Error(`FIELD_CONTENT_TEXT_ADVANCE_FAILED: ${nextText}`);
  }
  const nextX = anchor.centerX - nextAdvance / 2;
  textNode.setAttribute(
    'transform',
    `matrix(1 0 0 1 ${nextX} ${anchor.baselineY})`
  );
}

function readTransformedTextBounds(textNode) {
  const consolidated = textNode.transform.baseVal.consolidate();
  if (!consolidated) {
    throw new Error('FIELD_CONTENT_TEXT_TRANSFORM_MISSING');
  }
  const bounds = textNode.getBBox();
  const matrix = consolidated.matrix;
  const corners = [
    new DOMPoint(bounds.x, bounds.y),
    new DOMPoint(bounds.x + bounds.width, bounds.y),
    new DOMPoint(bounds.x, bounds.y + bounds.height),
    new DOMPoint(bounds.x + bounds.width, bounds.y + bounds.height),
  ].map((corner) => corner.matrixTransform(matrix));
  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);
  return Object.freeze({
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  });
}

function assertRendererContract({ surface, nodeByAuthoredRoot }) {
  if (!(surface instanceof HTMLElement)) {
    throw new Error('FIELD_CONTENT_SURFACE_MISSING');
  }
  if (!(nodeByAuthoredRoot instanceof Map) || nodeByAuthoredRoot.size !== 38) {
    throw new Error('FIELD_CONTENT_AUTHORITY_MAP_FAILED');
  }
}

async function assertRequiredFontsLoaded() {
  await document.fonts.ready;

  for (const face of REQUIRED_FONT_FACES) {
    const descriptor =
      `${face.weight} 100px "${face.family}"`;

    let loadedFaces;

    try {
      loadedFaces = await document.fonts.load(
        descriptor,
        FONT_VALIDATION_SAMPLE
      );
    } catch (error) {
      throw new Error(
        `FIELD_CONTENT_FONT_LOAD_FAILED: ` +
        `${face.weight}/${face.family}: ` +
        `${error instanceof Error ? error.message : String(error)}`
      );
    }

    const available = document.fonts.check(
      descriptor,
      FONT_VALIDATION_SAMPLE
    );

    if (loadedFaces.length !== 1 || !available) {
      throw new Error(
        `FIELD_CONTENT_FONT_CONTRACT_FAILED: ` +
        `${face.weight}/${face.family}/` +
        `${loadedFaces.length}/${available}`
      );
    }
  }
}

export async function createFieldInnerContentRenderer({
  surface,
  nodeByAuthoredRoot,
}) {
  assertRendererContract({ surface, nodeByAuthoredRoot });
  await assertRequiredFontsLoaded();

  const titleNode = resolveTextNode(nodeByAuthoredRoot, TITLE_ROOT);
  if (titleNode.getAttribute('transform') !== TITLE_TRANSFORM) {
    throw new Error('FIELD_CONTENT_TITLE_TRANSFORM_FAILED');
  }

  const centeredTextNodes = new Map(
    CENTERED_TEXT_ROOTS.map((root) => [
      root,
      resolveTextNode(nodeByAuthoredRoot, root),
    ])
  );
  const centeredTextAnchors = new Map(
    CENTERED_TEXT_ROOTS.map((root) => [
      root,
      readTextAnchor(centeredTextNodes.get(root)),
    ])
  );

  const capitalRoot = requireRoot(nodeByAuthoredRoot, 12);
  const capitalTexts = capitalRoot.querySelectorAll('text');
  if (
    capitalTexts.length < 2 ||
    capitalTexts[1].textContent.trim() !== '有效资金'
  ) {
    throw new Error('FIELD_CONTENT_CAPITAL_CAPTION_AUTHORITY_FAILED');
  }
  const capitalCaption = capitalTexts[1];
  const capitalCaptionAnchor = readTextAnchor(capitalCaption);
  setCenteredText(
    capitalCaption,
    '当前有效资金',
    capitalCaptionAnchor
  );

  const phiHeadingRoot = requireRoot(nodeByAuthoredRoot, PHI_HEADING_ROOT);
  const phiHeading = phiHeadingRoot.querySelector('text');
  if (
    !(phiHeading instanceof SVGTextElement) ||
    phiHeading.textContent.trim() !== 'Φ 发生势' ||
    phiHeadingRoot.querySelector('[data-field-phi-information]')
  ) {
    throw new Error('FIELD_CONTENT_PHI_HEADING_AUTHORITY_FAILED');
  }
  const phiHeadingBounds = readTransformedTextBounds(phiHeading);
  const iconX = phiHeadingBounds.right + INFORMATION_ICON_GAP;
  const iconY =
    (phiHeadingBounds.top +
      phiHeadingBounds.bottom -
      INFORMATION_ICON_SIZE) /
    2;
  const infoIcon = document.createElementNS(SVG_NAMESPACE, 'image');
  infoIcon.dataset.fieldPhiInformation = 'true';
  infoIcon.setAttribute('href', INFORMATION_ICON_URL.href);
  infoIcon.setAttribute('width', String(INFORMATION_ICON_SIZE));
  infoIcon.setAttribute('height', String(INFORMATION_ICON_SIZE));
  infoIcon.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  infoIcon.setAttribute('pointer-events', 'none');
  infoIcon.setAttribute('aria-hidden', 'true');
  infoIcon.setAttribute('x', String(iconX));
  infoIcon.setAttribute('y', String(iconY));
  const informationToneKey = new URLSearchParams(window.location.search)
    .get('infoTone') ?? DEFAULT_INFORMATION_ICON_TONE;
  const informationTone = INFORMATION_ICON_TONES[informationToneKey];
  if (informationTone) {
    const filterId = `fm-information-tone-${informationToneKey}`;
    const filterDefs = document.createElementNS(SVG_NAMESPACE, 'defs');
    const filter = document.createElementNS(SVG_NAMESPACE, 'filter');
    const flood = document.createElementNS(SVG_NAMESPACE, 'feFlood');
    const composite = document.createElementNS(SVG_NAMESPACE, 'feComposite');
    filter.id = filterId;
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    flood.setAttribute('flood-color', informationTone);
    flood.setAttribute('result', 'tone');
    composite.setAttribute('in', 'tone');
    composite.setAttribute('in2', 'SourceAlpha');
    composite.setAttribute('operator', 'in');
    filter.append(flood, composite);
    filterDefs.append(filter);
    phiHeadingRoot.append(filterDefs);
    infoIcon.dataset.fieldPhiInformationTone = informationTone;
    infoIcon.setAttribute('filter', `url(#${filterId})`);
  }
  phiHeadingRoot.append(infoIcon);

  const phiRoot = requireRoot(nodeByAuthoredRoot, PHI_ROOT);
  const sourcePathGroup = phiRoot.querySelector('g');
  if (
    !(sourcePathGroup instanceof SVGGElement) ||
    sourcePathGroup.querySelectorAll('path').length !== 2
  ) {
    throw new Error('FIELD_CONTENT_PHI_AUTHORITY_PATH_FAILED');
  }
  const sourceBounds = sourcePathGroup.getBBox();
  if (
    !Number.isFinite(sourceBounds.x) ||
    !Number.isFinite(sourceBounds.y) ||
    !Number.isFinite(sourceBounds.width) ||
    !Number.isFinite(sourceBounds.height) ||
    sourceBounds.width <= 0 ||
    sourceBounds.height <= 0
  ) {
    throw new Error('FIELD_CONTENT_PHI_AUTHORITY_BOUNDS_FAILED');
  }

  const dynamicPhi = document.createElementNS(SVG_NAMESPACE, 'text');
  dynamicPhi.dataset.fieldDynamicPhi = 'true';
  dynamicPhi.setAttribute('class', 'st557');
  dynamicPhi.setAttribute('font-size', '100');
  dynamicPhi.setAttribute('fill', '#000');
  dynamicPhi.setAttribute('font-synthesis', 'none');
  dynamicPhi.textContent = '78';
  phiRoot.append(dynamicPhi);

  dynamicPhi.removeAttribute('transform');
  const referenceBounds = dynamicPhi.getBBox();
  if (!Number.isFinite(referenceBounds.height) || referenceBounds.height <= 0) {
    throw new Error('FIELD_CONTENT_PHI_REFERENCE_BOUNDS_FAILED');
  }
  const phiScale = sourceBounds.height / referenceBounds.height;
  sourcePathGroup.setAttribute('visibility', 'hidden');

  function renderPhi(nextText) {
    dynamicPhi.textContent = nextText;
    dynamicPhi.removeAttribute('transform');
    const measured = dynamicPhi.getBBox();
    if (
      !Number.isFinite(measured.x) ||
      !Number.isFinite(measured.y) ||
      !Number.isFinite(measured.width) ||
      !Number.isFinite(measured.height) ||
      measured.width <= 0 ||
      measured.height <= 0
    ) {
      throw new Error(`FIELD_CONTENT_PHI_DYNAMIC_BOUNDS_FAILED: ${nextText}`);
    }
    const tx =
      (sourceBounds.x + sourceBounds.width / 2) -
      phiScale * (measured.x + measured.width / 2);
    const ty = sourceBounds.y - phiScale * measured.y;
    dynamicPhi.setAttribute(
      'transform',
      `translate(${tx} ${ty}) scale(${phiScale})`
    );
  }

  function render(selection) {
    const entry = selection?.entry;
    if (
      !entry ||
      !Number.isInteger(entry.index) ||
      entry.index < 1 ||
      entry.index > 18
    ) {
      throw new Error('FIELD_CONTENT_SELECTION_FAILED');
    }

    const indexLabel = String(entry.index).padStart(2, '0');
    const capitalLabel =
      `${entry.capital_cny_yi.toLocaleString('zh-CN')}亿`;
    const eventLabel =
      `${entry.event_chain_count.toLocaleString('zh-CN')}条`;
    const policyLabel = `${entry.policy_convergence}组`;
    const phiLabel = String(entry.phi);
    const momentumLabel = String(entry.momentum);

    titleNode.textContent = entry.domain;
    if (titleNode.getAttribute('transform') !== TITLE_TRANSFORM) {
      throw new Error('FIELD_CONTENT_TITLE_TRANSFORM_CHANGED');
    }
    const titleAdvance = titleNode.getComputedTextLength();
    if (!Number.isFinite(titleAdvance) || titleAdvance > TITLE_MAX_ADVANCE) {
      throw new Error(
        `FIELD_CONTENT_TITLE_OVERFLOW: ${entry.index}/${titleAdvance}`
      );
    }

    setCenteredText(
      centeredTextNodes.get(9),
      indexLabel,
      centeredTextAnchors.get(9)
    );
    setCenteredText(
      centeredTextNodes.get(12),
      capitalLabel,
      centeredTextAnchors.get(12)
    );
    setCenteredText(
      centeredTextNodes.get(13),
      eventLabel,
      centeredTextAnchors.get(13)
    );
    setCenteredText(
      centeredTextNodes.get(17),
      policyLabel,
      centeredTextAnchors.get(17)
    );
    setCenteredText(
      centeredTextNodes.get(23),
      momentumLabel,
      centeredTextAnchors.get(23)
    );
    renderPhi(phiLabel);
  }

  return Object.freeze({ render });
}
