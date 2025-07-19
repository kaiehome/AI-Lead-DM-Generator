# AI Lead DM Generator - 部署和配置指南

## 🚀 快速开始

### 1. 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
OPENAI_API_KEY=sk-248ed291fe8148098d684c84183d4532
```

### 2. 获取API密钥

#### Supabase配置
1. 访问 [Supabase控制台](https://supabase.com/dashboard)
2. 创建新项目或选择现有项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 密钥 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### OpenAI配置
1. 访问 [OpenAI API Keys](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 复制到 `OPENAI_API_KEY`

### 3. 数据库设置

在Supabase SQL编辑器中执行以下SQL脚本：

```sql
-- 创建leads表
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  linkedin_url VARCHAR(500),
  message TEXT,
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved', 'Sent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- 启用行级安全策略
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 创建策略（演示用途）
CREATE POLICY "Allow all operations" ON leads FOR ALL USING (true);

-- 自动更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 5. Vercel部署

#### 自动部署
1. 将代码推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com)
3. 导入GitHub仓库
4. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
5. 点击部署

#### 手动部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
```

## 🔧 功能测试

### 测试清单

1. **Lead输入表单**
   - [ ] 输入姓名、职位、公司
   - [ ] 可选LinkedIn URL
   - [ ] 提交表单验证

2. **AI消息生成**
   - [ ] 选择已创建的lead
   - [ ] 点击"Generate Message"
   - [ ] 验证AI生成的消息质量

3. **状态管理**
   - [ ] 更改消息状态（Draft/Approved/Sent）
   - [ ] 编辑lead信息
   - [ ] 删除lead

4. **数据持久化**
   - [ ] 刷新页面验证数据保存
   - [ ] 检查Supabase数据库中的数据

### 常见问题

#### 构建错误
- 确保所有环境变量都已设置
- 检查API密钥的有效性
- 验证Supabase项目配置

#### 数据库连接问题
- 确认Supabase URL和密钥正确
- 检查数据库表是否已创建
- 验证RLS策略配置

#### OpenAI API错误
- 确认API密钥有效
- 检查账户余额
- 验证API调用限制

## 📊 性能优化

### 生产环境建议

1. **环境变量**
   - 使用Vercel的环境变量管理
   - 定期轮换API密钥

2. **数据库优化**
   - 监控查询性能
   - 添加适当的索引
   - 实施数据归档策略

3. **API限制**
   - 实施速率限制
   - 添加错误处理
   - 监控API使用量

## 🔒 安全考虑

### 生产环境安全

1. **认证和授权**
   - 实施用户认证
   - 添加适当的RLS策略
   - 限制API访问

2. **数据保护**
   - 加密敏感数据
   - 实施数据备份
   - 定期安全审计

3. **API安全**
   - 使用HTTPS
   - 实施CORS策略
   - 监控异常活动

## 📈 扩展功能

### 可选增强功能

1. **用户认证**
   - Supabase Auth集成
   - 用户权限管理

2. **高级功能**
   - 批量消息生成
   - CSV导入/导出
   - 拖拽状态管理

3. **分析功能**
   - 消息效果跟踪
   - 转化率分析
   - 报告生成

## 🆘 支持

如果遇到问题，请检查：

1. **日志文件**
   - Vercel部署日志
   - 浏览器控制台错误
   - Supabase查询日志

2. **文档**
   - [Next.js文档](https://nextjs.org/docs)
   - [Supabase文档](https://supabase.com/docs)
   - [OpenAI API文档](https://platform.openai.com/docs)

3. **社区支持**
   - GitHub Issues
   - Stack Overflow
   - Discord社区 