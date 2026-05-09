# i18n 目录说明

## 模块定位

`src/i18n/` 负责项目的界面国际化资源与国际化初始化逻辑。

## 文档层级

- 当前层级：国际化层级 / i18n
- 上级文档：
  - `../README.md`
  - `../../docs/architecture/PROJECT_ANALYSIS.md`
- 下级文档：无
- 平级相关文档：
  - `../components/README.md`
  - `../features/translation/README.md`

## 当前目录职责

- 管理 UI locale 资源
- 负责界面语言切换相关支持
- 区分“界面语言”和“翻译目标语言”两套体系

## 实现约束

- UI locale 不能和 translation target languages 混用。
- 国际化资源应保持独立，不应混入翻译业务逻辑。
