-- ============================================================
--  Tabel admin untuk login panel (jalankan jika init.sql sudah
--  terlanjur di-import tanpa tabel ini).
--
--    mysql -u root -p uas-zayaksara < db/admin.sql
--
--  Login default:  username = admin   password = admin123
--  (GANTI password setelah login pertama / ganti hash di bawah)
-- ============================================================
USE `uas-zayaksara`;

CREATE TABLE IF NOT EXISTS admin (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO admin (username, password_hash) VALUES
  ('admin', '$2b$10$yg62QL.eFEP0K1qf1NcYFeF8nNFc2z53AAVNsF.tf81jlZrB41IM6')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
