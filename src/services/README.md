# services 目录说明

## 模块定位

`src/services/` 是当前项目中的服务层，主要承载配置读写、加密解密以及 LLM 调用相关逻辑。

在目标骨架中，这个层级未来会进一步收敛为更清晰的 `integrations/` 与部分 feature services，但当前项目的很多关键能力仍然集中在这里。

## 文档层级

- 当前层级：服务层级 / services
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/PROJECT_ANALYSIS.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：
  - `./llmService/README.md`
- 平级相关文档：
  - `../components/README.md`
  - `../features/README.md`
  - `../config/README.md`
  - `../entities/README.md`

## 当前目录职责

当前主要负责：
- LLM 调用封装
- Provider 模型实例化
- safeFetch 错误兜底
- 配置导入导出
- 本地配置加密解密

## 当前关键文件

- `configIO.ts`
- `crypto.ts`
- `llmService/index.ts`
- `llmService/providers.ts`
- `llmService/safeFetch.ts`

## 阅读建议

- 想看 LLM 接入 → `./llmService/README.md`
- 想看 settings 业务视角 → `../features/settings/README.md`
- 想看整体目标边界 → `../../docs/architecture/TARGET_ARCHITECTURE.md`
