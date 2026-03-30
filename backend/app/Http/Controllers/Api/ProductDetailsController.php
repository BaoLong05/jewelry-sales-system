<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductDetailsController extends Controller
{
    public function show($id)
    {
        $product = Product::with('images')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }
}