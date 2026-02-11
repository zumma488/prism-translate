<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 运行并部署您的 AI Studio 应用

包含在本地运行应用所需的一切。

[在线演示](https://zumma488.github.io/prism-translate/)

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

## 技术栈 (Tech Stack)

- **框架**: React 19 + TypeScript + Vite
- **样式**: Tailwind CSS v4
- **UI 组件**: shadcn/ui
- **AI 集成**: Vercel AI SDK + Google Gemini + OpenAI
- **部署**: Vercel (Serverless Functions)

### AI Skills 参考

开发此项目时使用了以下 AI Skills（通用配置，无需随项目同步）：

| Skill                | 用途                              |
| -------------------- | --------------------------------- |
| `shadcn-ui`          | shadcn/ui 组件库安装和使用指南    |
| `tailwind-v4-shadcn` | Tailwind v4 与 shadcn/ui 集成配置 |
| `ai-sdk`             | Vercel AI SDK 使用指南            |
| `ui-ux-pro-max`      | UI/UX 设计规范和最佳实践          |

## 本地运行

**先决条件**: Node.js (v18 或更高版本)

1. 安装依赖:
   `npm install`
2. (可选) 如果使用云端提供商，请在 [.env.local](.env.local) 中设置 `GEMINI_API_KEY`。对于本地模型 (Ollama)，此步骤可跳过。
3. 运行应用:
   `npm run dev`
