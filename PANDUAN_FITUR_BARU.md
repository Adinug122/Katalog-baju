# 📚 PANDUAN FITUR BARU - KATALOG BAJU2

Halo! Berikut adalah penjelasan **Bahasa Indonesia** untuk semua fitur yang sudah diimplementasikan:

---

## 1️⃣ KODE PRODUK OTOMATIS (Auto Product Code)

### 📍 Lokasi: Menu Produk → Tambah Produk

**Apa yang berubah:**
- Sebelumnya: Kode produk random `BJ-XXXXX`
- Sekarang: **Kode otomatis berdasarkan kategori** seperti:
  - ✅ `KBY-0001` untuk Kebaya
  - ✅ `JAS-0001` untuk Jas
  - ✅ `DRE-0001` untuk Dress
  - ✅ Dan seterusnya...

**Keuntungan:**
- Kode lebih rapi dan teratur
- Mudah dikenali kategori yang mana
- Otomatis ter-increment (0001, 0002, dst)

---

## 2️⃣ VALIDASI ORDER SEWA YANG KETAT

### 📍 Lokasi: Menu Order → Buat Order Baru

**Fitur yang ditambahkan:**

#### ✅ Minimum 3 Hari Sewa
```
Jika customer hanya pilih 2 hari → DITOLAK
Pesan: "Minimum sewa adalah 3 hari"
```

#### ✅ Pengecekan Ketersediaan Tanggal (DATE CONFLICT CHECK)
```
Contoh:
- Tanggal 15-20 April: Dress A sudah disewa 2 unit
- Customer mau pesan Dress A tanggal 18-23 April
- Sistem: "Dress A hanya tersedia 1 unit pada periode 18-23 Apr"
```

**Cara Kerjanya:**
1. Customer input tanggal sewa
2. Sistem otomatis cek apakah item tersedia pada tanggal itu
3. Jika ada conflict → ❌ DITOLAK
4. Jika aman → ✅ DISETUJUI

#### ✅ KTP Pelanggan Wajib
- Setiap order harus punya nomor KTP/ID unik
- Tidak boleh ada 2 order dengan KTP yang sama kecuali lain-lain

---

## 3️⃣ DP/DEPOSIT TRACKING (UANG MUKA)

### 📍 Lokasi: Menu Order → Buat/Edit Order

**Field baru:**
```
- Uang Muka (DP): Input berapa rupiah
- Sisa Pembayaran: Auto-hitung (Total - DP)
- Status DP: Pending, Partial, atau Lunas
```

**Contoh:**
```
Total Sewa: Rp 500.000
DP diberikan: Rp 200.000
Sisa Bayar: Rp 300.000
```

**Tracking di Laporan Piutang:**
- Admin bisa lihat siapa saja yang masih punya hutang
- Berapa sisa yang harus dibayar
- Status pembayaran setiap order

---

## 4️⃣ AUTO DENDA KETERLAMBATAN

### 📍 Lokasi: Menu Order → Kembalikan Baju

**Cara Kerjanya:**

1. **Ketika baju dikembalikan terlambat:**
   - Sistem otomatis hitung hari keterlambatan
   - Ambil kategori produk
   - Hitung denda dari `fine_per_day` kategori

2. **Contoh Perhitungan:**
   ```
   Return Date yang ditentukan: 20 April 2026
   Tanggal kembali aktual: 25 April 2026
   Terlambat: 5 hari
   Kategori: Kebaya Wisuda (fine_per_day: 50.000)
   
   Denda: 5 hari × Rp 50.000 = Rp 250.000
   ```

3. **Fine Per Kategori:**
   - Bisa dikustomisasi di kategori masing-masing
   - Default: Rp 35.000 - Rp 50.000 per hari

4. **Total Bayar:**
   - Total Sewa + Denda = Tagihan Akhir
   - Sistem auto-update total price

---

## 5️⃣ MODUL CASHFLOW (CASHIER OPERATIONS)

### 📍 Lokasi: Menu Cashflow (Menu Baru)

**Apa itu Cashflow?**
- Pencatatan semua uang masuk dan keluar toko per hari
- Tracking saldo toko setiap saat
- Laporan lengkap untuk owner

### 📊 Fitur Cashflow:

#### 1. **Modal/Saldo Awal**
```
Kasir pagi: "Pemilik kasih saya Rp 5.000.000 hari ini"
→ Input di "Cashflow → Tambah → Type: Modal"
→ Amount: 5.000.000
```

#### 2. **Pemasukan**
- Dari sewa (otomatis dari order yang completed)
- Dari DP (jika ada pembayaran DP)
- Dari penjualan lain

#### 3. **Pengeluaran**
- Biaya operasional
- Gaji karyawan
- Biaya perbaikan
- Dll

#### 4. **Auto-Balance**
```
Saldo Awal   : Rp 5.000.000
+ Pemasukan  : Rp 2.000.000
- Pengeluaran: Rp 500.000
= Saldo Ahir : Rp 6.500.000
```

#### 5. **Export Report**
- Semua transaksi bisa di-export ke Excel
- Format rapi dengan saldo akhir setiap transaksi

---

## 6️⃣ LAPORAN ADMIN (REPORTS)

### 📍 Lokasi: Menu Laporan (Menu Baru)

**Ada 5 Jenis Laporan:**

#### 1. **📊 Dashboard Laporan** (Ringkasan)
Menampilkan:
- Total Pendapatan
- Total Piutang (DP belum lunas)
- Total Denda
- Total Order
- Order Selesai
- Order Terlambat

