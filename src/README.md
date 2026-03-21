# src 目录说明

## 模块定位

`src/` 是当前前端应用的主代码目录，承载页面入口、界面组件、配置定义、国际化资源、通用工具与服务逻辑。

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
- 平级相关文档：
  - `./App.tsx`
  - `./main.tsx`
  - `./types.ts`
  - `./constants.ts`

## 当前目录职责

当前 `src/` 主要负责：
- 应用启动
- 页面主编排
- UI 组件
- Provider / 模型配置定义
- 配置持久化、加密解密
- LLM 调用封装
- 国际化资源

## 当前结构特点

当前项目仍是“以 `App.tsx` 为总控”的单页结构，业务边界已经能看出来，但还没有完全演化成目标骨架中的 `features / entities / integrations / app / pages` 分层。

也就是说：
- 这里既包含现有实现
- 也作为后续向目标骨架演进的起点

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
