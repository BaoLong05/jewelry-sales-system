<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('product_images')->insert([
            [
                'product_id'=>1,
                'image_url'=>'products/ruby.jpg'
            ],
            [
                'product_id'=>2,
                'image_url'=>'products/vang.jpg'
            ],
            [
                'product_id'=>3,
                'image_url'=>'products/kimcuong.jpg'
            ]
        ]);
    }
}
