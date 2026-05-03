<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            // Add rent_id foreign key dengan cascade delete
            // Ini memastikan jika rent dihapus, semua cashflow terkait juga terhapus
            $table->foreignId('rent_id')
                ->nullable()
                ->after('id')
                ->constrained('rents')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Rent::class);
        });
    }
};
