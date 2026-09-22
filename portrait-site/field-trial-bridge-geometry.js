export const FIELD_TRIAL_BRIDGE_SOURCE_WIDTH = 390;
export const FIELD_TRIAL_BRIDGE_SOURCE_HEIGHT = 844;
export const FIELD_TRIAL_BRIDGE_CROP_TOP = 63.5;
export const FIELD_TRIAL_BRIDGE_BODY_HEIGHT = 780.5;
export const FIELD_TRIAL_BRIDGE_EDGE_INSET_PX = 16;
export const FIELD_TRIAL_BRIDGE_PORTRAIT_REVEAL_PX = 64;

function freezeBbox(x, y, width, height) {
  return Object.freeze({ x, y, width, height });
}

export const FIELD_TRIAL_BRIDGE_ACTORS = Object.freeze([
  Object.freeze({
    id: 'A00',
    label: '顶部空白/可能出现的米白条，明确排除',
    coordinateSpace: 'source',
    bbox: freezeBbox(0, 0, 390, 63.5),
  }),
  Object.freeze({
    id: 'A01',
    label: '黑色主体',
    coordinateSpace: 'body',
    bbox: freezeBbox(0, 0, 390, 780.5),
  }),
  Object.freeze({
    id: 'A02',
    label: '右上线场原始范围',
    coordinateSpace: 'body',
    bbox: freezeBbox(65.741714, -367.558289, 621.521729, 921.921692),
  }),
  Object.freeze({
    id: 'A03',
    label: '左下线场原始范围',
    coordinateSpace: 'body',
    bbox: freezeBbox(-826.399963, -94.699982, 1237.850098, 1238.024902),
  }),
  Object.freeze({
    id: 'A04',
    label: 'FIELD-MINER / SIMULATED FIELD品牌组',
    coordinateSpace: 'body',
    bbox: freezeBbox(65.7, 64.1, 254.5, 21.2),
  }),
  Object.freeze({
    id: 'A05',
    label: '一个变化正在发生',
    coordinateSpace: 'body',
    bbox: freezeBbox(89.6, 136.8, 205.2, 23.8),
  }),
  Object.freeze({
    id: 'A06',
    label: '并不是企业行动的理由',
    coordinateSpace: 'body',
    bbox: freezeBbox(46.9, 176.8, 289.5, 26.4),
  }),
  Object.freeze({
    id: 'A07',
    label: '它必须回到企业的',
    coordinateSpace: 'body',
    bbox: freezeBbox(90.7, 271.5, 203.6, 23.9),
  }),
  Object.freeze({
    id: 'A08',
    label: 'Goals底字',
    coordinateSpace: 'body',
    bbox: freezeBbox(129.399979, 307.899994, 139.512589, 40.5),
  }),
  Object.freeze({
    id: 'A09',
    label: '目标',
    coordinateSpace: 'body',
    bbox: freezeBbox(172.5, 338.5, 54.699997, 27.800018),
  }),
  Object.freeze({
    id: 'A10',
    label: 'Resources底字',
    coordinateSpace: 'body',
    bbox: freezeBbox(74.699997, 383.600006, 248.812515, 39.700012),
  }),
  Object.freeze({
    id: 'A11',
    label: '资源',
    coordinateSpace: 'body',
    bbox: freezeBbox(169, 407, 58.300003, 27.699982),
  }),
  Object.freeze({
    id: 'A12',
    label: 'Constraints底字',
    coordinateSpace: 'body',
    bbox: freezeBbox(61, 464.499939, 276.3125, 40.599915),
  }),
  Object.freeze({
    id: 'A13',
    label: '限制',
    coordinateSpace: 'body',
    bbox: freezeBbox(170.499985, 486.600037, 55.700012, 27.700012),
  }),
  Object.freeze({
    id: 'A14',
    label: '接入EKTO-POD药丸',
    coordinateSpace: 'body',
    bbox: freezeBbox(49.8, 586.5, 290.4, 44.899963),
  }),
  Object.freeze({
    id: 'A15',
    label: '新增返回Demo按钮',
    coordinateSpace: 'body',
    bbox: freezeBbox(20, 8, 104, 44),
  }),
]);

export function fieldTrialBridgeSourceToBody({ x, y }) {
  return Object.freeze({
    x,
    y: y - FIELD_TRIAL_BRIDGE_CROP_TOP,
  });
}

export function fieldTrialBridgeNormalizeBbox({ x, y, width, height }) {
  return Object.freeze({
    x: x / FIELD_TRIAL_BRIDGE_SOURCE_WIDTH,
    y: y / FIELD_TRIAL_BRIDGE_BODY_HEIGHT,
    width: width / FIELD_TRIAL_BRIDGE_SOURCE_WIDTH,
    height: height / FIELD_TRIAL_BRIDGE_BODY_HEIGHT,
  });
}

export function fieldTrialBridgeSurfaceGeometry(viewportWidth, viewportHeight) {
  const portrait = viewportHeight >= viewportWidth;
  const scale = portrait
    ? Math.min(
      1,
      (viewportWidth - FIELD_TRIAL_BRIDGE_EDGE_INSET_PX * 2)
        / FIELD_TRIAL_BRIDGE_SOURCE_WIDTH,
      (viewportHeight
        - FIELD_TRIAL_BRIDGE_EDGE_INSET_PX
        - FIELD_TRIAL_BRIDGE_PORTRAIT_REVEAL_PX)
        / FIELD_TRIAL_BRIDGE_BODY_HEIGHT,
    )
    : Math.min(
      1,
      (viewportWidth - FIELD_TRIAL_BRIDGE_EDGE_INSET_PX * 2)
        / FIELD_TRIAL_BRIDGE_SOURCE_WIDTH,
      (viewportHeight - FIELD_TRIAL_BRIDGE_EDGE_INSET_PX * 2)
        / FIELD_TRIAL_BRIDGE_BODY_HEIGHT,
    );

  const surfaceWidth = FIELD_TRIAL_BRIDGE_SOURCE_WIDTH * scale;
  const surfaceHeight = FIELD_TRIAL_BRIDGE_BODY_HEIGHT * scale;

  return Object.freeze({
    portrait,
    scale,
    width: surfaceWidth,
    height: surfaceHeight,
    left: portrait ? (viewportWidth - surfaceWidth) / 2 : null,
    top: portrait ? FIELD_TRIAL_BRIDGE_EDGE_INSET_PX : null,
  });
}

export function fieldTrialBridgeQrGeometry(viewportWidth, viewportHeight) {
  const width = Math.min(360, viewportWidth - 32);
  const height = Math.min(440, viewportHeight - 32);
  const qrSize = Math.min(224, width - 64, height - 136);

  return Object.freeze({ width, height, qrSize });
}
