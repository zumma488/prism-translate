# llmService 目录说明

## 模块定位

`src/services/llmService/` 是当前项目中最接近目标态 `integrations/llm` 的目录，负责统一模型创建、调用封装、响应解析与错误处理。

## 文档层级

- 当前层级：服务子模块级 / services.llmService
- 上级文档：
  - `../README.md`
  - `../../../docs/architecture/TARGET_ARCHITECTURE.md`
  - `../../../src/features/translation/README.md`
- 下级文档：无
- 平级相关文档：
  - `../configIO.ts`
  - `../crypto.ts`
  - `../../config/README.md`
  - `../../features/provider-management/README.md`

## 模块职责

当前这个目录主要负责：
- `createModel()`：根据 provider 配置实例化模型
- `translateText()`：执行翻译调用
- `safeFetch`：识别伪成功响应并转成错误
- 响应清洗：去除 `<think>`、提取 JSON、解析结果

## 非职责范围

这里不应直接负责：
- 结果卡片展示
- 设置弹窗逻辑
- 页面总控状态管理

## 当前关键文件

- `index.ts`
- `providers.ts`
- `safeFetch.ts`

## 实现约束

- 所有 LLM 调用细节应尽量从 UI 层抽离到这里。
- Provider 实例化和结果展示不能耦合。
- 未来如果切换到后端代理层，这里应成为最主要的替换入口。
