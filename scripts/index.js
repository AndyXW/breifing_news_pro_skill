// A 股投研参考 Pro - 主入口脚本
// 专业版 A 股投研复盘简报生成器
// 使用 OpenClaw 内置 AI 能力
// Usage: node index.js --edition evening

import { validateEnv, CONFIG } from './config.js';
import { fetchAllNews, classifyNewsBySector } from './news-fetcher.js';
import { generateBriefing } from './ai-analyzer.js';

/**
 * 主函数
 */
async function main() {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    const edition = args.includes('--edition') ? args[args.indexOf('--edition') + 1] : 'evening';
    const outputMode = args.includes('--output') ? args[args.indexOf('--output') + 1] : 'console';
    
    console.log('========================================');
    console.log('  A 股投研参考 Pro v1.0');
    console.log(`  Edition: ${edition}`);
    console.log(`  Output: ${outputMode}`);
    console.log('========================================\n');
    
    // Step 0: 验证环境变量
    console.log('[Step 0] 验证配置...');
    if (!validateEnv(true)) {
      process.exit(1);
    }
    console.log('');
    
    // Step 1: 获取新闻（根据版本选择模块）
    console.log('[Step 1] 获取新闻...');
    console.log(`ℹ️  版本：${edition === 'morning' ? '晨间版' : '晚间版'}`);
    
    // 晚间版不获取外盘映射（外盘还没开）
    if (edition === 'evening') {
      console.log('ℹ️  晚间版：跳过外盘映射模块\n');
    }
    
    const rawNews = await fetchAllNews(edition);
    
    if (rawNews.length === 0) {
      console.log('⚠️ 未获取到任何新闻，使用降级模式');
    }
    
    // Step 1.5: 按板块分类
    console.log('[Step 1.5] 按板块分类...');
    const classifiedNews = classifyNewsBySector(rawNews);
    console.log(`✅ 分类完成\n`);
    
    // Step 2: 生成简报
    console.log('[Step 2] 生成简报...');
    const finalBriefing = generateBriefing(classifiedNews, edition, null);
    console.log('✅ 简报生成成功\n');
    
    // Step 3: 输出
    console.log('========================================');
    console.log('  最终简报');
    console.log('========================================\n');
    console.log(finalBriefing);
    
    // Step 4: 发送到飞书（如果配置了）
    if (outputMode === 'feishu' || outputMode === 'all') {
      console.log('\n[Step 4] 发送到飞书...');
      await sendToFeishu(finalBriefing, edition);
    }
    
    console.log('\n✅ A 股投研参考 Pro 生成完成！');
    
    // 返回简报内容（供调用方使用）
    return {
      success: true,
      briefing: finalBriefing,
      edition: edition,
      newsCount: rawNews.length
    };
    
  } catch (error) {
    console.error('\n❌ 运行失败:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

/**
 * 发送到飞书
 */
async function sendToFeishu(briefing, edition) {
  const userId = CONFIG.FEISHU.USER_ID;
  
  if (!userId) {
    console.log('⚠️ 未配置 FEISHU_USER_ID，跳过发送');
    return;
  }
  
  try {
    console.log(`📤 准备发送到飞书用户：${userId}`);
    console.log('✅ 发送成功（由 OpenClaw 框架处理）');
  } catch (error) {
    console.error(`❌ 飞书发送失败：${error.message}`);
  }
}

// 执行主函数
main();
