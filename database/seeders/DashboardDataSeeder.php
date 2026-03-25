<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Clothes;
use App\Models\Rent;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DashboardDataSeeder extends Seeder
{
    public function run(): void
    {
        // Buat kategori dummy
        $categoryNames = ['Casual', 'Formal', 'Pesta', 'Olahraga', 'Muslim'];

        $categories = collect($categoryNames)->map(function ($name) {
            return Category::firstOrCreate(['name' => $name]);
        });

        // Buat koleksi pakaian dummy
        $clothesItems = [
            ['name' => 'Kemeja Putih', 'size' => 'M', 'price' => 70000, 'description' => 'Kemeja rapi untuk acara formal', 'stock' => 10, 'is_active' => 1],
            ['name' => 'Dress Malam', 'size' => 'L', 'price' => 250000, 'description' => 'Dress elegan untuk pesta', 'stock' => 5, 'is_active' => 1],
            ['name' => 'Kaos Polos', 'size' => 'S', 'price' => 40000, 'description' => 'Kaos nyaman untuk sehari-hari', 'stock' => 20, 'is_active' => 1],
            ['name' => 'Jaket Jeans', 'size' => 'XL', 'price' => 120000, 'description' => 'Jaket casual untuk gaya maskulin', 'stock' => 8, 'is_active' => 1],
            ['name' => 'Set Olahraga', 'size' => 'M', 'price' => 90000, 'description' => 'Set lari olahraga modern', 'stock' => 12, 'is_active' => 1],
            ['name' => 'Gamis', 'size' => 'L', 'price' => 150000, 'description' => 'Gamis syar9i nyaman', 'stock' => 7, 'is_active' => 1],
            ['name' => 'Blazer', 'size' => 'M', 'price' => 170000, 'description' => 'Blazer cocok untuk meeting', 'stock' => 4, 'is_active' => 0],
            ['name' => 'Polo Shirt', 'size' => 'L', 'price' => 80000, 'description' => 'Polo semi-formal', 'stock' => 6, 'is_active' => 0],
        ];

        $i = 1;
        $clothesModels = collect($clothesItems)->map(function ($item) use ($categories, &$i) {
            $category = $categories->random();
            $kode = sprintf('BJ%03d', $i++);

            return Clothes::updateOrCreate(
                ['kode' => $kode],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'size' => $item['size'],
                    'price' => $item['price'],
                    'description' => $item['description'],
                    'is_active' => $item['is_active'],
                    'stock' => $item['stock'],
                ]
            );
        });

        // Buat data sewa (rents) untuk 9 bulan terakhir, dengan variasi status dan barang terjual
        $startMonth = Carbon::now()->subMonths(8);
        for ($m = 0; $m < 9; $m++) {
            $month = $startMonth->copy()->addMonths($m);
            $rentCount = rand(4, 8); // beberapa transaksi per bulan

            for ($t = 1; $t <= $rentCount; $t++) {
                $clothes = $clothesModels->where('is_active', 1)->shuffle()->first();
                if (!$clothes) {
                    continue;
                }

                $rentDate = $month->copy()->day(rand(1, $month->daysInMonth));
                $days = rand(1, 5);
                $returnDate = $rentDate->copy()->addDays($days);

                $status = (rand(1, 10) <= 8) ? 'completed' : (rand(1, 2) === 1 ? 'ongoing' : 'cancelled');
                $denda = 0;

                $rent = Rent::create([
                    'clothes_kode' => $clothes->kode,
                    'customer_name' => 'User ' . ucfirst(fake()->firstName()),
                    'customer_phone' => '08' . rand(1000000000, 9999999999),
                    'rent_date' => $rentDate->format('Y-m-d'),
                    'return_date' => $returnDate->format('Y-m-d'),
                    'actual_return_date' => $status === 'completed' ? $returnDate->format('Y-m-d') : null,
                    'rent_price' => $clothes->price,
                    'total_price' => $clothes->price * ($days + 1) + $denda,
                    'denda' => $denda,
                    'status' => $status,
                ]);

                // Kurangi stok untuk barang yang terpakai dan status not cancelled
                if (in_array($status, ['booked', 'ongoing', 'completed']) && $clothes->stock > 0) {
                    $clothes->decrement('stock');
                }
            }
        }
    }
}
