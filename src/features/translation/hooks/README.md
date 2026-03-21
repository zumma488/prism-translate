# translation hooks 说明

## 文档层级

- 当前层级：子模块级 / features.translation.hooks
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../components/README.md`
  - `../services/README.md`
  - `../../../services/llmService/README.md`

## 模块定位

这里用于沉淀 translation feature 下的可复用状态编排逻辑和业务 hooks。

## 应承载的内容

未来这里应放：
- `useTranslationRunner`
- `useTranslationResults`
- `useLanguageBindings`
- `useTranslationState`

## 约束

- 页面级和组件级状态编排应逐步从 `App.tsx` 中抽离到这里。
- hooks 负责组织业务状态，不直接承担最终 UI 呈现。
