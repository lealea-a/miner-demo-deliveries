# Field Miner Mobile PWA v10 validation

- Date: 2026-09-21 (Asia/Shanghai)
- Work order: FIELD-PUBLIC-HANDOFF-VERTICAL-001-CORRECTION-01
- Result: PASS / PUBLIC_HANDOFF_CANDIDATE / NOT_DEPLOYED
- Baseline: field-miner-mobile-pwa-v09.zip
- Baseline ZIP SHA-256: 329A04EC24BA47AF448B0A768558D5E18AA875478B8F7FEC0CC48BDE42D2B070
- Source authority commit: 8c1cfbc7f217cdac5618009adca695aebf3edbc1
- Source authority lines: design-experiments/field-miner-cover-recovery-v01/field-first-use-narrative-layout-trial-v01.html:457-474

## Package and provenance gates

- v09 ZIP identity and 55/55 manifest verified before copying.
- Authority fragment and v09 replacement target each matched exactly once.
- Packaged Guide fragment matched the fixed Git authority fragment byte-for-byte.
- Realm-swap harness changed the iframe document during observer construction and proved the old
  node was not observed; the deliberately broken no-guard fixture failed loudly.
- v09/v10 both contain 56 files; exactly Guide, SW, README, VALIDATION and FILES.sha256 differ.
- The remaining 51 files, including Entry Runtime, are byte-identical.
- v10 manifest closes 55/55; ZIP readback closes beneath only field-miner-mobile-v01/.

## Runtime acceptance

- ZIP-extracted ?guide=replay completed five sequential fresh-load runs with outer
  fieldEntryHandoffStatus="inner", Guide sequence complete, null audit error and zero console,
  page or request errors.
- ZIP-extracted returning-user Entry completed one run to interactive Inner with zero console,
  page or request errors.
- Guide, Entry, Inner and deterministic visual assets were not rewritten beyond the approved
  Guide readiness guard and cache identity.
