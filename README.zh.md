# AI 翻译仪表盘

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
  <em>本应用是一款完全由 <b>AI Agent</b> 开发的翻译工具。</em><br/>
  <em>由 <b>Google Stitch</b>、<b>Google AI Studio</b> 与 <b>Antigravity</b> 共同协作完成。</em>
</p>

<p align="center">
  <b>简体中文</b> | <a href="./README.md">English</a>
</p>

一款基于 Next.js、React 19、TypeScript 和 Vercel AI SDK 构建的现代化 AI 翻译仪表盘。本项目集成了多个 AI 提供商（Google Gemini、OpenAI 等），在简洁流畅的界面中提供高质量的翻译服务。

<p align="center">
  <a href="https://zumma488.github.io/prism-translate/"><b>在线演示</b></a>
</p>

## 📸 截图预览 (Screenshots)

### 仪表盘 (Dashboard)

![Dashboard Desktop](docs/images/dashboard-desktop.png)

### 移动端适配 (Mobile & Responsive)

<p align="center">
  <img src="docs/images/dashboard-mobile.png" width="300" alt="Mobile View" />
</p>

### 模型管理 (Model Management)

|                  连接提供商                  |                 自定义模型                 |                 模型选择                 |
| :------------------------------------------: | :----------------------------------------: | :--------------------------------------: |
| ![Connect](docs/images/connect-provider.png) | ![Custom](docs/images/custom-provider.png) | ![Manage](docs/images/manage-models.png) |

## ✨ 功能特性 (Features)

- **多模型翻译对比**: 为每种语言选择多个 AI 模型，在简洁的垂直布局中并排对比翻译结果
- **每语言独立模型选择**: 为每种目标语言独立定制 AI 模型，优化不同语言对的翻译质量
- **自定义 Base URL 支持**: 为任意 AI API 提供商配置自定义 Base URL，这为 API 代理路由和企业内网端点提供了极大的灵活性
- **多模型支持**: 通过 Vercel AI SDK 无缝切换 Google Gemini、OpenAI 等多种 AI 提供商
- **现代化 UI/UX**: 使用 `shadcn/ui` 和 Tailwind CSS v4 打造高端响应式设计
- **微动画效果**: 通过 `tw-animate-css` 提升用户体验
- **类型安全**: 完整的 TypeScript 支持，确保开发稳健性
- **全球 i18n 支持**: 界面支持 12 种语言 — 阿拉伯语、英语、西班牙语、日语、韩语、缅甸语、葡萄牙语、俄语、土耳其语、越南语、简体中文和繁体中文

## 🌍 支持语言 (Supported Languages)

| 语言 | 代码 | 原生名称 |
|------|------|----------|
| 阿拉伯语 | `ar` | العربية |
| 英语 | `en` | English |
| 西班牙语 | `es` | Español |
| 日语 | `ja` | 日本語 |
| 韩语 | `ko` | 한국어 |
| 缅甸语 | `my` | မြန်မာ |
| 葡萄牙语 | `pt` | Português |
| 俄语 | `ru` | Русский |
| 土耳其语 | `tr` | Türkçe |
| 越南语 | `vi` | Tiếng Việt |
| 简体中文 | `zh` | 简体中文 |
| 繁体中文 | `zh-TW` | 繁體中文 |

## 技术栈 (Tech Stack)

- **框架**: Next.js + React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **UI 组件**: shadcn/ui
- **AI 集成**: Vercel AI SDK + Google Gemini + OpenAI
- **部署**: 兼容 Vercel 的托管环境

### AI Skills 参考

开发此项目时使用了以下 AI Skills（通用配置，无需随项目同步）：

| Skill                | 用途                              |
| -------------------- | --------------------------------- |
| `shadcn-ui`          | shadcn/ui 组件库安装和使用指南    |
| `tailwind-v4-shadcn` | Tailwind v4 与 shadcn/ui 集成配置 |
| `ai-sdk`             | Vercel AI SDK 使用指南            |
| `ui-ux-pro-max`      | UI/UX 设计规范和最佳实践          |

## 🚀 快速开始

### 先决条件

- Node.js (v18 或更高版本)
- npm 或 pnpm

### 安装步骤

1. 克隆仓库：

   ```bash
   git clone https://github.com/zumma488/prism-translate.git
   cd prism-translate
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 配置环境变量（可选）：
   如果你想覆盖默认请求超时时间，请将 `.env.example` 复制为 `.env.local`。

   ```bash
   cp .env.example .env.local
   ```

   示例：

   ```env
   REQUEST_TIMEOUT_MS=1800000
   ```

   提供商 API Key 请在应用内的设置界面中填写，保存在当前浏览器里。

## 配置存储说明

- 提供商配置保存在当前浏览器的 localStorage 中。
- API Key 和其他提供商密钥会以明文形式存储在该 localStorage 中。
- 导出的 `.prism` 文件同样会以明文 JSON 形式包含这些密钥。
- 如果你清除浏览器数据、切换浏览器或更换设备，请妥善保管导出的配置文件，以便后续恢复设置。

4. 运行开发服务器：

   ```bash
   npm run dev
   ```

## 部署到 Vercel

这个项目可以部署到 Vercel，并且已经通过标准 Next.js 的 `npm run build` 构建验证。

推荐的项目设置：

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 留空

环境变量：

- `REQUEST_TIMEOUT_MS`
  - 可选。
  - 用于控制上游模型请求超时时间，单位为毫秒。
  - 在 Vercel 环境中，应用会自动把这个值限制在函数执行时长以内，尽量减少平台硬超时。

部署注意事项：

- 提供商凭证保存在每个用户自己的浏览器 `localStorage` 中，不依赖 Vercel 环境变量。
- 翻译 API 运行在 Node.js Function 上，并已为较长的流式请求配置函数时长。
- `ollama` 默认的 `http://localhost:11434/api` 在 Vercel 上不可直接使用。
  如果要继续使用它，需要改成一个外网可访问的 Ollama 兼容端点，或者改用其他托管模型提供商。
- 如果翻译文本很长、上游模型响应很慢，仍然可能触发你当前 Vercel 套餐的执行时长限制。

## GitHub 自动化

当前仓库保留 1 个 GitHub Actions 工作流：

- `CI` (`.github/workflows/ci.yml`)
  - 在每次 push 和 pull request 时运行
  - 安装依赖，执行 `npm run lint`，再执行 `npm run build`

生产部署建议直接使用 Vercel 与当前仓库的 Git 集成。

## 🤝 贡献

欢迎贡献！请阅读我们的[贡献指南](CONTRIBUTING.md)和[行为准则](CODE_OF_CONDUCT.md)了解详情。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 👥 作者

**zumma488**

- GitHub: [@zumma488](https://github.com/zumma488)
