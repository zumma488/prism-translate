# Prism Translate 演进路线图（ROADMAP）

## 1. 文档定位

本文档只负责回答一件事：

> 从当前项目现状出发，Prism Translate 应该按什么顺序逐步演进到目标架构。

它不是：
- 当前项目总结文档
- 目标架构说明文档
- 目录导航文档

三者边界如下：
- 当前项目现状、问题、要求 → `PROJECT_ANALYSIS.md`
- 目标架构、目标骨架、目标模块边界 → `TARGET_ARCHITECTURE.md`
- 演进顺序、阶段优先级、实施建议 → `ROADMAP.md`（本文档）

---

## 2. 当前阶段判断

当前仓库已经完成的不是“代码层 feature 化迁移”，而是：

1. 明确了当前项目现状与约束
2. 明确了目标架构方向
3. 建立了项目根目录 `AGENT.md`
4. 建立了 `docs/architecture/` 总纲文档体系
5. 建立了 `src/` 周边的 README 导航体系

因此，当前项目所处阶段应定义为：

> **文档先行、代码未完全迁移、具备进入结构化改造的准备态。**

这意味着：
- 可以开始做结构性代码迁移
- 但前提是继续遵守当前文档里已经定义好的边界
- 不应假装目标骨架已经落地完成

---

## 3. 路线图总原则

后续演进建议遵守以下原则：

1. **先拆职责，再迁代码**
   - 先明确边界，再动手搬逻辑。

2. **先稳数据流，再美化结构**
   - 先处理翻译任务生成、执行、结果聚合这些核心逻辑。

3. **先业务 feature 化，再基础设施升级**
   - 优先把 translation / settings 这两条主线独立出来。

4. **先兼容当前纯前端，再为代理后端留口**
   - 当前不强推后端化，但结构上不能把“浏览器直连 provider”写死。

5. **每次迁移都要可回溯、可定位、可文档化**
   - 目录职责变化时，同步更新对应 README。

---

## 4. 推荐阶段划分

### Phase 0：文档体系收尾与对齐（当前阶段）

目标：
- 把现有文档体系补齐为完整闭环
- 确保后续代码迁移时有稳定导航

本阶段建议完成：
- 补 `ROADMAP.md`（本文档）
- 持续维护 `SESSION_HANDOFF.md`
- 检查 `docs/architecture/README.md` 是否把三类文档关系讲清楚
- 检查 `src/README.md` 与一级模块 README 是否仍与当前代码相符

验收标准：
- 新会话进入仓库后，能不重做分析而直接继续工作
- 现状 / 目标 / 路线图 三类文档边界明确

---

### Phase 1：拆分 `App.tsx` 的核心职责

目标：
- 让页面总控不再同时承担过多业务逻辑

优先拆出的职责：
1. 设置加载与持久化
2. 目标语言与模型绑定解析
3. TranslationTask 构建
4. 翻译执行编排
5. 结果分组与排序

建议产物：
- `features/translation/` 下逐步落入 hooks / services
- `features/settings/` 下逐步落入 settings persistence / migration

不要求一开始就彻底重组目录，但要求：
- 新增逻辑尽量落到 feature 边界内
- 从 `App.tsx` 抽出的逻辑要有明确模块归属

验收标准：
- `App.tsx` 主要负责页面编排，而不再承担全部业务细节

---

### Phase 2：让 translation 成为真正独立的 feature

目标：
- 让“多语言 × 多模型翻译比较”成为项目的显式核心能力

优先形成的能力模块：
- `buildTranslationTasks`
- `runTranslationTasks`
- `groupTranslationResults`
- `sortTranslationResults`
- `useTranslationRunner`
- `useTranslationResults`

本阶段重点：
- 明确 `TranslationTask` 概念
- 明确单任务失败隔离
- 明确结果排序和分组规则
- 让“并发执行”和“UI 展示”分离

验收标准：
- translation 主流程不再散落在 `App.tsx + components` 中
- 结果分组和排序成为独立能力，而不是临时 UI 处理

---

### Phase 3：让 settings 成为真正独立的 feature

目标：
- 把配置作为正式资产来管理，而不是附属弹窗逻辑

优先形成的能力模块：
- `useAppSettings`
- `useSettingsPersistence`
- `settingsMigration`
- `settingsMerge`
- `providerModelFetch`

本阶段重点：
- 设置加载 / 持久化 / 迁移分离
- 导入 / 导出 / 合并规则集中化
- Provider 编辑流程与模型拉取流程边界更清楚

验收标准：
- 设置逻辑不再主要埋在 `SettingsModal` / `EditProviderView` 中
- 配置相关规则有稳定入口

---

### Phase 4：收紧 Provider / LLM 接入边界

目标：
- 让 provider 扩展路径稳定下来
- 为未来支持更多协议和更稳定输出做准备

建议方向：
- 收敛 provider 定义入口
- 收敛 model 实例化入口
- 收敛响应解析入口
- 明确 OpenAI-compatible 的统一适配策略
- 预留对不同 OpenAI 协议模式的兼容层

本阶段重点：
- 避免 provider 规则散落到多个组件与服务文件
- 避免“新增 provider 需要全项目到处改”

验收标准：
- 新增 provider / 新增协议支持时，改动路径尽量固定

---

### Phase 5：增强比较体验与治理能力

目标：
- 从“能用”进入“更像可靠工具”

建议增强项：
- 模型差异高亮
- 术语一致性辅助
- 成本 / 延迟展示
- 并发上限
- retry / backoff
- 更稳定的结构化输出能力

验收标准：
- 系统不仅能出结果，还能更稳定、更可比较、更可治理

---

### Phase 6：可选的代理后端化

目标：
- 如果进入团队 / 企业使用场景，补齐真正的治理边界

可引入能力：
- API Key 不直接暴露浏览器
- 统一限流
- 缓存
- 审计 / 日志
- 统一鉴权

注意：
- 这是可选阶段，不是当前纯前端阶段的前置条件
- 当前架构只需要为它预留空间，不需要现在就强推

---

## 5. 当前最推荐的近期动作

结合项目当前状态，最推荐的近期动作不是“大重构一步到位”，而是：

### 近期动作 A：保持文档与真实代码状态同步
- 新增或移动模块时，更新对应 README
- 持续维护 `SESSION_HANDOFF.md`
- 如果阶段变化明显，更新本 `ROADMAP.md`

### 近期动作 B：先拆 translation 主流程
- 从 `App.tsx` 中优先抽离任务构建、执行、聚合逻辑
- 不急着一次性搬空 UI 组件

### 近期动作 C：再拆 settings 主流程
- 把 persistence / migration / merge 规则从界面组件中抽出

一句话优先级：

> **先拆 translation，再拆 settings；先稳主流程，再扩基础设施。**

---

## 6. 每阶段都应保持的规则

1. 不要把当前分析、目标架构、路线图混写。
2. 不要因为目录有 `features/` README，就假设代码已迁移完成。
3. 目录职责变化时，同步更新 README 导航。
4. 做 git 提交前先看 `git status`，不要误带 `.env`。
5. 如果只是继续推进现有工作，优先沿文档接手，不要重新从零分析。

---

## 7. 一句话路线图结论

Prism Translate 的推荐演进顺序是：

> **先补齐文档闭环，再拆 `App.tsx`；先让 translation 与 settings feature 化，再收紧 provider 边界；最后再考虑更强治理能力和可选后端代理化。**
