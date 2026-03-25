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
        Schema::create('rent_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rent_id')->constrained('rents')->onDelete('cascade');
            $table->string('clothes_kode');
            $table->foreign('clothes_kode')
              ->references('kode')
              ->on('clothes')
              ->onUpdate('cascade') 
              ->onDelete('restrict');
            $table->integer('qty');
            $table->integer('price_per_item');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_items');
    }
};
