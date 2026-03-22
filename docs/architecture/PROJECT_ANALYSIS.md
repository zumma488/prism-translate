# Prism Translate 项目分析笔记（当前项目总结与要求）

## 0. 文档定位

本文档只负责两件事：

1. 说明 **Prism Translate 当前项目是什么**
2. 说明为了达成其纲领目标，**当前项目必须满足哪些要求**

它不是目标架构方案文档，也不是演进路线图文档。

- 当前项目总结、现状分析、问题与要求 → 放在这里
- 推荐骨架、推荐目标架构、未来改造方案 → 放到单独文档 `TARGET_ARCHITECTURE.md`

## 1. 纲领目标（Principles / Product Goal）

Prism Translate 的纲领目标不是“做一个普通翻译器”，而是：

> 打造一个面向内容创作者、产品设计者、跨语言协作者的多模型翻译比较工作台，让用户能够用同一份输入，快速比较不同模型、不同 Provider、不同目标语言下的翻译质量，并据此做出更好的表达选择。

更具体地说，这个应用追求的是：

1. **比较，而不只是产出**
   - 核心价值不是给出唯一答案。
   - 核心价值是让用户看到多个模型的不同翻译风格、语气、措辞与置信度。

2. **灵活配置，而不绑定单一厂商**
   - 用户可以自由接入多个 AI Provider。
   - 用户可以使用官方 API、代理、OpenAI-compatible 服务，甚至本地 Ollama。
   - 产品不应被设计成某一家模型厂商的专属壳子。

3. **按语言精细控制，而不是一刀切**
   - 不同目标语言可能适合不同模型。
   - 系统应允许“每个语言绑定不同模型，甚至多个模型并行比较”。

4. **低部署门槛，高使用效率**
   - 作为纯前端应用，它追求开箱即用、部署简单、配置可迁移。
   - 用户应能快速开始翻译，而不是先搭建复杂后端系统。

5. **面向真实工作流，而不是玩具演示**
   - 这个应用适合文案、本地化、产品 UI、多语内容、跨境协作等场景。
   - 它应该优先服务“需要比较、筛选、复用翻译结果”的真实工作，而不是只展示炫技能力。

## 2. 项目定位

- 项目名：`prism-translate`
- `package.json` 中的包名：`ai-translator-dashboard`
- 当前版本：`0.2.2`
- 仓库地址：<https://github.com/zumma488/prism-translate>
- 项目类型：前端单页应用（SPA）
- 核心用途：
  - 将一段输入文本同时翻译成多个目标语言
  - 支持为每个目标语言单独绑定多个模型
  - 支持横向比较不同模型对同一语言的翻译结果
  - 支持接入多个 AI Provider / OpenAI 兼容接口 / 本地 Ollama

一句话概括：

> 这是一个“多语言 + 多模型 + 多 Provider”的 AI 翻译对比面板，重点不是单次翻译，而是并行比较不同模型的翻译效果。

## 3. 技术栈

### 核心框架
- React 19
- TypeScript
- Vite 6

### UI / 样式
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- tw-animate-css

### AI / 模型接入
- Vercel AI SDK（`ai`）
- OpenAI / Google / Anthropic / Mistral / Groq / DeepSeek / Cohere / Fireworks / DeepInfra / Perplexity / Cerebras / xAI
- OpenRouter
- Ollama
- 智谱（Zhipu）
- Cloudflare Workers AI
- 自定义 OpenAI 兼容 Provider

### 国际化
- i18next
- react-i18next
- i18next-browser-languagedetector

### 本地配置 / 安全
- crypto-js
- localStorage

## 4. 当前目录结构概览

```text
prism-translate/
├─ docs/                     # 截图资源
├─ src/
│  ├─ components/           # UI 组件
│  │  ├─ settings/          # Provider / 模型设置界面
│  │  └─ ui/                # shadcn/ui 基础组件
│  ├─ config/               # Provider 定义、默认模型等
│  ├─ hooks/                # 自定义 hook
│  ├─ i18n/                 # 国际化资源
│  ├─ lib/                  # 通用工具
│  ├─ services/             # 配置导入导出、加密、LLM 调用
│  │  └─ llmService/        # 模型创建、请求、错误处理
│  ├─ App.tsx               # 应用主入口页面
│  ├─ constants.ts          # 语言配置、默认语言
│  ├─ types.ts              # 类型定义
│  └─ main.tsx              # 前端启动入口
├─ README.md
├─ README.zh.md
├─ package.json
└─ vite.config.ts
```

