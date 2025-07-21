# AI Lead DM Generator

# AI 潜在客户消息生成器

A lightweight, AI-powered outreach workflow tool built with Next.js, Supabase, and OpenAI.

一个轻量级的、基于AI的外联工作流工具，使用Next.js、Supabase和OpenAI构建。

## Features / 功能特性

- 📝 **Lead Management / 潜在客户管理**: Add and manage leads with name, role, company, and LinkedIn URL / 添加和管理包含姓名、职位、公司和LinkedIn URL的潜在客户
- 🤖 **AI Message Generation / AI消息生成**: Generate personalized LinkedIn outreach messages using OpenAI / 使用OpenAI生成个性化的LinkedIn外联消息
- 📊 **Status Tracking / 状态跟踪**: Track message status (Draft, Approved, Sent) / 跟踪消息状态（草稿、已批准、已发送）
- 🎨 **Modern UI / 现代界面**: Built with Tailwind CSS and shadcn/ui components / 使用Tailwind CSS和shadcn/ui组件构建
- ⚡ **Real-time Updates / 实时更新**: React Query for efficient data management / 使用React Query进行高效的数据管理

## Tech Stack / 技术栈

- **Frontend / 前端**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components / UI组件**: shadcn/ui
- **Database / 数据库**: Supabase (PostgreSQL)
- **AI / 人工智能**: OpenAI API (GPT-3.5)
- **State Management / 状态管理**: TanStack Query
- **Deployment / 部署**: Vercel

## Getting Started / 快速开始

### Prerequisites / 前置要求

- Node.js 18+ 
- npm or yarn
- Supabase account / Supabase账户
- OpenAI API key / OpenAI API密钥

### Installation / 安装

1. **Clone the repository / 克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd ai-lead-dm-generator
   ```

2. **Install dependencies / 安装依赖**
   ```bash
   npm install
   ```

3. **Set up environment variables / 设置环境变量**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials: / 编辑 `.env.local` 并添加您的凭据:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up Supabase database / 设置Supabase数据库**
   - Create a new Supabase project / 创建新的Supabase项目
   - Go to SQL Editor / 进入SQL编辑器
   - Run the SQL commands from `supabase-setup.sql` / 运行 `supabase-setup.sql` 中的SQL命令

5. **Run the development server / 运行开发服务器**
   ```bash
   npm run dev
   ```

6. **Open your browser / 打开浏览器**
   Navigate to [http://localhost:3000](http://localhost:3000) / 导航到 [http://localhost:3000](http://localhost:3000)

## Database Schema / 数据库架构

### Leads Table / 潜在客户表
```sql
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
```

## API Endpoints / API端点

- `POST /api/generate-message` - Generate AI message / 生成AI消息
- `GET /api/leads` - Get all leads / 获取所有潜在客户
- `POST /api/leads` - Create new lead / 创建新潜在客户
- `PUT /api/leads/[id]` - Update lead / 更新潜在客户
- `DELETE /api/leads/[id]` - Delete lead / 删除潜在客户

## Usage / 使用方法

1. **Add a Lead / 添加潜在客户**: Fill out the lead form with name, role, company, and optional LinkedIn URL / 填写包含姓名、职位、公司和可选的LinkedIn URL的潜在客户表单
2. **Generate Message / 生成消息**: Click "Generate" on any lead to create a personalized message using AI / 点击任何潜在客户的"生成"按钮，使用AI创建个性化消息
3. **Manage Status / 管理状态**: Update the status of leads (Draft → Approved → Sent) / 更新潜在客户的状态（草稿 → 已批准 → 已发送）
4. **Edit/Delete / 编辑/删除**: Use the action buttons to edit or delete leads / 使用操作按钮编辑或删除潜在客户

## Deployment / 部署

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) / 详细部署说明请参见 [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Vercel / 快速部署到Vercel

1. Push your code to GitHub / 将代码推送到GitHub
2. Connect your repository to Vercel / 将仓库连接到Vercel
3. Add environment variables in Vercel dashboard / 在Vercel仪表板中添加环境变量
4. Deploy! / 部署！

### Environment Variables for Production / 生产环境变量

Make sure to set these in your Vercel dashboard: / 确保在Vercel仪表板中设置这些变量:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## Contributing / 贡献

1. Fork the repository / Fork仓库
2. Create a feature branch / 创建功能分支
3. Make your changes / 进行更改
4. Submit a pull request / 提交拉取请求

## License / 许可证

MIT License - see LICENSE file for details / MIT许可证 - 详情请参见LICENSE文件

---

## Project Documentation / 项目文档

For comprehensive project documentation, design guides, and architecture details, please visit the [docs](./docs/) folder.

有关完整的项目文档、设计指南和架构详情，请访问 [docs](./docs/) 文件夹。

### Key Documents / 关键文档
- [Project Concept](./docs/01-CONCEPT.md) - 项目构思
- [Project Planning](./docs/02-PLANNING.md) - 项目规划  
- [Project Approval](./docs/03-APPROVAL.md) - 项目审批
- [Architecture Review](./docs/04-ARCHITECTURE.md) - 架构评审
- [Figma Design Guide](./docs/FIGMA_DESIGN_GUIDE.md) - Figma设计指南

### Design Files / 设计文件
All Figma design files are available in the [designs](./designs/) folder, including responsive designs for desktop, tablet, and mobile.

所有Figma设计文件都在 [designs](./designs/) 文件夹中，包括桌面端、平板端和移动端的响应式设计。
