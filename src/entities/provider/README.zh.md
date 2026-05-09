[English](./README.md) | **简体中文**

# `src/entities/provider/`

## 模块定位

这里记录 Provider 相关的稳定领域模型，供 provider-management、settings、config 和 services 共享。

## 当前职责

这里计划覆盖的概念包括：
- `ProviderDefinition`
- `ProviderConfig`
- `ProviderType`
- Provider capability metadata

## 非职责范围

这里不应直接承载：
- Provider UI 渲染
- 运行时 Provider 实例化
- translation 执行编排

## 当前代码映射

当前实现主要仍位于：
- `src/types.ts`
- `src/config/models.ts`
- `src/services/llmService/providers.ts`

## 相邻模块关系

- `../../features/provider-management/` 依赖这些概念。
- `../../config/` 承载静态 Provider 元数据。
- `../../services/` 承载运行时 Provider 访问逻辑。

## 阅读建议

- entities 总览：`../README.md` 或 `../README.zh.md`
- provider management：`../../features/provider-management/README.md` 或 `../../features/provider-management/README.zh.md`
