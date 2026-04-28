<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Cashflow extends Model
{
    protected $table = 'cashflows';

    protected $fillable = [
        'date',
        'type',
        'amount',
        'sumber_dana',
        'description',
        'user_id',
        'notes',
        'balance_after',
        'sumber_dana_balance_after'
    ];

    protected $dates = [
        'date',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope: Filter by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get total balance dari awal hingga tanggal tertentu
     */
    public static function getBalanceByDate($date)
    {
        return self::where('date', '<=', $date)
            ->sum(DB::raw('CASE 
                WHEN type = "initial_capital" THEN amount 
                WHEN type = "income" THEN amount 
                WHEN type = "expense" THEN -amount 
                ELSE 0 END'));
    }
}
