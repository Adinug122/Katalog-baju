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
        Schema::create('rents', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_code')->unique();
        $table->string('customer_name', 30);
        $table->string('customer_phone', 15);
        $table->date('rent_date');
        $table->date('return_date');
        $table->date('actual_return_date');
        $table->integer('total_price')->default(0); 
        $table->integer('denda')->default(0);
        $table->enum('status', [
            'pending',   
            'booked',   
            'ongoing',   
            'completed', 
            'cancelled'  
        ])->default('pending');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rents');
    }
};
