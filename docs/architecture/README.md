# Architecture Documentation Index

## 模块定位

这是 `prism-translate` 项目的顶层架构文档索引，负责把“当前项目现状”“目标架构”“代码目录级说明文档”串成一套可双向导航的文档体系。

## 文档层级

- 当前层级：项目级 / 架构总纲级
- 上级文档：无
- 下级文档：
  - `./PROJECT_ANALYSIS.md`
  - `./TARGET_ARCHITECTURE.md`
  - `../../src/README.md`
  - `../../src/features/README.md`
  - `../../src/services/README.md`
  - `../../src/components/README.md`
  - `../../src/config/README.md`
  - `../../src/i18n/README.md`
- 平级相关文档：
  - `./AGENT.md`（未来）
  - `./ROADMAP.md`（可选）

## 文档职责

本目录下的文档分工如下：

- `PROJECT_ANALYSIS.md`
  - 记录当前项目现状、问题、要求
- `TARGET_ARCHITECTURE.md`
  - 记录目标架构、目标骨架、推荐演进方向
- `README.md`（本文档）
  - 作为顶层索引，告诉 AI agent 和开发者该从哪里进入、往哪里继续查

## 阅读建议

### 如果你想看“当前项目是什么”
先读：
- `./PROJECT_ANALYSIS.md`

### 如果你想看“项目以后应该变成什么”
再读：
- `./TARGET_ARCHITECTURE.md`

### 如果你想落到代码目录理解模块边界
继续读：
- `../../src/README.md`
- `../../src/features/README.md`
- `../../src/services/README.md`
- `../../src/components/README.md`

## 文档导航规则

为了让 AI agent 可以按需查找，后续所有目录级 README 都遵守同一规则：

1. 记录自己当前层级
2. 记录自己的上级文档
3. 记录自己的下级文档
4. 记录平级相关文档

这样可以做到：
- 从上到下查找
- 从下到上回溯
- 不需要每次全量读取全部文档
