<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
       protected $fillable = [
        'customer_name',
        'customer_phone',
        'rent_date',
        'return_date',
        'actual_return_date',
        'rent_price',
        'total_price',
        'denda',
        'status',
        'invoice_code',
    ];

    protected static function booted()
    {
        static::created(function ($rent) {
            if (empty($rent->invoice_code)) {
                $rent->invoice_code = sprintf('INV-%s-%05d', $rent->rent_date ? date('Ymd', strtotime($rent->rent_date)) : date('Ymd'), $rent->id);
                $rent->saveQuietly();
            }
        });
    }

    public function clothes()
    {
        return $this->belongsTo(Clothes::class,'clothes_kode','kode');
    }

    public function getInvoiceCodeAttribute($value)
    {
        if (!empty($value)) {
            return $value;
        }

        return sprintf('INV-%s-%05d', $this->rent_date ? date('Ymd', strtotime($this->rent_date)) : date('Ymd'), $this->id);
    }

    public function details()
    {
        return $this->hasMany(RentItem::class, 'rent_id', 'id');
    }

}
