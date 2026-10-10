# Miner Demo Deliveries

## 当前交付：Field + Tech 总部署包 r4-fix1

**本地部署/回退技术验收通过，可交第三方试部署；Demo 尚未线上部署。**

- [最新总部署交付目录](https://github.com/lealea-a/miner-demo-deliveries/tree/main/deliveries/miner-integrated-deployment-20261011-r4-fix1)
- [下载冻结 ZIP](https://github.com/lealea-a/miner-demo-deliveries/raw/refs/tags/miner-integrated-deployment-20261011-r4-fix1/deliveries/miner-integrated-deployment-20261011-r4-fix1/miner-integrated-deployment-20261011-r4-fix1.zip)
- [包外冻结记录](deliveries/miner-integrated-deployment-20261011-r4-fix1/FREEZE-RECORD.json)
- [ZIP SHA256](deliveries/miner-integrated-deployment-20261011-r4-fix1/miner-integrated-deployment-20261011-r4-fix1.zip.sha256)

ZIP 保持独立审核时的原字节，包含 282 个文件、229 个站点文件。包内 pending/review 是打包时阶段；当前状态以包外 FREEZE-RECORD.json 为准，不为更新标签重打包。

公开克隆与更新：

```bash
git clone --branch main --single-branch https://github.com/lealea-a/miner-demo-deliveries.git
cd miner-demo-deliveries
git pull --ff-only origin main
```

不可移动的发行标签：`miner-integrated-deployment-20261011-r4-fix1`。核对 SHA256 后解压 ZIP，执行原始 `node verify-package.mjs`，再按包内 `GETTING-STARTED.md` 和 `UPDATE-ROLLBACK.md` 操作。各 Demo 的部署说明仍在包内。静态托管无需维护源码或服务端 Node。

验收限于声明的本地部署与回退范围；公网 HTTPS/DNS/CDN、Windows 服务、物理设备/Safari、旧固定地址 SW 与已安装 PWA 迁移仍开放。CloudBase 仅支持新版本路径试传，不能沿用本地 Caddy 结论宣称完成云端回滚。

本仓库发布审核后的部署包及必要冻结元数据。完整维护源码、施工/测试目录、依赖和浏览器不公开。

## 历史基线（非最新下载）

- [Tech Miner Web v1 分支](https://github.com/lealea-a/miner-demo-deliveries/tree/codex/tech-miner-web-v1-delivery)
- [Field Miner Web v1 分支](https://github.com/lealea-a/miner-demo-deliveries/tree/codex/field-miner-web-v1-delivery)

旧分支、标签及原交付保留；新使用者请从上方总部署包开始。