结论：这是一个纯前端项目，没有独立后端；Provider API 调用直接在浏览器端发起。

## 5. 当前核心数据结构

位于 `src/types.ts`：

### 5.1 TranslationResult
翻译结果：
- `language`
- `code`
- `text`
- `tone`
- `confidence`
- `modelName?`
- `providerName?`
- `error?`

### 5.2 ProviderConfig
Provider 配置：
- `id`
- `type`
- `name`
- `apiKey`
- `baseUrl?`
- `headers?`
- `models`
- 以及部分 provider 专属字段，如 `accountId`

### 5.3 AppSettings
应用配置：
- `providers: ProviderConfig[]`
- `activeModelKey: string`
- `languageModels?: Record<string, string[]>`

其中：
- `activeModelKey` 格式：`${providerId}:${modelId}`
- `languageModels` 表示“某个目标语言绑定哪些模型”

这说明该产品的核心不是“一个默认模型翻所有语言”，而是：
- 全局有一个默认模型
- 每个语言可以覆盖默认模型
- 每个语言还可以绑定多个模型，形成多结果对比

## 6. 当前应用主流程

主流程集中在 `src/App.tsx`。

### 6.1 启动阶段
应用启动后会做几件事：
1. 从 localStorage 读取目标语言列表
2. 从 localStorage 读取设置
3. 支持旧版设置迁移：
   - `ai-translator-settings-v2`（明文）
   - 迁移到 `ai-translator-settings-v3`（加密）
4. 将设置持久化回浏览器本地

### 6.2 翻译阶段
`handleTranslate()` 是核心流程：

1. 校验输入文本不能为空
2. 校验当前是否存在可用模型
3. 收集当前所有启用模型
4. 按目标语言构建任务列表 `tasks`
   - 如果该语言绑定了多个模型，则为每个模型创建一个任务
   - 如果未单独绑定，则使用默认模型
5. 为每个 `(language, model)` 创建独立的翻译 Promise
6. 调用 `translateText()` 发起请求
7. 每个结果返回后立即 append 到 UI（渐进式更新）
8. 所有任务完成后将状态设为 `SUCCESS`

### 6.3 结果展示阶段
- 按语言分组
- 若某个语言只有一个结果，显示单卡片
- 若某个语言有多个模型结果，显示组卡片 + 多结果列表
- 支持结果复制、朗读、隐藏/展开

结论：这是“并发翻译 + 渐进渲染”模式，而不是等待所有结果一次性展示。

## 7. 当前 LLM 调用设计

核心文件：`src/services/llmService/index.ts`

### 7.1 Prompt 设计
系统提示词要求模型返回严格 JSON 数组，字段包括：
- 目标语言名
- ISO 语言码
- 翻译文本
- 语气
- 置信度

### 7.2 响应处理
调用 `generateText()` 后：
- 先拿到纯文本响应
- 移除 `<think>...</think>` 推理内容
- 截取最外层 JSON 数组
- `JSON.parse()` 解析为 `TranslationResult[]`

### 7.3 超时策略
- 默认请求超时：30 分钟
- 可通过 `VITE_REQUEST_TIMEOUT_MS` 配置

## 8. 当前 Provider 抽象

核心文件：`src/services/llmService/providers.ts` 与 `src/config/models.ts`

### 8.1 两层抽象
- `PROVIDER_DEFINITIONS`：负责 UI 展示与默认配置
- `createModel(provider, modelId)`：负责实例化具体模型

### 8.2 Provider 覆盖范围
内置支持：
- Google Gemini
- OpenAI
- Anthropic
- DeepSeek
- Mistral
- xAI
- Cohere
- Groq
- Together AI
- Fireworks AI
- DeepInfra
- Perplexity
- Cerebras
- Ollama
- 智谱 AI
- Cloudflare Workers AI
- OpenRouter
- 多个 `custom` 预设（Kimi / Qwen / MiniMax / Baichuan / Doubao / Custom Provider）

