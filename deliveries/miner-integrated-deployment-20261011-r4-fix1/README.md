# Miner integrated deployment r4-fix1

当前状态：**本地部署/回退技术验收通过，已冻结，可交第三方试部署；Demo 未线上部署。**

- [下载审核原字节 ZIP](https://github.com/lealea-a/miner-demo-deliveries/raw/refs/tags/miner-integrated-deployment-20261011-r4-fix1/deliveries/miner-integrated-deployment-20261011-r4-fix1/miner-integrated-deployment-20261011-r4-fix1.zip)
- [SHA256 文件](miner-integrated-deployment-20261011-r4-fix1.zip.sha256)
- [当前冻结记录](FREEZE-RECORD.json)

ZIP 包含 282 个文件，Field 105 + Tech 124 = 229 个站点文件与已接受基线一致。未为更新状态重打包。ZIP 内 pending/review 文案是打包时阶段，当前状态与验收边界以本目录 FREEZE-RECORD.json 为准。

接收后先核对 ZIP 的 SHA256：

```text
3be385e0d9dc358e887617af6dde20caab82dea6ee4519dad83ec66f79d39492
```

解压后使用声明支持的 Node.js 24.21.0 执行 `node verify-package.mjs`。部署操作从包内 `GETTING-STARTED.md`、`UPDATE-ROLLBACK.md` 进入，保留各 Demo 的原部署说明。只将说明指定的静态站点放到发行路径，不将整个交付包上传为站点。

独立审核覆盖真实不同 A/B 的本地 Caddy 共存、切换、业务失败后的显式恢复、旧标签/SW 隔离，以及 Windows 自带 PowerShell File.Replace 持久化和进程重启。未验收公网 HTTPS/DNS/CDN、云端切换、Windows 服务、物理设备/Safari或旧 PWA 迁移；不承诺自动业务回滚。CloudBase 仍只支持新版本路径试传。

完整维护源码另存可选，本次不公开。原分支、标签和历史交付保留。
