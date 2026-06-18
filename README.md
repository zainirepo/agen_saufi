# agen_saufi

App kelola order pembuatan project web: data pemesan (nama, no HP), status pembayaran (Belum/DP/Lunas), dan file project (.zip, sampai ~200MB) per order. Login untuk CEO (Mas Saufi) dan Admin, akses sama (full CRUD).

Stack: Next.js (App Router) + Prisma + PostgreSQL + NextAuth (credentials) + Vercel Blob (client upload).

## Jalan di laptop (Docker, Windows 10/11)

Prasyarat: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (WSL2 backend) terpasang dan jalan.

1. Copy `.env.example` ke `.env`, isi `BLOB_READ_WRITE_TOKEN` (ambil dari Vercel dashboard > Storage > Blob, buat store dulu kalau belum ada — token tetap dipakai walau dev lokal, karena tidak ada emulator Blob lokal resmi).
2. Buat `AUTH_SECRET`: `npx auth secret` atau `openssl rand -base64 32`.
3. Nyalakan app + database:
   ```
   docker compose up --build
   ```
4. Setelah container `db` jalan, terapkan migration dan seed akun login (jalankan dari host, sekali saja):
   ```
   npm install
   npm run db:migrate
   npm run db:seed
   ```
5. Buka http://localhost:3000 — login pakai `SEED_CEO_EMAIL`/`SEED_CEO_PASSWORD` atau `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` dari `.env`.

### Dev tanpa Docker (opsional)

```
npm install
npm run dev
```
Butuh Postgres jalan di `localhost:5432` (bisa pakai `docker compose up db` saja) dan `DATABASE_URL` di `.env` mengarah ke situ.

## Deploy ke Vercel

1. Buat database di [Neon](https://neon.tech) (Postgres serverless), salin connection string.
2. Buat Blob store di Vercel dashboard project > Storage, salin `BLOB_READ_WRITE_TOKEN`.
3. Import repo ke Vercel, set environment variables: `DATABASE_URL` (Neon), `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`.
4. Jalankan migration ke database Neon sebelum/saat deploy pertama:
   ```
   DATABASE_URL="<neon-connection-string>" npm run db:migrate
   DATABASE_URL="<neon-connection-string>" npm run db:seed
   ```
5. Deploy. Vercel akan build otomatis (`next build`).

## Catatan teknis

- Upload zip pakai **Vercel Blob client upload** (`@vercel/blob/client`) — file dikirim langsung dari browser ke Blob storage via signed token (`app/api/blob/upload/route.ts`), bukan lewat body server function. Ini diperlukan karena Vercel serverless function punya limit body ~4.5MB, sedangkan file project bisa sampai puluhan MB.
- Hapus order otomatis menghapus file di Blob storage (`app/api/orders/[id]/route.ts`).
- Role `CEO` dan `ADMIN` punya hak akses identik — field role cuma untuk label tampilan.
