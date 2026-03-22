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
.env.example  .gitignore  README.md  skill.json  scripts/  package.json  docs/
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

```bash
# 复制配置模板
cp .env.example .env

# 编辑 .env 文件
notepad .env
```

**必需配置**：
```bash
# Tavily API Key（必需）
TAVILY_API_KEY=tvly-your_api_key_here

# 飞书用户 ID（可选，用于推送）
FEISHU_USER_ID=ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 步骤 4：验证配置

```bash
npm run check-env
```

**预期输出**：
```
✅ 所有必需配置已正确设置！

📊 AI 配置说明:
   使用 OpenClaw 内置 AI 能力（推荐）

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
  • 机构复盘：15 条
  • A 股收评：15 条
  • 行业深度：15 条

✅ 总计：75 条 → 去重后：70 条

[Step 2] 生成简报...
✅ 简报生成成功

**📅 【A 股投研复盘与推演】晚间版 | 2026-03-22 周日**
━━━━━━━━━━━━━━━━━━

**一、🌍 宏观政策和重要新闻**
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

## 📚 更多文档

| 文档 | 说明 |
|------|------|
| [README.md](../README.md) | 完整使用文档 |
| [docs/ARCHITECTURE.md](./ARCHITECTURE.md) | 架构说明 |
| [docs/QUICKSTART.md](./QUICKSTART.md) | 本文件（快速开始） |
| [CHANGELOG.md](../CHANGELOG.md) | 版本更新日志 |

---

## 🎉 部署成功！

**下一步**：
1. ✅ 测试运行：`npm run evening`
2. ✅ 查看飞书消息（已配置推送）
3. ✅ 配置定时任务（OpenClaw 自动执行）

**如有问题**：
- 查看 [FAQ](../README.md#-常见问题)
- 查看错误日志
- 联系作者：闪电狗 ⚡

---

*部署指南版本：v1.0 | 更新时间：2026-03-22*
