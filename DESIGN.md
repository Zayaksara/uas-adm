# Portofolio — Neo-Brutalism × Interactive (Alex-Beige vibe) ⋆｡ ﾟ☁︎｡ ⋆｡ ﾟ☾ ﾟ｡ ⋆

## Mission
Create implementation-ready, token-driven UI guidance for a personal **portfolio** that feels **deeply interactive and playful — like https://www.alexbeigeweb.dev/** — but rendered entirely in a **Neo-Brutalism** visual language (bold black borders, hard offset shadows, flat vivid colors, sharp corners, heavy type). The *feel* (motion, quirk, composition) comes from Alex Beige; the *surface styling* is neo-brutalist.

## Brand
- Product/brand: Portofolio interaktif (landing page dinamis + admin panel)
- Reference vibe: https://www.alexbeigeweb.dev/ (interactive web developer, animation-heavy, solo, self-aware humor)
- Audience: rekruter, dosen, sesama developer + pemilik (admin)
- Product surface: landing satu halaman (Home, Pendidikan, Skills, Prestasi, Tentang) + dashboard admin CRUD
- Personality: bold, playful, jenaka, high-contrast, "raw but alive".

## North-Star Principle
**Komposisi & gerak meniru Alex Beige; setiap kotak/garis/bayangan mematuhi Neo-Brutalism.**
Artinya: layout boleh asimetris, lega, dan dekoratif — tetapi tidak ada soft shadow, gradient halus, atau border tipis. Dekorasi playful (bentuk geometris) tetap memakai outline `2px ink` + hard shadow.

## Style Foundations
### Color tokens (semantic) — sumber: `app/globals.css`
Selalu pakai nama token, bukan hex mentah.
- `color.ink=#050505` — border, teks utama, shadow (warna kunci)
- `color.surface.base=#ffffff` — kartu
- `color.surface.cream=#fef6e4` — background bergantian (whitespace lega ala Alex Beige)
- `color.accent.yellow=#ffdb33` — aksi primer, highlight, marquee
- `color.accent.pink=#ff6b97` — destruktif, badge
- `color.accent.blue=#74c0fc` — info, dekorasi "planet"
- `color.accent.green=#69db7c` — sukses, simpan
- `color.accent.purple=#b197fc` — heading section, "arch"
- `color.accent.orange=#ffa94d` — sekunder/varian
- Kontras `color.ink` di atas semua warna aksi memenuhi WCAG AA.

### Typography
- Stack: `font.family.primary=Geist, ui-sans-serif, system-ui, sans-serif` (`--font-sans`).
- Heading **harus** extrabold (`800`); body `400–600`.
- Scale: `xs=12px`, `sm=14px`, `md=16px`, `lg=18px`, `xl=20px`, `2xl=24px`, `3xl=30px`, `4xl=clamp(36px,6vw,72px)` (hero besar, ala Alex Beige).
- Heading section pakai pola "label berbingkai": teks di kotak warna aksi + `nb-shadow`.

### Spacing & rhythm
- `space.1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `12=48`, `20=80`, `32=128` (px).
- **Section padding vertikal harus longgar** (`space.20`–`space.32`) untuk meniru whitespace lega Alex Beige.

### Radius / shadow / motion
- `radius`: **0** pada elemen brutalist (kotak/tombol/input/chip). Avatar boleh kotak penuh.
- `border`: **selalu** `2px solid color.ink`.
- `shadow.nb=4px 4px 0 0 #050505`; `shadow.nb-lg=8px 8px 0 0 #050505`.
- `motion.duration.instant=100ms`, `fast=200ms`, `medium=400ms`, `scroll-reveal=600ms`.
- `motion.easing.standard=cubic-bezier(0.2,0,0,1)` (smooth, ala animasi Alex Beige).
- Motion brutalist pada kontrol: hover **mengangkat** (`translate(-2px,-2px)` + shadow membesar), active **menekan** (`translate(2px,2px)` + shadow hilang).

