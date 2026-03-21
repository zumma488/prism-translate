# AGENT.md

## 1. 文件定位

本文档是 `prism-translate` 项目的项目级 AI Agent 工作说明书。

它放在项目根目录，目的是让进入仓库的 AI agent 能第一时间看到：
- 这个项目是什么
- 这套代码当前是怎么组织的
- 应该优先读哪些文档
- 改动代码时要遵守什么边界
- 如何按需从上到下或从下到上查找项目信息

这不是产品介绍文档，也不是纯架构方案文档，而是：

> **AI agent 在这个仓库里开展分析、文档整理、代码修改、结构演进时的操作说明与阅读导航。**

---

## 2. 项目一句话定义

`prism-translate` 是一个 **多语言 + 多模型 + 多 Provider 的 AI 翻译比较工作台**。

它的核心不是“给出一个翻译结果”，而是：
- 让一段输入同时经过多个模型
- 支持按目标语言绑定不同模型
- 让用户比较不同模型的翻译表现
- 服务于真实内容工作流，而不是聊天式玩具场景

---

## 3. Agent 进入项目后的优先阅读顺序

### 第 1 层：项目总纲文档
先读：
1. `./AGENT.md`（本文档）
2. `./docs/architecture/README.md`
3. `./docs/architecture/PROJECT_ANALYSIS.md`
4. `./docs/architecture/TARGET_ARCHITECTURE.md`

这四份文档分别回答：
- `AGENT.md`：你在这个仓库里应该怎么工作
- `docs/architecture/README.md`：文档体系怎么导航
- `PROJECT_ANALYSIS.md`：当前项目是什么、当前问题和要求是什么
- `TARGET_ARCHITECTURE.md`：目标骨架和目标架构是什么

### 第 2 层：代码根目录说明
然后读：
- `./src/README.md`

它回答：当前 `src/` 如何理解，以及现有代码与目标骨架怎么映射。

### 第 3 层：按需进入模块 README
根据任务选择阅读：
- 翻译工作流 → `./src/features/translation/README.md`
- 设置与配置 → `./src/features/settings/README.md`
- Provider 管理 → `./src/features/provider-management/README.md`
- 服务层与 LLM 调用 → `./src/services/README.md`
- LLM 调用细节 → `./src/services/llmService/README.md`
- 当前 UI 组件 → `./src/components/README.md`
- 实体模型 → `./src/entities/README.md`
- Provider 静态配置 → `./src/config/README.md`
- 国际化 → `./src/i18n/README.md`
- 通用 hooks → `./src/hooks/README.md`
- 通用 lib → `./src/lib/README.md`

### 第 4 层：再下钻到子模块 README
如果任务更具体，再继续进入：
- `src/features/translation/components/README.md`
- `src/features/translation/hooks/README.md`
- `src/features/translation/services/README.md`
- `src/features/settings/components/README.md`
- `src/features/settings/hooks/README.md`
- `src/features/settings/services/README.md`
- `src/features/provider-management/services/README.md`
- `src/components/settings/README.md`
- `src/components/ui/README.md`
- `src/entities/provider/README.md`
- `src/entities/translation/README.md`
- `src/entities/settings/README.md`

---

## 4. 文档导航规则（必须遵守）

本项目文档体系采用“双向导航”规则。

### 4.1 从上到下
从总纲一路下钻：
- `AGENT.md`
- `docs/architecture/README.md`
- `src/README.md`
- 一级模块 README
- 二级 / 三级子模块 README

### 4.2 从下到上
从某个具体目录回溯：
- 当前子目录 README
- 上级模块 README
- `src/README.md`
- `docs/architecture/README.md`
- `AGENT.md`

### 4.3 每层 README 必须记录
- 当前层级
- 上级文档
- 下级文档
- 平级相关文档

### 4.4 Agent 的阅读原则
- 不要一上来全量扫所有文档。
- 先读总纲，再按任务进入对应模块。
- 若当前目录 README 已能回答问题，不要无谓继续扩大读取范围。
- 若当前目录信息不够，再顺着“上级文档”或“下级文档”扩展。

目标是：
> **按需查找，而不是全量灌入。**

---

## 5. 当前项目现状理解

### 5.1 当前实现形态
当前项目仍然是典型的前端单页结构：
- `App.tsx` 是主编排中心
- `components/` 承载主要 UI
- `services/` 承载主要服务逻辑
- `config/` 承载 Provider 静态定义
- `types.ts` / `constants.ts` 承担核心对象与配置的一部分

### 5.2 当前项目不是目标骨架完成态
当前目录里已经补了 `features/`、`entities/` 等 README 和空目录，但这表示的是：

- **目标骨架文档已经落地**
- **代码还没有完全迁移到目标骨架**

所以 agent 必须理解：

> 现在仓库处于“文档先行、代码后迁移”的状态。

也就是说：
- 当前真实代码逻辑，仍大量存在于 `components/`、`services/`、`App.tsx`
- `features/`、`entities/` 目前更多是在定义未来结构与边界

---

## 6. 目标骨架理解方式

后续项目建议围绕以下骨架演进：

- `features/`：承载业务能力
- `entities/`：承载稳定核心实体
- `services/` / 未来 `integrations/`：承载外部接入与基础服务
- `components/`：承载当前 UI 组件，后续逐步把业务语义明确的组件迁回 feature
- `docs/architecture/`：承载总纲文档
- 项目根目录 `AGENT.md`：承载 agent 工作说明

