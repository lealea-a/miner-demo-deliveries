# Field Miner landscape simple-guide demo v05

This is the independently deployable static package derived from:

- Cover source and visual parity evidence: `design-experiments/field-miner-landscape-cover-v01/`
- Entry handoff, independent frame fitter, landscape Inner/Guide authority: `design-experiments/field-miner-cover-recovery-v01/`
- Build date: 2026-09-20
- Public base: `/field-miner-landscape-simple-guide-v01/`

## Run locally

Serve this `site` directory from the URL prefix
`/field-miner-landscape-simple-guide-v01/`. A plain file:// URL is not supported.

## Entry

- `index.html`: the verified landscape Cover DOM driven by the frozen vertical handoff controller.
- `embed.html`: coverless master embed Entry. First use opens the existing
  three-step guide; returning use opens the landscape Inner directly.
- Add `?guide=replay` to either Entry to force the first-use guide.
- The normal first-use marker is stored in localStorage under
  `field-miner:first-use-narrative:v1:shown`.
- Runtime embedding requires one canonical `parent_origin` query parameter.
  The child reports exactly one versioned READY or ERROR message to that origin.

## Update

v05 is a byte-preserving derivative of frozen v04. Do not rebuild Runtime for this release. Reproduce it with package-v05-from-v04.mjs.

## License

Source Han Sans license: licenses/source-han-sans-license.txt.

## Boundaries

This package is the landscape web demo, not a PWA install package. Relative to
the frozen baseline, the only Runtime change is the Entry and Guide readiness
ordering: each waiter now registers its observer and then synchronously reruns
the same status check (`observe` → synchronous recheck). Registry content,
animation timing, layout, and production site routes are unchanged.
