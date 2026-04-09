# Payload CMS Blog Setup Guide

## Quick Start

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Using createdb (macOS/Linux)
createdb blog_db

# OR using psql
psql -U postgres
CREATE DATABASE blog_db;
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
# Payload CMS
PAYLOAD_SECRET=your_super_secret_key_here_generate_with_openssl_rand_base64_32
PAYLOAD_PUBLIC_URL=http://localhost:3000

# PostgreSQL Database
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/blog_db
```

Generate a secure `PAYLOAD_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Database Migrations

```bash
npm run payload:migrate
```

This creates all necessary tables in PostgreSQL.

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access Payload Admin

Visit: http://localhost:3000/admin

**First Time Setup:**
1. Create your admin account
2. Add authors
3. Add categories
4. Create your first blog post
5. Upload media files

### 8. View Blog

- **Blog Listing:** http://localhost:3000/blog
- **Individual Post:** http://localhost:3000/blog/[post-slug]
- **RSS Feed:** http://localhost:3000/blog/rss.xml

## Available Scripts

```bash
# Start Payload standalone (optional)
npm run payload

# Generate TypeScript types from Payload schema
npm run payload:generate-types

# Run database migrations
npm run payload:migrate

# Reset database and run migrations
npm run payload:migrate:fresh
```

## Collections

### Posts
Blog articles with title, slug, content, cover image, status, author, categories, and tags.

### Categories
Categories for organizing posts (e.g., "Technology", "Tutorial", "News").

### Authors
Blog authors with name, email, bio, avatar, website, and social links.

### Media
Image uploads with automatic thumbnail generation.

### Users
Admin users for Payload CMS access control.

## Useful URLs

- **Admin Panel:** `/admin`
- **API Endpoint:** `/api/payload/...`
- **Blog Listing:** `/blog`
- **RSS Feed:** `/blog/rss.xml`
- **Sitemap:** `/sitemap.xml`

## Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running:
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

### Migration Error

Reset database:
```bash
npm run payload:migrate:fresh
```

### Payload Admin Not Loading

Check that `PAYLOAD_SECRET` is set in `.env`.

## Production Deployment

1. Set up PostgreSQL on your hosting provider (e.g., Supabase, Neon, AWS RDS)
2. Set environment variables in your deployment
3. Run migrations: `npm run payload:migrate`
4. Build the app: `npm run build`
5. Start: `npm run start`

## Customization

### Adding New Fields

Edit collection files in `/payload/src/collections/`:
- `Posts.ts` - Blog post fields
- `Categories.ts` - Category fields
- `Authors.ts` - Author fields

After changes:
1. Run `npm run payload:generate-types` to update TypeScript types
2. Run `npm run payload:migrate` to update database

### Custom Components

Add custom React components to admin UI by editing `payload.config.ts`.

## Support

- Payload CMS Docs: https://payloadcms.com/docs
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
