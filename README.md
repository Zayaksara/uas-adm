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

### 4.0 Persiapan Server (AWS EC2): Instalasi Docker Engine

Dijalankan **sekali** di EC2 (Ubuntu) memakai repository resmi Docker.

```bash
# 1) Bersihkan paket lama (jika ada)
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt-get remove -y $pkg
done

# 2) Tambahkan repository resmi Docker + GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# 3) Instal Docker Engine + CLI + Compose plugin
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4) Aktifkan service & jalankan saat boot
sudo systemctl enable --now docker

# 5) Agar user `ubuntu` bisa pakai Docker tanpa sudo
sudo usermod -aG docker $USER && newgrp docker
```

**Verifikasi (bukti Docker Engine sudah terinstal):**

```bash
docker --version              # mis. Docker version 27.x, build ...
docker compose version        # mis. Docker Compose version v2.x
sudo systemctl status docker  # active (running)
docker run --rm hello-world   # uji menarik & menjalankan image
```

> Screenshot bukti instalasi (output `docker --version`, `docker compose version`, dan `systemctl status docker` = `active (running)`):

<!-- TODO: tempel screenshot terminal EC2 di sini -->
<img width="900" alt="Bukti instalasi Docker Engine di EC2" src="" />

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

<<<<<<< HEAD

### 6.4 Live Test — Zero-Touch Deployment & Zero Downtime


**Bukti Zero Downtime** — loop `curl` selama proses deploy tetap mengembalikan `200`:

<img width="1919" height="245" alt="image" src="https://github.com/user-attachments/assets/f4e08eaf-7112-4427-bb7d-9fdce95eb561" />

### Checklist akhir
- [v] Docker Engine + Compose plugin terinstal di EC2 (`docker --version`)
- [v] Web Statis tampil di `:80`
- [v] Web Dinamis + login tampil di `:8080`
- [v] 3 container `Up` (`docker compose ps`)
- [v] Security Group port 22/80/8080 terbuka
- [v] MariaDB ter-seed otomatis
- [v] 2 workflow Actions hijau + image di Docker Hub
- [v] Live test: push → berubah otomatis
- [v] Zero downtime terbukti (curl loop `200`)
=======
>>>>>>> ee190517472756102dd615c8c89f840c82c110d4
