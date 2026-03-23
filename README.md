# A 股投研参考 Pro

**专业版 A 股投研复盘简报生成器** - 使用 AI 深度分析多源新闻，提供实战导向的交易策略参考

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

---

## 📖 简介

**A 股投研参考 Pro** 是一款专业的投研简报生成工具，每个交易日自动生成晨间/晚间版投研复盘，帮助投资者快速把握市场主线、资金动向和交易机会。

### 核心特性

- ✅ **6 大新闻模块**：宏观政策、晚间公告、外盘映射、机构复盘、A 股收评、行业深度
- ✅ **AI 深度分析**：使用 DeepSeek AI 判断新闻价值，生成专业投研简报
- ✅ **实战导向**：强制逻辑推导，杜绝废话，提供明确交易策略
- ✅ **双版本支持**：晨间盘前版（08:30）+ 晚间复盘版（21:00）
- ✅ **隐私安全**：无硬编码 API Key，所有敏感信息通过环境变量配置
- ✅ **可扩展**：支持与其他 Skill 协作（如问财量化评分）

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- Tavily API Key（用于新闻搜索）
- OpenClaw 框架（用于定时任务调度和 AI 分析）
- Python >= 3.8（可选，用于问财量化评分）

### 安装步骤

#### 1. 安装 Skill

```bash
cd ~/.openclaw/skills
git clone https://github.com/your-repo/a-share-research-pro.git
```

#### 2. 安装依赖

```bash
cd a-share-research-pro
npm install
```

#### 3. 配置环境变量

```bash
# 复制配置模板
cp .env.example .env

# 编辑 .env 文件，填入你的 API Key
# - TAVILY_API_KEY: 从 https://tavily.com/ 获取
# - FEISHU_USER_ID: 飞书用户 ID（可选，用于推送消息）
```

#### 4. 验证配置

```bash
npm run check-env
```

#### 5. 测试运行

```bash
# 生成晚间版简报
npm run evening

# 生成晨间版简报
npm run morning
```

---

## 📋 配置说明

### 必需配置

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `TAVILY_API_KEY` | Tavily Search API Key | https://tavily.com/ |

### 可选配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `FEISHU_USER_ID` | 飞书用户 ID（用于推送） | - |
| `FEISHU_APP_ID` | 飞书 App ID | - |
| `FEISHU_APP_SECRET` | 飞书 App Secret | - |
| `MAX_WORDS` | 最大生成字数 | 1500 |
| `MAX_NEWS_PER_MODULE` | 每个模块最大新闻数 | 15 |
| `MAX_AI_PROCESS` | AI 处理新闻上限 | 80 |

### 配置示例

```bash
# .env 文件示例
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_USER_ID=ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAX_WORDS=1500
```

---

## 📦 依赖 Skill

本 Skill 可独立运行，也可与以下 Skill 协作使用：

### 可选依赖

| Skill | 说明 | 用途 |
|-------|------|------|
| **wencai-quant-score** | 问财量化评分 | 获取行业板块 4 维量化数据（资金/价格/情绪/估值） |

### 当前状态

**问财量化评分**：暂不支持（网络问题）

**未来计划**：
- 修复问财 API 集成
- 添加真实资金流向数据
- 集成龙虎榜数据

---

## 📊 输出示例

### 晚间版简报

```markdown
**📅 【A 股投研复盘与推演】晚间版 | 2026-03-22 周六**
━━━━━━━━━━━━━━━━━━

**一、🌍 宏观政策与外盘映射 (Macro & Overseas)**

• **央行：深化业技融合推进金融 AI 应用**
  - **深度摘要**：首次明确"安全有序"原则，要求技术与业务紧密结合
  - **市场映射**：🟢 金融 IT/AI 软件 - 政策推动→金融 AI 需求明确→技术供应商受益

**二、🔥 今日主线复盘与资金嗅觉 (Mainlines & Money Flow)**

• **核心主线**：AI 算力 / 新能源
  - **催化内核**：央行推进金融 AI 应用 + 新能源业绩预告超预期
  - **高标核心**：XX 股份晋级 5 连板（AI）
  - **机构净买入方向**：AI 算力（CPO/光模块）

**三、📢 晚间重磅公告排雷与催化 (Announcements)**

• **XX 股份**：Q1 净利预增 200%
  - **研判**：🟢利好 - 超市场预期，验证行业景气度拐点

**四、🎯 明日推演与交易策略 (Strategy)**

• **情绪推演**：外盘科技股走弱，明日 A 股 AI 板块或面临分歧考验
• **操作建议**：回避高位连板缩量标的，关注底部首板的金融 IT 概念；仓位 6-7 成

━━━━━━━━━━━━━━━━━━
📍 2026-03-22 21:00 | 数据源：Tavily 智能检索聚合
```

---

## 🔧 使用方式

### 命令行运行

```bash
# 生成晚间版（默认）
node scripts/index.js

# 生成晚间版（明确指定）
node scripts/index.js --edition evening

# 生成晨间版
node scripts/index.js --edition morning

# 输出到飞书
node scripts/index.js --edition evening --output feishu
```

### npm 脚本

```bash
# 检查环境配置
npm run check-env

# 生成晚间版
npm run evening

# 生成晨间版
npm run morning

# 运行测试
npm test
```

### OpenClaw 定时任务

在 `skill.json` 中已配置定时任务：

```json
{
  "schedule": {
    "evening": {
      "cron": "0 21 * * 1-5",
      "command": "node scripts/index.js --edition evening"
    },
    "morning": {
      "cron": "0 8 * * 1-5",
      "command": "node scripts/index.js --edition morning"
    }
  }
}
```

---

## 🛠️ 开发指南

### 项目结构

```
a-share-research-pro/
├── scripts/
│   ├── index.js           # 主入口
│   ├── config.js          # 配置管理
│   ├── news-fetcher.js    # 新闻获取
│   ├── ai-analyzer.js     # AI 分析
│   ├── AI_PROMPT.md       # AI 提示词
│   └── check-env.js       # 环境检查
├── .env.example           # 环境变量模板
├── .gitignore             # Git 忽略文件
├── package.json           # 依赖管理
├── skill.json             # OpenClaw Skill 配置
└── README.md              # 本文档
```

### 添加新的新闻模块

1. 在 `config.js` 的 `SEARCH_MODULES` 中添加新模块
2. 在 `AI_PROMPT.md` 中更新输出模板
3. 测试验证

### 自定义 AI 提示词

编辑 `scripts/AI_PROMPT.md`，调整：
- 系统角色定义
- 输出模板格式
- 输出规则

---

## 🔒 隐私与安全

### 本 Skill 的安全措施

- ✅ **无硬编码 API Key**：所有敏感信息通过环境变量配置
- ✅ **无个人隐私**：不硬编码用户 ID，由用户自行配置
- ✅ **.gitignore 保护**：`.env` 文件不会被提交到版本控制
- ✅ **配置验证**：启动前自动检查必需配置

### 用户注意事项

- ⚠️ **不要分享 .env 文件**：包含你的 API Key
- ⚠️ **定期轮换 API Key**：建议每 3 个月更换一次
- ⚠️ **使用独立 API Key**：不要与其他项目共用

---

### v1.0.0 (2026-03-22)

- ✅ 初始版本发布
- ✅ 6 大新闻模块
- ✅ AI 深度分析
- ✅ 晨间/晚间双版本
- ✅ 完整部署文档
- ✅ 隐私安全保护

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

- **作者**: 闪电狗 ⚡
- **问题反馈**: https://github.com/your-repo/a-share-research-pro/issues

---

*Made with ❤️ for A-share investors*
