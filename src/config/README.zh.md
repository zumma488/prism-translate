[English](./README.md) | **简体中文**

# `src/config/`

## 模块定位

`src/config/` 负责存放可以安全下发到浏览器的静态 Provider 配置与元数据。

## 当前职责

这个目录当前负责：
- Provider 静态定义
- 默认模型集合
- Provider 展示元数据

## 非职责范围

这个目录不应直接承载：
- 运行时 Provider 实例化
- 私有密钥
- translation 执行逻辑

## 当前代码映射

关键文件：
- `models.ts`

## 相邻模块关系

- `../features/provider-management/` 使用这里的元数据驱动 Provider 管理流程。
- `../services/llmService/` 在解析 Provider / model 行为时消费这些配置。
- `../entities/provider/` 记录相关稳定模型概念。

## 阅读建议

- provider management：`../features/provider-management/README.md` 或 `../features/provider-management/README.zh.md`
- LLM services：`../services/llmService/README.md` 或 `../services/llmService/README.zh.md`
