# lib 目录说明

## 模块定位

`src/lib/` 是当前项目中的通用工具目录，用来承载与具体业务弱耦合的工具方法、辅助函数和基础能力。

## 文档层级

- 当前层级：通用工具层级 / lib
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../hooks/README.md`
  - `../components/README.md`
  - `../services/README.md`

## 模块职责

这里适合放：
- 与业务弱耦合的工具函数
- 格式化、校验、转换类工具
- 多处可复用的小型基础逻辑

## 非职责范围

这里不应长期放：
- Provider 业务规则
- Translation 任务编排
- Settings 迁移与导入导出主逻辑

这些应归入 feature / service / entity 等更明确的目录。
