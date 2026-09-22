# Field Miner Mobile PWA v10 — public handoff candidate

这是从竖版 v09 逐字节派生的纠偏候选。v09 目录与 ZIP 保持不变。

## 本版唯一 Runtime 变化

- Guide 内页 readiness 恢复固定提交 8c1cfbc7f217cdac5618009adca695aebf3edbc1 的权威片段：
  目标 iframe Realm 的 MutationObserver 构造后，先复核 document/root/window/连接身份，
  再 observe，并同步调用同一状态检查函数。
- Service Worker 缓存身份升级为
  v13-public-handoff-guide-guard-20260921；生命周期控制流不变。
- README、VALIDATION 与 FILES.sha256 更新为 v10 身份。

Entry bundle、动画、Inner、卡片、QR、Registry、字体、资产、视觉和时间轴均与 v09
逐字节一致。

## 公网挂载合同

- 固定路径：/field-miner-mobile-v01/
- 入口：/field-miner-mobile-v01/field-entry-exit-trial.html
- ZIP 唯一根：field-miner-mobile-v01/
- 状态：PUBLIC_HANDOFF_CANDIDATE / NOT_DEPLOYED
