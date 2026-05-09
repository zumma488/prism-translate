[English](./README.md) | **简体中文**

# `src/i18n/`

## 模块定位

`src/i18n/` 负责界面国际化资源与初始化逻辑。

## 当前职责

这个目录当前负责：
- UI locale 资源管理
- 界面语言切换支持
- 区分界面语言与翻译目标语言这两套概念

## 非职责范围

这个目录不应直接承载：
- 翻译结果内容
- Provider / model 逻辑
- settings 持久化规则

## 当前代码映射

这里承载应用 UI 使用的前端 i18n 初始化与资源配置。

## 相邻模块关系

- `../components/` 消费这里提供的界面文案。
- `../features/translation/` 依赖“界面语言”和“翻译目标语言”的区分。

## 阅读建议

- components：`../components/README.md` 或 `../components/README.zh.md`
- translation feature：`../features/translation/README.md` 或 `../features/translation/README.zh.md`
