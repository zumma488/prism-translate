# 变更日志

本文件用于记录项目中的重要变更。

格式参考 Keep a Changelog，已发布版本通常遵循 Semantic Versioning，并通过手动维护 GitHub Releases 对外发布。

## [Unreleased]

## [0.3.0] - 2026-05-20

### Added

- 新增 `/settings` 路由化设置中心，包括通用设置、语言绑定、Provider 管理和关于页面。
- 新增 `browser-direct` 与 `server-proxy` 两种翻译执行模式。
- 新增 `/api/translate/task` 单任务翻译 API，用于新的服务端代理执行链路。
- 新增面向单个翻译任务的状态视图，可展示 pending、running、retrying、success 和按任务粒度的失败信息。
- 新增中英文社区治理文档。
- 新增 GitHub issue 模板、Pull Request 模板、CI 工作流和 Dependabot 配置。
- 新增 ESLint、Vitest 以及 lint / typecheck / test / check 质量门槛脚本。
- 新增 `CODEOWNERS` 以声明仓库评审归属。
- 新增覆盖 settings 持久化、Provider 模型拉取、翻译执行、runner decision 和 orchestrator 的针对性测试。
- 新增 Provider 模型拉取辅助、拉取模型的选择/合并流程，以及用于重复模型 ID 的稳定模型 UID。

### Changed

- 翻译执行改为由前端负责的并发任务编排，支持重试和渐进式任务状态更新。
- 当用户在已有结果基础上新增目标语种时，系统现在只翻译新增语种，不再清空并重跑所有已有结果。
- 在 `browser-direct` 模式下，不支持直连的 Provider 现在只会在任务级别给出明确提示/错误，不再静默自动转发到服务器代理链路。
- 设置体验现在以 `app/settings/*` 下的路由化设置壳层为主，同时保留 `src/components/settings/` 中旧的 modal 兼容视图。
- 默认模型选择现在基于稳定的 provider/model 标识键，持久化设置也会在 `v6` 存储格式中规范化执行模式和旧模型 ID。
- 根 README 和模块 README 现在更明确地描述了路由化设置中心、执行模式边界、浏览器直连信任行为以及增量任务化翻译流程。
- 核心 UI 外观、状态徽标和工作台导航已刷新，以配合新的设置中心和更丰富的翻译结果状态。
- 根 README 现在会链接到治理文档，并准确说明仓库中实际存在的 CI 工作流。
- 移除了根 README 中的横幅区块，使仓库入口更聚焦于项目说明和社区协作信息。
- 包元数据现在与 Prism Translate 的公开项目标识保持一致。
- 安全相关措辞现在更明确地反映当前“浏览器管理配置、明文导出”的信任模型。
