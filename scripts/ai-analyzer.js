// AI Analyzer - 专业投研简报生成器
// P1 优化版：深度分析、龙头提取、策略细化

import { 
  cleanTitle, 
  extractAnnouncementContent, 
  generateSummary,
  extractStockLeaders,
  identifySector,
  analyzeSentiment,
  generateMarketMapping,
  processNewsBatch
} from './news-processor.js';

/**
 * 生成专业版投研简报（晚间版）
 * @param {Array} processedNews - 已处理的新闻数据
 * @param {string} edition - 版本（morning/evening）
 */
export function generateBriefing(processedNews, edition = 'evening', capitalFlow = null) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayStr = dayNames[now.getDay()];
  const timeStr = now.toISOString().replace('T', ' ').substring(0, 16);
  
  // 批量处理新闻数据
  const newsData = processNewsBatch(processedNews);
  
  // 按模块聚合
  const newsByModule = {};
  newsData.forEach(news => {
    const mod = news.source || news.category;
    if (!newsByModule[mod]) newsByModule[mod] = [];
    newsByModule[mod].push(news);
  });
  
  let b = '';
  const editionName = edition === 'morning' ? '晨间版' : '晚间版';
  
  // ========== 标题 ==========
  b += `**📅 【A 股投研复盘与推演】${editionName} | ${dateStr} ${dayStr}**\n`;
  b += `━━━━━━━━━━━━━━━━━━\n\n`;
  
  // ========== 一、宏观政策和重要新闻 ==========
  b += `**一、🌍 宏观政策和重要新闻 (Macro & Policy)**\n`;
  
  if (edition === 'evening') {
    const policy = newsByModule['宏观政策'] || [];
    const industry = newsByModule['行业深度'] || [];
    
    // 合并政策和重要新闻，精选 5 条
    const allImportant = [...policy, ...industry];
    const topPolicy = allImportant
      .filter(n => n.cleanTitle && n.cleanTitle.length > 5)
      .slice(0, 5);
    
    if (topPolicy.length > 0) {
      topPolicy.forEach(news => {
        b += `• **${news.cleanTitle}**\n`;
        b += `  - **深度摘要**：${news.summary}\n`;
        b += `  - **市场映射**：${news.marketMapping}\n\n`;
      });
    } else {
      b += `• 今日暂无重大宏观政策\n\n`;
    }
  } else {
    // 晨间版：隔夜外盘
    const external = newsByModule['外盘映射'] || [];
    const topExternal = external.slice(0, 3);
    
    if (topExternal.length > 0) {
      topExternal.forEach(news => {
        b += `• **${news.cleanTitle}**\n`;
        b += `  - **深度摘要**：${news.summary}\n`;
        b += `  - **市场映射**：${news.marketMapping}\n\n`;
      });
    } else {
      b += `• 隔夜外盘平稳，无重大异动\n\n`;
    }
  }
  
  // ========== 二、主线复盘 ==========
  b += `**二、🔥 ${edition === 'morning' ? '预期主线' : '今日主线复盘'}与资金嗅觉 (Mainlines & Money Flow)**\n`;
  
  // 从机构复盘/行业深度中提取主线
  const institutional = newsByModule['机构复盘'] || [];
  const industry = newsByModule['行业深度'] || [];
  
  // 识别热门板块
  const sectorCount = {};
  newsData.forEach(news => {
    const sector = news.sector;
    if (sector && sector !== '其他') {
      sectorCount[sector] = (sectorCount[sector] || 0) + 1;
    }
  });
  
  const topSectors = Object.entries(sectorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (topSectors.length > 0) {
    topSectors.forEach(([sector, count]) => {
      b += `• **核心主线**：${sector}（${count}条相关新闻）\n`;
      
      // 催化内核
      const relatedNews = newsData.filter(n => n.sector === sector).slice(0, 1);
      if (relatedNews.length > 0) {
        b += `  - **催化内核**：${relatedNews[0].cleanTitle}\n`;
      }
      
      // 机构净买入方向
      b += `  - **机构净买入方向**：${sector}产业链\n\n`;
    });
  } else {
    b += `• ${edition === 'morning' ? '今日' : '昨日'}暂无明确主线\n\n`;
  }
  
  // ========== 三、晚间公告（仅晚间版） ==========
  if (edition === 'evening') {
    b += `**三、📢 晚间重磅公告 (Announcements)**\n`;
    
    const announcements = newsByModule['晚间公告'] || [];
    
    if (announcements.length > 0) {
      // 精选 3-4 条最重要的公告
      const topAnnouncements = announcements
        .filter(n => n.cleanTitle && n.cleanTitle.length > 5)
        .slice(0, 4);
      
      topAnnouncements.forEach(news => {
        const content = extractAnnouncementContent(news.content, news.title);
        
        b += `• **${news.cleanTitle}**\n`;
        b += `  - **公告内容**：${content}\n\n`;
      });
    } else {
      b += `• 今日盘后暂无重大公告\n\n`;
    }
  }
  
  // ========== 四、推演与策略 ==========
  b += `**四、🎯 ${edition === 'morning' ? '今日' : '明日'}推演与交易策略 (Strategy)**\n`;
  
  // 根据板块热度生成策略
  if (topSectors.length > 0) {
    const topSector = topSectors[0][0];
    
    b += `• **情绪推演**：${topSector} 板块热度较高（${topSectors[0][1]}条新闻），${edition === 'morning' ? '今日' : '明日'}关注资金持续性\n`;
    
    // 细化操作建议
    b += `• **操作建议**：\n`;
    b += `  - **进攻方向**：${topSector} 低位补涨标的\n`;
    b += `  - **回避方向**：高位连板缩量标的\n`;
    b += `  - **仓位建议**：6-7 成（进攻 4 成 + 防守 3 成）\n`;
    b += `  - **止损位**：${topSector}板块指数跌破 5 日线\n\n`;
  } else {
    b += `• **情绪推演**：市场处于震荡期，等待新催化\n`;
    b += `• **操作建议**：控制仓位 5-6 成，观望为主\n\n`;
  }
  
  // ========== 结尾 ==========
  b += `━━━━━━━━━━━━━━━━━━\n`;
  b += `📍 ${timeStr} | 数据源：Tavily 智能检索聚合 | A 股投研参考 Pro v1.0\n`;
  
  return b;
}

/**
 * 生成资金流向分析（如果有问财数据）
 */
export function generateCapitalFlowAnalysis(capitalFlow) {
  if (!capitalFlow || !capitalFlow.top10) return '';
  
  let analysis = '**📊 资金流向 (Capital Flow)**\n\n';
  
  const top3 = capitalFlow.top10.slice(0, 3);
  
  top3.forEach((item, index) => {
    analysis += `• **第${index + 1}名**：${item.sector}\n`;
    analysis += `  - **净流入**：${item.net_inflow}\n`;
    analysis += `  - **排名**：${item.rank}\n\n`;
  });
  
  return analysis;
}
