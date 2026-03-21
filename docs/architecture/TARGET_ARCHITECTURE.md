# Prism Translate 目标架构与目标骨架建议

## 1. 文档定位

本文档不描述“当前项目已经是什么”，而描述：

1. 为了达成 Prism Translate 的纲领目标，项目 **应该演进成什么样**
2. 推荐采用什么样的 **技术架构、项目骨架、模块边界与演进方向**

它是目标态文档，不是现状总结文档。

- 当前现状、当前问题、当前要求 → 见 `PROJECT_ANALYSIS.md`
- 目标架构、推荐骨架、未来模块分层 → 见本文档

## 2. 目标架构总原则

目标架构的核心原则只有一句：

> 让“多模型翻译比较”成为系统的第一原则，并围绕输入、任务编排、Provider 接入、结果聚合、配置沉淀建立清晰、可扩展、可治理的分层结构。

进一步展开为以下原则：

1. 多模型比较是一等公民，而不是附加能力。
2. Provider 接入必须统一抽象。
3. 配置管理必须成为独立能力。
4. 任务编排与结果展示必须解耦。
5. 当前可保持纯前端，但必须为后端代理化预留空间。
6. 核心实体必须稳定、统一、可复用。

## 3. 推荐总体技术架构

推荐的目标架构可以分为 6 层：

### 3.1 UI Layer
职责：
- 输入与交互
- 结果展示
- 比较界面
- 配置入口

### 3.2 Page Orchestration Layer
职责：
- 组装页面
- 连接 feature
- 控制页面级状态流转

### 3.3 Feature Layer
职责：
- translation feature：负责翻译工作流
- settings feature：负责配置工作流
- provider-management feature：负责 provider 扩展工作流

### 3.4 Domain Layer
职责：
- 定义 Provider、Model、Task、Result、Settings 等核心实体
- 定义排序、聚合、分组、冲突合并等业务规则

### 3.5 Infrastructure / Integration Layer
职责：
- LLM SDK 接入
- safeFetch
- 本地存储
- 加密解密
- 浏览器剪贴板 / 语音能力

### 3.6 External Layer
职责：
- 各类 AI Provider API
- Ollama
- 浏览器运行时
- 未来可选的代理后端

## 4. 推荐项目骨架

```text
prism-translate/
├─ docs/
│  ├─ architecture/
│  │  ├─ PROJECT_ANALYSIS.md
│  │  ├─ TARGET_ARCHITECTURE.md
│  │  ├─ AGENT.md
│  │  └─ ROADMAP.md
│  └─ images/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  ├─ providers/
│  │  └─ router/
│  ├─ pages/
│  │  ├─ translator/
│  │  └─ settings/
│  ├─ features/
│  │  ├─ translation/
│  │  ├─ settings/
│  │  └─ provider-management/
│  ├─ entities/
│  │  ├─ provider/
│  │  ├─ translation/
│  │  └─ settings/
│  ├─ shared/
│  │  ├─ components/
│  │  ├─ ui/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ constants/
│  │  └─ types/
│  ├─ integrations/
│  │  ├─ llm/
│  │  ├─ storage/
│  │  └─ browser/
│  ├─ config/
│  ├─ i18n/
│  ├─ styles/
│  └─ tests/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## 5. 推荐模块边界

### 5.1 `features/translation/`
职责：
- 文本输入与触发翻译
- 目标语言管理
- TranslationTask 生成
- 并发翻译执行
- 结果排序、分组、聚合
- 多模型比较展示

建议模块：
- `buildTranslationTasks.ts`
- `runTranslationTasks.ts`
- `groupTranslationResults.ts`
- `sortTranslationResults.ts`
- `useTranslationRunner.ts`
- `useTranslationResults.ts`

### 5.2 `features/settings/`
职责：
- Provider 配置管理
- 模型管理
- 默认模型管理
- 配置导入导出
- 配置持久化与迁移

建议模块：
- `useAppSettings.ts`
- `useSettingsPersistence.ts`
- `settingsMigration.ts`
- `settingsMerge.ts`
- `providerModelFetch.ts`

### 5.3 `entities/`
职责：
- 提供系统稳定的核心数据模型

建议实体：
- `ProviderDefinition`
- `ProviderConfig`
- `ModelDefinition`
- `AppSettings`
- `TranslationTask`
- `TranslationResult`
- `LanguageConfig`

### 5.4 `integrations/llm/`
职责：
- 模型实例化
- SDK 调用包装
- safeFetch
- 响应解析
- 未来 structured output 能力

## 6. 目标数据流设计

### 6.1 翻译执行流

```text
Input Text
  ↓
Resolve Languages
  ↓
Resolve Models Per Language
  ↓
Build TranslationTask[]
  ↓
Execute Tasks (parallel / controlled concurrency)
  ↓
Normalize Results
  ↓
Sort + Group Results
  ↓
Render Comparison UI
```

### 6.2 配置流

```text
User Edits Settings
  ↓
Validate Config
  ↓
Persist Config
  ↓
Encrypt for Local Storage
  ↓
Hydrate Runtime State
```

## 7. 目标非功能要求

### 7.1 性能
- 结果必须渐进展示
- 要支持未来加入并发上限
- 大量任务下不能导致明显 UI 卡顿

### 7.2 可靠性
- 单任务失败隔离
- Provider 异常返回识别
- 超时控制
- 未来支持 retry / backoff

### 7.3 可扩展性
- 新增 provider 的改动路径应固定
- 新增比较维度不应重写展示层
- 新增排序规则不应改散多个组件

### 7.4 安全边界
- 当前可允许浏览器端配置密钥
- 但目标架构必须允许未来切换到代理后端
- LLM 接入不能把浏览器直连写死在 UI 层

## 8. 推荐演进方向

### Phase 1：整理当前前端结构
- 拆分 `App.tsx`
- 提炼 translation / settings 两大 feature
- 引入稳定的 TranslationTask 概念

### Phase 2：增强比较体验
- 差异高亮
- 术语一致性分析
- 最佳结果辅助判断
- 成本 / 延迟展示

### Phase 3：增强治理能力
- 并发控制
- retry / backoff
- provider 健康状态
- 更稳定的输出解析机制

### Phase 4：引入代理后端（可选）
- API Key 不暴露浏览器
- 统一限流、缓存、鉴权、日志审计

## 9. 目标架构结论

Prism Translate 的目标架构，不应只是“把当前代码拆碎”，而应围绕其纲领目标形成清晰中心：

> 一个输入，被展开为多个面向不同语言和模型的翻译任务；这些任务通过统一的 Provider 抽象层执行，经由稳定的结果聚合与比较机制反馈给用户；配置作为正式资产被管理；系统在当前纯前端可运行的前提下，为未来的治理化与后端代理化预留演进空间。
