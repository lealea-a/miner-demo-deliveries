# 四包独立交接目录

发行：ekto-delivery-suite-20261030-r1；2026-10-30 用户已授权公开以下四份已复核部署包。此次公开交付不改变产品、原ZIP字节或线上入口。

| 包 | 字节 | 获取与使用 |
|---|---:|---|
| Field | 2176002 | [下载 ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/field-standalone-owner-complete-20261030-r1.zip) · [部署入口](field/README.md) |
| Tech | 2117597 | [下载 ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/tech-standalone-owner-complete-20261030-r1.zip) · [部署入口](tech/README.md) |
| Mobile H5 | 315150410 | [下载 ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/mobile-runtime-wechat-loading-complete-deployment-r2.zip) · [部署入口](mobile/README.md) |
| Web H5 | 203735815 | [下载 ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/web-runtime-c6ac3932-complete-deployment-r2.zip) · [部署入口](web/README.md) |

[完整版本与摘要](RELEASE-INDEX.json) · [SHA256SUMS](SHA256SUMS.txt) · [AI接手入口](AI-HANDOFF.md) · [同仓Release](https://github.com/lealea-a/miner-demo-deliveries/releases/tag/ekto-delivery-suite-20261030-r1)

## 获取

Git clone/pull得到本交接索引，四个完整ZIP在同仓Release附件；不作为普通Git大文件提交。GitHub自动生成的Source code.zip不是运行交付包。

```sh
git clone --branch main --single-branch https://github.com/lealea-a/miner-demo-deliveries.git
cd miner-demo-deliveries
git pull --ff-only origin main
gh release download ekto-delivery-suite-20261030-r1 --repo lealea-a/miner-demo-deliveries --dir ./downloads
```

先按本目录SHA256SUMS核对四ZIP，再分别解压到新目录。部署按各包README/AI-HANDOFF；不需要可选维护源码。

## 安装、更新与回退

- Field/Tech：各自执行包内tools/release.mjs prepare，自动核验；按README生成Caddy配置、启动服务、核HTTP及实际入口，再显式切换。新包包含配置、交接和人工问题表，无需Playwright/CloudBase。Field横71fc/竖7bfc保持两个身份、原路径和分类缓存；Tech124文件为原R10 rev2字节。旧r4原生部署需另建新根并保留旧配置，不能直接转换或复用旧记录。
- 手机/Web H5：按各自README填写两个不同HTTPS来源，一条prepare生成当前/回退组合并自动verify；输出的serve与反代配置负责实际响应。手机含完整B，Web含完整上一组。更新先生成并验证新目录，再显式切入口；回退使用各自binding.previous.parentBase，保留旧子路径，不能混用父子BUILD。
- Node/Caddy、DNS、生产TLS、常驻进程由部署方准备；一条命令准备并校验不是一键公网部署。Web/手机默认4881/4882相同，同机须分机/容器网络隔离或明确端口方案，不要求统一服务器。

## 版本与边界

独立Field/Tech不能替换Web或手机的内嵌Demo；Web的Field d5b89c/Tech first-frame与手机Field entry-chain/Tech entry-b各属自己的绑定，详见RELEASE-INDEX。

Field/Tech轻量交付层已通过独立复核；本地Caddy全文件HTTP、必要Chrome流程、显式A/B恢复及配置保存后重启证据通过。Web/mobile沿用对应r2及未变范围的有效验收。本次发布不新增真机/Safari、视觉、性能或目标公网DNS/TLS/CDN结论。

冻结ZIP内候选、待独审、暂不公开等文字保留其封存时历史；本次2026-10-30授权明确包括四份运行ZIP的公开分发，以此外层交接及实际Release状态为准。维护ZIP、审核日志、施工脚本与生产凭据不公开。原包、旧标签与历史交付保留。
