<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clothes extends Model
{
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode',
        'category_id',
        'name',
        'size',
        'price',
        'is_active',
        'description',
        'stock',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function rents()
    {
        return $this->hasMany(Rent::class);
    }

    public function images()
    {
        return $this->hasMany(ClothesImage::class, 'clothes_kode', 'kode');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