### 8.3 OpenAI 兼容策略
对于 `openai` 和 `custom`：
- 统一调用 `createOpenAI(...)`
- 使用 `openai.chat(modelId)` 而不是默认 Responses API

## 9. 当前错误处理设计

核心文件：`src/services/llmService/safeFetch.ts`

它解决的是：某些 AI Provider 会返回 HTTP 200，但 body 里其实是错误对象。

处理方式：
- 包装原始 `fetch`
- 解析响应 body
- 识别错误结构
- 主动转成 HTTP 400 风格响应

收益：
- 避免 SDK 误判成功
- 减少无意义重试
- 给用户更清晰的错误信息

## 10. 当前配置管理

核心文件：`src/components/SettingsModal.tsx`、`src/components/settings/EditProviderView.tsx`、`src/services/configIO.ts`

### 10.1 支持的设置能力
- 添加 / 编辑 / 删除 Provider
- 手动添加模型
- 从 `/models` 接口拉取模型
- 导出配置
- 导入配置
- 导入时支持“合并”或“覆盖”

### 10.2 模型获取逻辑
在 `EditProviderView.tsx` 中：
- 当用户填写 `baseUrl + apiKey`
- 前端请求 `${baseUrl}/models`
- 假设返回 OpenAI 兼容格式：`{ data: [{ id }] }`
- 用户可勾选并批量导入模型

### 10.3 导入 / 导出逻辑
在 `configIO.ts` 中：
- 导出配置为 `.prism` 文件
- 内容是加密后的 JSON
- 导入支持加密 `.prism` 和明文 `.json`
- 冲突判断规则：`provider.type + provider.name`
- 合并策略：保留旧 provider 配置，补充新模型

## 11. 当前本地存储与安全边界

核心文件：`src/services/crypto.ts`

### 11.1 做了什么
- 使用 PBKDF2 派生密钥
- 使用 AES-CBC + PKCS7 对配置做加密
- 使用 `PRISM_ENC_V1:` 前缀标识加密格式

### 11.2 实际安全边界
它更像“防止明文直接暴露”，不是严格密钥安全：
- 密钥材料硬编码在前端代码里
- 浏览器端仍可读到运行时数据
- 不适合作为真正的企业级密钥保护方案

## 12. 当前 UI / 交互特征

从 `TranslationInput.tsx`、`TranslationGroup.tsx`、`SettingsModal.tsx` 可见：
- 左侧输入，右侧结果
- 移动端改为纵向布局
- 每个目标语言可单独绑定多个模型
- 结果卡片支持复制、朗读、隐藏、长文本折叠
- 翻译中显示 skeleton
- 结果渐进式展示

整体上更像“专业翻译比较面板”，不是聊天式翻译器。

## 13. 当前国际化情况

UI 多语言资源包括：
- ar / en / es / ja / ko / my / pt / ru / tr / vi / zh / zh-TW

说明：
- “界面语言”和“翻译目标语言”是两套体系
- i18n locale 数量不等于目标语言支持数

## 14. 当前项目优点

- 产品定位明确：多模型翻译对比，而不是单模型翻译
- Provider 抽象统一，扩展性较好
- 配置能力强：多 provider / 多模型 / 导入导出 / baseUrl 自定义
- 兼容性意识强：处理 `<think>`、OpenAI-compatible、异构错误格式
- 纯前端部署简单

## 15. 当前主要风险 / 问题

### 15.1 前端直连 Provider，密钥暴露风险高
即使加密，API Key 仍然在浏览器端使用，不适合企业级场景。

### 15.2 解析高度依赖模型按 Prompt 返回 JSON
如果模型格式不稳定，解析容易失败。

### 15.3 错误处理偏经验型
`safeFetch` 靠规则识别错误体，后续可能需要持续补洞。

### 15.4 多模型并发较多
如果目标语言和模型数都多，一次会发很多并发请求，可能触发：
- 限流
- 成本飙升
- 浏览器端卡顿

### 15.5 `App.tsx` 过重
承担了设置加载、迁移、持久化、任务编排、结果更新等多种职责，后续建议拆分。

