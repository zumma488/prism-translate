[English](./README.md) | **简体中文**

# `src/components/`

## 模块定位

`src/components/` 承载可复用 UI 组件，以及尚未完全迁移到 feature 目录中的页面级界面组件。

## 当前职责

这个目录当前包括：
- 翻译输入 UI
- settings modal UI
- 共享交互组件
- `ui/` 下的基础 UI 原语
- `settings/` 下的设置相关视图组件

## 非职责范围

这个目录不应成为以下内容的长期归宿：
- 底层 Provider 逻辑
- settings 持久化规则
- translation 编排服务

这些应归属 feature 或 service 层。

## 当前代码映射

代表性文件：
- `TranslationInput.tsx`
- `SettingsModal.tsx`
- `ModelSelectorPopover.tsx`
- `Header.tsx`
- `LanguageSwitcher.tsx`

## 相邻模块关系

- `../features/translation/` 负责 translation 业务行为。
- `../features/settings/` 负责 settings 状态与业务规则。
- `./settings/` 承载 settings 相关 UI。
- `./ui/` 承载基础 UI 原语。

## 阅读建议

- 基础 UI：`./ui/README.md` 或 `./ui/README.zh.md`
- settings UI：`./settings/README.md` 或 `./settings/README.zh.md`
- translation feature：`../features/translation/README.md` 或 `../features/translation/README.zh.md`
