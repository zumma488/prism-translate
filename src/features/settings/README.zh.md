[English](./README.md) | **简体中文**

# `src/features/settings/`

## 模块定位

`src/features/settings/` 负责 Provider 配置、模型管理、默认选择、导入导出以及面向持久化的 settings 状态。

## 当前职责

这个模块当前负责：
- Provider 的新增、编辑、删除
- 模型列表管理
- OpenAI 与兼容 Provider 的协议模式选择
- 默认模型选择与语言模型绑定
- settings 导入导出流程
- 持久化与迁移协同

## 非职责范围

这个模块不应直接承载：
- 翻译结果展示
- 底层 LLM 请求适配
- App Router 路由定义

## 当前代码映射

settings 相关实现当前分布在：
- `src/features/settings/components/`
- `src/features/settings/hooks/`
- `src/features/settings/services/`
- `src/components/SettingsModal.tsx`
- `src/components/settings/`
- `src/services/configIO.ts`
- `src/App.tsx`

## 相邻模块关系

- `../provider-management/` 负责 Provider 接入与管理规则。
- `../../services/` 负责 config IO、旧格式兼容辅助与共享基础设施。
- `../../entities/settings/` 记录稳定的 settings 领域模型。

## 阅读建议

- settings UI：`./components/README.md` 或 `./components/README.zh.md`
- settings hooks：`./hooks/README.md` 或 `./hooks/README.zh.md`
- settings services：`./services/README.md` 或 `./services/README.zh.md`
