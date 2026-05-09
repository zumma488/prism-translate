[English](./README.md) | **简体中文**

# `src/features/provider-management/`

## 模块定位

`src/features/provider-management/` 负责 Provider 生命周期规则、接入说明，以及 Provider 元数据、settings 流程和 Provider 管理行为之间的协同边界。

## 当前职责

这个模块当前覆盖：
- Provider 类型与实例配置之间的连接
- Provider 接入规则
- 新增 Provider 时的相关入口与约束
- Provider settings UI 与模型拉取流程之间的协同

## 非职责范围

这个模块不应直接承载：
- 翻译结果展示
- 页面级编排
- 底层 fetch 或 Provider SDK 实现

## 当前代码映射

当前行为仍分散在：
- `src/config/models.ts`
- `src/components/settings/EditProviderView.tsx`
- `src/services/llmService/providers.ts`
- `src/features/provider-management/services/`

## 相邻模块关系

- `../settings/` 负责 settings 状态与配置流程。
- `../../config/` 负责静态 Provider 元数据。
- `../../services/llmService/` 负责底层 Provider / model 对接。
- `../../entities/provider/` 记录 Provider 相关稳定模型。

## 阅读建议

- provider-management services：`./services/README.md` 或 `./services/README.zh.md`
- settings feature：`../settings/README.md` 或 `../settings/README.zh.md`
- config 元数据：`../../config/README.md` 或 `../../config/README.zh.md`
