[English](./README.md) | **简体中文**

# `src/features/settings/services/`

## 模块定位

这里承载 settings feature 的业务服务与 settings 特有的持久化规则。

## 当前职责

当前文件包括：
- `settingsPersistence.ts`
  - settings 迁移
  - 持久化策略
  - `activeModelKey` 校验与回退
  - 执行模式与稳定模型标识规范化
- `fetchProviderModels.ts`
  - 感知执行模式的 Provider 模型拉取
  - 浏览器直连与代理拉取协同
- `providerFetchedModels.ts`
  - 拉取模型去重
  - 可选择模型状态整形
  - 将选中的拉取模型合并到持久化 Provider 模型列表

这个目录也是以下能力的预期归属位置：
- settings 合并规则
- 导入导出规则
- settings 校验策略

## 非职责范围

这里不应直接承载：
- settings modal 渲染
- 底层 Provider SDK 访问
- 路由处理

## 当前代码映射

这里与以下模块协作：
- `../hooks/` 负责状态编排
- `../../../services/` 负责共享 config 工具
- `../../../entities/settings/` 负责稳定 settings 模型边界

## 相邻模块关系

- `../hooks/` 管理 settings 状态。
- `../../../services/` 提供共享的 config IO 与旧格式兼容工具。

## 阅读建议

- settings 总览：`../README.md` 或 `../README.zh.md`
- settings hooks：`../hooks/README.md` 或 `../hooks/README.zh.md`
- settings entities：`../../../entities/settings/README.md` 或 `../../../entities/settings/README.zh.md`
