# 集成指南 - 问财量化评分

本指南说明如何将 **问财量化评分 Skill** 集成到 **A 股投研参考 Pro** 中。

---

## 📦 依赖关系

| Skill | 版本 | 必需性 | 用途 |
|-------|------|--------|------|
| **wencai-quant-score** | v1.0+ | 可选 | 提供行业板块 4 维量化评分 |

---

## 🎯 集成效果

集成后，投研参考简报将包含量化评分数据：

```markdown
**二、🔥 今日主线复盘与资金嗅觉 (Mainlines & Money Flow)**

• **核心主线**：AI 算力（量化评分 85 分，排名第 1 🟢）
  - **催化内核**：央行推进金融 AI 应用 + 资金大幅流入
  - **高标核心**：XX 股份晋级 5 连板
  - **机构净买入方向**：AI 算力（CPO/光模块）
```

---

## 🔧 集成方式

### 方式一：读取 JSON 文件（推荐）

问财量化评分每日 16:00 自动生成 JSON 文件，投研参考直接读取：

```javascript
// 在 ai-analyzer.js 中添加
import { readFileSync } from 'fs';
import { join } from 'path';

function loadWencaiScores() {
  try {
    const wencaiPath = join(__dirname, '../../wencai-quant-score/data/wencai_scores.json');
    const scores = JSON.parse(readFileSync(wencaiPath, 'utf-8'));
    return scores;
  } catch (error) {
    console.log('⚠️ 未找到问财量化评分文件，跳过集成');
    return null;
  }
}

// 在生成简报时使用
const wencaiScores = loadWencaiScores();
if (wencaiScores) {
  // 在简报中加入量化评分
  briefing += `\n**行业量化评分 Top 3**:\n`;
  briefing += `1. ${wencaiScores.top5[0]} (${wencaiScores.scores[wencaiScores.top5[0]].total}分 🟢)\n`;
  briefing += `2. ${wencaiScores.top5[1]} (${wencaiScores.scores[wencaiScores.top5[1]].total}分 🟢)\n`;
  briefing += `3. ${wencaiScores.top5[2]} (${wencaiScores.scores[wencaiScores.top5[2]].total}分 🟡)\n`;
}
```

---

### 方式二：调用 Python 脚本

在投研参考生成前，先执行问财量化评分脚本：

```javascript
// 在 index.js 中添加
import { execSync } from 'child_process';

// Step 1.5: 生成量化评分
console.log('[Step 1.5] 生成问财量化评分...');
try {
  execSync('python ../../wencai-quant-score/scripts/query_wencai_quant.py', {
    stdio: 'inherit'
  });
  console.log('✅ 量化评分生成完成\n');
} catch (error) {
  console.log('⚠️ 量化评分生成失败，跳过\n');
}
```

---

### 方式三：环境变量配置

在 `.env` 中添加问财配置路径：

```bash
# 问财量化评分路径
WENCAI_SCORE_PATH=~/.openclaw/skills/wencai-quant-score/data/wencai_scores.json

# 是否启用量化评分集成
ENABLE_WENCAI_INTEGRATION=true
```

在 `config.js` 中读取：

```javascript
WENCAI: {
  ENABLED: process.env.ENABLE_WENCAI_INTEGRATION === 'true',
  SCORE_PATH: process.env.WENCAI_SCORE_PATH
}
```

---

## 📊 数据映射

### 问财板块 → 投研行业

| 问财板块 | 投研行业 | 说明 |
|---------|---------|------|
| 人工智能、AI、计算机 | AI | 统一为 AI 板块 |
| 半导体、芯片 | Semiconductor | 半导体/芯片合并 |
| 电池、光伏、风电 | NewEnergy | 新能源统一分类 |
| 新能源汽车 | EV | 电动车单独分类 |
| 有色金属 | Metals | 包含金属/矿业 |
| 电力、电网 | Grid | 电力电网统一 |
| 银行、保险、券商 | Finance | 大金融统一 |

