# settings components 说明

## 文档层级

- 当前层级：子模块级 / features.settings.components
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../hooks/README.md`
  - `../services/README.md`
  - `../../../components/settings/README.md`

## 模块定位

这里承载 settings feature 下直接面向用户的设置业务组件。

## 当前代码映射

当前对应实现主要还在：
- `src/components/SettingsModal.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`

## 约束

- 这里以设置 UI 和交互为主。
- 不应长期沉积完整配置迁移、导入导出、加密等底层逻辑。
