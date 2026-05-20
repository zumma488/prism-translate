[English](./README.md) | **简体中文**

# `src/features/settings/hooks/`

## 模块定位

这里承载 settings feature 下的 React hooks，负责状态管理与工作流编排。

## 当前职责

当前 hooks 包括：
- `useAppSettings`
  - settings 加载
  - 持久化触发
  - active model 选择
  - active model 规范化
  - language-model 绑定更新
- `useSettingsImportExport`
  - 导入导出流程
  - 导入冲突确认状态
  - 导入导出反馈
- `useSettingsModalNavigation`
  - modal 内部导航
  - 移动端返回行为
- `useSettingsProviderEditing`
  - Provider 新增/编辑上下文
  - Provider 保存/删除动作
  - 编辑页初始状态解析

## 非职责范围

这里不应直接承载：
- 最终 settings 视图渲染
- 底层 config IO 实现
- translation 执行逻辑

## 当前代码映射

这些 hooks 与以下模块协作：
- `../components/` 负责渲染
- `../services/` 负责 settings 业务逻辑
- `../../../services/` 负责共享配置基础设施

## 相邻模块关系

- `../components/` 渲染这里管理的流程。
- `../services/` 承载面向持久化的业务服务。

## 阅读建议

- settings 总览：`../README.md` 或 `../README.zh.md`
- settings services：`../services/README.md` 或 `../services/README.zh.md`
- 共享 services：`../../../services/README.md` 或 `../../../services/README.zh.md`
