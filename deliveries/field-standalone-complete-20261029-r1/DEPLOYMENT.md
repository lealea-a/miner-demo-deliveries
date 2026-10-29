# Field 完整包部署说明

本包是独立 Demo 的静态交付，含横版 49 文件和竖版 50 文件。它不是已经完成 Web H5 活动许可接线的内嵌交付。当前两个版本已在 demo.ektopod.cn 发布；不要为了使用这份整理包重复覆盖原目录。

## 目录与文件

解压部署 ZIP 后，只将 `public/` 内的目录层级映射到站点 URL 根。保持 `_releases/<原版本ID>/field/<原布局目录>/`，不要把两个布局移到同一个版本 ID 下。完整复制资源、字体、HTML、清单、SW 和许可证，不仅复制首页。

目标若已有同名目录，先比对 SHA；内容相同则无需上传，不相同应停止并保留现场，不能覆盖不可变版本。迁移到新服务器时可以保留相同 URL 路径；更换域名需另外核 HTTPS、来源头及实际进入流程，不能视为已完成迁移验收。

完整路径为：

```text
/_releases/release-field-perf-r1-71fc214d0b3b7f2e/field/field-miner-landscape-simple-guide-v01/
/_releases/release-field-perf-r1-7bfce3562a547405/field/field-miner-mobile-v01/
```

目录地址以 `/` 结尾；不带末尾斜杠时定向到同目录的斜杠地址。缺文件返回 404，不能走 H5 的 SPA 首页回退。JS 使用 JavaScript MIME，woff2/webmanifest/SVG/PNG 使用对应 MIME。

## 响应头

`deployment/nginx-reference.conf` 从已用配置中仅摘取本次两个布局的 location，路径根以 `__RELEASE_ROOT__` 占位；这是参考片段，不是整份现网配置。未替换占位符不得加载；当前线上已有对应配置，不要重复追加。它不含证书、凭据或 SSH 信息。

每布局的 `CACHE-POLICY.json` 列出的版本化资源可 `public, max-age=31536000, immutable`；HTML、SW 和其余文件沿用 `no-store`。仅对明确不可变版本路径应用，不能扩到别名、HTML、SW 或 Tech。不要用历史统一 no-store 的旧验收器来否定这批已通过的分类型策略，也不要把检验器的变更当产品提速。

保留参考片段的精确来源与嵌套 frame 策略及现场必要安全头。任何 Web H5 新父域的放行只能在下一批新 Web 嵌入路径上实施；不改这两个现有路径。Nginx 配置重名、全局头继承、CDN 与实际响应的核对属于具体迁移部署，不能将本地制包当成已经完成。

## SW 和更新

竖版使用本目录内 `sw.js` 及原 scope，不注册根级 SW，不删除其他 scope/旧版本缓存，不添加 skipWaiting 或 clients.claim。保留既有应用 ID；不同版本目录并不保证两个独立安装应用或 localStorage 隔离。

本批不更新默认入口、alias 或 H5 引用。若日后获准切换某个入口，先准备完整的新版本，核验后只修改该入口的引用；回退恢复原引用和必要配置，不删原版本。不得上传维护 ZIP 到站点。

## 核验与接受边界

包外 `VERIFICATION.json` 证明与冻结输入一致；部署 ZIP 内 `SHA256SUMS` 覆盖除其自身之外的所有交付文件。各布局原 `FILES.sha256` 也保留。

实际新部署时，核 HTTPS、99 个实际文件 SHA/MIME/缓存、末尾斜杠与缺失 404，再走独立入口进入、首次/已看引导、GLOBAL/CHINA、弹层/试算、返回及竖版离线。Web 内嵌协议属于另一份计划，不因独立页正常而视为通过。

此前的技术/视觉/用户接受沿用其对应版本；本轮未重跑视觉、手机或性能测试。原字节不变的组合整理无需重新开启已接受的首页性能优化。
