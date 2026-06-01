-- ============================================================
--  Migration: ubah kolom photo_url agar muat foto hasil upload
--  (disimpan sebagai data URL base64, bisa panjang).
--
--  Jalankan jika DB sudah terlanjur di-import dengan VARCHAR(255):
--    mysql -u root -p uas-zayaksara < db/upgrade-photo.sql
-- ============================================================
USE `uas-zayaksara`;

ALTER TABLE profile MODIFY photo_url LONGTEXT NULL;
