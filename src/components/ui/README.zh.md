[English](./README.md) | **简体中文**

# `src/components/ui/`

## 模块定位

这里承载基础 UI 原语和视觉基础设施。这些组件是通用构件，而不是带有明确业务语义的视图。

## 当前职责

这个目录适合放：
- buttons
- dialogs
- popovers
- inputs
- tabs
- sheets
- 其他 shadcn/ui 风格的基础组件

## 非职责范围

这里不应包含：
- 带业务语义的 translation 组件
- 带业务语义的 settings 视图
- feature 编排逻辑

## 当前代码映射

这是基础 UI 层，被 `src/components/` 与 `src/features/` 中的组件组合使用。

## 相邻模块关系

- `../settings/` 承载 settings 专属 UI。
- `../../features/` 承载业务模块并组合这些基础组件。

## 阅读建议

- components 总览：`../README.md` 或 `../README.zh.md`
- settings UI：`../settings/README.md` 或 `../settings/README.zh.md`