### 核心原则
1. 业务按 feature 分，而不是按文件类型堆。
2. 多模型比较是核心，不是附属功能。
3. Provider 抽象必须统一。
4. 配置管理必须视为独立能力。
5. 任务编排与结果展示必须逐步分离。
6. 文档必须支持上下双向导航。

---

## 7. 你在这个项目里做事时的行为规则

### 7.1 做分析类任务时
应优先：
1. 读 `AGENT.md`
2. 读 `docs/architecture/README.md`
3. 读 `PROJECT_ANALYSIS.md`
4. 再按任务进入对应模块 README

不要直接从零散代码文件开始盲读，除非模块文档已经不足以回答问题。

### 7.2 做架构整理类任务时
应优先区分三类文档：
- 当前项目总结 → `PROJECT_ANALYSIS.md`
- 目标架构建议 → `TARGET_ARCHITECTURE.md`
- Agent 工作说明 → `AGENT.md`

不要把“现状”“建议”“路线图”混在一篇文档里。

### 7.3 做代码修改类任务时
先确认当前任务属于哪类：
- translation
- settings
- provider-management
- llm service
- config
- components

再进入对应 README 查边界。

### 7.4 做目录扩展类任务时
新增目录或模块时，应同步补：
- 该目录的 `README.md`
- 它的上级 / 下级导航关系

也就是说：
> **目录新增不是只加代码，也要加导航文档。**

### 7.5 做 git 类任务时
- 提交文档时只提交文档，不要误带 `.env` 等敏感文件。
- 若用户要求走分支流程，优先在专用分支提交。
- 提交前用 `git status` 检查未跟踪或敏感文件。

---

## 8. 各模块的工作边界（Agent 速查版）

### 8.1 translation
看：`src/features/translation/README.md`

负责：
- 输入文本
- 目标语言管理
- 任务生成
- 任务执行编排
- 结果分组、排序、比较

不负责：
- Provider 底层 SDK 实例化
- 配置加密解密

### 8.2 settings
看：`src/features/settings/README.md`

负责：
- Provider 配置
- 模型管理
- 默认模型
- 导入导出
- 配置迁移、持久化

不负责：
- 翻译结果展示
- LLM 底层适配

### 8.3 provider-management
看：`src/features/provider-management/README.md`

负责：
- Provider 接入入口
- Provider 业务管理规则
- Provider 元信息与设置协同

### 8.4 services / llmService
看：
- `src/services/README.md`
- `src/services/llmService/README.md`

负责：
- 模型创建
- 翻译调用
- safeFetch
- 响应解析
- 配置 IO / crypto

### 8.5 entities
看：`src/entities/README.md`

负责：
- 稳定核心数据模型

注意：
当前实体尚未真正拆代码迁移完成，但文档已经定义了目标边界。

---

## 9. 项目中的关键现实约束

### 9.1 纯前端边界
当前项目是浏览器直连 Provider 的纯前端应用。
因此：
- 配置加密不等于真正安全
- API Key 仍然属于前端暴露风险模型

不要把当前方案描述成企业级密钥安全方案。

### 9.2 当前 `App.tsx` 仍然过重
很多编排逻辑还在 `App.tsx`，所以 agent 在做结构性调整时，要意识到：
- 当前职责尚未完全拆开
- 文档里的目标边界不等于代码已经完成迁移

### 9.3 当前文档先于代码迁移
`features/`、`entities/` 的很多 README 先出现，是为了明确未来边界，而不是表示目录下已经有完整实现。

---

## 10. 推荐工作流（给后续 agent）

### 场景 A：我只是想理解项目
顺序：
1. `AGENT.md`
2. `docs/architecture/README.md`
3. `PROJECT_ANALYSIS.md`
4. `src/README.md`
5. 对应模块 README

### 场景 B：我想新增 / 修改功能
顺序：
1. 找到功能归属模块
2. 读模块 README
3. 读相关平级 README
4. 再进入具体代码文件
5. 改完后若目录边界发生变化，同步更新 README

### 场景 C：我想继续架构重构
顺序：
1. `PROJECT_ANALYSIS.md`
2. `TARGET_ARCHITECTURE.md`
3. 相关模块 README
4. 确认当前代码落点与目标骨架映射
5. 再做迁移

---

## 11. Agent 不该做的事

1. 不要把“当前分析”“目标架构”“路线图”写进同一篇文档。
2. 不要因为有了 `features/` README，就假设代码已经完成 feature 化迁移。
3. 不要绕过模块 README 直接大范围拍脑袋改结构。
4. 不要提交 `.env`、密钥、临时文件。
5. 不要把 `components/ui` 和带业务语义的组件混为一谈。
6. 不要把 Provider 业务规则散落到各个不相关组件里。

---

## 12. 后续应继续维护的内容

后续如果继续推进这个项目，建议优先维护这几类文档：

1. `AGENT.md`
   - 保持 agent 工作规则最新

2. `docs/architecture/PROJECT_ANALYSIS.md`
   - 保持对当前项目真实状态的描述最新

3. `docs/architecture/TARGET_ARCHITECTURE.md`
   - 保持目标骨架和目标架构最新

4. 各目录 `README.md`
   - 目录职责变化时同步更新
   - 新增子目录时同步补 README

---

## 13. 一句话总结

如果你是第一次进入这个仓库的 AI agent，请记住：

> **先读总纲，再按模块进入；先认清现状，再参考目标；所有目录都应可双向导航；所有改动都尽量落在明确边界里。**
