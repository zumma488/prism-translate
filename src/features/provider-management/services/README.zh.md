[English](./README.md) | **简体中文**

# `src/features/provider-management/services/`

## 模块定位

这里是 provider-management 业务服务与 Provider 接入规则的预期承载位置。

## 当前职责

这里计划集中：
- Provider 接入规则
- Provider 能力映射
- Provider 模型拉取协同逻辑
- 新增 Provider 的检查清单

目前这些规则大多仍部分散落在目录外。

## 非职责范围

这里不应直接承载：
- 静态 Provider 元数据
- 底层 model / provider 实例化
- translation UI

## 当前代码映射

相关逻辑目前还分布在：
- `src/config/`
- `src/services/llmService/`
- settings 相关 UI 与 hooks

## 相邻模块关系

- `../../../config/` 负责静态 Provider 定义。
- `../../../services/llmService/` 负责底层 Provider / model 对接。
- `../../../entities/provider/` 记录共享的 Provider 模型。

## 阅读建议

- provider-management 总览：`../README.md` 或 `../README.zh.md`
- provider entities：`../../../entities/provider/README.md` 或 `../../../entities/provider/README.zh.md`
- LLM 服务层：`../../../services/llmService/README.md` 或 `../../../services/llmService/README.zh.md`
