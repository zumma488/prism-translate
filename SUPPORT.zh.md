# 支持说明

[English](./SUPPORT.md) | **简体中文**

## 去哪里寻求帮助

本仓库目前以 GitHub Issues 作为主要支持渠道。

- 如果你能稳定复现错误行为，请提交 Bug report。
- 如果你想提出产品或工作流改进建议，请提交 Feature request。
- 如果是安装、部署或 Provider 兼容性问题，而现有模板都不合适，也可以提交普通 issue。

## 提交 Issue 前

- 先阅读 [README.zh.md](README.zh.md)。
- 涉及部署或运行时问题时，先看 [SELF_HOSTING.zh.md](SELF_HOSTING.zh.md)。
- 涉及凭证流向、信任边界或安全模型时，先看 [TRUST_MODEL.zh.md](TRUST_MODEL.zh.md)。
- 提交前先搜索已有 issue，避免重复。

## Bug 和 Feature Request 的区别

以下情况更适合提交 Bug report：
- 应用崩溃
- Provider 流程异常失败
- 翻译、设置、导入导出或模型拉取行为不正确
- 文档中的安装或运行步骤与实际不一致

以下情况更适合提交 Feature request：
- 你希望支持新的工作流或 Provider 能力
- 你希望改进 UX
- 你希望增强部署文档、贡献流程或仓库维护工具

## 涉及安全敏感内容的问题

本仓库的安全相关问题仍通过公开 GitHub Issues 报告。

发布前请先完成脱敏：
- 删除或轮换真实凭证
- 不要附带包含真实数据的导出 `.prism` 文件
- 不要公开原始请求载荷、Provider headers 或包含 secrets 的日志
- 上传截图前先确认其中没有敏感信息

如果你无法在公开环境中安全描述问题，请先轮换受影响的凭证，再提交脱敏后的报告。具体规则见 [SECURITY.zh.md](SECURITY.zh.md)。

## 建议提供的信息

提问时建议附带：
- 你原本想完成什么
- 运行环境：浏览器、操作系统、Node 版本、部署目标
- 涉及的 Provider 类型
- 具体报错或可见现象
- 最小复现步骤

## 当前不承诺的内容

本仓库目前不承诺：
- 私下支持渠道
- 带 SLA 的响应时限
- 针对第三方部署环境的托管式支持

支持以 best-effort 方式在公开渠道中进行，让后续用户也能从讨论中获益。
