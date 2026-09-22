import { getFieldFrameViewport } from './field-frame-fit.js';
import { installDialogLightDismiss } from './field-dialog-light-dismiss.js';

const REGISTRY_ID = 'FIELD_MINER_DEMO_GLOBAL_18_V1_2';
const REGISTRY_VERSION = 'v1.2';
const DOMAIN_COUNT = 18;
const EXPECTED_BOUNDARY_GROUP_COUNT = 54;
const EXPECTED_TARGET_BUTTON_COUNT = 58;
const CURRENT_FIELD_TRIGGER_ROOT = 40;
const CURRENT_FIELD_TRIGGER_SIZE = 44;
const CURRENT_FIELD_DIALOG_WIDTH = 352;
const CURRENT_FIELD_DIALOG_GAP = 8;
const CURRENT_FIELD_VIEWPORT_GUTTER = 12;
const GEOMETRY_EPSILON = 0.001;

function fail(code) {
  throw new Error(code);
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function requireElement(root, selector, Constructor, code) {
  const node = root.querySelector(selector);

  if (!(node instanceof Constructor)) {
    fail(code);
  }

  return node;
}

function assertRegistryContract(registryRuntime) {
  const registry = registryRuntime?.selection?.registry;

  if (
    registryRuntime?.scope !== 'global' ||
    registry?.registry_id !== REGISTRY_ID ||
    registry?.registry_version !== REGISTRY_VERSION ||
    !Array.isArray(registry?.entries) ||
    registry.entries.length !== DOMAIN_COUNT
  ) {
    fail('FIELD_CURRENT_SHEET_REGISTRY_CONTRACT_FAILED');
  }

  const entriesByIndex = new Map();

  registry.entries.forEach((entry, offset) => {
    const expectedIndex = offset + 1;

    if (
      entry?.index !== expectedIndex ||
      typeof entry.domain !== 'string' ||
      entry.domain.length === 0 ||
      typeof entry.domain_definition !== 'string' ||
      entry.domain_definition.length === 0 ||
      !Array.isArray(entry.boundary_refs)
    ) {
      fail('FIELD_CURRENT_SHEET_ENTRY_CONTRACT_FAILED');
    }

    entriesByIndex.set(entry.index, entry);
  });

  let boundaryGroupCount = 0;
  let targetButtonCount = 0;

  for (const entry of registry.entries) {
    boundaryGroupCount += entry.boundary_refs.length;

    for (const boundary of entry.boundary_refs) {
      if (
        typeof boundary?.excluded_scope !== 'string' ||
        boundary.excluded_scope.length === 0 ||
        !Array.isArray(boundary.targets) ||
        boundary.targets.length === 0
      ) {
        fail('FIELD_CURRENT_SHEET_BOUNDARY_CONTRACT_FAILED');
      }

      targetButtonCount += boundary.targets.length;

      for (const target of boundary.targets) {
        const targetEntry = entriesByIndex.get(
          target?.target_entry_index
        );

        if (
          !targetEntry ||
          typeof target.target_domain !== 'string' ||
          target.target_domain !== targetEntry.domain
        ) {
          fail('FIELD_CURRENT_SHEET_TARGET_CONTRACT_FAILED');
        }
      }
    }
  }

  if (
    boundaryGroupCount !== EXPECTED_BOUNDARY_GROUP_COUNT ||
    targetButtonCount !== EXPECTED_TARGET_BUTTON_COUNT
  ) {
    fail('FIELD_CURRENT_SHEET_TOPOLOGY_FAILED');
  }

  return Object.freeze({
    registry,
    entriesByIndex,
    boundaryGroupCount,
    targetButtonCount,
  });
}

function assertSelectionContract(
  selection,
  registry,
  entriesByIndex
) {
  const entry = selection?.entry;

  if (
    selection?.registry !== registry ||
    !Number.isInteger(entry?.index) ||
    entry.index < 1 ||
    entry.index > DOMAIN_COUNT ||
    entry !== entriesByIndex.get(entry.index)
  ) {
    fail('FIELD_CURRENT_SHEET_SELECTION_FAILED');
  }

  return entry;
}

function createTargetButton(target) {
  const button = document.createElement('button');
  button.className = 'fm-current-field-sheet__target';
  button.type = 'button';
  button.dataset.targetEntryIndex =
    String(target.target_entry_index);
  button.setAttribute(
    'aria-label',
    '查看 ' +
      String(target.target_entry_index).padStart(2, '0') +
      ' ' +
      target.target_domain +
      '的当前发生场说明'
  );

  const arrow = document.createElement('span');
  arrow.className = 'fm-current-field-sheet__target-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';

  const text = document.createElement('span');
  text.className = 'fm-current-field-sheet__target-text';
  text.textContent =
    String(target.target_entry_index).padStart(2, '0') +
    ' ' +
    target.target_domain;

  button.append(arrow, text);
  return button;
}

function createBoundaryGroup(boundary) {
  const group = document.createElement('div');
  group.className = 'fm-current-field-sheet__boundary-group';

  const excluded = document.createElement('p');
  excluded.className = 'fm-current-field-sheet__excluded';
  excluded.textContent = boundary.excluded_scope;

  group.append(excluded);

  for (const target of boundary.targets) {
    group.append(createTargetButton(target));
  }

  return group;
}

export function initializeCurrentFieldSheetTrial({
  registryRuntime,
  surface,
  nodeByAuthoredRoot,
}) {
  if (!(surface instanceof HTMLElement)) {
    fail('FIELD_CURRENT_SHEET_SURFACE_MISSING');
  }

  const dialog = document.querySelector(
    '[data-field-current-sheet]'
  );

  if (!(dialog instanceof HTMLDialogElement)) {
    fail('FIELD_CURRENT_SHEET_DIALOG_MISSING');
  }
  installDialogLightDismiss(dialog);

  const trigger = requireElement(
    surface,
    '[data-field-current-trigger]',
    HTMLButtonElement,
    'FIELD_CURRENT_SHEET_TRIGGER_MISSING'
  );
  const closeButton = requireElement(
    dialog,
    '[data-field-current-sheet-close]',
    HTMLButtonElement,
    'FIELD_CURRENT_SHEET_CLOSE_MISSING'
  );
  const stateNode = requireElement(
    dialog,
    '[data-field-current-sheet-state]',
    HTMLParagraphElement,
    'FIELD_CURRENT_SHEET_STATE_MISSING'
  );
  const titleNode = requireElement(
    dialog,
    '[data-field-current-sheet-title]',
    HTMLHeadingElement,
    'FIELD_CURRENT_SHEET_TITLE_MISSING'
  );
  const definitionNode = requireElement(
    dialog,
    '[data-field-current-sheet-definition]',
    HTMLParagraphElement,
    'FIELD_CURRENT_SHEET_DEFINITION_MISSING'
  );
  const boundariesNode = requireElement(
    dialog,
    '[data-field-current-sheet-boundaries]',
    HTMLDivElement,
    'FIELD_CURRENT_SHEET_BOUNDARIES_MISSING'
  );

  const anchorNode = nodeByAuthoredRoot?.get(
    CURRENT_FIELD_TRIGGER_ROOT
  );

  if (
    !(anchorNode instanceof SVGTextElement) ||
    anchorNode.textContent.trim() !== 'ⓘ'
  ) {
    fail('FIELD_CURRENT_SHEET_TRIGGER_AUTHORITY_FAILED');
  }

  const {
    registry,
    entriesByIndex,
    boundaryGroupCount,
    targetButtonCount,
  } = assertRegistryContract(registryRuntime);

  if (typeof registryRuntime?.select !== 'function') {
    fail('FIELD_CURRENT_SHEET_RUNTIME_CONTRACT_FAILED');
  }

  const searchParams = new URLSearchParams(
    window.location.search
  );
  const rawTrialIndex = searchParams.get('currentFieldTrial');

  if (
    rawTrialIndex !== null &&
    !/^(?:[1-9]|1[0-8])$/.test(rawTrialIndex)
  ) {
    fail('FIELD_CURRENT_SHEET_TRIAL_INDEX_FAILED');
  }

  const typeScale = searchParams.get('typeScale') ?? 'min';

  if (!/^(base|a|b|b10|b15|min)$/.test(typeScale)) {
    fail('FIELD_CURRENT_SHEET_TYPE_SCALE_FAILED');
  }

  dialog.dataset.typeScale = typeScale;
  dialog.dataset.registryBoundaryGroupCount = String(
    boundaryGroupCount
  );
  dialog.dataset.registryTargetButtonCount = String(
    targetButtonCount
  );

  let mainSelection = registryRuntime.selection;
  let currentSelection = null;
  const localStack = [];

  function render(selection) {
    const entry = assertSelectionContract(
      selection,
      registry,
      entriesByIndex
    );
    const groupCount = entry.boundary_refs.length;
    const targetCount = entry.boundary_refs.reduce(
      (sum, boundary) => sum + boundary.targets.length,
      0
    );

    stateNode.textContent =
      String(entry.index).padStart(2, '0') +
      ' · 当前发生场';
    titleNode.textContent = entry.domain;
    definitionNode.textContent = entry.domain_definition;
    boundariesNode.replaceChildren(
      ...entry.boundary_refs.map(createBoundaryGroup)
    );

    dialog.dataset.domainIndex = String(entry.index);
    dialog.dataset.boundaryGroupCount = String(groupCount);
    dialog.dataset.targetButtonCount = String(targetCount);
    dialog.dataset.localStack = localStack.join(',');
    currentSelection = selection;

    return Object.freeze({
      entry,
      groupCount,
      targetCount,
    });
  }

  function positionTrigger() {
    const surfaceRect = surface.getBoundingClientRect();
    const anchorRect = anchorNode.getBoundingClientRect();
    const scale = surfaceRect.width / surface.offsetWidth;
    const centerX =
      (
        anchorRect.left -
        surfaceRect.left +
        anchorRect.width / 2
      ) / scale;
    const centerY =
      (
        anchorRect.top -
        surfaceRect.top +
        anchorRect.height / 2
      ) / scale;
    const left =
      centerX - CURRENT_FIELD_TRIGGER_SIZE / 2;
    const top =
      centerY - CURRENT_FIELD_TRIGGER_SIZE / 2;

    if (
      ![
        centerX,
        centerY,
        left,
        top,
        anchorRect.width,
        anchorRect.height,
      ].every(Number.isFinite) ||
      anchorRect.width <= 0 ||
      anchorRect.height <= 0
    ) {
      fail('FIELD_CURRENT_SHEET_TRIGGER_GEOMETRY_FAILED');
    }

    trigger.style.left = `${left}px`;
    trigger.style.top = `${top}px`;
    trigger.hidden = false;
  }

  function positionDialog() {
    if (!dialog.open) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const frame = getFieldFrameViewport(surface);
    const frameScale = frame.scale;
    const dialogWidth = dialog.offsetWidth;
    const dialogHeight = dialog.offsetHeight;
    const visualDialogWidth = dialogWidth * frameScale;
    const visualDialogHeight = dialogHeight * frameScale;
    const viewportGutter =
      CURRENT_FIELD_VIEWPORT_GUTTER * frameScale;
    const dialogGap = CURRENT_FIELD_DIALOG_GAP * frameScale;
    const minimumX = frame.left + viewportGutter;
    const minimumY = frame.top + viewportGutter;
    const maximumX =
      frame.right - visualDialogWidth - viewportGutter;
    const maximumY =
      frame.bottom - visualDialogHeight - viewportGutter;
    const x0 =
      triggerRect.left +
      triggerRect.width / 2 -
      visualDialogWidth / 2;
    const x = clamp(
      x0,
      minimumX,
      maximumX
    );
    const below =
      triggerRect.bottom + dialogGap;
    const above =
      triggerRect.top -
      dialogGap -
      visualDialogHeight;
    const y =
      below + visualDialogHeight <=
      frame.bottom - viewportGutter
        ? below
        : above >= minimumY
          ? above
          : clamp(
              below,
              minimumY,
              maximumY
            );

    if (
      ![
        dialogWidth,
        dialogHeight,
        visualDialogWidth,
        visualDialogHeight,
        viewportGutter,
        dialogGap,
        minimumX,
        minimumY,
        maximumX,
        maximumY,
        x0,
        x,
        below,
        above,
        y,
      ].every(Number.isFinite) ||
      maximumX < minimumX ||
      maximumY < minimumY ||
      (typeScale === 'min' &&
        Math.abs(
          dialogWidth - CURRENT_FIELD_DIALOG_WIDTH
        ) > GEOMETRY_EPSILON)
    ) {
      fail('FIELD_CURRENT_SHEET_POSITION_FAILED');
    }

    dialog.style.setProperty(
      '--field-frame-scale',
      String(frameScale)
    );
    dialog.style.left = `${x}px`;
    dialog.style.top = `${y}px`;
  }

  function open(selection) {
    if (dialog.open) {
      return;
    }

    const entry = assertSelectionContract(
      selection,
      registry,
      entriesByIndex
    );

    localStack.splice(0, localStack.length, entry.index);
    render(selection);
    trigger.setAttribute('aria-expanded', 'true');
    dialog.showModal();
    positionDialog();
    titleNode.focus({ preventScroll: true });
  }

  function setMainSelection(selection) {
    assertSelectionContract(
      selection,
      registry,
      entriesByIndex
    );
    mainSelection = selection;
  }

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  });

  trigger.addEventListener('click', () => {
    open(mainSelection);
  });

  boundariesNode.addEventListener('click', event => {
    const eventTarget = event.target;

    if (!(eventTarget instanceof Element)) {
      return;
    }

    const button = eventTarget.closest(
      '.fm-current-field-sheet__target'
    );

    if (
      !(button instanceof HTMLButtonElement) ||
      !boundariesNode.contains(button)
    ) {
      return;
    }

    const targetIndex = Number(
      button.dataset.targetEntryIndex
    );
    const existing = localStack.lastIndexOf(targetIndex);

    if (existing >= 0) {
      localStack.splice(existing + 1);
    } else {
      localStack.push(targetIndex);
    }

    render(registryRuntime.select(targetIndex));
    positionDialog();
    titleNode.focus({ preventScroll: true });
  });

  positionTrigger();

  window.addEventListener(
    'resize',
    () => {
      positionTrigger();
      positionDialog();
    },
    { passive: true }
  );

  surface.addEventListener(
    'fieldframechange',
    () => {
      positionTrigger();
      positionDialog();
    }
  );

  if (rawTrialIndex !== null) {
    open(registryRuntime.select(Number(rawTrialIndex)));
  }

  return Object.freeze({
    active: true,
    get currentSelection() {
      return currentSelection;
    },
    open,
    setMainSelection,
  });
}
