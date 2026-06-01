-- ============================================================
--  Portofolio - skema database + data awal (seed)
--  Letakkan file ini di /docker-entrypoint-initdb.d/ pada
--  container MariaDB agar ter-import OTOMATIS saat pertama up.
--
--  Ubah isi data di bawah (INSERT) dengan data diri kamu.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `uas-zayaksara`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `uas-zayaksara`;

-- ----------------------------------------------------------
-- 1. PROFIL / HOME
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120)  NOT NULL,
  headline     VARCHAR(160)  NOT NULL,
  tagline      VARCHAR(255)  NOT NULL,
  bio          TEXT          NOT NULL,
  location     VARCHAR(120)  NOT NULL,
  email        VARCHAR(160)  NOT NULL,
  phone        VARCHAR(40)   NOT NULL,
  photo_url    LONGTEXT      NULL,   -- foto disimpan sebagai data URL base64
  github_url   VARCHAR(255)  NOT NULL DEFAULT '#',
  linkedin_url VARCHAR(255)  NOT NULL DEFAULT '#'
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. RIWAYAT PENDIDIKAN
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  institution VARCHAR(160) NOT NULL,
  degree      VARCHAR(120) NOT NULL,
  field       VARCHAR(120) NOT NULL DEFAULT '',
  start_year  INT          NOT NULL,
  end_year    INT          NULL,
  description TEXT         NOT NULL DEFAULT ''
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. SKILLS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(80)  NOT NULL,
  category VARCHAR(80)  NOT NULL,
  level    INT          NOT NULL DEFAULT 50   -- 0..100
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 4. PRESTASI
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(180) NOT NULL,
  issuer      VARCHAR(160) NOT NULL DEFAULT '',
  year        INT          NOT NULL,
  description TEXT         NOT NULL DEFAULT ''
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 5. HOBI / TENTANG DIRI
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS hobbies (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  emoji       VARCHAR(16)  NOT NULL DEFAULT '⭐',
  description VARCHAR(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 6. PROJECTS (section Project) — status: ongoing | completed
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(180) NOT NULL,
  description TEXT         NOT NULL,
  image_url   LONGTEXT     NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'completed',
  demo_url    VARCHAR(255) NOT NULL DEFAULT '',
  repo_url    VARCHAR(255) NOT NULL DEFAULT '',
  sort_order  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 7. ADMIN (login panel) — default: admin / admin123
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO admin (username, password_hash) VALUES
  ('admin', '$2b$10$yg62QL.eFEP0K1qf1NcYFeF8nNFc2z53AAVNsF.tf81jlZrB41IM6')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- ==========================================================
--  DATA AWAL (ganti dengan data kamu)
-- ==========================================================
INSERT INTO profile
  (full_name, headline, tagline, bio, location, email, phone, photo_url, github_url, linkedin_url)
VALUES
  ('Nama Lengkap Kamu',
   'Mahasiswa Informatika & Web Developer',
   'Membangun aplikasi web yang rapi, cepat, dan bermanfaat.',
   'Saya seorang mahasiswa yang antusias di bidang pengembangan web dan cloud computing. Suka belajar teknologi baru dan menyelesaikan masalah lewat kode.',
   'Bandung, Indonesia',
   'email@contoh.com',
   '+62 812-3456-7890',
   '',
   'https://github.com/username',
   'https://linkedin.com/in/username');

INSERT INTO education (institution, degree, field, start_year, end_year, description) VALUES
  ('Universitas Contoh', 'S1', 'Teknik Informatika', 2022, NULL, 'Fokus pada rekayasa perangkat lunak dan komputasi awan.'),
  ('SMA Negeri 1 Contoh', 'SMA', 'IPA', 2019, 2022, 'Aktif di ekstrakurikuler komputer dan olimpiade sains.');

INSERT INTO skills (name, category, level) VALUES
  ('HTML & CSS',      'Frontend', 90),
  ('JavaScript',      'Frontend', 85),
  ('React / Next.js', 'Frontend', 80),
  ('Tailwind CSS',    'Frontend', 85),
  ('Node.js',         'Backend',  75),
  ('PHP',             'Backend',  70),
  ('MySQL / MariaDB', 'Backend',  78),
  ('Docker',          'DevOps',   65),
  ('Git & GitHub',    'DevOps',   80),
  ('Linux',           'DevOps',   70);

INSERT INTO achievements (title, issuer, year, description) VALUES
  ('Juara 1 Lomba Web Design', 'Universitas Contoh', 2024, 'Memenangkan kompetisi desain web tingkat kampus.'),
  ('Finalis Hackathon Nasional', 'TechFest Indonesia', 2023, 'Masuk 10 besar dari 200+ tim peserta.'),
  ('Sertifikat Cloud Practitioner', 'AWS', 2024, 'Lulus sertifikasi dasar cloud computing.');

INSERT INTO projects (title, description, image_url, status, demo_url, repo_url, sort_order) VALUES
  ('Portofolio Neo-Brutalism', 'Website portofolio dinamis dengan Next.js, MariaDB, dan deployment Docker + CI/CD.', NULL, 'ongoing', '#', '#', 1),
  ('Aplikasi Kasir Sederhana', 'Aplikasi point-of-sale berbasis web dengan manajemen produk dan laporan penjualan.', NULL, 'completed', '#', '#', 2),
  ('Bot Telegram Reminder', 'Bot pengingat tugas otomatis terintegrasi dengan database dan penjadwalan.', NULL, 'completed', '#', '#', 3);

INSERT INTO hobbies (name, emoji, description) VALUES
  ('Coding',        '💻', 'Membuat project sampingan di waktu luang.'),
  ('Gaming',        '🎮', 'Suka game strategi dan teka-teki.'),
  ('Membaca',       '📚', 'Buku teknologi dan pengembangan diri.'),
  ('Fotografi',     '📷', 'Mengabadikan momen dan pemandangan.'),
  ('Olahraga',      '⚽', 'Futsal bersama teman setiap akhir pekan.');
