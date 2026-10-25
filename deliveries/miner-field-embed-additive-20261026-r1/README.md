# Field 横版 iframe 隔离交付

[最终ZIP](miner-field-embed-additive-20261026-r1.zip) · [部署交接](THIRD-PARTY-HANDOFF.txt) · [独立审核](COORDINATOR-REVIEW.txt) · [部署通路与权限](DEPLOYMENT-ACCESS.md) · [SHA256](SHA256SUMS)

ZIP 22,136,960 bytes，467文件。SHA256：

`eb47c1393abc27c2a0756ae60ec840767f538ce8e7864ce1a755f32c7db91d93`

本目录只新增已审交付，保留旧包与默认入口。GitHub交付不等于服务器部署，待部署方确认。包内首先读 FIELD-DEPLOYMENT.txt；不切active，不用整份生成配置覆盖现网。审核快照原样保留，其中本地阶段状态以其当时语境阅读。

目标（待部署）：https://field.ektopod.cn/_releases/release-field-embed-20261026-r1/field-embed/embed-v2.html 。build 为 field-h5-public-r1-bf15eb4d-v2。旧Field/Tech273文件与Tech embed122文件原字节保持；现有H5/Live未改。

需要部署方提供可自主反复发布两站专用测试版本目录的既有通路，支持prepare/verify、精确路径配置验证、受限平滑加载和回退；原站目录、默认入口与active只读。具体边界见 DEPLOYMENT-ACCESS.md。公网/真机尚未签通过。

下载：[GitHub ZIP（main，务必核对上述SHA）](https://github.com/lealea-a/miner-demo-deliveries/raw/refs/heads/main/deliveries/miner-field-embed-additive-20261026-r1/miner-field-embed-additive-20261026-r1.zip)。沿原仓库执行 git pull --ff-only 也可取得；提交固定链接由交付回执提供。
