# translation components 说明

## 文档层级

- 当前层级：子模块级 / features.translation.components
- 上级文档：
  - `../README.md`
  - `../../../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../hooks/README.md`
  - `../services/README.md`
  - `../../../components/README.md`

## 模块定位

这里承载 translation feature 下与界面呈现强相关的组件抽象。

## 应承载的内容

未来这里应放：
- 翻译输入区业务组件
- 结果分组组件
- 比较视图组件
- 翻译状态展示组件

## 当前代码映射

当前项目里，对应实现还分布在：
- `src/components/TranslationInput.tsx`

当前已落入本目录：
- `TranslationOutputPanel.tsx`
  - 承载翻译结果区域的分组展示、空态和加载骨架
- `TranslationGroup.tsx`
  - 承载按语言分组后的结果展示，并在单结果场景下降级渲染卡片
- `TranslationCard.tsx`
  - 承载单条翻译结果展示与复制、朗读、隐藏、折叠等交互

## 约束

- 组件负责展示和交互，不直接持有底层 provider 调用逻辑。
- 比较视图逻辑可以存在，但底层任务编排应放在 hooks / services。
