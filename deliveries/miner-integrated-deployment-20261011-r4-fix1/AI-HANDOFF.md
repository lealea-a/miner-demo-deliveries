# 第三方 AI 交接入口

先读 [第三方交付主说明](THIRD-PARTY-HANDOFF.txt)，按其中的部署、更新、显式回退流程操作，并保留实际异常说明。[交付审核备注附件](DELIVERY-AUDIT-NOTES.txt) 保存审核范围、覆盖缺口和维护备注，不增加验收要求，也不转化为新增工程、测试或全量重审任务。

当前冻结状态及验收边界以外层 [FREEZE-RECORD.json](FREEZE-RECORD.json) 为准；[README](README.md) 提供冻结 ZIP 下载与摘要。包内 pending/review 文案属于打包阶段历史。本次文档发布不修改冻结 ZIP、部署代码或 Runtime，不移动发行标签。

下载并解压 README 指定的冻结 ZIP 后，使用其中已有入口（以下均为解压根目录相对路径，并非仓库外层文件链接）：

- 首次部署：`GETTING-STARTED.md`
- 更新、显式回退及启动配置持久化：`UPDATE-ROLLBACK.md`
- Field AI 交接：`demos/field/AI-HANDOFF.md`
- Tech AI 交接：`demos/tech/AI-HANDOFF.txt`

只围绕接收方授权的实际部署与具体异常工作，沿用已有操作说明及问题回收入口。附件中的历史观察、覆盖限制和维护备注不代表已修复，也不自动授权修改源码、Runtime 或重跑历史测试矩阵。
