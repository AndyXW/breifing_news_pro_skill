# 快速部署指南

**5 分钟完成 A 股投研参考 Pro 的部署和测试**

---

## ⚡ 快速开始（5 步完成）

### 步骤 1：确认 Skill 已安装

```bash
# 检查 Skill 目录
ls ~/.openclaw/skills/a-share-research-pro
```

**预期输出**：
```
.env  .env.example  .gitignore  README.md  skill.json  scripts/  package.json
```

---

### 步骤 2：安装依赖

```bash
cd ~/.openclaw/skills/a-share-research-pro
npm install
```

**预期输出**：
```
added 7 packages, and audited 8 packages in 3s
found 0 vulnerabilities
```

---

### 步骤 3：配置环境变量

环境变量已预配置，只需确认即可：

```bash
# 查看配置（已预填充）
cat .env
```

**已配置项**：
- ✅ `TAVILY_API_KEY`：tvly-dev-2eGAOK-...（邢总提供）
- ✅ `DEEPSEEK_API_KEY`：sk-e645343f...（使用原 v4.0 Key）
- ✅ `FEISHU_USER_ID`：ou_xxx...（邢总飞书 ID）

**如需修改**：
```bash
# 编辑 .env 文件
notepad .env
```

---

### 步骤 4：验证配置

```bash
npm run check-env
```

**预期输出**：
```
✅ 所有必需配置已正确设置！

可以运行以下命令测试:
  npm run evening  # 生成晚间版简报
  npm run morning  # 生成晨间版简报
```

---

### 步骤 5：测试运行

```bash
# 生成晚间版简报
npm run evening
```

**预期输出**：
```
========================================
  A 股投研参考 Pro v1.0
  Edition: evening
========================================

[Step 0] 验证配置...
✅ 环境变量验证通过

[Step 1] 获取新闻...
📊 各模块获取数量:
  • 宏观政策：15 条
  • 晚间公告：15 条
  • 外盘映射：15 条
  • 机构复盘：15 条
  • A 股收评：15 条
  • 行业深度：15 条

✅ 总计：90 条 → 去重后：85 条

[Step 2] AI 深度分析...
  调用 AI API（80 条新闻，批量处理）...
  ✅ AI 分析完成（1200 字符）

========================================
  最终简报
========================================

**📅 【A 股投研复盘与推演】晚间版 | 2026-03-22 周六**
━━━━━━━━━━━━━━━━━━

**一、🌍 宏观政策与外盘映射**
...
```

---

## 🎯 部署完成！

现在您可以：

### 手动运行

```bash
# 晚间版（复盘当日市场）
npm run evening

# 晨间版（盘前推演）
npm run morning
```

### 配置定时任务（OpenClaw）

在 `skill.json` 中已配置：

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

OpenClaw 会自动在交易日执行。

---

## 🔧 可选配置

### 1. 集成问财量化评分

如果需要使用问财量化评分增强简报：

```bash
# 确认问财 Skill 已安装
ls ~/.openclaw/skills/wencai-quant-score

# 测试问财查询
cd ~/.openclaw/skills/wencai-quant-score/scripts
python query_wencai_quant.py
```

**集成方法**：见 [INTEGRATION_WENCAI.md](./INTEGRATION_WENCAI.md)

---

### 2. 自定义 AI 模型

如需使用其他 AI 模型（如通义千问、Kimi）：

编辑 `.env`：

```bash
# 使用通义千问
DEEPSEEK_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
DEEPSEEK_MODEL=qwen-plus

# 使用 Kimi
DEEPSEEK_BASE_URL=https://api.moonshot.cn/v1
DEEPSEEK_MODEL=moonshot-v1-8k
```

---

### 3. 调整搜索模块

如需添加/修改搜索模块：

编辑 `scripts/config.js`：

```javascript
SEARCH_MODULES: {
  // 添加新模块
  CUSTOM: {
    name: '自定义模块',
    query: '你的搜索关键词',
    include_domains: ['example.com'],
    max_results: 15
  }
}
```

---

## ❓ 常见问题

### Q: Tavily API 配额不够用怎么办？

A: 编辑 `.env` 减少每个模块的新闻数量：

```bash
MAX_NEWS_PER_MODULE=10  # 默认 15
```

---

### Q: AI 生成内容不满意？

A: 可以调整 AI 提示词：

1. 编辑 `scripts/AI_PROMPT.md`
2. 修改系统角色定义或输出模板
3. 重新运行测试

---

### Q: 如何推送到飞书？

A: 已配置飞书用户 ID，会自动推送。如需修改：

编辑 `.env`：

```bash
FEISHU_USER_ID=ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # 新的用户 ID
```

---

### Q: 如何查看历史简报？

A: 简报会输出到控制台和飞书，建议：

1. 在飞书中查看历史消息
2. 或添加文件输出功能（需自行开发）

---

## 📚 更多文档

| 文档 | 说明 |
|------|------|
| [README.md](../README.md) | 完整使用文档 |
| [INTEGRATION_WENCAI.md](./INTEGRATION_WENCAI.md) | 问财集成指南 |
| [STRUCTURE.md](../STRUCTURE.md) | 项目结构说明 |
| [CHANGELOG.md](../CHANGELOG.md) | 版本更新日志 |

---

## 🎉 部署成功！

**下一步**：
1. ✅ 测试运行：`npm run evening`
2. ✅ 查看飞书消息（已自动推送）
3. ✅ 配置定时任务（OpenClaw 自动执行）

**如有问题**：
- 查看 [FAQ](../README.md#-常见问题)
- 查看错误日志
- 联系作者：闪电狗 ⚡

---

*部署指南版本：v1.0 | 更新时间：2026-03-22*
