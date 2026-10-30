# Web H5 部署入口

[下载完整部署ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/web-runtime-c6ac3932-complete-deployment-r2.zip) · [四包总入口](../README.md)

版本：web-runtime-c6ac3932-delivery-20261030-r2；203735815 bytes。

SHA256：`46b4ab58af86f74dbcb96716e8d39fae1e1261857c9143832bd3371917a6ccfc`

核对后解压，阅读包内README.md、AI-HANDOFF.md；先按README配置，再从解压根执行：

```sh
node tools/prepare.mjs --config my-deployment.json --out ../restored-web
```

prepare自动核验；启动托管、更新、显式切换、失败恢复和重启步骤继续按包内README执行。问题填写包内problem-report.json。配置双HTTPS来源；生成含当前和回退组合，启动生成目录中的serve.mjs并配置自己的TLS/反代。不新增全自动公网部署、自动业务回滚或设备验收承诺。维护源码不在公开清单。
