# settings hooks 说明

## 文档层级

- 当前层级：子模块级 / features.settings.hooks
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../components/README.md`
  - `../services/README.md`
  - `../../../services/README.md`

## 模块定位

这里用于沉淀 settings feature 下的状态管理 hooks。

## 应承载的内容

未来这里应放：
- `useAppSettings`
- `useProviderSettings`
- `useLanguageModelBindings`
- `useSettingsPersistence`

## 约束

- 设置状态与设置 UI 应逐步解耦。
- hooks 负责业务状态，不直接负责视图结构。
