// 环境配置检查脚本
// 帮助用户验证 .env 配置是否正确

import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('========================================');
console.log('  A 股投研参考 Pro - 环境配置检查');
console.log('========================================\n');

// 加载 .env 文件
const envPath = join(__dirname, '..', '.env');
console.log(`📄 检查配置文件：${envPath}`);

try {
  const result = config({ path: envPath });
  
  if (result.error) {
    console.error(`❌ 无法读取 .env 文件：${result.error.message}`);
    console.error('\n请执行以下命令创建配置文件:');
    console.error('  cp .env.example .env');
    console.error('  # 然后编辑 .env 填入你的 API Key');
    process.exit(1);
  }
  
  console.log('✅ 配置文件读取成功\n');
  
  // 检查必需配置
  console.log('📋 配置检查:');
  console.log('----------------------------------------');
  
  const checks = [
    {
      name: 'TAVILY_API_KEY',
      value: process.env.TAVILY_API_KEY,
      required: true,
      description: 'Tavily Search API Key'
    },
    {
      name: 'DEEPSEEK_API_KEY',
      value: process.env.DEEPSEEK_API_KEY,
      required: false,
      description: 'DeepSeek AI API Key（可选，不配置则使用 OpenClaw 内置 AI）'
    },
    {
      name: 'FEISHU_USER_ID',
      value: process.env.FEISHU_USER_ID,
      required: false,
      description: '飞书用户 ID（可选，用于推送消息）'
    },
    {
      name: 'FEISHU_APP_ID',
      value: process.env.FEISHU_APP_ID,
      required: false,
      description: '飞书 App ID（可选）'
    },
    {
      name: 'FEISHU_APP_SECRET',
      value: process.env.FEISHU_APP_SECRET,
      required: false,
      description: '飞书 App Secret（可选）'
    }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const hasValue = check.value && check.value !== 'your_xxx_here' && !check.value.includes('your_');
    const status = hasValue ? '✅' : check.required ? '❌' : '⚠️';
    
    if (check.required && !hasValue) {
      allPassed = false;
    }
    
    console.log(`${status} ${check.name}`);
    console.log(`   ${check.description}`);
    
    if (hasValue) {
      const masked = check.value.substring(0, 8) + '...' + check.value.substring(-4);
      console.log(`   值：${masked}`);
    } else if (check.required) {
      console.log(`   ⚠️ 必需配置，请填写`);
    } else {
      console.log(`   ℹ️ 可选配置`);
    }
    console.log('');
  });
  
  console.log('----------------------------------------');
  
  if (allPassed) {
    console.log('\n✅ 所有必需配置已正确设置！');
    console.log('\n📊 AI 配置说明:');
    if (process.env.DEEPSEEK_API_KEY) {
      console.log('   使用 DeepSeek AI（已配置 API Key）');
    } else {
      console.log('   使用 OpenClaw 内置 AI 能力（推荐）');
    }
    console.log('\n可以运行以下命令测试:');
    console.log('  npm run evening  # 生成晚间版简报');
    console.log('  npm run morning  # 生成晨间版简报');
  } else {
    console.log('\n❌ 存在必需配置未设置，请先完善 .env 文件');
    console.log('\n参考配置模板:');
    console.log('  cp .env.example .env');
    console.log('  # 然后编辑 .env 填入你的 API Key');
    process.exit(1);
  }
  
} catch (error) {
  console.error(`❌ 检查失败：${error.message}`);
  process.exit(1);
}
