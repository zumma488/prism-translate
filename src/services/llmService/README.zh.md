[English](./README.md) | **简体中文**

# `src/services/llmService/`

## 模块定位

`src/services/llmService/` 是 `src/` 侧主要的 LLM/provider 访问层，集中处理 model 创建、请求执行辅助、响应解析以及 Provider 集成胶水逻辑。

## 当前职责

这个目录当前负责：
- `createModel()` 相关的 model 实例化行为
- 翻译请求执行辅助
- 被 translation feature 复用的浏览器直连 Provider 执行辅助
- 识别伪成功上游响应的 `safeFetch` 处理
- 如 `<think>` 清理、JSON 提取与结果解析等响应清洗

## 非职责范围

这个目录不应直接承载：
- translation card 渲染
- settings modal 工作流
- 页面级状态管理

## 当前代码映射

关键文件：
- `index.ts`
- `providers.ts`
- `safeFetch.ts`

## 相邻模块关系

- `../../features/translation/` 消费这里暴露的翻译执行能力。
- `../../features/provider-management/` 依赖这里的 Provider 元数据与对接逻辑。
- `../../../server/` 是 API 背后与之相邻的服务端执行边界。

## 阅读建议

- services 总览：`../README.md` 或 `../README.zh.md`
- translation feature：`../../features/translation/README.md` 或 `../../features/translation/README.zh.md`
- provider management：`../../features/provider-management/README.md` 或 `../../features/provider-management/README.zh.md`
