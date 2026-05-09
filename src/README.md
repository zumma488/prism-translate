# src 目录说明

## 模块定位

`src/` 是当前应用的主代码目录，承载客户端界面、业务 feature、共享静态配置、国际化资源、通用工具以及服务端专用模块。

## 文档层级

- 当前层级：代码根目录级 / src
- 上级文档：
  - `../docs/architecture/README.md`
  - `../docs/architecture/PROJECT_ANALYSIS.md`
  - `../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：
  - `./components/README.md`
  - `./services/README.md`
  - `./config/README.md`
  - `./i18n/README.md`
  - `./features/README.md`（目标骨架说明，当前目录未完全落地）
  - `./server/config/README.md`
- 平级相关文档：
  - `./App.tsx`
  - `./main.tsx`
  - `./types.ts`
  - `./constants.ts`

## 当前目录职责

当前 `src/` 主要负责：
- Next.js 页面客户端编排
- 页面主编排
- UI 组件
- Provider / 模型配置定义
- 配置持久化、加密解密
- 服务端 LLM 调用封装
- 服务端运行时配置
- 国际化资源

配置边界：
- `src/constants.ts` 与 `src/config/` 只放客户端也能安全看到的静态配置。
- `src/server/config/` 只放服务端运行时配置，如私钥加载、请求超时和未来的服务端开关。
- 真实密钥文件放在 `.secrets/`，不要放进 `src/`。

## 当前结构特点

当前项目已经并回 Next.js App Router。`app/` 负责路由、布局和 API Route Handlers，`src/` 继续承载主要业务代码。`App.tsx` 仍主要承担页面级编排，translation / settings 的主要业务编排分别下沉到 `src/features/translation/` 与 `src/features/settings/`。

也就是说：
- 现有代码已经完成 Phase 1 所要求的主要职责拆分，并引入 Next.js 服务端边界
- 但整体目录仍未完全演化成目标骨架中的 `features / entities / integrations / pages` 分层
- 这里既包含现有实现，也作为后续是否继续演进的起点

## 阅读建议

### 如果你想理解当前 UI 结构
看：
- `./components/README.md`

### 如果你想理解当前服务层与 LLM 接入
看：
- `./services/README.md`

### 如果你想理解 Provider 静态配置
看：
- `./config/README.md`

### 如果你想理解未来骨架如何映射到当前代码
回看：
- `../docs/architecture/TARGET_ARCHITECTURE.md`
