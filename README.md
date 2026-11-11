# JOM BACA! – Papan Bacaan Interaktif

Satu fail sahaja: `index.html` (HTML + CSS + JavaScript, fon Andika tertanam; huruf t kecil dilukis sebagai palang silang lurus untuk tulisan bacaan).
Buka terus dalam Chrome, Safari atau Edge. Tiada akaun, tiada internet diperlukan.
Untuk kegunaan luar talian, simpan fail ini pada peranti (Save As) dan buka dari situ.

## Mula mengajar
Pilih modul -> pilih kumpulan (cth. KV – a) -> tekan **Mod Mengajar** (skrin penuh, hanya kad dipaparkan).

Kekunci: Space / ketik skrin = langkah seterusnya (b -> a -> ba); anak panah kiri/kanan = kad;
atas = langkah sebelumnya; G gabung; S sebut; R ulang; P gambar; C penunjuk; F skrin penuh; T mod mengajar; Esc keluar.

## Modul
1 Vokal · 2 Konsonan (+ b/d, p/q, m/n) · 3 KV (a, i, o, u, e pepet, e taling) · 4 KVKV (pola sama + campuran)
5 KVK (10 akhiran + jadual KVK 18 x 8 untuk a, i, o, u, e pepet, e taling) · 6 Diftong · 7 Digraf (ng, ny, sy, kh, gh) · Set Saya · Kegemaran

## Jadual KVK
Modul 5 ada kumpulan 'KVK – a (jadual)' hingga 'KVK – e taling (jadual)': 18 konsonan awal x 8 konsonan akhir (h k l m n r s t) = 144 suku kata bagi setiap vokal, seperti jadual dalam buku latihan.
Tekan Jadual (atau J) untuk memaparkan jadual penuh. Ketik sel untuk ke kad itu, ketik pengepala lajur untuk ke kad pertama dalam lajur. Pilih baca ikut baris (bih, bik, bil...) atau ikut lajur (bih, cih, dih...).

## Kunci admin
Tetapan -> Admin -> Tetapkan PIN admin. Selepas itu Tetapan, Edit Bahan, Rekod Bunyi dan Import / Eksport meminta PIN (ditanda ikon kunci).
Admin kekal terbuka 10 minit selepas PIN dimasukkan; tekan Kunci sekarang untuk mengunci serta-merta. Lima PIN salah menyekat percubaan selama 30 saat.
PIN disimpan sebagai cincang SHA-256 bergaram pada peranti. Eksport JSON menyertakan cincang itu, jadi peranti yang mengimportnya turut terkunci dengan PIN yang sama.
Untuk PIN tetap pada semua peranti, isi ADMIN_BAKED dalam fail (cincang sahaja, bukan PIN).
Nota: ini kunci pada pelayar. Ia menghalang perubahan tidak sengaja oleh murid atau rakan sekerja, tetapi bukan keselamatan pelayan.

## Mod
Penunjuk (bulatan, jari atau laser besar untuk menunjuk kepada murid semasa berkongsi skrin) · Belajar (langkah demi langkah) · Uji Bacaan (tanpa bantuan, Betul / Perlu Ulang) · Auto (3/5/8/10 saat) · Senarai kad · Edit Bahan.

## e pepet dan e taling
e taling ditanda `é` (penanda mengajar sahaja; ejaan biasa guna `e`). Boleh dimatikan dalam Tetapan.
Dalam Edit Bahan, taip `é` untuk e taling (cth. `mé-ja`).

## Rekod bunyi suara guru
Tetapan -> Rekod Bunyi (atau butang Rekod Bunyi di menu). Rekod vokal (e pepet dan e taling berasingan), konsonan, digraf dan diftong.
Setiap konsonan/digraf ada dua slot: bunyi huruf ("bə") dan bunyi gabung (b pendek, tanpa "ə"). Rakaman berhenti sendiri apabila guru diam;
senyap di awal dan hujung dipangkas supaya bunyi boleh digabung rapat (b + a = ba, perkataan = suku kata berturut-turut).
Klip disambung dengan pertindihan pendek dan pudar silang supaya konsonan mengalir ke vokal (b + a = ba).
Pilihan: rekod suku kata KV penuh (ba, bi, bu, bé...) di bahagian 'Suku kata penuh'; jika ada, ia digunakan menggantikan gabungan huruf, termasuk dalam perkataan yang bermula dengan suku kata itu.
Jika semua bunyi dalam satu sebutan ada rakaman, rakaman dimainkan; jika tidak, suara TTS peranti digunakan.
Rakaman disimpan dalam IndexedDB pada peranti dan boleh disertakan dalam eksport JSON. Mikrofon memerlukan https atau fail tempatan;
tidak berfungsi dalam pautan artifak Claude.

## Audio
Butang Sebut membunyikan huruf secara fonik Bahasa Melayu (b = "bə", ng = "ngə"). Boleh ditukar kepada nama huruf dalam Tetapan.
Hanya suara Melayu (ms-MY) pada peranti digunakan; bunyi bergantung pada suara yang dipasang.

## Data dan sandaran
Semua tetapan dan suntingan disimpan dalam localStorage pada peranti. Import / Eksport JSON untuk sandaran.
Format perkataan: `ba-ju|👕` (tanda `-` = sempadan suku kata, selepas `|` = gambar emoji).
Tampal senarai daripada Google Sheets (lajur perkataan, lajur emoji) melalui "Tampal banyak perkataan".

## Pengembangan
`DataSource` (dalam skrip) ialah satu-satunya lapisan storan; ganti `load()` / `save()` dengan panggilan
Google Apps Script untuk menyegerak ke Google Sheets. Struktur data modul (data.js dalam fail ini) sama dengan format eksport.
Untuk embed dalam Google Sites, letak fail pada hos dan guna `<iframe allow="fullscreen">`.
