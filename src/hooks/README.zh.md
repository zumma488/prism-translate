[English](./README.md) | **简体中文**

# `src/hooks/`

## 模块定位

`src/hooks/` 承载不明显归属于单一 feature、可被多个区域复用的共享 React hooks。

## 当前职责

这个目录适合放：
- 跨 feature 复用的 hooks
- 通用 UI 状态 hooks
- 仍属于 React 适配层的浏览器能力 hooks

## 非职责范围

这个目录不应成为以下内容的长期归宿：
- translation 专属业务 hooks
- settings 专属业务 hooks

这些应归属对应的 feature 目录。

## 当前代码映射

这个目录是共享 hooks 层，位于 `src/lib/` 与 feature 专属 hooks 之间。

## 相邻模块关系

- `../features/` 负责 feature 专属 hooks。
- `../lib/` 负责非 React 的通用工具。
- `../components/` 消费共享 UI hooks。

## 阅读建议

- features 总览：`../features/README.md` 或 `../features/README.zh.md`
- lib 工具：`../lib/README.md` 或 `../lib/README.zh.md`
