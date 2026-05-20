[English](./README.md) | **简体中文**

# `src/features/settings/components/`

## 模块定位

这里代表 settings feature 下的业务 UI 边界，用于承载直接面向用户的设置界面组件。

## 当前职责

当前实现已拆分为这里的路由设置页面客户端组件，以及 `src/components/settings/` 中仍在复用的旧视图。

这里的主要路由页面客户端组件包括：
- `SettingsShell.tsx`
- `SettingsPageHeader.tsx`
- `GeneralSettingsPageClient.tsx`
- `LanguageSettingsPageClient.tsx`
- `ProviderSettingsPageClient.tsx`
- `ProviderModelsPageClient.tsx`
- `ConnectProviderPageClient.tsx`
- `ProviderEditorPageClient.tsx`
- `AboutSettingsPageClient.tsx`
- `ExecutionModeSettingsCard.tsx`
- `FetchedModelsSelectionDialog.tsx`
- `ImportConflictDialog.tsx`
- `SettingsToast.tsx`

仍在兼容复用的视图与弹窗包括：
- `src/components/SettingsModal.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`

这部分负责：
- settings UI 组合
- `/settings/general`、`/settings/languages`、`/settings/providers`、`/settings/about` 的路由设置壳层
- Provider 列表与导航流程
- 选择提供商、新建/编辑提供商的页面流程
- 模型管理视图
- 执行模式选择界面
- 拉取模型选择弹窗与导入导出反馈界面
- 移动端 settings 壳层导航与 Sheet 无障碍标题接线

## 非职责范围

这里不应直接承载：
- 配置迁移规则
- 导入导出核心逻辑
- 通用兼容性处理

## 当前代码映射

settings UI 当前仍横跨这个 feature 边界和 `src/components/settings/`。当前整体路由流已是“settings 壳层 -> general/languages/providers/about”，其中 Provider 子流程为“列表 -> 选择提供商 -> 新建/编辑 -> 模型管理”。

## 相邻模块关系

- `../hooks/` 负责 settings 状态编排。
- `../services/` 负责 settings 业务服务。
- `../../../components/settings/` 仍承载当前可复用的 settings 视图实现。

## 阅读建议

- settings 总览：`../README.md` 或 `../README.zh.md`
- settings hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- 共享 settings UI：`../../../components/settings/README.md` 或 `../../../components/settings/README.zh.md`
