[English](./README.md) | **简体中文**

# `src/features/translation/`

## 模块定位

`src/features/translation/` 负责 Prism Translate 的核心翻译工作流：把一段输入文本转换成面向不同目标语言与模型组合的翻译任务，并将结果组织为可比较的结构。

## 当前职责

这个模块当前负责：
- 源文本相关工作流行为
- 目标语言选择与持久化协同
- 语言到模型绑定关系解析
- 翻译任务创建
- 任务视图状态的创建与排序
- 感知执行模式的翻译执行编排
- 在一次翻译完成后新增目标语言时的增量翻译
- 结果分组、排序与比较展示支持

## 非职责范围

这个模块不应直接承载：
- 底层 Provider SDK 实例化
- 通用配置兼容性处理
- settings 导入导出规则
- App Router 路由处理

这些应归属 `src/services/`、`server/` 或 `app/`。

## 当前代码映射

翻译相关实现当前分布在：
- `src/features/translation/components/`
- `src/features/translation/hooks/`
- `src/features/translation/services/`
- `app/api/translate/task/route.ts`
- `src/components/TranslationInput.tsx`
- `src/App.tsx`
- `src/types.ts`
- `src/constants.ts`
- `src/services/llmService/`

## 相邻模块关系

- `../settings/` 管理 translation 使用到的 Provider 与模型配置。
- `../../services/llmService/` 执行底层 Provider / model 调用。
- `../../entities/translation/` 记录稳定的翻译领域模型。
- `../../components/` 仍承载一部分翻译 UI。

## 阅读建议

- UI 部分：`./components/README.md` 或 `./components/README.zh.md`
- 状态 hooks：`./hooks/README.md` 或 `./hooks/README.zh.md`
- 业务服务：`./services/README.md` 或 `./services/README.zh.md`
