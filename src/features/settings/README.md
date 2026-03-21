# settings feature 说明

## 模块定位

`src/features/settings/` 负责承载 Provider 配置、模型管理、默认模型管理、配置导入导出、配置持久化与迁移相关的业务能力。

## 文档层级

- 当前层级：模块级 / features.settings
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
  - `../../../docs/architecture/PROJECT_ANALYSIS.md`
- 下级文档：
  - 未来可补：`./components/README.md`
  - 未来可补：`./hooks/README.md`
  - 未来可补：`./services/README.md`
- 平级相关文档：
  - `../translation/README.md`
  - `../provider-management/README.md`
  - `../../services/README.md`
  - `../../components/README.md`
  - `../../entities/settings/README.md`

## 模块职责

这个模块应负责：
- Provider 的新增、编辑、删除
- 模型列表管理
- 默认模型与语言绑定模型管理
- 配置导入导出
- 配置迁移与持久化
- 配置冲突处理

## 非职责范围

这个模块不应直接负责：
- 具体翻译结果展示
- LLM 底层请求适配
- 页面主入口编排

## 当前代码映射

在当前项目实现里，这部分职责主要分散在：
- `src/components/SettingsModal.tsx`
- `src/components/settings/EditProviderView.tsx`
- `src/components/settings/ConnectProviderView.tsx`
- `src/components/settings/ManageModelsView.tsx`
- `src/services/configIO.ts`
- `src/services/crypto.ts`
- `src/App.tsx`

## 核心数据流

```text
用户进入设置
  ↓
编辑 provider / model / 默认模型配置
  ↓
执行保存
  ↓
配置持久化到 localStorage
  ↓
必要时执行加密 / 迁移 / 导入导出
```

## 实现约束

- SettingsModal 应逐步退化为 UI 外壳，而不是承载全部配置逻辑。
- 配置持久化、迁移、合并策略应逐步独立。
- 配置能力应视为正式业务能力，而不是附属弹窗功能。

## 阅读建议

- 想看当前设置 UI → `../../components/README.md`
- 想看配置持久化与加密 → `../../services/README.md`
- 想看目标态边界 → `../../../docs/architecture/TARGET_ARCHITECTURE.md`
