[English](./README.md) | **简体中文**

# `src/features/translation/hooks/`

## 模块定位

这里用于承载 translation feature 下的 React hooks，主要负责状态编排与可复用工作流逻辑。

## 当前职责

当前 hooks 包括：
- `usePersistedTargetLanguages.ts`
  - 目标语言读取与持久化协同
- `useTranslationRunner.ts`
  - 翻译执行状态
  - 渐进式任务视图与结果收集
  - 增量目标语言执行决策
  - 翻译流程中的错误分发

## 非职责范围

这里不应直接承载：
- 最终 UI 渲染
- 底层 Provider 请求代码
- 全局 settings 管理

## 当前代码映射

这些 hooks 与以下模块协作：
- `../components/` 负责界面渲染
- `../services/` 负责 translation 业务逻辑
- `../../../services/llmService/` 负责实际 Provider / model 执行

## 相邻模块关系

- `../components/` 渲染这里管理的状态。
- `../services/` 提供任务生成、分组和执行辅助逻辑。

## 阅读建议

- translation 总览：`../README.md` 或 `../README.zh.md`
- translation components：`../components/README.md` 或 `../components/README.zh.md`
- translation services：`../services/README.md` 或 `../services/README.zh.md`
