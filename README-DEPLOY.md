# Production deployment

This project keeps the existing UI/UX and owner editing workflow. For Vercel production:

- App: Vercel Hobby
- Database: Neon Postgres
- Image storage: Vercel Blob Hobby

Required environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`

The database schema is created automatically on first request. If you want to preserve content currently stored in the local SQLite database, export the `live` and `draft` documents before the first production request and import them into Neon. The default `seed.ts` remains the fallback for a brand-new database.
