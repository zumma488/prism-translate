[English](./README.md) | **简体中文**

# `src/entities/settings/`

## 模块定位

这里记录 settings 相关的稳定领域模型，供 settings 工作流、导入导出和持久化逻辑共享。

## 当前职责

这里计划覆盖的概念包括：
- `AppSettings`
- `ActiveModelKey`
- `LanguageModelBindings`
- 导入导出 payload
- settings migration state

## 非职责范围

这里不应直接承载：
- settings UI 行为
- localStorage 实现细节
- Provider API 调用

## 当前代码映射

当前实现主要仍位于：
- `src/types.ts`
- `src/services/configIO.ts`
- 浏览器存储相关的 settings 工具

## 相邻模块关系

- `../../features/settings/` 使用这些概念。
- `../../services/` 承载 config IO 与持久化辅助逻辑。

## 阅读建议

- entities 总览：`../README.md` 或 `../README.zh.md`
- settings feature：`../../features/settings/README.md` 或 `../../features/settings/README.zh.md`
