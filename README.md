# EKSPLORA Mini Website — V3

Versi demo interaktif dengan logo pada login, akun demo berdasarkan peran, fitur ganti akun, profil dan fitur ganti nama untuk setiap akun demo, kuota, pendaftaran, jadwal, presensi, pengumuman, laporan, dokumentasi kegiatan, catatan sertifikat/prestasi, dan ekspor CSV/cetak PDF.

## Isi
- `index.html`
- `style.css`
- `script.js`
- `assets/eksplora-logo.png`

## Login demo
Daftar akun demo dapat dilihat dari tombol **Lihat daftar akun demo** di halaman login. Pilih akun untuk mengisi username dan kata sandi demo secara otomatis.

## Cara deploy ke GitHub Pages
1. Ekstrak ZIP.
2. Unggah/replace `index.html`, `style.css`, `script.js`, dan folder `assets` ke root repository.
3. Commit perubahan dan tunggu GitHub Pages selesai memperbarui situs.

## Penting
Ini masih prototype front-end. Data ditaruh di `localStorage` browser, sehingga tidak tersinkron antarpengguna/perangkat dan dapat dihapus oleh browser. Akun serta kata sandi demo berada di JavaScript sehingga **jangan gunakan untuk data atau kata sandi sungguhan**. Untuk sistem nyata, perlu backend, database, autentikasi aman, dan validasi izin di server. Fitur ganti kata sandi memang tidak disertakan sesuai permintaan.
