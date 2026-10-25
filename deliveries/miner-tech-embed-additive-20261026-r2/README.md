# Tech iframe 部署工具 r2（独立复验通过）

[交付说明](THIRD-PARTY-HANDOFF.txt) · [现场信息与最小权限](DEPLOYMENT-ACCESS.md) · [ZIP](miner-tech-embed-additive-20261026-r2.zip) · [SHA256](SHA256SUMS.txt)

406文件，ZIP 16063536 bytes。仅核验器和派生清单改变；122子站与273旧Demo文件不变。目标应用release仍为 release-tech-embed-20261026-r1。r1保留，不静默换包。

已从ZIP独立解压复验：406文件完整；正常、合法charset及application/javascript通过，同源/跨源跳转、非法JS MIME、missing跳转均被拒绝，跳转目标未收到请求。本目录通过Git交付，服务器尚未部署；HTTP检查不替代真实iframe与手机验收。临时公网路线保持停止。
