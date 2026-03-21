# settings components 说明

## 文档层级

- 当前层级：组件子模块级 / components.settings
- 上级文档：
  - `../README.md`
  - `../../../src/features/settings/README.md`
- 下级文档：无
- 平级相关文档：
  - `../../services/README.md`
  - `../../features/provider-management/README.md`

## 模块定位

这里存放当前项目中与设置界面直接相关的组件，例如：
- `ConnectProviderView.tsx`
- `EditProviderView.tsx`
- `ManageModelsView.tsx`

## 当前职责

- 承接设置 UI 交互
- 展示 provider 编辑视图
- 承接模型拉取与选择交互

## 约束

- 这里应尽量承载界面行为，不应长期沉积完整配置领域逻辑。
- 配置迁移、导入导出、加密等能力应更多落到 settings feature / services 中。
