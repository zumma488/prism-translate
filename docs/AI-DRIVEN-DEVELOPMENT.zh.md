# AI驱动开发实践

> 从设计→Bug修复→上线全靠AI！

**Prism Translate** - 一个完全由AI Agent协作开发的现代化AI翻译Dashboard。

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-6.0-black)](https://sdk.vercel.ai)

## 项目简介

本项目展示了完整的AI驱动开发流程：
- **UI设计** → Google Stitch 生成视觉稿
- **代码开发** → Claude Code + Google AI Studio 实现
- **Bug修复** → AI Agent 调试解决
- **部署上线** → 自动化 CI/CD 流程

## 核心功能

- ✨ **17+ AI提供商**：Google Gemini、OpenAI、Anthropic、DeepSeek、智谱AI、Kimi、通义千问...
- 🎯 **按语言选择模型**：每种目标语言可使用不同AI模型
- ⚡ **渐进式显示**：流式输出翻译结果
- 🔐 **端到端加密**：API Key 使用 AES-GCM 加密存储
- 🌍 **多语言界面**：支持英语、中文、日语

## 技术架构

### 核心技术栈
```json
{
  "框架": "React 19.2.4 + TypeScript 5.8.2",
  "构建": "Vite 6.2.0",
  "样式": "Tailwind CSS v4 + shadcn/ui",
  "AI SDK": "Vercel AI SDK 6.0.71",
  "加密": "Web Crypto API (AES-GCM)"
}
```

### 开发时间线

```
Day 1:     需求分析 → UI设计稿（Stitch生成）
Day 2-3:   架构搭建 → React 19 + Vite + Tailwind v4
Day 4-5:   AI接入 → 集成17家AI提供商
Day 6-7:   进阶功能 → 加密存储、国际化、配置导入导出
Day 8-10:  迭代优化 → v0.2.0 按语言选择模型功能
```

**总计**：10天，50+次Git提交，约4,000行代码，**零手工编码**

## 多Provider系统设计

Provider定义中心化：

```typescript
// src/config/models.ts
export const PROVIDER_DEFINITIONS: ProviderDefinition[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    icon: 'token',
    defaultModel: 'gemini-2.0-flash',
    category: 'popular',
  },
  // ... 17+ providers
];
```

## Bug修复实录

### 1. 移动端Dialog不可见
**问题**：手机上点击设置，Dialog弹不出来  
**解决**：使用显式定位替代百分比高度

### 2. 加密数据损坏
**问题**：加密数据损坏导致应用白屏  
**解决**：增加try-catch和自动重置机制

### 3. Web Crypto非安全上下文
**问题**：局域网IP访问时加密功能报错  
**解决**：降级使用crypto-js兼容非安全环境

### 4. 移动端返回按钮
**问题**：返回按钮直接退出整个应用  
**解决**：拦截popstate事件，改为关闭Modal

## 项目数据

| 指标 | 数值 |
|------|------|
| 开发时间 | 10天 |
| 代码行数 | ~4,000行 |
| Git提交 | 50+ |
| AI提供商 | 17家 |
| UI组件 | 17个 shadcn/ui |
| 语言支持 | 英/中/日 |
| 版本迭代 | 3个 |

## 经验总结

### AI擅长
✅ 代码生成（给定清晰的Prompt）  
✅ 架构设计和模块化  
✅ Bug修复（给定错误上下文）  
✅ 文档编写  
✅ 重复性配置任务

### AI局限
❌ 需求澄清（需要人工确认）  
❌ 复杂的多文件调试  
❌ UI细节的审美判断  
❌ 无指导的性能优化

## 快速开始

```bash
git clone https://github.com/zumma488/prism-translate.git
cd prism-translate
npm install
npm run dev
```

## 相关链接

- **在线体验**: [zumma488.github.io/prism-translate](https://zumma488.github.io/prism-translate)
- **GitHub仓库**: [github.com/zumma488/prism-translate](https://github.com/zumma488/prism-translate)
- **英文版本**: [./AI-DRIVEN-DEVELOPMENT.md](./AI-DRIVEN-DEVELOPMENT.md)
- **掘金文章**: [juejin.cn](https://juejin.cn) (待发布)

---

**开源协议**: MIT  
**作者**: [@zumma488](https://github.com/zumma488)
