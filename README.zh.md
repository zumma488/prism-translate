# Prism Translate

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
  <b>简体中文</b> | <a href="./README.md">English</a>
</p>

Prism Translate 是一个多语言、多模型、多提供商的翻译对比工作台。一次输入可以交给多个模型翻译，不同目标语言可以绑定不同模型集合，结果会以便于横向比较的方式展示。

<p align="center">
  <a href="https://zumma488.github.io/prism-translate/"><b>在线演示</b></a>
</p>

## 功能特性

- 对同一段源文本比较多个模型输出。
- 为不同目标语言绑定不同模型集合。
- 配置托管 Provider 与 OpenAI-compatible 端点。
- 在 UI 中管理 Provider 设置、模型列表、默认模型、导入导出与持久化。
- 通过 Next.js API Handlers 和服务端编排执行翻译请求。
- 提供响应式界面与内建 i18n 支持。

## 当前架构

当前仓库同时包含已经运行中的结构，以及仍在持续推进的文档先行重构。

- `app/`
  - Next.js App Router 入口。
  - 负责路由、布局、全局样式，以及 `app/api/translate/stream/route.ts`、`app/api/providers/models/route.ts` 等 API 路由。
- `server/`
  - 承载 API 边界后的服务端翻译、provider proxy、模型与编排逻辑。
- `src/`
  - 承载客户端 UI、feature 模块、共享配置、i18n、hooks 和通用工具。
  - `src/features/translation/` 负责翻译工作流。
  - `src/features/settings/` 负责设置、面向持久化的状态，以及导入导出流程。
  - `src/features/provider-management/` 负责 Provider 接入与管理规则。
- `src/services/`
  - 承载 config IO、crypto 工具和 LLM/provider 访问等共享基础设施。
- `src/components/`
  - 承载可复用 UI，以及尚未完全迁移到 feature 内的界面组件。

这意味着仓库已经不是单纯的浏览器端翻译面板：设置仍然是浏览器侧管理，但翻译执行与 provider/model 访问已经跨过服务端 API 边界。

## 仓库导航

- 根入口：[`src/README.md`](src/README.md) / [`src/README.zh.md`](src/README.zh.md)
- Features：[`src/features/README.md`](src/features/README.md) / [`src/features/README.zh.md`](src/features/README.zh.md)
- Translation：[`src/features/translation/README.md`](src/features/translation/README.md) / [`src/features/translation/README.zh.md`](src/features/translation/README.zh.md)
- Settings：[`src/features/settings/README.md`](src/features/settings/README.md) / [`src/features/settings/README.zh.md`](src/features/settings/README.zh.md)
- Provider management：[`src/features/provider-management/README.md`](src/features/provider-management/README.md) / [`src/features/provider-management/README.zh.md`](src/features/provider-management/README.zh.md)
- Services：[`src/services/README.md`](src/services/README.md) / [`src/services/README.zh.md`](src/services/README.zh.md)
- Components：[`src/components/README.md`](src/components/README.md) / [`src/components/README.zh.md`](src/components/README.zh.md)
- Entities：[`src/entities/README.md`](src/entities/README.md) / [`src/entities/README.zh.md`](src/entities/README.zh.md)

## 运行与安全说明

- Provider 设置保存在当前浏览器中。
- API Key 和其他 Provider 凭证都应按敏感信息处理。
- 导出的 `.prism` 文件可能包含这些凭证，必须按敏感文件对待。
- 不要把当前浏览器存储模型描述成企业级密钥安全方案。
- `src/config/` 只放可以安全下发到浏览器的静态元数据。
- 服务端请求处理和 provider/model 访问位于 Next.js API 路由与 `server/` 代码之后。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vercel AI SDK 与多家 Provider SDK

## 快速开始

### 前置条件

- Node.js 18 或更高版本
- npm

### 安装

```bash
git clone https://github.com/zumma488/prism-translate.git
cd prism-translate
npm install
```

### 可选环境变量覆盖

如果你想覆盖默认上游超时时间，可以将 `.env.example` 复制为 `.env.local`。

```bash
cp .env.example .env.local
```

示例：

```env
REQUEST_TIMEOUT_MS=1800000
```

### 本地运行

```bash
npm run dev
```

### 验证

```bash
npm run lint
npm run build
```

## 部署

当前仓库是标准 Next.js 应用，可直接部署到 Vercel。

推荐设置：

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: 留空

运行说明：

- `REQUEST_TIMEOUT_MS` 为可选变量，用于控制上游超时毫秒数。
- Provider 凭证默认不来自 Vercel 环境变量，而是在浏览器 UI 中管理。
- 如果上游模型响应过慢，超长翻译仍可能触发平台执行时长限制。
- `ollama` 的本地默认地址不能直接在 Vercel 上使用，除非你提供一个可访问的兼容端点。

## 截图

### 仪表盘

![Dashboard Desktop](docs/images/dashboard-desktop.png)

### 移动端

<p align="center">
  <img src="docs/images/dashboard-mobile.png" width="300" alt="Mobile View" />
</p>

### Provider 与模型管理

|                  连接提供商                  |                 自定义 Provider                |                 模型选择                 |
| :------------------------------------------: | :--------------------------------------------: | :--------------------------------------: |
| ![Connect](docs/images/connect-provider.png) | ![Custom](docs/images/custom-provider.png) | ![Manage](docs/images/manage-models.png) |

## CI

仓库包含 `.github/workflows/ci.yml` 中的 `CI` 工作流，会执行：

- `npm install`
- `npm run lint`
- `npm run build`

## 许可证

MIT，见 [LICENSE](LICENSE)。
