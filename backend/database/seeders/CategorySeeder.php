<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Rings', 'description' => 'Luxury rings'],
            ['name' => 'Necklaces', 'description' => 'Gold necklaces'],
            ['name' => 'Bracelets', 'description' => 'Fashion bracelets'],
            ['name' => 'Earrings', 'description' => 'Diamond earrings'],
            ['name' => 'Watches', 'description' => 'Luxury watches']
        ]);
    }
}
