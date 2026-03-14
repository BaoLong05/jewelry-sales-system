<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payments')->insert([
            [
                'order_id'=>1,
                'payment_method'=>'Credit Card',
                'payment_status'=>'paid',
                'transaction_id'=>'TXN123456'
            ],
            [
                'order_id'=>2,
                'payment_method'=>'COD',
                'payment_status'=>'pending',
                'transaction_id'=>null
            ]
        ]);
    }
}
