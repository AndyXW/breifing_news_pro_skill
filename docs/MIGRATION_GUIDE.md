# 迁移指南 - 从 v4.0 到 Pro v1.0

**A 股投研参考 Pro v1.0** 相比 **v4.0 游资机构版** 的重大架构升级

---

## 🎯 核心变化

### v4.0 架构

```
┌─────────────────────────────────────┐
│   v4.0 (硬编码 API Key)             │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  skill.json                 │  │
│   │  - TAVILY_API_KEY: xxx      │  │ ❌ 硬编码
│   │  - DEEPSEEK_API_KEY: xxx    │  │ ❌ 硬编码
│   │  - userId: ou_xxx           │  │ ❌ 硬编码
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  config-v3.js               │  │
│   │  - API Key 硬编码            │  │ ❌ 泄露风险
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Pro v1.0 架构

```
┌─────────────────────────────────────────┐
│   Pro v1.0 (环境变量配置)               │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │  .env (用户自行配置)            │  │ ✅ 安全
│   │  - TAVILY_API_KEY=user_input    │  │
│   │  - DEEPSEEK_API_KEY=optional    │  │
│   │  - FEISHU_USER_ID=user_input    │  │
│   └─────────────────────────────────┘  │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │  OpenClaw 内置 AI 能力           │  │ ✅ 推荐
│   │  - 无需额外 API Key              │  │
│   │  - 支持多种模型切换              │  │
│   └─────────────────────────────────┘  │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │  问财量化评分 (Python 脚本)      │  │ ✅ 集成
│   │  - 4 维量化数据                  │  │
│   │  - JSON 文件交换                 │  │
│   └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📊 功能对比

| 功能 | v4.0 | Pro v1.0 | 改进说明 |
|------|------|----------|----------|
| **API Key 管理** | ❌ 硬编码 | ✅ 环境变量 | 安全性大幅提升 |
| **AI 能力** | DeepSeek API | OpenClaw 内置 AI | 成本更低，更灵活 |
| **问财集成** | ❌ 无 | ✅ Python 脚本调用 | 量化评分增强 |
| **部署文档** | ❌ 无 | ✅ 完整文档 | 5 分钟快速部署 |
| **隐私保护** | ❌ 用户 ID 硬编码 | ✅ 用户自行配置 | 无隐私泄露 |
| **可发布性** | ❌ 不可发布 | ✅ 可公开发布 | 适合分享 |
| **模块化** | ⚠️ 部分 | ✅ 完全模块化 | 易维护扩展 |
| **配置验证** | ❌ 无 | ✅ check-env.js | 快速排查问题 |

---

## 🔄 迁移步骤

### 从 v4.0 升级到 Pro v1.0

#### 步骤 1：备份旧版本

```bash
# 备份 v4.0 目录
cp -r ~/.openclaw/skills/a-share-research-briefing-v4 \
      ~/.openclaw/skills/a-share-research-briefing-v4.backup
```

#### 步骤 2：安装新版本

```bash
# Pro v1.0 已安装
cd ~/.openclaw/skills/a-share-research-pro
```

#### 步骤 3：迁移配置

**v4.0 配置位置**：
```
~/.openclaw/skills/a-share-research-briefing-v4/skill.json
~/.openclaw/skills/a-share-research-briefing-v4/scripts/config-v3.js
```

**Pro v1.0 配置位置**：
```
~/.openclaw/skills/a-share-research-pro/.env
```

**迁移方法**：
```bash
# 1. 复制配置模板
cp .env.example .env

# 2. 编辑 .env，填入你的 API Key
notepad .env

# Tavily API Key（必需）
TAVILY_API_KEY=tvly-dev-xxxxx

# DeepSeek API Key（可选，不使用则注释）
# DEEPSEEK_API_KEY=sk-xxxxx

# 飞书用户 ID（可选）
FEISHU_USER_ID=ou_xxxxx
```

#### 步骤 4：验证配置

```bash
npm run check-env
```

**预期输出**：
```
✅ 所有必需配置已正确设置！

📊 AI 配置说明:
   使用 OpenClaw 内置 AI 能力（推荐）
```

#### 步骤 5：测试运行

```bash
npm run evening
```

---

## ⚠️ 重要变更说明

### 1. API Key 管理方式变更

**v4.0**：
```javascript
// ❌ 硬编码在 skill.json 和 config-v3.js 中
TAVILY_API_KEY: 'tvly-dev-xxxxx'
DEEPSEEK_API_KEY: 'sk-xxxxx'
```

**Pro v1.0**：
```bash
# ✅ 环境变量配置（.env 文件）
TAVILY_API_KEY=tvly-dev-xxxxx
DEEPSEEK_API_KEY=sk-xxxxx  # 可选
```

**影响**：
- ✅ 更安全，不会泄露
- ✅ 不同环境可使用不同配置
- ⚠️ 需要手动配置 .env 文件

---

### 2. AI 能力来源变更

**v4.0**：
```javascript
// ❌ 使用独立 DeepSeek API
const apiKey = 'sk-e645343fb9ea4f2fa3576bb098384120';
fetch('https://api.deepseek.com/v1/chat/completions', ...);
```

**Pro v1.0**：
```javascript
// ✅ 使用 OpenClaw 内置 AI 能力
// 由 OpenClaw 框架统一调度
// 支持 qwen3.5-plus / kimi-k2.5 等模型
```

