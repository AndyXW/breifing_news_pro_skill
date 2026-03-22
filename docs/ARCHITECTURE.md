# 架构说明

**A 股投研参考 Pro v1.0** 的技术架构和设计决策

---

## 🏗️ 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw 框架                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │        A 股投研参考 Pro (Node.js)                │  │
│  │                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │ Tavily API   │  │ 问财量化评分 │              │  │
│  │  │ (新闻搜索)   │  │ (Python 脚本) │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  │         │                  │                      │  │
│  │         └────────┬─────────┘                      │  │
│  │                  ▼                                │  │
│  │  ┌───────────────────────────────────┐           │  │
│  │  │    OpenClaw 内置 AI 能力           │           │  │
│  │  │    (qwen3.5-plus / kimi 等)       │           │  │
│  │  └───────────────────────────────────┘           │  │
│  │                  │                                │  │
│  │                  ▼                                │  │
│  │  ┌───────────────────────────────────┐           │  │
│  │  │     生成投研简报 (Markdown)        │           │  │
│  │  └───────────────────────────────────┘           │  │
│  │                  │                                │  │
│  └──────────────────┼────────────────────────────────┘  │
│                     ▼                                    │
│         ┌───────────────────────┐                       │
│         │   飞书推送 (可选)      │                       │
│         └───────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 核心组件

### 1. Node.js 主程序

**职责**：
- 协调各模块执行
- 调用 Tavily API 获取新闻
- 调用 Python 脚本获取问财数据
- 准备 AI 分析输入数据
- 输出最终简报

**文件**：
- `scripts/index.js` - 主入口
- `scripts/config.js` - 配置管理
- `scripts/news-fetcher.js` - 新闻获取
- `scripts/ai-analyzer.js` - AI 分析（降级模板）

---

### 2. Tavily API 集成

**职责**：
- 6 大模块新闻搜索
- 高级搜索参数配置
- 新闻去重和分类

**搜索模块**：
1. 宏观政策（15 条）
2. 晚间公告（15 条）
3. 外盘映射（15 条）
4. 机构复盘（15 条）
5. A 股收评（15 条）
6. 行业深度（15 条）

**配置**：
```javascript
TAVILY: {
  SEARCH_DEPTH: 'advanced',
  TIME_RANGE: 'day',
  INCLUDE_RAW_CONTENT: true
}
```

---

### 3. 问财量化评分集成

**职责**：
- 提供行业板块 4 维量化数据
- 资金/价格/情绪/估值评分
- 100 分制综合排名

**调用方式**：
```javascript
// 执行 Python 脚本
execSync('python query_wencai_quant.py', {
  cwd: wencaiDir,
  stdio: 'inherit'
});

// 读取 JSON 文件
const scores = JSON.parse(readFileSync(jsonPath, 'utf-8'));
```

**输出格式**：
```json
{
  "date": "2026-03-22",
  "scores": {
    "AI": {
      "total": 85,
      "capital": 35,
      "price": 22,
      "sentiment": 18,
      "valuation": 10,
      "rank": 1
    }
  },
  "top5": ["AI", "Semiconductor", "NewEnergy", "Metals", "Biotech"]
}
```

---

### 4. OpenClaw 内置 AI 能力

**核心设计**：
- ✅ **不使用**独立 DeepSeek API Key
- ✅ 使用 OpenClaw 框架内置 AI 模型
- ✅ 支持多种模型（qwen3.5-plus / kimi 等）
- ✅ 由 OpenClaw 框架统一调度

**AI 分析流程**：
```
1. Node.js 准备新闻数据 + 问财评分
2. 传递给 OpenClaw 框架
3. OpenClaw 调用内置 AI 模型分析
4. 返回 AI 生成的简报内容
5. Node.js 输出/推送简报
```

**优势**：
- 🔒 不需要额外 API Key
- 💰 节省 API 成本
- 🔄 灵活切换模型
- 📊 统一的 AI 能力管理

---

## 🔄 执行流程

### 完整版（含问财集成）

```
[开始]
  │
  ├─→ [Step 0] 验证配置（Tavily API Key）
  │
  ├─→ [Step 1] 获取新闻（Tavily API）
  │     └─→ 6 大模块，共 90 条
  │
  ├─→ [Step 1.5] 按板块分类
  │
  ├─→ [Step 1.6] 调用问财量化评分（Python）
  │     ├─→ 执行 query_wencai_quant.py
  │     └─→ 读取 wencai_scores.json
  │
  ├─→ [Step 2] 准备 AI 分析
  │     └─→ 新闻数据 + 问财评分 → OpenClaw AI
  │
  ├─→ [Step 3] OpenClaw AI 分析
  │     └─→ 生成 Markdown 简报
  │
  ├─→ [Step 4] 输出简报
  │     ├─→ 控制台输出
  │     └─→ 飞书推送（可选）
  │
  └─→ [完成]
```

### 降级版（无问财数据）

