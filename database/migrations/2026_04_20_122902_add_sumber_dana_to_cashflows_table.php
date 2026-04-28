<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
          
            $table->enum('sumber_dana', ['operasional', 'modal'])->default('operasional')->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('cashflows', function (Blueprint $table) {
            $table->dropColumn('sumber_dana');
        });
    }
};