**影响**：
- ✅ 不需要额外 API Key
- ✅ 节省成本
- ✅ 灵活切换模型
- ⚠️ 需要 OpenClaw 框架支持

---

### 3. 问财量化评分集成

**v4.0**：
```
❌ 无问财集成
```

**Pro v1.0**：
```javascript
// ✅ 调用 Python 脚本获取问财数据
execSync('python query_wencai_quant.py');
const scores = JSON.parse(readFileSync('wencai_scores.json'));

// 在简报中使用量化评分
b += `**核心主线**：AI（量化评分 85 分，排名第 1 🟢）\n`;
```

**影响**：
- ✅ 增强投研参考价值
- ✅ 客观量化数据支撑
- ⚠️ 需要 Python 环境和 pywencai

---

### 4. 目录结构变更

**v4.0**：
```
a-share-research-briefing-v4/
├── skill.json (硬编码配置)
├── scripts/
│   ├── index-v4.js
│   ├── config-v3.js (硬编码配置)
│   ├── news-fetcher-v3.js
│   └── AI_PROMPT_v4.md
```

**Pro v1.0**：
```
a-share-research-pro/
├── skill.json (无敏感信息)
├── .env (用户配置，.gitignore 保护)
├── .env.example (配置模板)
├── .gitignore (保护敏感文件)
├── README.md (完整文档)
├── package.json (依赖管理)
├── scripts/
│   ├── index.js (主入口)
│   ├── config.js (配置读取)
│   ├── news-fetcher.js (新闻获取)
│   ├── ai-analyzer.js (AI 分析)
│   ├── AI_PROMPT.md (AI 提示词)
│   ├── check-env.js (配置验证)
│   └── test.js (功能测试)
└── docs/
    ├── QUICKSTART.md (快速部署)
    ├── INTEGRATION_WENCAI.md (问财集成)
    └── ARCHITECTURE.md (架构说明)
```

**影响**：
- ✅ 更规范的项目结构
- ✅ 完整的文档体系
- ✅ 易于维护和扩展

---

## 🎯 升级优势

### 安全性

| 项目 | v4.0 | Pro v1.0 |
|------|------|----------|
| API Key 硬编码 | ❌ 是 | ✅ 否 |
| 用户 ID 硬编码 | ❌ 是 | ✅ 否 |
| .gitignore 保护 | ❌ 无 | ✅ 有 |
| 配置验证工具 | ❌ 无 | ✅ 有 |

### 功能性

| 功能 | v4.0 | Pro v1.0 |
|------|------|----------|
| 问财量化评分 | ❌ 无 | ✅ 集成 |
| 配置验证 | ❌ 无 | ✅ check-env.js |
| 功能测试 | ❌ 无 | ✅ test.js |
| 快速部署 | ❌ 无 | ✅ 5 分钟 |

### 文档

| 文档类型 | v4.0 | Pro v1.0 |
|---------|------|----------|
| README | ❌ 无 | ✅ 完整 |
| 快速开始 | ❌ 无 | ✅ QUICKSTART.md |
| 架构说明 | ❌ 无 | ✅ ARCHITECTURE.md |
| 集成指南 | ❌ 无 | ✅ INTEGRATION_WENCAI.md |
| 更新日志 | ❌ 无 | ✅ CHANGELOG.md |

---

## ⚡ 快速迁移（3 步完成）

### 方法一：全新安装（推荐）

```bash
# 1. 进入 Skill 目录
cd ~/.openclaw/skills/a-share-research-pro

# 2. 配置环境变量
cp .env.example .env
notepad .env  # 填入 Tavily API Key

# 3. 测试运行
npm run evening
```

### 方法二：保留 v4.0 配置

```bash
# 1. 从 v4.0 复制 API Key
# 从 skill.json 中获取 TAVILY_API_KEY

# 2. 粘贴到 Pro v1.0 的 .env
TAVILY_API_KEY=从 v4.0 复制

# 3. 测试运行
npm run evening
```

---

## ❓ 常见问题

### Q: 迁移后原来的 v4.0 还能用吗？

A: 可以！两个版本独立，互不影响。建议：
1. 保留 v4.0 作为备份
2. 使用 Pro v1.0 作为主版本
3. 确认 Pro v1.0 正常后再删除 v4.0

---

### Q: 迁移后需要重新配置 API Key 吗？

A: 需要，但只需配置一次：
```bash
cp .env.example .env
notepad .env  # 填入 API Key
```

---

### Q: 迁移后定时任务需要重新配置吗？

A: 需要。在 OpenClaw 中更新定时任务配置：
```json
{
  "schedule": {
    "evening": {
      "cron": "0 21 * * 1-5",
      "command": "node scripts/index.js --edition evening"
    }
  }
}
```

---

### Q: 迁移后问财量化评分如何启用？

A: 确保问财 Skill 已安装并配置：
```bash
# 确认问财 Skill 存在
ls ~/.openclaw/skills/wencai-quant-score

# 测试问财查询
cd ~/.openclaw/skills/wencai-quant-score/scripts
python query_wencai_quant.py
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [QUICKSTART.md](./QUICKSTART.md) | 5 分钟快速部署 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 架构说明 |
| [INTEGRATION_WENCAI.md](./INTEGRATION_WENCAI.md) | 问财集成指南 |
| [README.md](../README.md) | 完整使用文档 |

---

*迁移指南版本：v1.0 | 更新时间：2026-03-22*
