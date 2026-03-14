<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('cart_items')->insert([
            [
                'cart_id'=>1,
                'product_id'=>1,
                'quantity'=>2
            ],
            [
                'cart_id'=>1,
                'product_id'=>3,
                'quantity'=>1
            ]
        ]);
    }
}
