# 变更日志

本文件用于记录项目中的重要变更。

格式参考 Keep a Changelog，已发布版本通常遵循 Semantic Versioning，并通过手动维护 GitHub Releases 对外发布。

## [Unreleased]

### Added

- 新增中英文社区治理文档。
- 新增 GitHub issue 模板、Pull Request 模板、CI 工作流和 Dependabot 配置。
- 新增 ESLint、Vitest 以及 lint / typecheck / test / check 质量门槛脚本。
- 新增 `CODEOWNERS` 以声明仓库评审归属。

### Changed

- 根 README 现在会链接到治理文档，并准确说明仓库中实际存在的 CI 工作流。
- 移除了根 README 中的横幅区块，使仓库入口更聚焦于项目说明和社区协作信息。
- 包元数据现在与 Prism Translate 的公开项目标识保持一致。
- 安全相关措辞现在更明确地反映当前“浏览器管理配置、明文导出”的信任模型。
