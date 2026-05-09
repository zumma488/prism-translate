# provider-management services 说明

## 文档层级

- 当前层级：子模块级 / features.provider-management.services
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../../../config/README.md`
  - `../../../services/llmService/README.md`
  - `../../../entities/provider/README.md`

## 模块定位

这里用于沉淀 provider-management feature 下的业务服务逻辑。

## 应承载的内容

未来这里应放：
- Provider 接入规则
- Provider 能力映射
- Provider 模型拉取协同逻辑
- 新增 Provider 的接入检查清单

## 约束

- 新增 Provider 的业务规则应逐步集中，而不是散在多个无关文件。
- 静态定义、业务管理、底层实例化三者应保持边界。
