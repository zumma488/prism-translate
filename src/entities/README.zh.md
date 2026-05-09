[English](./README.md) | **简体中文**

# `src/entities/`

## 模块定位

`src/entities/` 记录项目中稳定、可复用、跨模块共享的核心领域模型。

## 当前职责

这个层级旨在定义和规范如下概念：
- Provider 相关模型
- settings 相关模型
- translation 相关模型

它已经是这些概念的文档边界，只是部分真实类型定义仍位于其他目录。

## 非职责范围

这个目录不应直接承载：
- UI 渲染
- Provider SDK 对接
- feature 工作流编排

## 当前代码映射

部分当前实现仍位于：
- `src/types.ts`
- `src/constants.ts`
- `src/config/models.ts`

## 相邻模块关系

- `../features/` 以这里的概念作为共享业务语言。
- `../services/` 在配置与执行逻辑中依赖这些模型。
- `../config/` 提供相关静态元数据。

## 阅读建议

- provider entities：`./provider/README.md` 或 `./provider/README.zh.md`
- settings entities：`./settings/README.md` 或 `./settings/README.zh.md`
- translation entities：`./translation/README.md` 或 `./translation/README.zh.md`
