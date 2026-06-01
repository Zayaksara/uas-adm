# ============================================================
#  Image proxy: nginx + Web Statis CV (di-bundle)
#  Build context = root repo (lihat docker-compose.yml)
# ============================================================
FROM nginx:1.27-alpine

# Konfigurasi reverse proxy + static server
COPY proxy/nginx.conf /etc/nginx/conf.d/default.conf

# Web statis CV (file tunggal index.html sesuai instruksi)
COPY static-cv/ /usr/share/nginx/html/

EXPOSE 80 8080
