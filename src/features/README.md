# features 目录说明

## 模块定位

`src/features/` 是目标骨架中的业务能力层，用来承载面向具体业务场景的功能模块，而不是按文件类型平铺代码。

当前仓库里这个目录是本次文档落地时创建的目标骨架入口，用于承接未来从现有 `components + services + App.tsx` 逐步演进出来的业务模块。

## 文档层级

- 当前层级：业务模块级 / features
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
  - `../../docs/architecture/PROJECT_ANALYSIS.md`
- 下级文档：
  - `./translation/README.md`
  - `./settings/README.md`
  - `./provider-management/README.md`
- 平级相关文档：
  - `../components/README.md`
  - `../services/README.md`
  - `../config/README.md`

## 目录职责

这个层级负责承载：
- translation：翻译业务工作流
- settings：设置工作流
- provider-management：provider 接入与管理工作流

## 非职责范围

这个目录不直接承担：
- 最底层 LLM SDK 对接细节
- 最底层浏览器 API 封装
- 全局架构总纲说明

这些分别应归入：
- `src/services/` 或未来 `src/integrations/`
- `docs/architecture/`

## 阅读建议

- 想理解翻译核心工作流 → `./translation/README.md`
- 想理解设置与配置工作流 → `./settings/README.md`
- 想理解 provider 管理职责 → `./provider-management/README.md`
