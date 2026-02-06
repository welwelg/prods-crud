<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{

    protected $guarded = [];
    protected $fillable = [
        'name',
        'description',
        'price',
    ];
}
