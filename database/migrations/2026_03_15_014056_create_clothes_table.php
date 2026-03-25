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
        Schema::create('clothes', function (Blueprint $table) {
            $table->string('kode')->primary();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->string('name',30);
            $table->enum('size',['S','M','L','XL']);
            $table->enum('status',['free','booked']);
            $table->integer('price');
            $table->text('description');
            $table->boolean('is_active')->default(0);
            $table->integer('stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clothes');
    }
};
