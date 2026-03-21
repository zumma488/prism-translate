# settings entities 说明

## 文档层级

- 当前层级：实体子模块级 / entities.settings
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../provider/README.md`
  - `../translation/README.md`
  - `../../features/settings/README.md`

## 模块职责

这里应承载与设置系统相关的核心实体定义，例如：
- AppSettings
- ActiveModelKey
- LanguageModelBindings
- Import / Export payload
- SettingsMigrationState

## 当前代码映射

当前对应实现主要在：
- `src/types.ts`
- `src/services/configIO.ts`
- `src/services/crypto.ts`
