# VIP Video Website Setup & Deploy Guide

Website Landing Page VIP Video responsif, animasi modern, lengkap dengan CMS Dashboard berbasis Firebase.

## Setup Firebase (Free Database & Auth)
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat project baru.
3. Masuk ke menu **Authentication** -> Aktifkan **Email/Password**.
4. Buat 1 akun Admin di tab **Users**.
5. Masuk ke **Firestore Database** -> Buat Database (Mode Production / Test).
6. Masuk ke **Project Settings** -> Ambil `firebaseConfig` dan paste ke file `app.js` & `admin.js`.

## Cara Deploy ke GitHub Pages
1. Buat repository baru di GitHub (misal: `vip-video-website`).
2. Upload seluruh file (`index.html`, `admin.html`, `style.css`, `app.js`, `admin.js`, dll) ke repository.
3. Buka menu **Settings** di repository GitHub Anda.
4. Pilih menu **Pages** di sidebar kiri.
5. Pada bagian **Build and deployment / Branch**, pilih `main` atau `master` branch, lalu klik **Save**.
6. Website Anda aktif secara instan dalam beberapa menit di alamat: `https://username.github.io/vip-video-website/`.