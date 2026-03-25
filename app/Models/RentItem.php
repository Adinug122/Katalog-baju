<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RentItem extends Model
{
   protected $fillable = ['rent_id', 'clothes_kode', 'qty', 'price_per_item'];

    
    public function rent()
    {
        return $this->belongsTo(Rent::class, 'rent_id', 'id');
    }


    public function cloth()
    {
        return $this->belongsTo(Clothes::class, 'clothes_kode', 'kode');
    }
}