**Filter:** 7 Hari, 30 Hari, 90 Hari, Semua

#### 2. **⏰ Laporan Terlambat**
Daftar order yang:
- Tanggal kembali sudah lewat
- Tapi belum dikembalikan

Tampilkan:
- Nama pelanggan
- Pakaian yang disewa
- Hari keterlambatan
- Estimasi denda

#### 3. **💰 Laporan Piutang**
Daftar order yang:
- Masih ada sisa pembayaran
- DP belum lunas

Tampilkan:
- Nama pelanggan
- Total Sewa
- DP yang sudah dibayar
- Sisa Pembayaran
- % Pembayaran

#### 4. **📈 Laporan Pendapatan**
Breakdown pendapatan:
- **Per Bulan**: Chart revenue bulanan
- **Per Kategori**: Mana kategori yang paling profit

#### 5. **💾 Export Excel**
Semua laporan bisa diexport:
- Untuk arsip
- Untuk dikirim ke owner
- Untuk presentasi

---

## 7️⃣ DASHBOARD YANG LEBIH LENGKAP

### 📍 Lokasi: Beranda Admin (Dashboard utama)

**Metric Baru:**

```
┌─────────────────────────────────────────────┐
│ Total Produk: 45          Aktif: 40        │
├─────────────────────────────────────────────┤
│ Order Aktif (Lunas): 12   Booking/DP: 5   │
│ Terlambat: 2             Total Pendapatan  │
│ Bulan Ini: Rp 5.000.000  Tahun Ini: ...   │
├─────────────────────────────────────────────┤
│ Total Denda: Rp 750.000  Piutang: ...     │
│                                             │
│ 📈 Top 5 Produk Sewa:                      │
│    1. Dress Glamour - 45x disewa          │
│    2. Kebaya Wisuda - 38x disewa          │
│    3. Jas - 32x disewa                    │
│    ...                                     │
└─────────────────────────────────────────────┘
```

---

## 8️⃣ EDIT ORDER (FITUR BARU)

### 📍 Lokasi: Menu Order → Klik Order → Edit

**Bisa diedit (jika status "Booked"):**
- ✅ Nama pelanggan
- ✅ No. Telepon
- ✅ KTP
- ✅ Tanggal sewa
- ✅ Tanggal kembali
- ✅ Uang Muka (DP)
- ✅ Catatan

**Tidak bisa diedit:**
- ❌ Item yang disewa (harus buat order baru)
- ❌ Order yang sudah completed/dikembalikan

---

## 🎯 WORKFLOW CONTOH

### Skenario: Order Sewa Dress Glamour

#### **Hari 1 (15 April 2026) - Admin buat order:**

```
Customer: Budi Santoso
KTP: 1234567890
HP: 08123456789

Pilih Produk:
- Dress Glamour Code: DRE-0001 (Harga: Rp 150.000/hari)
  QTY: 1
  
Tanggal Sewa: 15 April 2026
(Sistem auto set min return: 18 April 2026)
Tanggal Kembali: 20 April 2026

Perhitungan:
- Hari sewa: 5 hari
- Harga: 150.000 × 1 × 5 = Rp 750.000

DP (optional): Rp 200.000
Sisa Bayar: Rp 550.000

Status: ✅ Order dibuat
Invoice: INV-20260415-xxx
```

#### **Hari 4 (20 April 2026) - Kembalikan terlambat:**

```
Customer kembali pada: 25 April 2026
(5 hari lebih lambat)

Admin klik "Kembalikan Baju":
Sistem otomatis hitung:
- Terlambat: 5 hari
- Fine Kategori Dress: Rp 40.000/hari
- Denda otomatis: 5 × 40.000 = Rp 200.000

Total Pembayaran:
- Sewa: Rp 750.000
- Denda: Rp 200.000
- Total Akhir: Rp 950.000
- Sudah dibayar: Rp 200.000
- Sisa: Rp 750.000

Status: ✅ Dikembalikan dengan denda
```

#### **Laporan:**

📊 **Di Dashboard:**
- Late Orders: +1
- Total Denda Hari Ini: +Rp 200.000
- Piutang: +Rp 750.000

📊 **Di Laporan Terlambat:**
- Nama: Budi Santoso
- Produk: Dress Glamour
- Terlambat: 5 hari
- Denda: Rp 200.000

---

## ⚠️ PENTING!

### Sebelum Pakai:

1. ✅ **Setup Kategori dulu**
   - Go to: Menu Kategori
   - Set `Fine Per Day` untuk masing-masing kategori
   - Default: 35.000 - 50.000 per hari

2. ✅ **Update Produk**
   - Tambah field `Condition` (Bagus/Cukup/Perlu Perbaikan)
   - Kode akan auto-generate berdasarkan kategori

3. ✅ **Training untuk Kasir**
   - Cara input Cashflow
   - Cara baca laporan

---

## 📞 BANTUAN

**Jika ada error:**
1. Check laravel logs: `storage/logs/laravel.log`
2. Test endpoint dengan Postman/Insomnia
3. Verify database migration sudah running

**Fitur yang masih development:**
- [ ] PDF Invoice
- [ ] WhatsApp Integration
- [ ] Email Notification
- [ ] Booking Calendar UI

---

**Dokumentasi dibuat:** April 1, 2026  
**Version:** 1.0 - Phase 1 Completion
