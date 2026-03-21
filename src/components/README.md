# components 目录说明

## 模块定位

`src/components/` 承载当前项目的大部分界面组件，包括翻译输入、结果展示、设置弹窗，以及一部分基础 UI 组件目录。

## 文档层级

- 当前层级：界面组件层级 / components
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/PROJECT_ANALYSIS.md`
- 下级文档：
  - `./settings/README.md`
- 平级相关文档：
  - `../features/README.md`
  - `../services/README.md`
  - `../config/README.md`

## 当前目录职责

当前这里主要包括：
- 翻译输入组件
- 翻译结果组件
- 设置相关组件
- UI 基础组件目录（`ui/`）

## 当前关键组件

- `TranslationInput.tsx`
- `TranslationGroup.tsx`
- `TranslationCard.tsx`
- `SettingsModal.tsx`
- `ModelSelectorPopover.tsx`

## 结构说明

当前项目还是“按组件目录集中组织”的结构，所以一部分本该属于 feature 的组件目前仍在这里。后续如果往目标骨架演进，应逐步把业务语义明确的组件迁到对应 feature 下。

## 阅读建议

- 想看设置组件 → `./settings/README.md`
- 想看 translation 业务边界 → `../features/translation/README.md`
- 想看服务逻辑 → `../services/README.md`
