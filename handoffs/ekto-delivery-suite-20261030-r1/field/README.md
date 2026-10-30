# Field 部署入口

[下载完整部署ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/field-standalone-owner-complete-20261030-r1.zip) · [四包总入口](../README.md)

版本：field-standalone-owner-complete-20261030-r1；2176002 bytes。

SHA256：`6c8c0ddcf8c9551e9b9766890901a943d2d70dd2c7419d869961499a6f7cdd97`

核对后解压，阅读包内README.md、AI-HANDOFF.md；先按README配置，再从解压根执行：

```sh
node tools/release.mjs prepare C:/MinerField/releases release-A
```

prepare自动核验；启动托管、更新、显式切换、失败恢复和重启步骤继续按包内README执行。问题填写包内problem-report.json。默认Caddy；旧r4记录不能原地复用，另根迁移且保留旧配置。不新增全自动公网部署、自动业务回滚或设备验收承诺。维护源码不在公开清单。
