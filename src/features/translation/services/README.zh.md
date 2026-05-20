[English](./README.md) | **简体中文**

# `src/features/translation/services/`

## 模块定位

这里承载 translation feature 的业务服务逻辑，是任务创建、工作流编排、结果整形和翻译相关持久化辅助逻辑的主要位置。

## 当前职责

当前文件包括：
- `translationOrchestrator.ts`
  - 任务生成
  - 启用模型解析
  - 期望结果数计算
  - 结果排序与分组
- `translationExecutionService.ts`
  - 并发执行翻译任务
  - 浏览器直连与服务端代理的执行分流
  - 渐进式任务视图/结果回调
  - 重试与任务错误分类
- `translationRunnerDecision.ts`
  - 目标语言变更决策
  - 增量翻译触发条件判断
- `translationTaskError.ts`
  - 本地化任务错误映射
- `translationTone.ts`
  - 语气标签本地化映射
- `targetLanguagesPersistence.ts`
  - 目标语言本地持久化
  - 校验与回退逻辑
- `translationStreamClient.ts`
  - 面向流式路径的 API 翻译请求协调逻辑

## 非职责范围

这里不应直接承载：
- 底层 Provider SDK 构造
- 通用 crypto / config 工具
- 翻译结果渲染

## 当前代码映射

这里与以下模块配合：
- `../hooks/` 负责 feature 状态编排
- `../components/` 负责展示
- `../../../services/llmService/` 与 API / server 边界负责 Provider 执行
- `../../../../app/api/translate/task/route.ts` 负责单任务代理执行

## 相邻模块关系

- `../../../services/llmService/` 处理 model / provider 访问细节。
- `../../../entities/translation/` 记录稳定的 translation 模型。

## 阅读建议

- translation 总览：`../README.md` 或 `../README.zh.md`
- translation hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- LLM 服务层：`../../../services/llmService/README.md` 或 `../../../services/llmService/README.zh.md`
