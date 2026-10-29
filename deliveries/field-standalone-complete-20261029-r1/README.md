# Field 定稿完整独立部署包

GitHub 交付日期：2026-10-30。原产品未重建，部署 ZIP 保持 2026-10-29 整理的原字节。

- [下载完整部署 ZIP](field-standalone-complete-20261029-r1-deployment.zip)
- [版本与原冻结提交](VERSION-INDEX.json)
- [部署说明](DEPLOYMENT.md)
- [文件 SHA-256](SHA256SUMS)

横版采用 `71fc`，49 文件；独立竖版采用 `7bfc`，50 文件。两者分别保留原 release 目录和资源身份，共 99 个运行文件，不混成同一个 sourceDigest。只公开 ZIP 中 public/ 的内容。

已有体验入口：

- [横版](https://demo.ektopod.cn/_releases/release-field-perf-r1-71fc214d0b3b7f2e/field/field-miner-landscape-simple-guide-v01/)
- [竖版](https://demo.ektopod.cn/_releases/release-field-perf-r1-7bfce3562a547405/field/field-miner-mobile-v01/)

这里的独立竖版不等于手机 H5 优化内嵌版。当前版本已经用户接受并冻结；本次仅 GitHub 交付，不修改或重部署这些线上入口，不改手机 H5。Web H5 新接线仍是另一个实施批次，不以独立页通过替代嵌入验收。

维护源码仍按原公开仓库的交付约定另存，本目录不包含维护 ZIP。ZIP 内的历史候选/待发布文字保留原字节，当前接受身份见本目录 VERSION-INDEX.json。旧交付、标签及默认入口均保留。
