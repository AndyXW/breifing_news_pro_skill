// Configuration for A-Share Research Pro
// 配置文件 - 使用环境变量，无硬编码敏感信息

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 加载 .env 文件（如果存在）
config({ path: join(__dirname, '..', '.env') });

export const CONFIG = {
  // API Keys（从环境变量读取）
  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  
  // 飞书配置
  FEISHU: {
    USER_ID: process.env.FEISHU_USER_ID || '',
    APP_ID: process.env.FEISHU_APP_ID || '',
    APP_SECRET: process.env.FEISHU_APP_SECRET || '',
    MAX_WORDS: parseInt(process.env.MAX_WORDS) || 1500
  },
  
  // DeepSeek AI 配置
  AI: {
    BASE_URL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    TEMPERATURE: 0.3,
    TIMEOUT_MS: 90000,
    MAX_TOKENS: 3000
  },
  
  // Tavily API 配置
  TAVILY: {
    BASE_URL: 'https://api.tavily.com/search',
    SEARCH_DEPTH: 'advanced',
    TIME_RANGE: 'day',
    INCLUDE_RAW_CONTENT: true,
    MAX_RESULTS: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15,
    TOPIC: 'news'
  },
  
  // 6 大搜索模块配置
  SEARCH_MODULES: {
    // 1. 宏观政策与高层动态
    POLICY: {
      name: '宏观政策',
      query: '("央行" OR "发改委" OR "证监会" OR "工信部" OR "国常会" OR "财政部") ("重磅" OR "印发" OR "通知" OR "会议" OR "发布") "今日" OR "晚间" -"早盘" -"午评" -"开盘" -"直播" -"回放" -"早间"',
      include_domains: ['wallstreetcn.com', 'cls.cn', 'gov.cn', 'pbc.gov.cn', 'ndrc.gov.cn', 'csrc.gov.cn', 'miit.gov.cn', 'caixin.com'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    },
    
    // 2. A 股晚间公告
    ANNOUNCEMENTS: {
      name: '晚间公告',
      query: '("晚间公告" OR "盘后公告" OR "业绩超预期" OR "业绩预告" OR "停牌核查" OR "并购重组" OR "异常波动" OR "中标" OR "重大合同") "今日" OR "晚间" -"早报" -"收盘摘要" -"晨会"',
      include_domains: ['stcn.com', 'cs.com.cn', 'cnstock.com', 'cninfo.com.cn'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    },
    
    // 3. 外盘映射与大宗商品
    EXTERNAL_MARKET: {
      name: '外盘映射',
      query: '("美股盘前" OR "美股收盘" OR "纳斯达克" OR "富时 A50" OR "大宗商品" OR "原油" OR "黄金" OR "伦铜" OR "碳酸锂") ("大涨" OR "异动" OR "跳水" OR "新高" OR "崩盘" OR "飙升") "今晚" OR "夜盘" OR "隔夜"',
      include_domains: ['wallstreetcn.com', 'jin10.com', 'investing.com', 'finance.sina.com.cn'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    },
    
    // 4. 机构复盘与主力资金
    INSTITUTIONAL: {
      name: '机构复盘',
      query: '("龙虎榜" OR "机构净买入" OR "北向资金" OR "券商研报" OR "中信证券" OR "中金公司") ("复盘" OR "主线逻辑" OR "高标股" OR "连板" OR "资金流向") "今日" OR "晚间" -"早评" -"午评" -"晨会" -"策略会"',
      include_domains: ['cls.cn', 'gelonghui.com', 'wallstreetcn.com'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    },
    
    // 5. A 股收评
    MARKET_REVIEW: {
      name: 'A 股收评',
      query: '("收评" OR "收盘点评" OR "复盘" OR "收盘") ("沪指" OR "创业板" OR "成交量" OR "涨停" OR "跌停") "今日" -"午评" -"早盘" -"开盘" -"直播" -"回放" -"早间" -"晨会" -"股吧" -"论坛" -"博客"',
      include_domains: ['cls.cn', 'wallstreetcn.com', 'stcn.com', 'cs.com.cn', 'cnstock.com'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    },
    
    // 6. 行业深度
    INDUSTRY_DEPTH: {
      name: '行业深度',
      query: '("AI 人工智能" OR "半导体芯片" OR "新能源" OR "光伏" OR "锂电池" OR "储能" OR "氢能") ("深度" OR "研报" OR "产业链" OR "技术突破" OR "产能" OR "价格") "今日" OR "近期" -"快讯" -"短讯"',
      include_domains: ['cls.cn', 'wallstreetcn.com', 'yicai.com', 'gelonghui.com'],
      max_results: parseInt(process.env.MAX_NEWS_PER_MODULE) || 15
    }
  },
  
  // 板块分类关键词
  SECTOR_KEYWORDS: {
    AI: ['AI', '人工智能', 'CPO', '光模块', '算力', '智能体', '大模型', 'LLM', 'AIGC', '多模态', 'Agent', 'MoE', '英伟达', '台积电'],
    Semiconductor: ['半导体', '芯片', '存储芯片', 'HBM', '半导体设备', '先进封装', 'CoWoS', '光刻机', '刻蚀机', '碳化硅', '流片'],
    Metals: ['有色金属', '铜', '铝', '黄金', '锂', '钴', '稀土', '小金属', '能源金属', '碳酸锂', '沪铝'],
    Grid: ['电力', '特高压', '智能电网', '虚拟电厂', '储能', '变压器', '配电网', '国家电网', '南方电网'],
    NewEnergy: ['新能源', '光伏', '风电', '氢能', '储能', '钙钛矿', '异质结', 'TOPCon', '锂电池', '宁德时代', '比亚迪'],
    EV: ['电动车', '新能源汽车', '锂电池', '固态电池', '自动驾驶', '智能驾驶', '充电桩', '换电', '蔚来', '小鹏', '理想'],
    Petrochemical: ['石油', '石化', '油气开采', '油服', '油运', '原油', '布伦特', '霍尔木兹'],
    Finance: ['券商', '保险', '银行', '金融', '北向资金', '龙虎榜']
  },
  
  // AI 处理上限
  MAX_AI_PROCESS: parseInt(process.env.MAX_AI_PROCESS) || 80
};

/**
 * 验证必需的环境变量
 * @param {boolean} skipDeepSeekValidation - 是否跳过 DeepSeek 验证（使用 OpenClaw 内置 AI）
 */
export function validateEnv(skipDeepSeekValidation = false) {
  const errors = [];
  
  if (!CONFIG.TAVILY_API_KEY) {
    errors.push('TAVILY_API_KEY 未配置');
  }
  
  // 仅在不跳过时验证 DeepSeek
  if (!skipDeepSeekValidation && !CONFIG.DEEPSEEK_API_KEY) {
    errors.push('DEEPSEEK_API_KEY 未配置');
  }
  
  if (errors.length > 0) {
    console.error('❌ 环境变量配置错误:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\n请复制 .env.example 为 .env 并填入正确的配置');
    return false;
  }
  
  console.log('✅ 环境变量验证通过');
  if (skipDeepSeekValidation) {
    console.log('ℹ️  使用 OpenClaw 内置 AI 能力（不需要 DeepSeek API Key）');
  }
  return true;
}