## 16. 为了达成纲领和目标需要满足的要求

为了让 Prism Translate 真正达成“多模型翻译比较工作台”的纲领目标，系统至少需要满足以下要求。

### 16.1 必须满足的产品要求

#### 1）必须具备真实的多模型比较能力
- 同一输入文本可以同时请求多个模型。
- 同一目标语言下可以展示多个模型结果。
- 每个结果都必须带有足够的比较上下文，如模型名、Provider 名、语气、置信度。
- 结果顺序必须稳定，用户才能快速做肉眼比对。

#### 2）必须支持按语言维度精细配置
- 每个目标语言可以绑定不同模型。
- 每个目标语言可以绑定多个模型。
- 在未单独配置时，系统可回退到全局默认模型。
- 目标语言配置不能与 UI 界面语言强耦合。

#### 3）必须支持多 Provider 灵活接入
- 官方 Provider 必须能直接接入。
- OpenAI-compatible Provider 必须有统一接入方式。
- 本地模型（如 Ollama）必须能接入，否则“低门槛 + 自主可控”目标不完整。
- 应允许用户配置自定义 Base URL，以支持代理、网关、企业中转层。

#### 4）必须具备可工作的结果展示体验
- 结果要渐进返回、渐进渲染，而不是全部等待完成。
- 长文本要可折叠 / 展开。
- 结果要支持复制、隐藏、复看。
- 多模型结果要按语言和任务顺序稳定展示，不能随机抖动。

#### 5）必须具备基础稳定性
- 单个请求失败不能拖垮整次翻译。
- Provider 伪成功（HTTP 200 但 body 实为错误）要能识别。
- 模型输出不规范 JSON 时要有清洗与兜底。
- 必须有超时控制，避免请求无限挂起。

### 16.2 必须满足的工程要求

#### 1）必须有统一的 Provider 抽象
- Provider 定义层：负责名称、图标、默认模型、默认 Base URL 等静态元数据。
- Provider 实例化层：负责把配置转换为真实 SDK model。
- 调用编排层：负责把业务任务拆解成一组 `(language, model)` 任务。
- 展示层：只关心状态与结果，不直接承担 provider 逻辑。

#### 2）必须有可迁移的配置体系
- 配置必须能持久化。
- 配置版本升级必须可迁移。
- 配置必须支持导入导出。
- 导入时必须支持冲突处理，而不是简单覆盖一切。

#### 3）必须控制复杂度扩散
- 新增 Provider 时，应有固定改动路径。
- 新增模型能力时，应尽量不修改主界面核心流程。
- 业务逻辑不能长期堆积在 `App.tsx` 中，否则后期维护成本会陡增。

#### 4）必须对并发和成本有治理意识
- 多语言 × 多模型场景下，请求数量会快速膨胀。
- 架构必须允许未来加入并发上限、节流、退避重试、缓存策略。
- 如果没有这层设计，比较能力越强，失败率和成本越容易失控。

### 16.3 应该满足的体验要求

#### 1）配置要资产化
- 用户配置不仅能“存在浏览器里”，还应能迁移、备份、复用。
- 用户接入多个 Provider 后，这些配置本身就是工作资产。

#### 2）部署要足够轻量
- 本地开发启动简单。
- 静态部署简单。
- 不依赖复杂后端就能跑通主流程。

#### 3）体验要服务真实工作流
- 这个产品不是聊天玩具。
- 它服务的是文案、本地化、跨语言协作、内容生产等真实场景。
- 所有设计都应优先服务“比较、筛选、复用结果”的操作闭环。

### 16.4 后续成熟化必须补齐的要求

#### 1）更强的结构化输出能力
- 未来应优先采用 schema / structured output，而不是继续依赖“从文本中抠 JSON”。

#### 2）更强的比较辅助能力
- 高亮模型间差异。
- 标注术语一致性。
- 辅助判断哪个版本更正式 / 更自然 / 更简洁。

#### 3）更强的安全与治理能力
- 纯前端加密不能视为真正密钥安全。
- 若进入团队 / 企业场景，需要后端代理、统一鉴权、限流、缓存、日志与审计。