---

## 🎨 输出增强

### 原始输出（无问财集成）

```markdown
**二、🔥 今日主线复盘与资金嗅觉**

• **核心主线**：AI 算力
  - **催化内核**：央行推进金融 AI 应用
  - **高标核心**：XX 股份晋级 5 连板
```

### 增强输出（集成问财）

```markdown
**二、🔥 今日主线复盘与资金嗅觉**

• **核心主线**：AI 算力（量化评分 85 分，排名第 1 🟢）
  - **催化内核**：央行推进金融 AI 应用 + 资金大幅流入
  - **高标核心**：XX 股份晋级 5 连板
  - **4 维评分**：
    - 💰 资金面：35/40（主力大幅流入）
    - 📈 价格面：22/25（1 日 +3.5%）
    - 🔥 情绪面：18/20（涨停 15 家）
    - 💎 估值面：10/15（PE 百分位 60%）
```

---

## ⚙️ 配置步骤

### 步骤 1：确认问财量化评分正常运行

```bash
cd ~/.openclaw/skills/wencai-quant-score/scripts
python query_wencai_quant.py
```

**预期输出**：
```
✅ Saved to: data/wencai_scores_20260322.json
```

### 步骤 2：验证 JSON 文件

```bash
cat ../data/wencai_scores_20260322.json
```

**预期内容**：
```json
{
  "date": "2026-03-22",
  "scores": {
    "AI": { "total": 85, "rank": 1 },
    "Semiconductor": { "total": 78, "rank": 2 }
  },
  "top5": ["AI", "Semiconductor", "NewEnergy", "Metals", "Biotech"]
}
```

### 步骤 3：在投研参考中集成

选择上述三种方式之一，推荐**方式一**（读取 JSON 文件）。

### 步骤 4：测试验证

```bash
cd ~/.openclaw/skills/a-share-research-pro
npm run evening
```

检查输出中是否包含量化评分数据。

---

## 🔍 故障排查

### 问题 1：找不到 JSON 文件

**现象**：`Error: ENOENT: no such file or directory`

**解决**：
1. 确认问财量化评分已运行：`python query_wencai_quant.py`
2. 检查文件路径是否正确
3. 确认文件权限

### 问题 2：JSON 格式错误

**现象**：`SyntaxError: Unexpected token`

**解决**：
1. 检查 JSON 文件是否完整
2. 确认问财脚本正常运行
3. 添加错误处理（try-catch）

### 问题 3：板块名称不匹配

**现象**：某些板块未显示评分

**解决**：
1. 检查行业映射规则
2. 在 `match_sector_to_industry()` 中添加新映射
3. 统一板块命名规范

---

## 📈 最佳实践

### 1. 定时任务协调

```
每日 16:00 → 问财量化评分（生成 JSON）
每日 21:00 → 投研参考（读取 JSON 生成简报）
```

### 2. 数据缓存

```javascript
// 缓存量化评分，避免重复读取
let cachedScores = null;
let cacheTime = null;

function getScores() {
  const now = Date.now();
  if (cachedScores && cacheTime && (now - cacheTime) < 3600000) {
    return cachedScores;  // 1 小时内使用缓存
  }
  cachedScores = loadWencaiScores();
  cacheTime = now;
  return cachedScores;
}
```

### 3. 降级处理

```javascript
// 如果问财数据不可用，使用降级逻辑
if (!wencaiScores) {
  // 使用新闻数量作为热度参考
  const sectorHeat = countNewsBySector(newsList);
  briefing += `**热点板块**：${Object.keys(sectorHeat).join('、')}\n`;
}
```

---

## 📝 示例代码

完整的集成示例见：`scripts/integration-example.js`

---

## 🔗 相关文档

- [问财量化评分 SKILL.md](../../wencai-quant-score/SKILL.md)
- [投研参考 Pro README.md](../README.md)
- [项目结构说明](./STRUCTURE.md)

---

*本指南由 A 股投研参考 Pro 提供*
