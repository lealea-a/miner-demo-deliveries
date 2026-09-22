# Tech Miner Web v1

这是 Tech Miner 的可部署静态交付包，状态为：

`FROZEN_LOCAL_AUDITED / OWNER_HANDOFF_READY / NOT_DEPLOYED`

## 纯交付克隆

```bash
git clone --depth 1 --single-branch --branch codex/tech-miner-web-v1-delivery https://github.com/lealea-a/lea.git tech-miner-web-v1
```

该分支是孤立交付分支，根目录只有本交付包，不包含项目源码、实验目录或其他 Demo。

交付内容：

- `site/`：部署源目录，23 个文件，与已审计冻结包逐字节一致。
- `tech-miner-web-v1.zip`：`site/` 内容的便携压缩包；解压后可直接看到 `index.html`。
- `tech-miner-web-v1.zip.sha256`：ZIP 完整性校验值。
- `HANDOFF.md`：部署、验收与回滚说明。
- `ai-handoff/AI-HANDOFF.json`：供部署 AI 读取的机器可判定合同；接收方必须返回符合 Result Schema 的结果 JSON。

开始部署前，请完整阅读 [HANDOFF.md](HANDOFF.md)。不要直接修改 `site/` 内的冻结文件；需要改产品时，应回到源码重建并重新验收。
