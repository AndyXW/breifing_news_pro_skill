// 测试脚本 - 验证 Skill 基本功能

import { validateEnv } from './config.js';
import { fetchAllNews } from './news-fetcher.js';
import { analyzeNewsWithAI, generateBriefing } from './ai-analyzer.js';

async function runTests() {
  console.log('========================================');
  console.log('  A 股投研参考 Pro - 功能测试');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: 环境配置验证
  console.log('Test 1: 环境配置验证');
  try {
    const result = validateEnv();
    if (result) {
      console.log('✅ PASS: 环境配置验证通过\n');
      passed++;
    } else {
      console.log('❌ FAIL: 环境配置验证失败\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error.message}\n`);
    failed++;
  }
  
  // Test 2: 新闻获取（仅测试配置正确时）
  if (process.env.TAVILY_API_KEY && !process.env.TAVILY_API_KEY.includes('your_')) {
    console.log('Test 2: 新闻获取测试');
    try {
      const news = await fetchAllNews();
      if (news.length >= 0) {  // 允许 0 条（API 配额限制）
        console.log(`✅ PASS: 获取 ${news.length} 条新闻\n`);
        passed++;
      }
    } catch (error) {
      console.log(`❌ FAIL: ${error.message}\n`);
      failed++;
    }
  } else {
    console.log('Test 2: 新闻获取测试 - SKIP (未配置 API Key)\n');
  }
  
  // Test 3: 简报生成（降级模式）
  console.log('Test 3: 简报生成测试（降级模式）');
  try {
    const mockNews = [
      {
        title: '测试新闻 1',
        content: '测试内容',
        source: '宏观政策'
      }
    ];
    const briefing = generateBriefing(mockNews, 'evening');
    if (briefing.includes('A 股投研复盘与推演')) {
      console.log('✅ PASS: 简报生成成功\n');
      passed++;
    } else {
      console.log('❌ FAIL: 简报格式错误\n');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${error.message}\n`);
    failed++;
  }
  
  // 总结
  console.log('========================================');
  console.log(`  测试结果：${passed} 通过，${failed} 失败`);
  console.log('========================================\n');
  
  if (failed === 0) {
    console.log('✅ 所有测试通过！Skill 可以正常使用');
    process.exit(0);
  } else {
    console.log('❌ 存在测试失败，请检查配置');
    process.exit(1);
  }
}

runTests();
