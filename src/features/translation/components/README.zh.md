[English](./README.md) | **简体中文**

# `src/features/translation/components/`

## 模块定位

这里承载 translation feature 下与翻译输入、结果分组、比较视图和结果呈现强相关的业务 UI 组件。

## 当前职责

当前目录中已经存在或已明确归属的组件包括：
- `TargetLanguageSelector.tsx`
- `TranslationOutputPanel.tsx`
- `TranslationGroup.tsx`
- `TranslationCard.tsx`

这些组件负责：
- 目标语言选择交互
- 翻译结果分组展示
- 结果区域的加载态与空态展示
- 单条结果的复制、折叠、隐藏、朗读相关交互

## 非职责范围

这里不应直接承载：
- 底层 Provider 请求
- 翻译任务编排
- 通用 settings UI

这些应放在 feature hooks / services 或其他模块中。

## 当前代码映射

当前仍与本目录强相关、但尚未迁入的实现：
- `src/components/TranslationInput.tsx` 仍是翻译输入表面的重要组成部分。
- 翻译执行与结果整形逻辑位于 `../hooks/` 与 `../services/`。

## 相邻模块关系

- `../hooks/` 负责 translation 状态编排。
- `../services/` 负责 translation 业务服务。
- `../../../components/` 仍承载部分共享与过渡期 UI。

## 阅读建议

- translation 总览：`../README.md` 或 `../README.zh.md`
- translation hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- translation services：`../services/README.md` 或 `../services/README.zh.md`
