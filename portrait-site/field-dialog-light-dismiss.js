function isBackdropHit(dialog, event) {
  if (
    !event.isTrusted ||
    event.target !== dialog
  ) {
    return false;
  }

  const rect = dialog.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;

  return (
    x < rect.left ||
    x > rect.right ||
    y < rect.top ||
    y > rect.bottom
  );
}

export function installDialogLightDismiss(dialog) {
  if (!(dialog instanceof HTMLDialogElement)) {
    throw new Error('FIELD_DIALOG_LIGHT_DISMISS_TARGET_INVALID');
  }

  if (dialog.getAttribute('closedby') !== 'closerequest') {
    throw new Error('FIELD_DIALOG_LIGHT_DISMISS_CONTRACT_FAILED');
  }

  let activationSource = null;
  let activationId = null;
  let downOnBackdrop = false;
  let upOnBackdrop = false;

  function resetActivation() {
    activationSource = null;
    activationId = null;
    downOnBackdrop = false;
    upOnBackdrop = false;
  }

  function beginActivation(source, id, event) {
    resetActivation();
    activationSource = source;
    activationId = id;
    downOnBackdrop = isBackdropHit(dialog, event);
  }

  function endActivation(source, id, event) {
    if (
      activationSource !== source ||
      activationId !== id
    ) {
      return;
    }

    upOnBackdrop = isBackdropHit(dialog, event);
  }

  dialog.addEventListener('pointerdown', event => {
    if (!event.isPrimary) {
      return;
    }

    beginActivation('pointer', event.pointerId, event);
  });

  dialog.addEventListener('mousedown', event => {
    if (
      event.button !== 0 ||
      activationSource === 'pointer'
    ) {
      return;
    }

    beginActivation('mouse', 0, event);
  });

  dialog.addEventListener('pointerup', event => {
    if (!event.isPrimary) {
      return;
    }

    endActivation('pointer', event.pointerId, event);
  });

  dialog.addEventListener('mouseup', event => {
    if (
      event.button !== 0 ||
      activationSource === 'pointer'
    ) {
      return;
    }

    endActivation('mouse', 0, event);
  });

  dialog.addEventListener('click', event => {
    const shouldDismiss =
      dialog.open &&
      downOnBackdrop &&
      upOnBackdrop &&
      isBackdropHit(dialog, event);

    resetActivation();

    if (!shouldDismiss) {
      return;
    }

    if (typeof dialog.requestClose === 'function') {
      dialog.requestClose('light-dismiss');
    } else {
      dialog.close('light-dismiss');
    }
  });

  dialog.addEventListener('pointercancel', resetActivation);
  dialog.addEventListener('close', resetActivation);
}
