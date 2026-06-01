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

![Web Statis CV port 80](docs/img/01-static-80.png)

Web Dinamis Next.js pada port 8080:

![Web Dinamis port 8080](docs/img/02-dynamic-8080.png)

Login admin berhasil (`:8080/admin`):

![Login admin](docs/img/03-login-admin.png)

Container berjalan & pemetaan port (`docker compose ps` di EC2):

![docker compose ps](docs/img/04-compose-ps.png)

```text
# Tempel output `docker compose ps` di sini
$ docker compose ps
```

AWS Security Group (inbound 22, 80, 8080 terbuka):

![Security Group AWS](docs/img/05-security-group.png)

### 6.2 Automasi Database (MariaDB auto-seed)

```bash
docker exec -it app-db-1 mariadb -u uas-zayaksara -pFatih0214 uas-zayaksara \
  -e "SHOW TABLES; SELECT full_name FROM profile;"
```

![MariaDB ter-seed](docs/img/06-db-seed.png)

```text
# Tempel output query di atas (tabel + data) di sini
```

### 6.3 CI/CD Pipeline (GitHub Actions & Docker Hub)

Kedua workflow centang hijau:

![GitHub Actions hijau](docs/img/07-actions-green.png)

Image ter-push ke Docker Hub:

![Docker Hub images](docs/img/08-dockerhub.png)

### 6.4 Live Test — Zero-Touch Deployment & Zero Downtime

Sebelum (teks lama):

![Sebelum](docs/img/09-before.png)

Commit & push perubahan dari lokal:

![git push](docs/img/10-git-push.png)

Workflow berjalan otomatis akibat push:

![Actions running](docs/img/11-actions-running.png)

Sesudah (teks baru muncul otomatis di browser, tanpa sentuh server):

![Sesudah](docs/img/12-after.png)

**Bukti Zero Downtime** — loop `curl` selama proses deploy tetap mengembalikan `200`:

```bash
while true; do curl -s -o /dev/null -w "%{http_code} " http://localhost; sleep 1; done
```

![Zero downtime curl loop](docs/img/13-zero-downtime.png)

```text
# Tempel deretan output (200 200 200 ...) selama deploy di sini
```

### 6.5 Log Deploy (dari GitHub Actions / EC2)

```text
# Tempel log tahap "Deploy di EC2": docker compose pull + up -d
```

### Checklist akhir
- [ ] Web Statis tampil di `:80`
- [ ] Web Dinamis + login tampil di `:8080`
- [ ] 3 container `Up` (`docker compose ps`)
- [ ] Security Group port 22/80/8080 terbuka
- [ ] MariaDB ter-seed otomatis
- [ ] 2 workflow Actions hijau + image di Docker Hub
- [ ] Live test: push → berubah otomatis
- [ ] Zero downtime terbukti (curl loop `200`)
