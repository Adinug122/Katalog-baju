<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill rent_id untuk cashflow entries yang sudah ada
        // dengan cara parsing invoice code dari description
        DB::statement('
            UPDATE cashflows 
            INNER JOIN rents ON (
                cashflows.description LIKE CONCAT(\'%INV: \', rents.invoice_code)
                OR cashflows.description LIKE CONCAT(\'%\', rents.invoice_code)
            )
            SET cashflows.rent_id = rents.id
            WHERE cashflows.rent_id IS NULL
        ');
    }

    public function down(): void
    {
        // Set rent_id back to NULL
        DB::statement('UPDATE cashflows SET rent_id = NULL');
    }
};
