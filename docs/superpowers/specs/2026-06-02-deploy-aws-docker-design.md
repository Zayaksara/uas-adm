# Deploy UAS — AWS + Docker + CI/CD (NIM 2388010024)

## Tujuan
Memenuhi Rubrik UAS Administrasi Server: deploy 2 aplikasi (Web Statis CV + Web
Dinamis Next.js) ke AWS EC2 lewat Docker Compose, dengan CI/CD GitHub Actions
(zero-touch deployment) dan MariaDB ter-seeding otomatis.

## Konteks
- Instance EC2 `UAS-2388010024` SUDAH ada & siap (Docker + Compose terpasang, IP publik, SSH key).
- Registry: **Docker Hub**.
- Web dinamis Next.js SUDAH selesai (`app/`, auth, admin CRUD, `db/*.sql`). TIDAK diubah.
- Web statis CV BELUM ada → dibuat baru (HTML/CSS neo-brutalism, selaras portofolio).

## Arsitektur (Opsi B — pemisahan port via reverse proxy)
Satu `docker-compose.yml`, network internal `appnet`, 3 service:

```
Internet
  :80   → [proxy] nginx  → serve static-cv/  (Web Statis CV)
  :8080 → [proxy] nginx  → reverse-proxy → web-dynamic:3000 (Next.js)
                                                │ appnet (DNS by service name)
                                                ▼
                                          [db] mariadb:11  (volume db_data, auto-seed)
```

- **proxy**: nginx. Ekspos `80:80` dan `8080:8080`. Satu-satunya yang publik.
  - `:80` root → file statis `static-cv/`.
  - `:8080` → `proxy_pass http://web-dynamic:3000`.
- **web-dynamic**: image Next.js (Dockerfile yang sudah ada). Tidak ekspos port publik.
  - env: `DATABASE_HOST=db`, `DATABASE_NAME=uas-2388010024`, `AUTH_SECRET`,
    `NEXTAUTH_URL=http://<IP-AWS>:8080`, `AUTH_URL` sama.
- **db**: `mariadb:11`. Tidak ekspos port publik. Volume `db_data` persisten.
  `db/*.sql` di-mount read-only ke `/docker-entrypoint-initdb.d/` (auto-seed).
  `depends_on` memastikan db up sebelum web-dynamic.

Reverse proxy statis dilayani oleh image nginx terpisah yang menyalin `static-cv/`
ke dalamnya (agar bisa di-build & push ke Docker Hub untuk CI/CD terisolasi),
atau di-bake langsung ke image `proxy`. Keputusan: **image `proxy` mem-bundle
`static-cv/` + nginx.conf** → satu image untuk statis & routing, lebih sederhana.

## CI/CD — paths filter terisolasi (rubrik "Sangat Baik")
Dua workflow di `.github/workflows/`:

1. **deploy-static.yml** — `on: push: paths: ['static-cv/**','proxy/**']`
   - Build image proxy (berisi static-cv) → push Docker Hub `:<sha>` + `:latest`.
   - SSH ke EC2 → `docker compose pull proxy && docker compose up -d proxy`.

2. **deploy-dynamic.yml** — `on: push: paths: ['app/**','components/**','lib/**','db/**','public/**','Dockerfile','package*.json','next.config.ts','auth*.ts','proxy.ts']`
   - Build image Next.js → push Docker Hub `:<sha>` + `:latest`.
   - SSH ke EC2 → `docker compose pull web-dynamic && docker compose up -d web-dynamic`.

Zero-downtime: `up -d` hanya me-recreate service yang berubah; service lain tetap jalan.

### GitHub Secrets
`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`,
`AUTH_SECRET`, `DB_PASSWORD`.

## Berkas yang dibuat / diubah
Baru:
- `static-cv/index.html`, `static-cv/style.css` (CV statis neo-brutalism)
- `proxy/Dockerfile`, `proxy/nginx.conf`
- `docker-compose.yml`
- `.env.production.example` (template env produksi)
- `.github/workflows/deploy-static.yml`, `deploy-dynamic.yml`
- `README.md` baru (topologi, env, langkah deploy, panduan screenshot, link IP)

Tidak diubah: seluruh kode aplikasi dinamis (`app/`, `components/`, `lib/`, `auth*`, `db/*.sql`).

## Kriteria sukses (peta ke rubrik)
1. CI/CD (20%): 2 workflow hijau, paths filter terisolasi.
2. Compose & jaringan (20%): DNS internal `db`, env vars, `depends_on`, volume persisten, port DB tidak publik.
3. Fungsionalitas & DB (20%): `:80` statis tampil, `:8080` Next.js + login jalan, MariaDB auto-seed dari `db/*.sql`.
4. Dokumentasi (15%): README dengan topologi, env, screenshot, link IP.
5. Live test (25%): ubah teks lokal → `git push` → otomatis ter-deploy ke EC2 tanpa downtime.

## Di luar lingkup
- Membuat/menyetel instance EC2 (sudah ada).
- Mengubah fitur aplikasi dinamis.
- HTTPS/domain (pakai IP + HTTP sesuai rubrik).
