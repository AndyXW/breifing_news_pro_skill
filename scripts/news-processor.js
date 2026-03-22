// News Processor - Tavily 新闻数据清洗和提取
// 专业版：智能标题清理、内容提取、分类

/**
 * 清理 Tavily 标题（智能提取单条新闻）
 */
export function cleanTitle(title) {
  if (!title) return '标题缺失';
  
  let cleaned = title;
  
  // 策略 1: 去除分号后的内容（Tavily 经常把多条新闻拼在一起）
  if (cleaned.includes(';')) {
    cleaned = cleaned.split(';')[0];
  }
  
  // 策略 2: 去除分隔符后的内容
  const separators = [' | ', ' - ', '——', '—', '｜'];
  for (const sep of separators) {
    if (cleaned.includes(sep)) {
      cleaned = cleaned.split(sep)[0];
      break;
    }
  }
  
  // 策略 3: 去除来源标识
  const sources = [
    '财联社', '东方财富', '证券时报', '中国证券报', '上证报',
    'Investing.com', '新浪财经', '同花顺', 'wind'
  ];
  for (const source of sources) {
    const regex = new RegExp(`[-–—]\\s*${source}.*$`, 'i');
    cleaned = cleaned.replace(regex, '');
  }
  
  // 策略 4: 去除多余空格和特殊字符
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // 策略 5: 截断到合适长度（30-50 字）
  if (cleaned.length > 50) {
    // 尝试在合适位置截断
    const breakPoints = ['，', ',', '：', ':', '的', '并', '且'];
    let cutIndex = 50;
    
    for (const bp of breakPoints) {
      const idx = cleaned.indexOf(bp, 30);
      if (idx > 0 && idx < 50) {
        cutIndex = idx;
        break;
      }
    }
    
    cleaned = cleaned.substring(0, cutIndex);
  }
  
  // 策略 6: 确保标题有意义（至少 5 个字）
  if (cleaned.length < 5) {
    return '标题过短';
  }
  
  return cleaned;
}

/**
 * 提取公告核心内容
 */
export function extractAnnouncementContent(content, title) {
  if (!content) return '待补充';
  
  // 去除 HTML 标签
  let cleaned = content.replace(/<[^>]*>/g, '');
  
  // 去除 URL
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');
  
  // 去除多余空格
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // 提取关键信息（公告类型）
  const keywords = {
    '业绩': ['净利润', '营收', '同比增长', '业绩预告', ' earnings'],
    '投资': ['投资', '增资', '收购', '并购', '项目'],
    '分红': ['分红', '派息', '股利', '分配'],
    '重组': ['重组', '合并', '收购', '资产'],
    '合同': ['中标', '合同', '订单', '签约']
  };
  
  let type = '公告';
  for (const [t, words] of Object.entries(keywords)) {
    if (words.some(w => cleaned.toLowerCase().includes(w))) {
      type = t;
      break;
    }
  }
  
  // 截断到 150 字
  if (cleaned.length > 150) {
    // 尝试在句子结尾截断
    const endMarks = ['。', '！', '？', '.', '!'];
    let cutIndex = 150;
    
    for (const mark of endMarks) {
      const idx = cleaned.indexOf(mark, 100);
      if (idx > 0 && idx < 150) {
        cutIndex = idx + 1;
        break;
      }
    }
    
    cleaned = cleaned.substring(0, cutIndex);
  }
  
  return cleaned;
}

/**
 * 生成深度摘要（从内容提取核心信息）
 */
export function generateSummary(content, maxLength = 100) {
  if (!content) return '待补充';
  
  // 去除 HTML 标签
  let cleaned = content.replace(/<[^>]*>/g, '');
  
  // 去除 URL
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');
  
  // 去除多余空格
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // 提取关键数字（金额、比例等）
  const numbers = cleaned.match(/[\d\.]+[亿万千百]%?/g) || [];
  const keyNumbers = numbers.slice(0, 3).join(', ');
  
  // 截断到合适长度
  if (cleaned.length > maxLength) {
    // 尝试在句子结尾截断
    const endMarks = ['。', '！', '？', '.', '!'];
    let cutIndex = maxLength;
    
    for (const mark of endMarks) {
      const idx = cleaned.indexOf(mark, maxLength - 50);
      if (idx > 0 && idx < maxLength) {
        cutIndex = idx + 1;
        break;
      }
    }
    
    cleaned = cleaned.substring(0, cutIndex);
  }
  
  // 如果有数字，添加到摘要
  if (keyNumbers && cleaned.length < maxLength - 20) {
    cleaned += ` (${keyNumbers})`;
  }
  
  return cleaned;
}

