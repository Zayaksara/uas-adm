# UAS Administrasi Server — Multi-App Deployment (NIM 2388010024)

Deployment **2 aplikasi** ke **AWS EC2** menggunakan **Docker Compose** + **CI/CD GitHub Actions** (zero-touch deployment), dengan **MariaDB** ter-seeding otomatis.

| Aplikasi | URL | Jenis | Container |
| :-- | :-- | :-- | :-- |
| **Web Statis (CV)** | `http://<IP-EC2>/` (port 80) | HTML/CSS murni | `proxy` (nginx) |
| **Web Dinamis (Portofolio)** | `http://<IP-EC2>:8080/` | Next.js + login + admin CRUD | `web-dynamic` |
| Database | internal (tidak publik) | MariaDB 11, auto-seed | `db` |

> Instance EC2: **`UAS-2388010024`**

---

## 1. Topologi Arsitektur

```
                    Internet
                       │
        ┌──────────────┴───────────────┐
        │  :80                    :8080 │
        ▼                               ▼
┌─────────────────────────────────────────────┐
│              proxy  (nginx)                   │   ← satu-satunya publik
│  :80   → serve static-cv/ (Web Statis CV)     │
│  :8080 → reverse-proxy ke web-dynamic:3000    │
└───────────────┬───────────────────────────────┘
                │ network internal "appnet" (DNS by service name)
                ▼
        ┌────────────────┐        ┌──────────────────┐
        │  web-dynamic    │ ─────► │       db          │
        │  Next.js :3000  │  3306  │  MariaDB 11       │
        │  (login/admin)  │        │  volume db_data   │
        └────────────────┘        │  auto-seed *.sql  │
                                   └──────────────────┘
```

- **Port DB & Next.js tidak diekspos ke publik** — hanya diakses lewat network internal `appnet`. Keamanan sesuai rubrik.
- Reverse proxy memakai **DNS internal** (`web-dynamic`, `db`) — bukan IP statis.

---

## 2. Komponen & Berkas

| Berkas | Fungsi |
| :-- | :-- |
| [docker-compose.yml](docker-compose.yml) | Orkestrasi 3 service + network + volume persisten |
| [proxy/Dockerfile](proxy/Dockerfile) · [proxy/nginx.conf](proxy/nginx.conf) | nginx: serve statis (`:80`) + reverse proxy (`:8080`) |
| [static-cv/index.html](static-cv/index.html) | Web statis CV (file tunggal) |
| [Dockerfile](Dockerfile) | Build Next.js standalone (multi-stage) |
| [db/](db/) | Skema + seed SQL, di-mount ke `/docker-entrypoint-initdb.d/` |
| [.github/workflows/](.github/workflows/) | 2 pipeline CI/CD (paths filter terisolasi) |
| [.env.production.example](.env.production.example) | Template environment produksi |

---

## 3. Environment Variables

Salin `.env.production.example` → `.env` di samping `docker-compose.yml` (di EC2), lalu isi:

| Variabel | Keterangan |
| :-- | :-- |
| `DOCKERHUB_USERNAME` | Username Docker Hub (nama image yang di-pull) |
| `DB_PASSWORD` | Password akun aplikasi `uas-zayaksara` |
| `AUTH_SECRET` | Rahasia sesi Auth.js (`npx auth secret`) |
| `NEXTAUTH_URL` | `http://<IP-PUBLIK-EC2>:8080` |

Aplikasi konek ke MariaDB sebagai user **`uas-zayaksara`** (bukan root), dibuat otomatis oleh container `db`.

Database `uas-zayaksara` dibuat & di-seed otomatis dari `db/*.sql` saat container `db` pertama kali up.

**Login admin default:** `admin` / `admin123` (ganti setelah login).

---

## 4. Cara Menjalankan

### Lokal (build dari source)
```bash
cp .env.production.example .env   # isi nilainya
docker compose up -d --build
# Statis  : http://localhost/
# Dinamis : http://localhost:8080/
```

### Produksi (AWS EC2 — pull dari Docker Hub)
```bash
mkdir -p ~/app && cd ~/app
# letakkan docker-compose.yml + .env di sini
docker compose pull
docker compose up -d
```

### Security Group AWS (wajib dibuka)
| Port | Protokol | Sumber | Fungsi |
| :-- | :-- | :-- | :-- |
| 22 | TCP | IP kamu | SSH |
| 80 | TCP | 0.0.0.0/0 | Web Statis CV |
| 8080 | TCP | 0.0.0.0/0 | Web Dinamis Next.js |

---

## 5. CI/CD — Zero-Touch Deployment

Dua workflow dengan **paths filter** sehingga terisolasi & hemat runner:

- [deploy-static.yml](.github/workflows/deploy-static.yml) → jalan saat `static-cv/**` atau `proxy/**` berubah.
- [deploy-dynamic.yml](.github/workflows/deploy-dynamic.yml) → jalan saat `app/**`, `lib/**`, `Dockerfile`, dll. berubah.

Alur tiap pipeline: **Build → Push ke Docker Hub → SCP compose → SSH ke EC2 → `docker compose pull` + `up -d`** (zero-downtime, hanya service berubah yang di-recreate).

### GitHub Secrets yang diperlukan
`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `AUTH_SECRET`, `DB_PASSWORD`

### Demo Live Test (Auto-Update)
```bash
# ubah teks di static-cv/index.html ATAU app/page.tsx
git add . && git commit -m "demo: live update" && git push
# → Actions berjalan otomatis → image baru → EC2 ter-update → refresh browser
```

---

## 6. Bukti Pengujian

> Link aplikasi: **http://54.254.231.65/** (statis) · **http://54.254.231.65:8080/** (dinamis)

### 6.1 Port Mapping (Web Statis :80 & Web Dinamis :8080)

Web Statis CV pada port 80:

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/e8618f85-14ec-404f-a52a-d35dabfdc1f7" />


Web Dinamis Next.js pada port 8080:

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c8ee4e58-0686-4fb6-9f34-3e0103a7583b" />



Login admin berhasil (`:8080/admin`):

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/bcb82c19-8046-45b9-ac3d-d4a7ca9a1bfe" />

AWS Security Group (inbound 22, 80, 8080 terbuka):

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/9307252b-ae6b-4157-aafb-d8c71b1a7347" />


### 6.2 Automasi Database (MariaDB auto-seed)

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7d01d13f-6d6d-4d77-a067-f6a0de3c65ea" />


### 6.3 CI/CD Pipeline (GitHub Actions & Docker Hub)

Kedua workflow centang hijau:

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ece9617e-574f-4c97-83f2-0850390f0e2d" />


Image ter-push ke Docker Hub:

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6f8ba66a-fea1-4fa6-826f-85fd94b3159e" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/1d3dabf0-160c-4d4c-8dbc-d8088d2f6e5f" />


### 6.4 Live Test — Zero-Touch Deployment & Zero Downtime


**Bukti Zero Downtime** — loop `curl` selama proses deploy tetap mengembalikan `200`:

<img width="1919" height="245" alt="image" src="https://github.com/user-attachments/assets/f4e08eaf-7112-4427-bb7d-9fdce95eb561" />

### Checklist akhir
- [v] Web Statis tampil di `:80`
- [v] Web Dinamis + login tampil di `:8080`
- [v] 3 container `Up` (`docker compose ps`)
- [v] Security Group port 22/80/8080 terbuka
- [v] MariaDB ter-seed otomatis
- [v] 2 workflow Actions hijau + image di Docker Hub
- [v] Live test: push → berubah otomatis
- [v] Zero downtime terbukti (curl loop `200`)
