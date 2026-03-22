# translation feature 说明

## 模块定位

`src/features/translation/` 负责承载 Prism Translate 的核心业务：把输入文本转换成一组面向不同目标语言、不同模型的翻译任务，并将结果按可比较的方式呈现出来。

## 文档层级

- 当前层级：模块级 / features.translation
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
  - `../../../docs/architecture/PROJECT_ANALYSIS.md`
- 下级文档：
  - 未来可补：`./components/README.md`
  - 未来可补：`./hooks/README.md`
  - 未来可补：`./services/README.md`
- 平级相关文档：
  - `../settings/README.md`
  - `../../services/README.md`
  - `../../components/README.md`
  - `../../entities/translation/README.md`

## 模块职责

这个模块应负责：
- 输入文本相关业务行为
- 目标语言管理
- 按语言解析模型绑定关系
- 生成 TranslationTask
- 驱动并发翻译执行
- 聚合 TranslationResult
- 结果排序、分组与比较展示

## 非职责范围

这个模块不应直接负责：
- Provider SDK 的底层实例化细节
- 配置加密解密
- 配置导入导出
- 全局页面装配

## 当前代码映射

在当前项目实现里，这个 feature 的职责主要分散在：
- `src/App.tsx`
- `src/features/translation/services/translationOrchestrator.ts`
- `src/components/TranslationInput.tsx`
- `src/components/TranslationGroup.tsx`
- `src/components/TranslationCard.tsx`
- `src/constants.ts`
- `src/types.ts`
- `src/services/llmService/index.ts`

## 核心数据流

```text
用户输入文本
  ↓
选择目标语言
  ↓
解析每种语言对应模型
  ↓
构建 TranslationTask
  ↓
并发执行翻译
  ↓
返回 TranslationResult
  ↓
分组、排序、比较展示
```

## 实现约束

- 多模型比较必须是一等能力，不能退化成单结果心智模型。
- 任务编排和结果展示应逐步分离。
- 结果分组、排序、比较逻辑不应长期塞在页面组件里。

## 阅读建议

- 想看当前 UI 组件 → `../../components/README.md`
- 想看当前调用服务 → `../../services/README.md`
- 想看目标态边界 → `../../../docs/architecture/TARGET_ARCHITECTURE.md`
