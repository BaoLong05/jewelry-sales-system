<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            [
                'user_id'=>1,
                'total_price'=>2400,
                'status'=>'completed',
                'shipping_address'=>'Ho Chi Minh City'
            ],
            [
                'user_id'=>2,
                'total_price'=>300,
                'status'=>'pending',
                'shipping_address'=>'Hanoi'
            ]
        ]);
    }
}
