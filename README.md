# AI Website Builder - Production SaaS

**Status:** 🚧 In Development | **Version:** 1.0.0-alpha

A modern AI-powered website builder that generates professional websites from business information. This is the production version, streamlined for a single premium template with focus on quality over quantity.

---

## 🎯 Business Model

```
Marketing Ads → User Fills Form → AI Generates (Hidden) → Sales Review → User Login → Edit → Publish
```

1. User clicks ad → Lands on form page
2. Fills business details + uploads (logo, images)
3. AI generates website in background (user sees "We'll get back to you")
4. Auto-generates credentials → Emails sales person
5. Sales person reviews → Sends credentials to user
6. User logs in → Edits website → Publishes to Netlify/Vercel

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL via Supabase, Prisma ORM
- **AI:** OpenAI GPT-4o-mini for content generation
- **Queue:** Bull + Redis for background jobs
- **Email:** Resend for transactional emails
- **Storage:** Supabase Storage for file uploads
- **Deploy:** Vercel (app), Netlify/Vercel (user sites)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
app/
  ├── page.tsx              # Landing page
  ├── get-started/          # Form page
  ├── dashboard/            # User dashboard
  ├── admin/                # Sales dashboard
  └── api/                  # API routes
services/                   # Business logic (copied from inspiration)
lib/                        # Utilities (Prisma, Supabase)
components/                 # React components
prisma/                     # Database schema
```

---

## 📋 Current Progress

### ✅ Completed
- [x] Next.js 14 app setup
- [x] Database schema (Prisma)
- [x] Folder structure
- [x] Core dependencies installed
- [x] Environment configuration

### 🔄 In Progress
- [ ] Landing page + form
- [ ] Form submission API
- [ ] AI website generator
- [ ] Sales dashboard
- [ ] User authentication

---

## 🔐 Environment Variables

See `.env.example` for all required variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `OPENAI_API_KEY` - OpenAI API key
- `RESEND_API_KEY` - Email service API key

---

## 📚 Documentation

- [Database Schema](./prisma/schema.prisma) - All database models
- [Inspiration Code](../inspiration/) - Reference implementation
- API docs coming soon

---

## 🛠️ Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # TypeScript check
npx prisma studio    # Database GUI
```

---

**Built with** ❤️ **and AI** | Proprietary - All Rights Reserved
