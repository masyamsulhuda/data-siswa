# Deploy ke Vercel tanpa expose URL Apps Script

## Struktur proyek
```
index.html          <- halaman utama (tidak berubah tampilannya)
api/students.js      <- serverless function, proxy ke Apps Script
vercel.json
```

Sekarang `index.html` memanggil `/api/students` (relatif, di domain sendiri),
bukan URL `script.google.com` langsung. URL Apps Script yang asli disimpan
sebagai Environment Variable di server Vercel, jadi tidak pernah dikirim ke
browser dan tidak terlihat lewat "View Source" atau tab Network.

## Langkah deploy

1. Push folder ini ke repo GitHub (atau upload langsung lewat Vercel CLI).
2. Di https://vercel.com -> New Project -> import repo ini.
3. Sebelum/atau sesudah deploy pertama, buka:
   Project -> Settings -> Environment Variables, lalu tambahkan:
   - Name: `GAS_URL`
   - Value: `https://script.google.com/macros/s/AKfycbz.../exec` (URL Apps Script Anda)
   - Environment: Production, Preview, Development (centang semua)
4. Klik Deploy (atau Redeploy jika env var ditambahkan setelah deploy pertama).
5. Buka URL Vercel Anda — aplikasi akan memanggil `/api/students`, dan
   function di server yang meneruskan ke Apps Script.

## Alternatif via CLI
```bash
npm i -g vercel
cd proyek-presensi
vercel
vercel env add GAS_URL
vercel --prod
```

## Catatan penting
- Deployment Apps Script tetap harus "Anyone" (Siapa Saja) agar bisa diakses
  server Vercel, tapi karena URL-nya cuma diketahui server (bukan browser
  pengguna), jauh lebih sulit ditemukan/disalahgunakan orang lain.
- Jika ingin proteksi lebih (misal cegah orang lain memanggil `/api/students`
  langsung), bisa ditambahkan pengecekan token/API key sederhana di
  `api/students.js` — beri tahu saya kalau mau ditambahkan.
