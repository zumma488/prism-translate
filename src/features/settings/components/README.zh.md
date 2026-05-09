[English](./README.md) | **简体中文**

# `src/features/settings/components/`

## 模块定位

这里代表 settings feature 下的业务 UI 边界，用于承载直接面向用户的设置界面组件。

## 当前职责

当前主要实现仍位于：
- `src/components/SettingsModal.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`

这部分负责：
- settings UI 组合
- Provider 编辑流程
- Provider 连接流程
- 模型管理视图

## 非职责范围

这里不应直接承载：
- 配置迁移规则
- 导入导出核心逻辑
- 通用兼容性处理

## 当前代码映射

settings UI 当前仍横跨这个 feature 边界和 `src/components/settings/`。

## 相邻模块关系

- `../hooks/` 负责 settings 状态编排。
- `../services/` 负责 settings 业务服务。
- `../../../components/settings/` 仍承载当前可复用的 settings 视图实现。

## 阅读建议

- settings 总览：`../README.md` 或 `../README.zh.md`
- settings hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- 共享 settings UI：`../../../components/settings/README.md` 或 `../../../components/settings/README.zh.md`