```
[开始]
  │
  ├─→ [Step 0] 验证配置
  │
  ├─→ [Step 1] 获取新闻
  │
  ├─→ [Step 1.5] 按板块分类
  │
  ├─→ [Step 1.6] 问财集成失败
  │     └─→ 跳过，继续执行
  │
  ├─→ [Step 2] 准备 AI 分析（仅新闻数据）
  │
  ├─→ [Step 3] OpenClaw AI 分析
  │
  ├─→ [Step 4] 输出简报（无量化评分）
  │
  └─→ [完成]
```

---

## 📊 数据流

### 新闻数据流

```
Tavily API
  │
  ├─→ 宏观政策（15 条）
  ├─→ 晚间公告（15 条）
  ├─→ 外盘映射（15 条）
  ├─→ 机构复盘（15 条）
  ├─→ A 股收评（15 条）
  └─→ 行业深度（15 条）
        │
        └─→ 去重 → 分类 → AI 分析
```

### 问财数据流

```
问财 API (pywencai)
  │
  ├─→ 资金流向查询
  ├─→ 价格表现查询
  ├─→ 市场情绪查询
  └─→ 估值水平查询
        │
        └─→ 量化评分 → JSON 文件 → AI 分析
```

---

## 🔧 配置管理

### 环境变量

| 变量 | 必需 | 用途 |
|------|------|------|
| `TAVILY_API_KEY` | ✅ | Tavily 新闻搜索 |
| `DEEPSEEK_API_KEY` | ❌ | 可选，不使用 |
| `FEISHU_USER_ID` | ❌ | 飞书推送 |

### 配置文件

```
.env                    # 实际配置（.gitignore 保护）
.env.example            # 配置模板
scripts/config.js       # 配置读取和验证
```

---

## 🛡️ 安全设计

### API Key 保护

1. **无硬编码**：所有 API Key 通过环境变量配置
2. **.gitignore**：`.env` 文件不会被提交
3. **最小权限**：仅必需的配置才验证

### 隐私保护

1. **无用户 ID 硬编码**：由用户自行配置
2. **本地执行**：所有数据处理在本地完成
3. **可选推送**：飞书推送是可选功能

---

## 📈 性能优化

### 并行获取新闻

```javascript
// 6 大模块并行获取
const results = await Promise.all(
  modules.map(m => fetchNewsFromTavily(m))
);
```

### 问财数据缓存

```javascript
// 问财每日 16:00 生成 JSON
// 投研参考 21:00 直接读取
// 避免重复调用 API
```

### AI 分析批量处理

```javascript
// 一次调用处理 80 条新闻
// 避免多次 API 调用
const aiResult = await analyzeNewsWithAI(news, 80);
```

---

## 🎯 设计决策

### 为什么使用 OpenClaw 内置 AI？

**原因**：
1. ✅ **成本更低**：不需要额外购买 API
2. ✅ **统一管理**：OpenClaw 框架统一调度
3. ✅ **灵活切换**：支持多种模型
4. ✅ **简化配置**：用户不需要配置多个 API Key

**对比**：
| 方案 | 成本 | 配置复杂度 | 灵活性 |
|------|------|-----------|--------|
| OpenClaw 内置 AI | 低 | 低 | 高 |
| 独立 DeepSeek API | 中 | 中 | 中 |
| 多 API 备份 | 高 | 高 | 高 |

---

### 为什么集成问财量化评分？

**原因**：
1. ✅ **客观数据**：基于真实市场数据
2. ✅ **多维度**：资金/价格/情绪/估值
3. ✅ **量化评分**：100 分制易于理解
4. ✅ **权威来源**：同花顺问财 API

**集成方式**：
- Python 脚本独立执行
- JSON 文件数据交换
- 零耦合设计

---

## 📝 扩展指南

### 添加新的数据源

1. 在 `scripts/` 目录创建新模块
2. 在 `index.js` 中调用
3. 在 `config.js` 中添加配置

### 支持更多 AI 模型

在 OpenClaw 配置中切换：
```json
{
  "model": "qwen3.5-plus"  // 或 "kimi-k2.5"
}
```

### 自定义输出格式

编辑 `scripts/ai-analyzer.js`：
```javascript
export function generateBriefing(news, edition, scores) {
  // 自定义模板
}
```

---

## 🔍 故障排查

### 问题 1：问财脚本执行失败

**解决**：
1. 确认 Python 已安装：`python --version`
2. 确认 pywencai 已安装：`pip install pywencai`
3. 确认 Cookie 有效

### 问题 2：Tavily API 配额不足

**解决**：
1. 减少 `MAX_NEWS_PER_MODULE`
2. 升级到 Tavily 付费计划
3. 使用其他新闻源补充

### 问题 3：AI 分析结果不满意

**解决**：
1. 调整 AI Prompt（`scripts/AI_PROMPT.md`）
2. 切换 AI 模型（OpenClaw 配置）
3. 优化输入数据质量

---

*架构文档版本：v1.0 | 更新时间：2026-03-22*
