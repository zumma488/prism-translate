# provider-management feature 说明

## 模块定位

`src/features/provider-management/` 负责承接 Provider 生命周期相关的业务规则，包括 Provider 接入、Provider 元信息管理、模型拉取入口与 Provider 管理界面协同。

## 文档层级

- 当前层级：模块级 / features.provider-management
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：
  - 未来可补：`./services/README.md`
- 平级相关文档：
  - `../settings/README.md`
  - `../../config/README.md`
  - `../../services/README.md`
  - `../../entities/provider/README.md`

## 模块职责

这个模块应负责：
- Provider 类型与实例配置之间的衔接
- Provider 接入方式整理
- 新增 Provider 时的业务接入入口说明
- 模型拉取入口与 provider 设置界面的协同

## 非职责范围

这个模块不应直接负责：
- 翻译结果展示
- 页面主编排
- 最底层 fetch / SDK 调用细节

## 当前代码映射

当前项目里，这部分职责主要散落在：
- `src/config/models.ts`
- `src/components/settings/EditProviderView.tsx`
- `src/services/llmService/providers.ts`

## 实现约束

- 新增 Provider 的改动路径应尽量固定。
- Provider 管理和翻译结果展示不要直接耦合。
- Provider 元信息与底层实例化逻辑应保持分层。
