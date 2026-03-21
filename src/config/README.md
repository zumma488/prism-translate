# config 目录说明

## 模块定位

`src/config/` 负责承载当前项目中的静态配置定义，尤其是 Provider 定义、默认模型与相关元数据。

## 文档层级

- 当前层级：配置层级 / config
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/PROJECT_ANALYSIS.md`
  - `../../docs/architecture/TARGET_ARCHITECTURE.md`
- 下级文档：无
- 平级相关文档：
  - `../services/README.md`
  - `../features/provider-management/README.md`
  - `../entities/provider/README.md`

## 当前目录职责

当前这里主要负责：
- Provider 静态定义
- 默认模型集合
- 与 provider 展示有关的元信息

## 当前关键文件

- `models.ts`

## 实现约束

- 静态定义与运行时实例化逻辑应保持分层。
- Provider 元信息不应散落到多个不相关目录。
- 新增 provider 时，这里应是固定入口之一。
