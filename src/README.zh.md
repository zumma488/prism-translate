[English](./README.md) | **简体中文**

# `src/` 目录

## 模块定位

`src/` 是 Prism Translate 面向客户端的主代码目录，承载 UI 编排、feature 模块、可复用组件、共享静态配置、i18n 资源、hooks 和通用工具。

当前仓库采用混合结构：
- `app/` 负责 App Router 路由和 API Handlers。
- `server/` 负责服务端执行边界。
- `src/` 继续作为客户端逻辑与前端共享代码的主要承载层。

## 当前职责

`src/` 当前负责：
- 客户端 UI 组合
- `App.tsx` 中的页面级编排
- `src/features/` 下的业务模块
- `src/components/` 下的可复用 UI 组件
- `src/config/` 下的 Provider 元数据与静态配置
- 仍部分保留在 `types.ts` 与 `constants.ts` 中的共享领域定义
- `src/i18n/` 下的国际化资源
- 面向前端的 hooks 与通用工具

配置边界：
- `src/config/` 与 `src/constants.ts` 只放可以安全下发到浏览器的静态数据。
- 服务端专用运行时设置不应放在这个目录。
- 真实密钥不应存放在 `src/` 中。

## 非职责范围

`src/` 不应被视为以下内容的所有者：
- App Router 路由定义
- API 路由处理器
- 服务端 Provider Proxy 执行逻辑
- 私有运行时密钥文件

这些应归属 `app/`、`server/` 或外部密钥存储。

## 当前代码映射

围绕该目录的重要入口包括：
- `src/App.tsx`
- `src/main.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/types.ts`
- `src/constants.ts`
- `src/features/`
- `src/components/`
- `src/services/`
- `src/config/`
- `src/i18n/`

## 相邻模块关系

- `../app/` 提供路由、布局与 API Handlers。
- `../app/settings/` 提供路由化设置中心壳层与页面入口，包括 `/settings/general`、`/settings/languages`、`/settings/providers`、`/settings/providers/select`、`/settings/providers/new`、`/settings/providers/[providerId]`、`/settings/providers/models` 与 `/settings/about`。
- `../server/` 提供 API 背后的翻译与 Provider 执行逻辑。
- `./features/` 定义面向业务能力的前端边界。
- `./services/` 提供共享配置与 LLM 访问基础设施。

## 阅读建议

- UI 结构：`./components/README.md` 或 `./components/README.zh.md`
- 业务模块：`./features/README.md` 或 `./features/README.zh.md`
- 服务层：`./services/README.md` 或 `./services/README.zh.md`
- Provider 元数据：`./config/README.md` 或 `./config/README.zh.md`
- 国际化：`./i18n/README.md` 或 `./i18n/README.zh.md`