## Interactivity & Motion (meniru Alex Beige) — *the headline feature*
Komponen interaktif **harus** mendokumentasikan keyboard, pointer, dan touch. Semua animasi **harus** menghormati `prefers-reduced-motion` (matikan/redam jika user meminta).

1. **Marquee banner** — pita teks berjalan horizontal tanpa henti (mis. "Web Dev • Next.js • UI • Cloud •…"), latar `bg-nb-yellow`, garis atas/bawah `2px ink`. Sebaiknya melambat/berhenti saat hover. Wajib duplikasi konten untuk loop mulus; sembunyikan dari screen reader (`aria-hidden`) bila murni dekoratif.
2. **Scroll-reveal** — section & kartu masuk dengan translate-up + fade saat memasuki viewport (IntersectionObserver), `duration=scroll-reveal`, easing standard, stagger antar item. Konten **harus** tetap terbaca tanpa JS (no-JS = tampil penuh).
3. **Parallax dekorasi** — bentuk geometris bergerak pelan beda kecepatan saat scroll. Murni dekoratif, `aria-hidden`, `pointer-events` aman.
4. **Draggable accents ("drag me!")** — 1–2 elemen dekoratif kecil bisa digeser (pointer + touch). Sebaiknya punya state grab/grabbing dan kembali halus; tidak boleh menutupi konten/aksi penting.
5. **Hover-reveal cards** — kartu prestasi/skill menampilkan overlay/ikon (mis. mata) + info tambahan saat hover; di touch **harus** ada padanan (tap untuk expand).
6. **Tilt/lift mikro** — kartu sedikit terangkat (shadow `nb`→`nb-lg`) saat hover. Bukan scale/opacity halus.
7. **Cursor/pointer accent (opsional)** — highlight kecil mengikuti kursor di hero; **harus** dimatikan di touch & saat reduced-motion.
8. **Micro-interactions form** — sukses → modal/toast brutalist (`bg-nb-green`); error → pesan `bg-nb-pink`. Tombol punya state loading ("Memproses…").

## Visual Composition (ala Alex Beige, gaya neo-brutalist)
- **Grid asimetris & modular**: lebar section bervariasi, item tidak selalu rata; ciptakan ritme. Tetap responsif (kolom tunggal di mobile).
- **Whitespace lega**: jangan padatkan; beri ruang antar blok.
- **Dekorasi geometris playful**: lingkaran/"planet", arch, kotak, bintang, blob — semua dengan outline `2px ink` + warna flat aksi + hard shadow. Boleh ditempel "menggantung" di tepi section.
- **Quirky tone**: copy boleh sedikit jenaka tapi jelas. **Dilarang emoji** sebagai ikon/dekorasi — gunakan ikon vektor (Lucide). Ikon dipakai **seperlunya** (aksen, bukan di setiap elemen).

## Accessibility
- Target WCAG 2.2 AA.
- Keyboard-first; semua kontrol **harus** Tab + Enter/Space.
- Focus-visible **harus** jelas (ring `2px ink` + offset / warna aksi). Border tebal bawaan **tidak** menggantikan focus ring.
- Kontras teks/aksi **harus** ≥ 4.5:1.
- Animasi **harus** menghormati `prefers-reduced-motion`; tidak ada info yang hanya disampaikan via gerak/shadow.
- Elemen draggable **harus** punya alternatif keyboard atau bersifat non-esensial (dekoratif).
- Marquee/parallax dekoratif **harus** `aria-hidden`.

## Writing Tone
Ringkas, percaya diri, playful, sedikit jenaka (mengikuti gaya Alex Beige). Bahasa Indonesia untuk UI publik & admin. Label aksi eksplisit ("Simpan Profil", "Tambah Skill", "Hapus") — bukan "OK"/"Submit".

