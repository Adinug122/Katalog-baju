<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Ganti isi fungsi up() kamu jadi begini:
public function up()
{
    DB::statement("
        UPDATE cashflows 
        SET rent_id = rents.id
        FROM rents
        WHERE cashflows.rent_id IS NULL
        AND (
            cashflows.description LIKE '%' || rents.invoice_code
            OR cashflows.description LIKE '%INV: ' || rents.invoice_code
        )
    ");
}

    public function down(): void
    {
        // Set rent_id back to NULL
        DB::statement('UPDATE cashflows SET rent_id = NULL');
    }
};
