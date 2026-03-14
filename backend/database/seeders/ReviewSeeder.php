<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('reviews')->insert([
            [
                'user_id'=>1,
                'product_id'=>1,
                'rating'=>5,
                'comment'=>'Very beautiful ring!'
            ],
            [
                'user_id'=>2,
                'product_id'=>3,
                'rating'=>4,
                'comment'=>'Nice bracelet'
            ]
        ]);
    }
}