/**
 * 提取龙头个股信息（从龙虎榜/机构复盘新闻）
 */
export function extractStockLeaders(news) {
  if (!news) return [];
  
  const leaders = [];
  const text = (news.title + ' ' + news.content).replace(/<[^>]*>/g, '');
  
  // 匹配股票代码和名称（如：XX 股份 (000001)）
  const stockPattern = /([A 股\u4e00-\u9fa5]{2,10})(?:\(|（)?(\d{6})(?:\)|）)?/g;
  let match;
  
  while ((match = stockPattern.exec(text)) !== null) {
    leaders.push({
      name: match[1],
      code: match[2],
      context: text.substring(Math.max(0, match.index - 50), match.index + 100)
    });
  }
  
  // 限制返回数量
  return leaders.slice(0, 5);
}

/**
 * 识别板块关键词
 */
export function identifySector(text) {
  if (!text) return null;
  
  const sectorMap = {
    'AI': ['AI', '人工智能', '算力', 'CPO', '光模块', '大模型', 'AIGC'],
    '半导体': ['半导体', '芯片', '集成电路', '存储', 'HBM'],
    '新能源': ['新能源', '光伏', '风电', '储能', '锂电'],
    '电动车': ['电动车', '汽车', '特斯拉', '比亚迪', '蔚来'],
    '金融': ['银行', '券商', '保险', '金融'],
    '医药': ['医药', '生物', '医疗', '创新药'],
    '消费': ['消费', '食品', '白酒', '零售'],
    '科技': ['科技', '电子', '通信', '5G'],
    '周期': ['钢铁', '煤炭', '有色', '化工'],
    '地产': ['地产', '房地产', '基建']
  };
  
  for (const [sector, keywords] of Object.entries(sectorMap)) {
    if (keywords.some(k => text.toLowerCase().includes(k.toLowerCase()))) {
      return sector;
    }
  }
  
  return '其他';
}

/**
 * 分析新闻情感倾向
 */
export function analyzeSentiment(content) {
  if (!content) return 'neutral';
  
  const text = content.toLowerCase();
  
  const positive = ['增长', '上涨', '突破', '超预期', '利好', '盈利', '预增', '新高', '大涨'];
  const negative = ['下跌', '下滑', '亏损', '低于预期', '利空', '下降', '暴跌', '跳水'];
  
  let posCount = positive.filter(w => text.includes(w)).length;
  let negCount = negative.filter(w => text.includes(w)).length;
  
  if (posCount > negCount + 1) return 'positive';
  if (negCount > posCount + 1) return 'negative';
  return 'neutral';
}

/**
 * 生成市场映射建议
 */
export function generateMarketMapping(sector, sentiment) {
  const mappings = {
    'AI': {
      positive: '🟢 AI 板块 - 行业景气度提升→算力/应用端受益',
      neutral: '🟡 AI 板块 - 观望为主，等待催化',
      negative: '🔴 AI 板块 - 警惕高位回调风险'
    },
    '半导体': {
      positive: '🟢 半导体 - 国产替代加速→设备/材料受益',
      neutral: '🟡 半导体 - 震荡整理，等待业绩验证',
      negative: '🔴 半导体 - 周期下行，谨慎参与'
    },
    '新能源': {
      positive: '🟢 新能源 - 装机超预期→产业链受益',
      neutral: '🟡 新能源 - 产能过剩担忧，观望',
      negative: '🔴 新能源 - 价格战加剧，规避'
    },
    '金融': {
      positive: '🟢 大金融 - 政策利好→券商/保险受益',
      neutral: '🟡 大金融 - 估值修复行情',
      negative: '🔴 大金融 - 资产质量担忧'
    }
  };
  
  const sectorMapping = mappings[sector] || mappings['其他'];
  return sectorMapping ? (sectorMapping[sentiment] || sectorMapping.neutral) : '🟡 待分析';
}

/**
 * 批量处理新闻数据
 */
export function processNewsBatch(rawNews) {
  return rawNews.map(news => ({
    ...news,
    cleanTitle: cleanTitle(news.title),
    summary: generateSummary(news.content),
    sector: identifySector(news.title + ' ' + news.content),
    sentiment: analyzeSentiment(news.content),
    marketMapping: generateMarketMapping(
      identifySector(news.title + ' ' + news.content),
      analyzeSentiment(news.content)
    )
  }));
}
