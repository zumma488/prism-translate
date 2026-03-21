# provider entities 说明

## 文档层级

- 当前层级：实体子模块级 / entities.provider
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../translation/README.md`
  - `../settings/README.md`
  - `../../config/README.md`
  - `../../services/README.md`

## 模块职责

这里应承载与 Provider 相关的核心实体定义，例如：
- ProviderDefinition
- ProviderConfig
- ProviderType
- Provider capability metadata

## 当前代码映射

当前对应实现主要在：
- `src/types.ts`
- `src/config/models.ts`
- `src/services/llmService/providers.ts`
