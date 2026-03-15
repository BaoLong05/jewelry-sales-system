<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock',
        'material',
        'weight'
    ];
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
