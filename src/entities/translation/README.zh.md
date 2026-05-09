[English](./README.md) | **简体中文**

# `src/entities/translation/`

## 模块定位

这里记录 translation 相关的稳定领域模型，供翻译 UI、编排逻辑和结果处理共享。

## 当前职责

这里计划覆盖的概念包括：
- `TranslationTask`
- `TranslationResult`
- translation 分组结构
- translation 执行状态
- 语言绑定关系

## 非职责范围

这里不应直接承载：
- 结果卡片渲染
- 底层 Provider 执行
- settings 持久化逻辑

## 当前代码映射

当前实现主要仍位于：
- `src/types.ts`
- `src/constants.ts`
- `src/App.tsx`

## 相邻模块关系

- `../../features/translation/` 使用这些概念。
- `../../services/` 以及 API / server 边界负责执行基于这些概念的工作流。

## 阅读建议

- entities 总览：`../README.md` 或 `../README.zh.md`
- translation feature：`../../features/translation/README.md` 或 `../../features/translation/README.zh.md`
