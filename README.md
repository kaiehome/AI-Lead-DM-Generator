# AI Lead DM Generator

A lightweight, AI-powered outreach workflow tool built with Next.js, Supabase, and OpenAI.

## Features

- 📝 **Lead Management**: Add and manage leads with name, role, company, and LinkedIn URL
- 🤖 **AI Message Generation**: Generate personalized LinkedIn outreach messages using OpenAI
- 📊 **Status Tracking**: Track message status (Draft, Approved, Sent)
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- ⚡ **Real-time Updates**: React Query for efficient data management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (GPT-3.5)
- **State Management**: TanStack Query
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-lead-dm-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Go to SQL Editor
   - Run the SQL commands from `supabase-setup.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Leads Table
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

## API Endpoints

- `POST /api/generate-message` - Generate AI message
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

## Usage

1. **Add a Lead**: Fill out the lead form with name, role, company, and optional LinkedIn URL
2. **Generate Message**: Click "Generate" on any lead to create a personalized message using AI
3. **Manage Status**: Update the status of leads (Draft → Approved → Sent)
4. **Edit/Delete**: Use the action buttons to edit or delete leads

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
