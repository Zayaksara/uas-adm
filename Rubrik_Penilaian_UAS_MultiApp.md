# **RUBRIK PENILAIAN UJIAN AKHIR SEMESTER (UAS)**

**MATA KULIAH:** Administrasi Server (Cloud Computing II)

**DOSEN PENGAMPU:** Mohamad Firdaus, M.Kom.

**METODE PENILAIAN:** Project-Based Learning (PBL) & Outcome-Based Education (OBE)

## **A. KOMPONEN PENILAIAN & BOBOT (100%)**

Penilaian UAS ini ditekankan pada kemampuan analitis, ketepatan arsitektur *Cloud Native*, dan pembuktian langsung keberhasilan implementasi *Continuous Integration/Continuous Deployment* (CI/CD). Uji coba langsung (*Live Test*) memegang peranan dan bobot tertinggi sebagai validasi final. Deploy 2 System Apps (statis Web: Web CV saat UTS) dan (Dynamic Web: buat dg bahasa pemrograman apapun Node, PHP, python dll). Buat instance baru UAS-NIM. 

| No | Kriteria Penilaian (CPMK) | Bobot | Fokus Evaluasi |
| :---- | :---- | :---- | :---- |
| 1 | **Arsitektur CI/CD Pipeline (GitHub Actions)** | **20%** | Keberhasilan skrip otomatisasi dalam melakukan *Build, Push Image*, dan *Deployment* ke AWS. |
| 2 | **Orkestrasi Docker Compose & Jaringan** | **20%** | Penulisan sintaks YAML, pemetaan port, konfigurasi volume, dan integrasi antar-kontainer. |
| 3 | **Fungsionalitas Aplikasi & Automasi Database** | **20%** | Aplikasi berjalan normal, Web statis dapat diakses, dan *Database MariaDB* ter-seeding otomatis. |
| 4 | **Dokumentasi Teknis (README.md)** | **15%** | Kejelasan log pengujian, bukti *screenshot* (Zero Downtime & Port Mapping), dan penjelasan arsitektur. |
| 5 | **Uji Coba Langsung (Live Test): Auto-Update** | **25%** | Demonstrasi "Zero-Touch Deployment" dengan mengubah kode aplikasi lokal, melakukan git commit, dan melihat perubahan terjadi secara otomatis di *Production* (AWS). |

## **B. RINCIAN INDIKATOR PENILAIAN (SKALA 0 \- 100\)**

### **1\. Arsitektur CI/CD Pipeline (Bobot 20%)**

* **Sangat Baik (17-20):** Pipeline berjalan sempurna (Centang Hijau). Menggunakan teknik *Paths Filter* sehingga web statis dan dinamis memiliki *pipeline* yang terisolasi dan efisien.  
* **Baik (13-16):** Pipeline berjalan sukses, namun masih digabung dalam satu YAML tanpa pemisahan *paths*, sehingga memboroskan *resource runner* saat salah satu aplikasi diubah.  
* **Cukup (8-12):** Skrip CI/CD berhasil melakukan *build* ke Docker Hub, namun gagal saat tahap *Delivery* (SCP) atau eksekusi SSH ke AWS EC2.  
* **Kurang (\<8):** Pipeline gagal di tahap awal (*syntax error* pada YAML atau rahasia/Secrets tidak terkonfigurasi).

### **2\. Orkestrasi Docker Compose & Jaringan (Bobot 20%)**

* **Sangat Baik (17-20):** File docker-compose.yml terstruktur rapi. Menggunakan variabel DNS internal (DATABASE\_HOST), mengamankan kredensial menggunakan *Environment Variables*, dan menggunakan depends\_on untuk memastikan urutan *startup* yang benar.  
* **Baik (13-16):** Sistem berjalan, tetapi terdapat inefisiensi arsitektur (misal: *mapping volume* database tidak persisten, atau mengekspos port database langsung ke publik tanpa alasan yang jelas).  
* **Cukup (8-12):** Format penulisan YAML tidak valid (indentasi salah) atau terjadi *Port Conflict* yang menyebabkan salah satu *container* gagal Up.  
* **Kurang (\<8):** Tidak menyerahkan file docker-compose.yml atau masih melakukan *deployment* manual.

### **3\. Fungsionalitas Aplikasi & Automasi DB (Bobot 20%)**

* **Sangat Baik (18-20):** \* Port 80 menampilkan Web Statis (Reverse Proxy berfungsi).  
  * Web Next.js dan fitur *Login* berfungsi normal (NEXTAUTH\_URL dikonfigurasi dengan IP AWS).  
  * Data ter-*import* otomatis dari file SQL lokal ke MariaDB (/docker-entrypoint-initdb.d/).  
* **Baik (15-17):** Kedua aplikasi web tampil, namun fitur *Login* gagal *redirect* atau mengalami *error 500* karena kesalahan injeksi .env pada saat *build/run*.  
* **Cukup (11-14):** Web statis tampil, namun Web Next.js mengalami *Crash Loop BackOff* (gagal menyala karena *error* pada tahap *Standalone Build*).  
* **Kurang (\<11):** Aplikasi tidak dapat diakses sama sekali via IP Publik AWS (Firewall/Security Group tidak dikonfigurasi).

### **4\. Dokumentasi Teknis (Bobot 15%)**

* **Sangat Baik (14-15):** Repositori GitHub memiliki README.md yang detail. Memuat topologi arsitektur, penjelasan *environment*, bukti *screenshot action* sukses, dan tautan langsung ke IP AWS.  
* **Baik (12-13):** Dokumentasi ada namun kurang komprehensif (misal: hanya menempelkan tautan tanpa menyertakan log *error/success* dari terminal AWS).  
* **Cukup (9-11):** Tidak ada README.md, hanya sekadar mengirimkan *link source code*.  
* **Kurang (\<9):** Terindikasi kuat melakukan *copy-paste* langsung dari *repository* rekan (Plagiarisme Infrastruktur).

### **5\. Uji Coba Langsung / Live Test CI/CD (Bobot 25%)**

* **Sangat Baik (20-25):** **\[ZERO-TOUCH DEPLOYMENT\]** Mahasiswa mengubah teks/fitur di komputer lokal, melakukan git push, dan sistem secara otomatis memperbarui *Image*, menarik ke EC2, dan me-*restart* kontainer tanpa *downtime* signifikan. Perubahan langsung terlihat di *browser*.  
* **Baik (20):** Proses *commit* dan *pipeline* berhasil, namun masih memerlukan intervensi manual di terminal (misal: harus *login* SSH ke EC2 untuk menekan tombol *refresh* atau mematikan kontainer lama yang tersangkut).  
* **Cukup (15):** Perubahan kode berhasil di-*push* ke GitHub, namun robot *pipeline* mengalami *error/crash* saat mencoba *deploy* versi terbaru ke server.  
* **Kurang (\<10):** Tidak mampu mendemonstrasikan pembaruan aplikasi melalui Git. Terindikasi mahasiswa memanipulasi *file* secara manual di dalam server AWS untuk mengelabui dosen.

## **C. KEPUTUSAN NILAI AKHIR (HURUF MUTU)**

	Sesuai Pedoman Akademik LPM UIN SSC