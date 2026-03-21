# translation services 说明

## 文档层级

- 当前层级：子模块级 / features.translation.services
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../components/README.md`
  - `../hooks/README.md`
  - `../../../services/llmService/README.md`
  - `../../../entities/translation/README.md`

## 模块定位

这里用于沉淀 translation feature 的业务服务逻辑。

## 应承载的内容

未来这里应放：
- 任务生成
- 结果排序
- 结果分组
- 执行编排
- 失败重试策略

## 约束

- 这里负责业务服务，不直接处理底层 SDK 适配。
- LLM 具体调用应继续经由 `services/llmService` 或未来 `integrations/llm`。
