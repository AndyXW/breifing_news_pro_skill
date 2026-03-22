# 项目结构

```
a-share-research-pro/
│
├── 📄 核心配置文件
│   ├── skill.json              # OpenClaw Skill 配置（无敏感信息）
│   ├── package.json            # Node.js 依赖管理
│   ├── .env.example            # 环境变量模板（用户复制使用）
│   ├── .env                    # 实际配置（由用户创建，.gitignore 忽略）
│   └── .gitignore              # Git 忽略文件（保护敏感信息）
│
├── 📚 文档
│   ├── README.md               # 完整部署文档和使用说明
│   ├── CHANGELOG.md            # 版本更新日志
│   ├── LICENSE                 # MIT 许可证
│   └── STRUCTURE.md            # 本文件（项目结构说明）
│
├── 📁 scripts/                 # 核心脚本
│   ├── index.js                # 主入口脚本
│   ├── config.js               # 配置管理（从环境变量读取）
│   ├── news-fetcher.js         # 新闻获取模块（Tavily API）
│   ├── ai-analyzer.js          # AI 分析模块（DeepSeek API）
│   ├── AI_PROMPT.md            # AI 提示词模板
│   ├── check-env.js            # 环境配置检查工具
│   └── test.js                 # 功能测试脚本
│
└── 📦 node_modules/            # 依赖包（npm install 自动生成）
    ├── dotenv                  # 环境变量加载
    └── node-fetch              # HTTP 请求库
```

---

## 文件说明

### 配置文件

| 文件 | 说明 | 是否包含敏感信息 |
|------|------|------------------|
| `skill.json` | OpenClaw Skill 配置 | ❌ 否 |
| `package.json` | Node.js 依赖和脚本 | ❌ 否 |
| `.env.example` | 配置模板（占位符） | ❌ 否 |
| `.env` | 实际配置（用户创建） | ✅ 是（已 .gitignore） |

### 核心脚本

| 文件 | 功能 | 行数 |
|------|------|------|
| `index.js` | 主入口，协调各模块 | ~100 行 |
| `config.js` | 配置管理 + 环境变量验证 | ~120 行 |
| `news-fetcher.js` | Tavily API 新闻获取 | ~80 行 |
| `ai-analyzer.js` | DeepSeek AI 分析 | ~150 行 |

### 文档

| 文件 | 说明 |
|------|------|
| `README.md` | 完整部署文档（安装、配置、使用、FAQ） |
| `CHANGELOG.md` | 版本历史和未来计划 |
| `LICENSE` | MIT 许可证 |

---

## 模块化架构

```
┌─────────────────────────────────────────┐
│           index.js (主入口)             │
│  - 解析命令行参数                        │
│  - 协调各模块执行                        │
│  - 输出结果                              │
└───────────────┬─────────────────────────┘
                │
        ┌───────┼───────┐
        │       │       │
        ▼       ▼       ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ config.js │ │news-      │ │ai-        │
│           │ │fetcher.js │ │analyzer.js│
│ - 环境    │ │           │ │           │
│   变量    │ │ - Tavily  │ │ - DeepSeek│
│ - 配置    │ │   API     │ │   AI      │
│   验证    │ │ - 新闻    │ │ - 简报    │
│           │ │   获取    │ │   生成    │
└───────────┘ └───────────┘ └───────────┘
```

---

## 安全设计

### ✅ 已实现

1. **无硬编码 API Key**：所有 API Key 通过环境变量配置
2. **无个人隐私**：用户 ID 由用户自行配置
3. **.gitignore 保护**：`.env` 文件不会被提交
4. **配置验证**：启动前自动检查必需配置
5. **模块化设计**：各模块职责清晰，便于审计

### 🔒 用户注意事项

1. 不要分享 `.env` 文件
2. 定期轮换 API Key
3. 使用独立的 API Key（不要与其他项目共用）

---

## 依赖 Skill

### 可选依赖

| Skill | 用途 | 集成方式 |
|-------|------|----------|
| `wencai-quant-score` | 行业板块量化评分 | 导入模块调用 |

### 集成示例

```javascript
// 在 ai-analyzer.js 中添加
import { getQuantScore } from '../../wencai-quant-score/lib.js';

const score = await getQuantScore('半导体');
// 在简报中加入量化评分
```

---

## 扩展指南

### 添加新的新闻模块

1. 编辑 `config.js`，在 `SEARCH_MODULES` 中添加新模块
2. 编辑 `AI_PROMPT.md`，更新输出模板
3. 测试验证

### 自定义 AI 提示词

编辑 `AI_PROMPT.md`：
- 修改系统角色定义
- 调整输出模板格式
- 添加/修改输出规则

### 支持更多 AI 模型

修改 `.env`：
```bash
DEEPSEEK_BASE_URL=https://api.other-ai.com/v1
DEEPSEEK_MODEL=other-model
```

---

*本文件由重构工具自动生成*
