[English](./README.md) | **简体中文**

# `src/lib/`

## 模块定位

`src/lib/` 承载与具体业务 feature 弱耦合的通用工具与辅助函数。

## 当前职责

这个目录适合放：
- 格式化辅助
- 校验辅助
- 转换工具
- 小型可复用支持逻辑

## 非职责范围

这个目录不应成为以下内容的长期归宿：
- Provider 业务规则
- translation 编排
- settings 迁移或导入导出核心逻辑

## 当前代码映射

这个目录是通用工具层，与 feature 专属 hooks 和 services 相邻。

## 相邻模块关系

- `../hooks/` 承载可复用的 React 适配逻辑。
- `../services/` 承载更重的基础设施职责。
- `../features/` 承载业务特定逻辑。

## 阅读建议

- hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- services：`../services/README.md` 或 `../services/README.zh.md`