#### 4）更强的可维护性
- 应将设置加载、配置持久化、翻译任务编排、结果排序、结果聚合逐步拆分成独立模块或 hooks。

### 16.5 一句话验收标准

如果把这些要求压缩成一句话，那么这个产品要证明自己不是 demo，而是可靠工具，就必须做到：

- 能比
- 好比
- 好配
- 能扩
- 跑得稳
- 边界清楚

## 17. 当前项目骨架观察

从当前目录结构看，这个项目的骨架特征是：

- 以单页应用为中心
- 以 `App.tsx` 作为页面总控
- 以 `components/` 组织主要界面
- 以 `services/` 组织配置、加密、LLM 调用逻辑
- 以 `config/` 组织 provider 静态定义
- 以 `types.ts` 承担核心类型定义

当前骨架的优点：
- 小项目上手快
- 目录直观
- 主要逻辑集中，阅读成本低

当前骨架的问题：
- `App.tsx` 过重
- translation 与 settings 两块业务尚未形成清晰 feature 分层
- domain 与 infrastructure 逻辑有混合趋势
- 当前结构更适合“小而快”，不完全适合长期演进

## 18. 对当前项目骨架的要求

如果继续沿着当前项目方向迭代，那么当前骨架至少应满足这些要求：

### 18.1 必须围绕业务能力组织，而不是只围绕文件类型
- 翻译能力应逐渐形成独立边界。
- 设置能力应逐渐形成独立边界。
- 核心业务不应长期仅靠 `components/ + services/ + App.tsx` 混合承载。

### 18.2 必须让“多模型比较”成为骨架中心
- 一个输入应被系统视为可展开为多个任务。
- 一个语言应天然支持多个模型结果。
- 结果聚合、排序、分组必须成为一等能力，而不是临时 UI 处理。

### 18.3 必须让 Provider 扩展有稳定入口
- 新增 provider 时，至少应有清晰的配置定义入口、实例化入口、设置入口。
- 不应依赖全项目散点修改来接入新 provider。

### 18.4 必须让配置管理成为独立能力
- 设置持久化、设置迁移、导入导出、冲突处理都应视为正式能力。
- 不应把这些能力完全埋进设置弹窗组件内部。

### 18.5 必须把任务编排与结果展示分开
- 任务生成、并发执行、状态跟踪应逐步和 UI 展示分离。
- 否则随着功能增长，页面主组件会继续膨胀。

### 18.6 必须为未来演进保留空间
- 当前可以纯前端运行。
- 但结构上应允许未来替换为代理后端，而不是把浏览器直连 Provider 的方式写死在上层界面里。

### 18.7 必须有稳定的数据模型
- ProviderDefinition
- ProviderConfig
- ModelDefinition
- AppSettings
- TranslationResult

这些对象应持续保持统一，不应让不同模块各自长出一套字段体系。

## 19. 对后续文档的边界说明

为了避免文档混淆，后续建议保持三类文档边界：

### 19.1 `PROJECT_ANALYSIS.md`
只放：
- 当前项目现状
- 当前项目结构
- 当前问题
- 当前要求

### 19.2 `TARGET_ARCHITECTURE.md`
放：
- 推荐目标架构
- 推荐项目骨架
- 推荐模块分层
- 推荐未来目录重组方案

### 19.3 `ROADMAP.md`（可选）
放：
- 改造顺序
- Phase 1 / 2 / 3
- 里程碑与优先级

## 20. 关键文件清单

- `src/App.tsx`
- `src/types.ts`
- `src/constants.ts`
- `src/config/models.ts`
- `src/services/crypto.ts`
- `src/services/configIO.ts`
- `src/services/llmService/index.ts`
- `src/services/llmService/providers.ts`
- `src/services/llmService/safeFetch.ts`
- `src/components/SettingsModal.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/TranslationInput.tsx`
- `src/features/translation/components/TranslationGroup.tsx`

## 21. 相关文档建议

建议形成以下文档体系：
- `PROJECT_ANALYSIS.md`：当前项目总结与要求
- `TARGET_ARCHITECTURE.md`：目标架构与目标骨架建议
- `ROADMAP.md`：演进路线图（可选）

后面生成 `AGENT.md` 时，可以同时参考以上文档。
