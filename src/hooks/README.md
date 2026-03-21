# hooks 目录说明

## 模块定位

`src/hooks/` 是当前项目中的通用 hooks 目录，用于承载不明显属于单一 feature、但对多个区域可能复用的 React hooks。

## 文档层级

- 当前层级：通用能力层级 / hooks
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../features/README.md`
  - `../lib/README.md`
  - `../components/README.md`

## 模块职责

这里适合放：
- 跨多个 feature 可复用的 hooks
- 与通用 UI 状态相关的 hooks
- 与浏览器能力相关、但仍偏 React 适配层的 hooks

## 非职责范围

这里不适合长期放：
- 明显属于 translation feature 的业务 hooks
- 明显属于 settings feature 的业务 hooks

这些应逐步归入对应 feature 下的 `hooks/` 子目录。

## 阅读建议

- 看 feature 专属 hooks → `../features/README.md`
- 看通用工具 → `../lib/README.md`
