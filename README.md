# Field Miner Web v1

这是 Field Miner 横竖双版的可部署静态交付包，状态为：

`FROZEN_LOCAL_AUDITED / OWNER_HANDOFF_READY / NOT_DEPLOYED`

## 纯交付克隆

```bash
git clone --depth 1 --single-branch --branch codex/field-miner-web-v1-delivery https://github.com/lealea-a/lea.git field-miner-web-v1
```

该分支是孤立交付分支，根目录只有本交付包，不包含项目源码、实验目录或其他 Demo。

交付内容：

- `portrait-site/`：竖版部署源目录，56 个文件，入口为 `field-entry-exit-trial.html`。
- `landscape-site/`：横版部署源目录，46 个文件，入口为 `index.html`。
- `field-miner-owner-delivery-v01.zip`：上述两个部署目录的便携镜像。
- `field-miner-owner-delivery-v01.zip.sha256`：总 ZIP 完整性校验值。
- `HANDOFF.md`：部署、验收与回滚说明。
- `ai-handoff/AI-HANDOFF.json`：供部署 AI 读取的机器可判定合同。

开始部署前，请完整阅读 [HANDOFF.md](HANDOFF.md)，并运行：

```bash
node ai-handoff/verify-ai-handoff.mjs
```

不要修改两个 `*-site/` 目录内的冻结文件。需要改产品时，应回到源码重新构建并重新验收。

