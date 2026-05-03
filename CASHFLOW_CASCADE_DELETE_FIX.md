# Cashflow Cascade Delete - Perbaikan & Best Practices

## Masalah yang Diperbaiki
**Sebelumnya:** Ketika sewa dihapus, data cashflow tetap ada di database (data orphan)
**Sesudah:** Cashflow otomatis dihapus menggunakan foreign key dengan CASCADE DELETE

## Solusi yang Diimplementasi

### 1. Database Migration
**File:** `2026_05_01_000000_add_rent_id_to_cashflows_table.php`
- Menambah kolom `rent_id` dengan foreign key constraint
- Constraint dengan `cascadeOnDelete()` = jika rent dihapus, cashflow ikut terhapus

```php
$table->foreignId('rent_id')
    ->nullable()
    ->after('id')
    ->constrained('rents')
    ->cascadeOnDelete();
```

**File:** `2026_05_01_000001_backfill_rent_id_in_cashflows.php`
- Mengisi existing cashflow records dengan rent_id
- Parse invoice code dari description field untuk match dengan rent

### 2. Model Updates

**Cashflow Model:**
```php
// Relasi ke Rent
public function rent()
{
    return $this->belongsTo(Rent::class);
}

// Tambahkan rent_id ke fillable array
protected $fillable = [
    'rent_id',  // ← BARU
    'date',
    'type',
    'amount',
    // ... fields lainnya
];
```

**Rent Model:**
```php
// Relasi inverse ke Cashflow
public function cashflows()
{
    return $this->hasMany(Cashflow::class, 'rent_id', 'id');
}
```

### 3. Controller Updates
**File:** `RentController.php`

Semua `Cashflow::create()` kini include `rent_id`:

```php
// Sebelumnya
Cashflow::create([
    'date'          => now(),
    'type'          => 'income',
    'amount'        => $validated['down_payment'],
    // ...
]);

// Sesudahnya
Cashflow::create([
    'rent_id'       => $rent->id,  // ← BARU
    'date'          => now(),
    'type'          => 'income',
    'amount'        => $validated['down_payment'],
    // ...
]);
```

**4 tempat di RentController yang diupdate:**
1. `store()` - Down payment saat create rent
2. `pelunasan()` - Sisa bayar saat pelunasan
3. `selesai()` - Denda keterlambatan saat selesai
4. `returnBaju()` - Denda keterlambatan saat return

## Best Practices yang Diterapkan

### 1. **Referential Integrity** ✓
- Foreign key relationship memastikan data consistency
- Database-level enforcement (tidak hanya aplikasi level)

### 2. **Cascade Delete Pattern** ✓
- Industry standard untuk child-parent relationships
- Menghindari orphan records di database
- Otomatis & transaksional (aman)

### 3. **Nullable Foreign Key** ✓
- `rent_id nullable()` untuk fleksibilitas
- Cashflow bisa ada tanpa rent (untuk other types)
- Backward compatible dengan existing data

### 4. **Migration Strategy** ✓
- Dual migration untuk:
  - Menambah struktur baru (migration 1)
  - Backfill existing data (migration 2)
- Ensures zero data loss

### 5. **Model Relationships** ✓
- Proper relationship definitions:
  - `Rent->cashflows()` : one-to-many
  - `Cashflow->rent()` : many-to-one
- Allows eager loading: `Rent::with('cashflows')->get()`

### 6. **Transaction Safety** ✓
- Existing `DB::transaction()` di controller
- Combined dengan cascade delete = super safe

## Testing Cascade Delete

```php
// Test di Tinker
$rent = Rent::find(1);
$cashflowCount = $rent->cashflows()->count(); // e.g., 3 entries

$rent->delete(); // Otomatis delete semua 3 cashflow entries

// Verify
Cashflow::whereRentId(1)->count(); // = 0
```

## Migrasi dari Data Lama

Backfill migration sudah berjalan:
- ✓ Existing down payment entries matched
- ✓ Existing pelunasan entries matched
- ✓ Existing denda entries matched

Jika ada cashflow orphan yang tidak ter-match, bisa di-query:
```php
Cashflow::whereNull('rent_id')->where('type', 'income')->get();
```

## Best Practice: Audit Trail (Optional)

Untuk production, pertimbangkan menambah **soft deletes** pada Rent:
```php
use SoftDeletes;
protected $dates = ['deleted_at'];
```

Benefit:
- Recover deleted rents
- Audit trail untuk compliance
- Cashflows tetap ikut cascade delete (soft delete compatible)

## Checklist

- [x] Migration untuk add foreign key
- [x] Migration untuk backfill existing data
- [x] Update Rent model dengan relationship
- [x] Update Cashflow model dengan relationship
- [x] Update RentController untuk store rent_id
- [x] Update Cashflow model fillable array
- [x] Database constraints applied
- [x] Tested cascade delete behavior

## Keamanan & Standar Industri

✓ **ACID Compliance** - Database transactions
✓ **Referential Integrity** - Foreign key constraints
✓ **Data Consistency** - Cascade delete ensures related data cleanup
✓ **Scalability** - Database-level operations (faster than app-level)
✓ **Recoverability** - (optional) Soft deletes for audit trail
✓ **Performance** - Indexed foreign keys
