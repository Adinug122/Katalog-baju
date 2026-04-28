<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rents', function (Blueprint $table) {
            // Tambah rent_price jika belum ada
            if (!Schema::hasColumn('rents', 'rent_price')) {
                $table->integer('rent_price')->default(0)->after('total_price');
            }

            // Ensure actual_return_date adalah nullable
            if (Schema::hasColumn('rents', 'actual_return_date')) {
                $table->date('actual_return_date')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rents', function (Blueprint $table) {
            if (Schema::hasColumn('rents', 'rent_price')) {
                $table->dropColumn('rent_price');
            }
        });
    }
};
