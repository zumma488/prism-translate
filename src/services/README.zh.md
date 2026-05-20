[English](./README.md) | **简体中文**

# `src/services/`

## 模块定位

`src/services/` 是前端侧相邻的共享基础设施层，当前承载 config IO、旧格式兼容辅助，以及 feature 会复用的 LLM/provider 访问辅助逻辑。

## 当前职责

这个目录当前负责：
- LLM 调用封装
- Provider model 创建辅助
- `safeFetch` 类请求兜底
- 配置导入导出支持
- 翻译执行模式解析
- 稳定 provider/model 标识规范化
- 旧配置格式兼容辅助

## 非职责范围

这个目录不应直接承载：
- 业务化的翻译结果展示
- settings modal 渲染
- App Router 路由文件

## 当前代码映射

关键文件：
- `configIO.ts`
- `crypto.ts`
- `executionMode.ts`
- `llmService/index.ts`
- `llmService/providers.ts`
- `llmService/safeFetch.ts`
- `modelIdentity.ts`

## 相邻模块关系

- `../features/` 通过这里复用共享基础设施。
- `../config/` 提供 services 会消费的静态元数据。
- `../../server/` 是与该层相邻的服务端运行时边界。

## 阅读建议

- LLM 集成细节：`./llmService/README.md` 或 `./llmService/README.zh.md`
- settings 业务上下文：`../features/settings/README.md` 或 `../features/settings/README.zh.md`
- translation 业务上下文：`../features/translation/README.md` 或 `../features/translation/README.zh.md`
