<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_items')->insert([
            [
                'order_id'=>1,
                'product_id'=>1,
                'quantity'=>2,
                'price'=>1200
            ],
            [
                'order_id'=>2,
                'product_id'=>3,
                'quantity'=>1,
                'price'=>300
            ]
        ]);
    }
}
