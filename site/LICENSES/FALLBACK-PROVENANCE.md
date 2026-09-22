# Tech Miner v0.7 card fonts

## Source Han Sans

- Upstream: Adobe Source Han Sans 2.005R
- Release commit: `6c709ca`
- Release asset: `19_SourceHanSansCN.zip`
- Downloaded archive SHA-256: `3A769D1B082EBD813CDB4C06EA57D29B340BCE548EDCC8E61976B78CA28E6236`
- Source files and SHA-256:
  - `SubsetOTF/CN/SourceHanSansCN-Light.otf`: `C406EC4C795FE71EC443A8A55570D7DF53DEA560EA93D4117EADAB6E2B19680D`
  - `SubsetOTF/CN/SourceHanSansCN-Normal.otf`: `9FC9AD5B64F086A2B342087865623923C216E346F879142A84DF37C7FFD323C5`
  - `SubsetOTF/CN/SourceHanSansCN-Medium.otf`: `A94E558A2FE972BEE4F46BCE0843ABFF37063FD68C33F1E7D9058F6F09432B01`
- Subsetter: FontTools `4.51.0`, Brotli `1.0.9`
- Required glyph source: `tech-miner-v07-glyphs.txt`
- R-01 corpus audit: the real 90 `cardModel` records plus the six visible screen labels added only `U+5F53` (`当`) and `U+6865` (`桥`); existing fixed-copy coverage was preserved.
- Rebuilt subset SHA-256 (2026-08-14):
  - `source-han-sans-tech-miner-v07-light.woff2`: `1DF944FF0BE72CE5E86276DB0CB8DF677877AD5C488DA418AFE108A8C06231AC`
  - `source-han-sans-tech-miner-v07-normal.woff2`: `C3307C36C1CBF241B714C93339932F4D1ACCCA5D9F06FC2D45A17D0A37A29F7C`
  - `source-han-sans-tech-miner-v07-medium.woff2`: `B47F6C6B27EB13F4752F4B11132B0BE47B39D43117E352FD1DEDE51D2A7E3ABB`
- Subset command shape:

```text
pyftsubset SourceHanSansCN-<Weight>.otf
  --text-file=tech-miner-v07-glyphs.txt
  --layout-features=*
  --flavor=woff2
  --ignore-missing-unicodes
  --output-file=source-han-sans-tech-miner-v07-<weight>.woff2
```

The fixed CN fonts do not map `U+2082`. The character remains unchanged in Registry text and DOM content; it is supplied by the single-character fallback below.

## Source Sans 3 single-character fallback

- Upstream: Adobe Source Sans 3.052R
- Release commit: `ed18089`
- Source file: `WOFF2/VF/SourceSans3VF-Upright.otf.woff2`
- SHA-256: `F9E4EAC0E8F8FFDAE91CF6EFF3962B96E81417CBA5C728BC1C89EFE9510E7653`
- CSS scope: `unicode-range: U+2082`
- Purpose: render the subscript two in the unchanged v0.7 strings containing `CO₂`.

Both font projects use the SIL Open Font License 1.1. Their license files are stored beside these assets.
