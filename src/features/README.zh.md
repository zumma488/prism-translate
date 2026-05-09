[English](./README.md) | **简体中文**

# `src/features/`

## 模块定位

`src/features/` 是业务能力层，按业务场景而不是按文件类型组织前端代码，是当前仓库中最核心的前端业务边界之一。

## 当前职责

这个层级当前聚合：
- `translation/`：翻译工作流与对比行为
- `settings/`：Provider 设置、模型管理、导入导出和面向持久化的状态
- `provider-management/`：Provider 接入与管理规则

它已经是实际存在的文档与代码边界，只是部分实现仍分散在旧目录中。

## 非职责范围

`src/features/` 不应直接承载：
- 底层 Provider SDK 对接
- 通用 crypto 与 config IO 工具
- App Router 路由定义
- 纯展示型基础 UI 原语

这些应归属 `src/services/`、`server/`、`app/` 或 `src/components/ui/`。

## 当前代码映射

主要子模块：
- `./translation/`
- `./settings/`
- `./provider-management/`

仍与以下位置共享部分职责：
- `../components/`
- `../services/`
- `../config/`
- `../types.ts`
- `../constants.ts`

## 相邻模块关系

- `../components/` 承载可复用 UI 和尚未完全迁移的业务 UI。
- `../services/` 提供 feature 依赖的共享基础设施。
- `../entities/` 定义 feature 共用的稳定领域模型。

## 阅读建议

- Translation 工作流：`./translation/README.md` 或 `./translation/README.zh.md`
- Settings 工作流：`./settings/README.md` 或 `./settings/README.zh.md`
- Provider 管理：`./provider-management/README.md` 或 `./provider-management/README.zh.md`
