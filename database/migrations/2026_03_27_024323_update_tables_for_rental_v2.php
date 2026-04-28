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
        Schema::table('clothes', function (Blueprint $table) {
        $table->enum('condition', ['Bagus', 'Cukup', 'Perlu Perbaikan'])->default('Bagus');
    });


    Schema::table('rents', function (Blueprint $table) {
        $table->integer('down_payment')->default(0); 
        $table->string('customer_ktp')->after('customer_phone');
        $table->text('note')->nullable(); 
        $table->enum('status', ['booked', 'ongoing', 'completed', 'cancelled'])->default('booked')->change();
    });

   
    Schema::create('cashflows', function (Blueprint $table) {
        $table->id();
        $table->date('date');
        $table->enum('type', ['initial_capital', 'income', 'expense']); // Modal, Masuk, Keluar
        $table->integer('amount');
        $table->string('description');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::dropIfExists('cashflows');


    Schema::table('clothes', function (Blueprint $table) {
        $table->dropColumn('condition');
    });

    Schema::table('rents', function (Blueprint $table) {
        $table->dropColumn(['down_payment', 'customer_ktp', 'note']);

    });
    }
};
