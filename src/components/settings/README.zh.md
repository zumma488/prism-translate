[English](./README.md) | **简体中文**

# `src/components/settings/`

## 模块定位

这里承载当前 settings 工作流中可复用的设置视图组件。

## 当前职责

当前文件包括：
- `ConnectProviderView.tsx`
- `EditProviderView.tsx`
- `ManageModelsView.tsx`

这些组件负责：
- Provider 连接 UI
- Provider 编辑 UI
- 模型拉取与选择 UI
- OpenAI 与兼容 Provider 的协议选择 UI

## 非职责范围

这里不应直接承载：
- settings 迁移逻辑
- 导入导出核心规则
- Provider SDK 对接

## 当前代码映射

这个目录目前仍是 settings 流程的重要实现中心之一，与 `src/features/settings/` 并行存在。

## 相邻模块关系

- `../../features/settings/` 负责 settings 工作流边界。
- `../../features/provider-management/` 负责 Provider 管理规则。
- `../../services/` 负责共享配置基础设施。

## 阅读建议

- components 总览：`../README.md` 或 `../README.zh.md`
- settings feature：`../../features/settings/README.md` 或 `../../features/settings/README.zh.md`
- provider management：`../../features/provider-management/README.md` 或 `../../features/provider-management/README.zh.md`
