# ui components 说明

## 文档层级

- 当前层级：基础 UI 子模块级 / components.ui
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../settings/README.md`
  - `../../features/README.md`

## 模块定位

这里用于存放基础 UI 组件，主要承担视觉与交互基础设施作用，而不是具体业务语义。

## 模块职责

这里适合放：
- Button
- Dialog
- Popover
- Input
- Tabs
- Sheet
- 其他 shadcn/ui 基础组件

## 非职责范围

这里不应放：
- TranslationInput 这种有明确业务语义的组件
- SettingsModal 这种有明确业务边界的组件

这些应逐步归入对应 feature 或业务组件目录。
