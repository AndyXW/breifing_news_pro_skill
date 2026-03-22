// News Fetcher - 新闻获取模块
// 从 Tavily API 获取多源新闻数据

import { CONFIG } from './config.js';
import { cleanTitle } from './news-processor.js';

/**
 * 从 Tavily 获取新闻
 */
async function fetchNewsFromTavily(moduleConfig) {
  try {
    const body = {
      api_key: CONFIG.TAVILY_API_KEY,
      query: moduleConfig.query,
      max_results: moduleConfig.max_results || CONFIG.TAVILY.MAX_RESULTS,
      search_depth: CONFIG.TAVILY.SEARCH_DEPTH,
      time_range: CONFIG.TAVILY.TIME_RANGE,
      include_domains: moduleConfig.include_domains || [],
      exclude_domains: moduleConfig.exclude_domains || [],
      include_raw_content: CONFIG.TAVILY.INCLUDE_RAW_CONTENT,
      topic: CONFIG.TAVILY.TOPIC
    };
    
    const response = await fetch(CONFIG.TAVILY.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.results || []).map(item => ({
      title: cleanTavilyTitle(item.title),
      content: item.content || '',
      raw_content: item.raw_content || '',
      url: item.url,
      source: moduleConfig.name,
      category: moduleConfig.name,
      published_date: item.published_date
    }));
    
  } catch (error) {
    console.error(`[Fetch Error] ${moduleConfig.name}: ${error.message}`);
    return [];
  }
}

/**
 * 获取所有新闻（根据版本选择模块）
 * @param {string} edition - 版本（morning/evening）
 */
export async function fetchAllNews(edition = 'evening') {
  console.log('\n[Step 1: Fetching News]');
  console.log('========================================');
  
  let modules = Object.values(CONFIG.SEARCH_MODULES);
  
  // 晚间版跳过外盘映射（外盘还没开）
  if (edition === 'evening') {
    modules = modules.filter(m => m.name !== '外盘映射');
  }
  
  console.log(`Edition: ${edition === 'morning' ? 'Morning' : 'Evening'}`);
  console.log(`Total modules: ${modules.length}`);
  console.log('Modules:', modules.map(m => m.name).join(', '));
  console.log('');
  
  // 并行获取所有模块
  const results = await Promise.all(
    modules.map(m => fetchNewsFromTavily(m))
  );
  
  // 合并所有新闻
  const allNews = results.flat();
  
  // 去重（基于 URL）
  const seen = new Set();
  const dedupedNews = allNews.filter(news => {
    const key = news.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // 按模块统计
  const stats = {};
  modules.forEach(m => {
    stats[m.name] = results[modules.indexOf(m)].length;
  });
  
  console.log('📊 各模块获取数量:');
  Object.entries(stats).forEach(([name, count]) => {
    console.log(`  • ${name}: ${count}条`);
  });
  console.log(`\n✅ 总计：${allNews.length}条 → 去重后：${dedupedNews.length}条\n`);
  
  return dedupedNews;
}

/**
 * 清理 Tavily 标题（去除冗余和混乱部分）
 */
function cleanTavilyTitle(title) {
  if (!title) return '标题缺失';
  
  // 去除分号后的内容（Tavily 经常把多条新闻拼在一起）
  let cleaned = title.split(';')[0];
  cleaned = cleaned.split(' | ')[0];
  cleaned = cleaned.split(' - ')[0];
  
  // 去除来源标识
  cleaned = cleaned.replace(/\s*[-–—]\s*财联社$/, '');
  cleaned = cleaned.replace(/\s*[-–—]\s*东方财富$/, '');
  cleaned = cleaned.replace(/\s*[-–—]\s*证券时报$/, '');
  cleaned = cleaned.replace(/\s*[-–—]\s* Investing\.com$/, '');
  
  // 去除多余空格
  cleaned = cleaned.trim();
  
  // 如果标题太长，截断
  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50) + '...';
  }
  
  return cleaned;
}

/**
 * 按板块关键词分类新闻
 */
export function classifyNewsBySector(newsList) {
  const classified = [];
  
  for (const news of newsList) {
    const text = (news.title + ' ' + news.content).toLowerCase();
    
    let sector = 'Finance';
    
    for (const [sectorName, keywords] of Object.entries(CONFIG.SECTOR_KEYWORDS)) {
      if (keywords.some(k => text.includes(k.toLowerCase()))) {
        sector = sectorName;
        break;
      }
    }
    
    classified.push({
      ...news,
      sector: sector
    });
  }
  
  return classified;
}
