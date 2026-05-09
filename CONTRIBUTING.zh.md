# 参与 Prism Translate

感谢你帮助改进 Prism Translate。这个项目目前仍在推进架构对齐，同时保持可用性，因此范围清晰、改动克制的贡献尤其有价值。

## 开始之前

- 先阅读 [README.md](README.md) 和 [src/README.md](src/README.md)。
- 在做结构性调整前，先阅读对应模块的 README，例如 `src/features/*`、`src/services/*` 等目录。
- 开始前先检查是否已有相关 issue 或 pull request，避免重复工作。

## 开发环境

```bash
git clone https://github.com/zumma488/prism-translate.git
cd prism-translate
npm install
npm run dev
```

可选的本地环境变量覆盖：

```bash
cp .env.example .env.local
```

## 贡献规范

- 保持改动聚焦，避免顺手进行无关重构。
- 遵循 `AGENTS.md` 以及各模块 README 中描述的当前架构方向。
- 不要提交 secrets、`.env` 文件、导出的 `.prism` 文件或 Provider 凭证。
- 只要已有中文配套文档，面向用户或治理类文档就应保持中英双语同步。
- 如果新增目录或调整模块边界，请同步更新相关 README 的导航说明。

## 代码风格与验证

- 优先采用贴合现有代码库的渐进式 TypeScript 改动。
- 提交 Pull Request 前至少执行以下验证：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

- 如果改动影响 UI、翻译流程或 API 行为，请附上手动验证说明。
- 不要在截图、日志、导出的 `.prism` 文件或原始 Provider 请求载荷中暴露真实 API Key 或其他凭证。

## Pull Request 要求

- 使用清晰的标题，并说明要解决的问题。
- 如有相关 issue，请在描述中关联。
- 概述用户可见的行为变化，以及是否还有后续工作。
- 对于 UI 改动，建议补充截图或录屏，便于评审。

## Commit Message

请使用英文 Conventional Commits，例如：

- `docs: add bilingual community health files`
- `fix: handle provider model fetch timeout`
- `feat: improve translation result grouping`

## 问题反馈

- Bug 和功能建议请通过 GitHub Issues 提交。
- 安全相关问题也通过 GitHub Issues 提交，但必须先脱敏，避免公开真实密钥、原始载荷或导出配置文件。
- 尽可能提供复现步骤、预期行为和环境信息。
