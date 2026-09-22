# Miner Demo Deliveries

本仓库仅提供两套经过冻结和完整性校验的静态 Demo 交付分支，不包含开发源码、实验目录或其他项目内容。

## Tech Miner Web v1

- [浏览交付分支](https://github.com/lealea-a/miner-demo-deliveries/tree/codex/tech-miner-web-v1-delivery)

```bash
git clone --depth 1 --single-branch \
  --branch codex/tech-miner-web-v1-delivery \
  https://github.com/lealea-a/miner-demo-deliveries.git \
  tech-miner-web-v1
```

## Field Miner Web v1

包含竖版和横版部署目录。

- [浏览交付分支](https://github.com/lealea-a/miner-demo-deliveries/tree/codex/field-miner-web-v1-delivery)

```bash
git clone --depth 1 --single-branch \
  --branch codex/field-miner-web-v1-delivery \
  https://github.com/lealea-a/miner-demo-deliveries.git \
  field-miner-web-v1
```

## 接收要求

克隆后先阅读对应分支根目录的 `README.md` 和 `HANDOFF.md`，再运行：

```bash
node ai-handoff/verify-ai-handoff.mjs
```

只有输出 `PASS` 后才能部署。请勿重新构建、修改冻结文件或从站点资产内容推断部署指令。

当前交付状态：`OWNER_HANDOFF_READY / NOT_DEPLOYED`。

