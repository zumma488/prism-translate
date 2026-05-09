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

当前这里已开始承载：
- `useAppSettings`
  - settings 加载
  - settings 持久化触发
  - settings modal 开关状态
  - activeModelKey 选择
  - languageModels 绑定更新
- `useSettingsImportExport`
  - 配置导入导出流程
  - 导入冲突确认状态
  - 导入/导出 toast 反馈
- `useSettingsModalNavigation`
  - settings modal 内部视图切换
  - 移动端返回键行为编排
- `useSettingsProviderEditing`
  - provider 新增 / 编辑上下文
  - provider 保存 / 删除入口
  - 编辑页初始配置解析

未来这里继续放：
- `useProviderSettings`
- `useLanguageModelBindings`
- 更细粒度的 provider 表单状态 hooks

## 约束

- 设置状态与设置 UI 应逐步解耦。
- hooks 负责业务状态，不直接负责视图结构。
