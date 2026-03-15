<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'category_id' => 1,
                'name' => 'Diamond Ring',
                'description' => '18K gold diamond ring',
                'price' => 1200,
                'stock' => 10,
                'material' => 'Gold',
                'weight' => 5.2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 2,
                'name' => 'Gold Necklace',
                'description' => '24K gold necklace',
                'price' => 2500,
                'stock' => 5,
                'material' => 'Gold',
                'weight' => 15,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category_id' => 3,
                'name' => 'Silver Bracelet',
                'description' => 'Elegant bracelet',
                'price' => 300,
                'stock' => 20,
                'material' => 'Silver',
                'weight' => 7,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
