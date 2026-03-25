<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClothesImage extends Model
{
    protected $fillable = ['path','clothes_kode'];

    public function clothes(){
        return $this->belongsTo(Clothes::class,'clothes_kode','kode');
    }
}
