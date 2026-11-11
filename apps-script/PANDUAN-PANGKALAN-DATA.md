# Panduan: Pangkalan data JOM BACA! (Google Sheets + Apps Script)

Selepas ini, **PIN admin, tetapan kongsi dan bahan yang disunting** disimpan di pusat.
Semua peranti guru membaca data yang sama. Hanya admin (PIN disahkan oleh pelayan) boleh mengubahnya.

Masa: kira-kira 10 minit. Dilakukan **sekali sahaja**. Anda perlukan akaun Google.

## Langkah 1. Buat Google Sheet
1. Buka https://sheets.new (Google Sheet kosong terbuka).
2. Klik tajuk "Untitled spreadsheet" dan namakan **JOM BACA Data**.

## Langkah 2. Tampal kod pelayan
1. Dalam Sheet itu, klik menu **Extensions** (Sambungan) lalu **Apps Script**. Tab baharu terbuka.
2. Dalam editor, padam semua kod sedia ada (biasanya `function myFunction() {}`).
3. Buka fail **Code.gs** yang saya hantar, salin **semua** isinya, dan tampal dalam editor.
4. Tekan **Ctrl+S** untuk simpan. Jika diminta nama projek, taip `JOM BACA`.

## Langkah 3. Beri kebenaran (sekali)
1. Di bar atas editor, pilih fungsi **setup** daripada senarai lungsur, kemudian tekan **Run** (Jalankan).
2. Tekan **Review permissions**, pilih akaun Google anda.
3. Google akan memberi amaran "Google hasn't verified this app". Ini normal kerana skrip ini milik anda sendiri.
   Tekan **Advanced** (Lanjutan), kemudian **Go to JOM BACA (unsafe)**, kemudian **Allow** (Benarkan).
4. Selepas siap, kembali ke Google Sheet. Anda akan nampak tab baharu bernama **data**.

## Langkah 4. Terbitkan sebagai Web app
1. Di penjuru kanan atas editor, tekan **Deploy** (Terapkan), kemudian **New deployment**.
2. Tekan ikon roda gigi di sebelah "Select type" dan pilih **Web app**.
3. Isi:
   - **Description**: `v1`
   - **Execute as**: **Me** (akaun anda)
   - **Who has access**: **Anyone** (Sesiapa sahaja). Ini perlu supaya guru yang tidak log masuk Google boleh membaca tetapan.
4. Tekan **Deploy**. Jika diminta kebenaran lagi, ikut langkah 3 sekali lagi.
5. Salin **Web app URL**. Alamat itu panjang dan berakhir dengan `/exec`.

## Langkah 5. Beri alamat itu kepada saya
Hantar Web app URL itu dalam sembang. Alamat ini bukan kata laluan, tetapi ia akan kelihatan dalam kod laman. Saya akan memasukkannya ke dalam aplikasi, menguji dan memberi fail baharu untuk dimuat naik ke Netlify.

## Langkah 6. Tetapkan PIN admin (selepas laman dikemas kini)
1. Buka laman JOM BACA! anda, tekan **Tetapan**, kemudian **Tetapkan PIN admin**.
2. **Peranti pertama yang menetapkan PIN menjadi admin.** Lakukan ini dengan segera selepas laman dikemas kini.
3. Selepas itu, semua peranti lain meminta PIN itu untuk membuka Tetapan, Edit Bahan dan Import / Eksport.

## Perkara yang perlu diketahui
- **Apa yang dikongsi:** PIN, tetapan paparan (saiz, huruf besar/kecil, warna, penanda é, penunjuk, bunyi fonik) dan bahan yang disunting. Rakaman suara, kegemaran dan pilihan suara tetap pada setiap peranti.
- **PIN selamat:** disimpan sebagai cincang SHA-256 bergaram dalam Script Properties (bukan dalam helaian). PIN yang salah 5 kali menyekat percubaan selama 60 saat.
- **Helaian `data`:** anda boleh melihat bahan yang disunting di sini. Jangan ubah tangan. Jangan kongsi Google Sheet ini kepada orang lain.
- **Kemas kini kod pelayan:** jika saya memberi Code.gs baharu, tampal menggantikan yang lama, kemudian **Deploy → Manage deployments → ikon pensel → Version: New version → Deploy**. Alamat tidak berubah.
- **Had Google:** akaun percuma ada had harian bagi Apps Script, tetapi mencukupi untuk puluhan guru. Aplikasi menyimpan salinan terakhir pada setiap peranti, jadi ia tetap berfungsi jika sambungan terputus.
- **Mengubah jika berlaku konflik:** jika dua admin menyimpan serentak, yang kemudian memuatkan data terkini dan tidak menimpa.
