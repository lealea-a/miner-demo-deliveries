# Mobile H5 部署入口

[下载完整部署ZIP](https://github.com/lealea-a/miner-demo-deliveries/releases/download/ekto-delivery-suite-20261030-r1/mobile-runtime-wechat-loading-complete-deployment-r2.zip) · [四包总入口](../README.md)

版本：mobile-runtime-wechat-loading-20261030-r2；315150410 bytes。

SHA256：`1b619ddef6b59f66145381d04df9d7dfe0557eda0032ca9ed852ec463b9112e1`

核对后解压，阅读包内README.md、AI-HANDOFF.md；先按README配置，再从解压根执行：

```sh
node tools/prepare.mjs --config my-deployment.json --out ../deployed-mobile
```

prepare自动核验；启动托管、更新、显式切换、失败恢复和重启步骤继续按包内README执行。问题填写包内problem-report.json。配置双HTTPS来源；生成含当前和回退组合，启动生成目录中的serve.mjs并配置自己的TLS/反代。不新增全自动公网部署、自动业务回滚或设备验收承诺。维护源码不在公开清单。
