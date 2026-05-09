# entities 目录说明

## 模块定位

`src/entities/` 用来承载项目中稳定、可复用、跨模块共享的核心业务对象定义。

## 文档层级

- 当前层级：核心实体级 / entities
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：
  - `./provider/README.md`
  - `./translation/README.md`
  - `./settings/README.md`
- 平级相关文档：
  - `../features/README.md`
  - `../services/README.md`
  - `../config/README.md`

## 模块职责

这个层级负责定义：
- ProviderDefinition
- ProviderConfig
- ModelDefinition
- AppSettings
- TranslationTask
- TranslationResult
- LanguageConfig

## 当前代码映射

当前项目里，核心实体还没有完全拆到 `entities/` 目录中，主要集中在：
- `src/types.ts`
- `src/constants.ts`
- `src/config/models.ts`

因此这里目前是“目标骨架文档先行，代码后续迁移”的状态。

## 实现约束

- 核心实体字段必须稳定、统一。
- 不允许不同模块长期维护多套相近但不兼容的数据结构。
- 实体定义应成为 feature、service、config 之间的共同语言。