## Rules: Do
- Gunakan token semantik (`color.accent.*`, `shadow.nb`), bukan hex mentah.
- Setiap komponen **harus** punya state: default, hover, focus-visible, active, disabled, loading, error.
- Setiap permukaan/dekorasi **harus** memakai `2px solid ink` + hard shadow.
- Setiap animasi **harus** punya fallback `prefers-reduced-motion` dan tetap fungsional tanpa JS.
- Komposisi **sebaiknya** asimetris & lega (meniru Alex Beige).
- Komponen interaktif **harus** mendokumentasikan keyboard, pointer, touch.

## Rules: Don't
- Jangan pakai soft/blur shadow, gradient halus, atau border <2px.
- Jangan bulatkan sudut besar pada elemen brutalist.
- Jangan biarkan animasi memblok konten, mengganggu fokus keyboard, atau jalan saat reduced-motion.
- Jangan pakai teks low-contrast / focus tersembunyi.
- Jangan spacing/tipografi one-off di luar token.
- Jangan label ambigu / aksi non-deskriptif.
- Jangan kirim guidance komponen tanpa aturan state.

## Component Rule Expectations
Utility di `globals.css`: `.nb-border`, `.nb-card`, `.nb-card-lg`, `.nb-shadow`, `.nb-shadow-lg`, `.nb-btn`, `.nb-chip`.

### Button (`.nb-btn`)
Border `2px ink` + `shadow.nb`; varian warna `bg-nb-*`. States: default; hover (lift); active (press); focus-visible (ring tebal); disabled (`opacity-60`, no lift); loading ("Memproses…"). Target sentuh **harus** ≥ 44×44px.

### Card (`.nb-card`/`.nb-card-lg`) + hover-reveal
`bg-white` + border + hard shadow; hover mengangkat & boleh memunculkan overlay info (padanan tap di touch). Long content **harus** `break-words`; empty-state kartu `bg-nb-cream` dengan pesan bold.

### Input / Field / File upload
Border `2px ink`, radius 0, fokus `bg-nb-yellow/40`. States default/focus/error(`bg-nb-pink`)/disabled. File upload: tombol file `bg-nb-yellow` + hint ("Maks 2 MB · jpg/png").

### Chip / Badge (`.nb-chip`)
Tag tahun/kategori/status; border `2px ink` + shadow `2px 2px`.

### Marquee
Loop mulus (konten diduplikasi), `aria-hidden`, melambat saat hover, mematuhi reduced-motion.

### Decorative shape (SVG/box)
Outline `2px ink` + warna aksi + hard shadow; `aria-hidden`; tidak boleh menutupi aksi.

### Modal (success/feedback)
Overlay `bg-black/40`; panel `.nb-card-lg`; ikon sukses kotak `bg-nb-green`. **Harus** bisa ditutup via tombol, klik overlay, auto-dismiss; fokus kembali ke pemicu.

Density halaman yang diketahui: buttons (~76), links (~39), inputs (~13) — jaga konsistensi varian.

## QA Checklist
- [ ] Semua permukaan & dekorasi: border `2px ink` + hard shadow (tanpa soft shadow/gradient).
- [ ] Hover mengangkat, active menekan; animasi smooth (easing standard).
- [ ] Marquee, scroll-reveal, parallax, draggable berfungsi — dan **mati/redam** saat `prefers-reduced-motion`.
- [ ] Konten tetap tampil & terbaca tanpa JS.
- [ ] Focus-visible jelas di semua kontrol (keyboard-only pass).
- [ ] Kontras teks/aksi ≥ 4.5:1; dekorasi `aria-hidden`.
- [ ] Tiap komponen punya state lengkap (default→error).
- [ ] Empty-state, overflow, long-content tertangani; hover punya padanan touch.
- [ ] Tidak ada hex mentah; hanya token semantik. Target sentuh ≥ 44×44px.
- [ ] Komposisi asimetris & lega; tone playful tapi label aksi eksplisit.
