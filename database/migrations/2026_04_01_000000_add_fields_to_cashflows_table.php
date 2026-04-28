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
        Schema::table('cashflows', function (Blueprint $table) {
            if (!Schema::hasColumn('cashflows', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('description')->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('cashflows', 'notes')) {
                $table->text('notes')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('cashflows', 'balance_after')) {
                $table->integer('balance_after')->default(0)->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            $table->dropForeignIdFor('users', 'user_id');
            $table->dropColumn(['user_id', 'notes', 'balance_after']);
        });
    }
};
