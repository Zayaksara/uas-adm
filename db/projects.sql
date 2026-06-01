-- ============================================================
--  Migration: tabel `projects` (section Project)
--  Jalankan jika DB sudah terlanjur di-import:
--    mysql -u root -p uas-zayaksara < db/projects.sql
--
--  status: 'ongoing' (sedang berjalan) | 'completed' (selesai)
--  image_url: data URL base64 hasil upload (boleh kosong)
-- ============================================================
USE `uas-zayaksara`;

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

INSERT INTO projects (title, description, image_url, status, demo_url, repo_url, sort_order) VALUES
  ('Portofolio Neo-Brutalism', 'Website portofolio dinamis dengan Next.js, MariaDB, dan deployment Docker + CI/CD.', NULL, 'ongoing', '#', '#', 1),
  ('Aplikasi Kasir Sederhana', 'Aplikasi point-of-sale berbasis web dengan manajemen produk dan laporan penjualan.', NULL, 'completed', '#', '#', 2),
  ('Bot Telegram Reminder', 'Bot pengingat tugas otomatis terintegrasi dengan database dan penjadwalan.', NULL, 'completed', '#', '#', 3);
