<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\CartsController;
use App\Http\Controllers\Api\CategoriesController;
use App\Http\Controllers\Api\ProductDetailsController;



//auth
Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){

    Route::get('/user',[AuthController::class,'user']);
    Route::post('/logout',[AuthController::class,'logout']);

});



//product 
Route::get('/products', [ProductsController::class, 'index_product']);
Route::get('/products/{id}', [ProductsController::class, 'show_product']);

// Admin product management - requires authentication
Route::middleware('auth:sanctum')->group(function(){
    Route::post('/products', [ProductsController::class, 'them_sp']);
    Route::post('/products/{id}/update', [ProductsController::class, 'sua_sp']);
    Route::delete('/products/{id}', [ProductsController::class, 'xoa_sp']);
});

// Categories
Route::get('/categories', [CategoriesController::class, 'index']);
Route::get('/categories/{id}', [CategoriesController::class, 'show']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/categories', [CategoriesController::class, 'store']);
    Route::put('/categories/{id}', [CategoriesController::class, 'update']);
    Route::delete('/categories/{id}', [CategoriesController::class, 'destroy']);
});

//cart - requires authentication
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/cart', [CartsController::class, 'get_cart']);
    Route::post('/cart/add', [CartsController::class, 'add_to_cart']);
    Route::put('/cart/items/{id}', [CartsController::class, 'update_cart_item']);
    Route::delete('/cart/items/{id}', [CartsController::class, 'remove_from_cart']);
    Route::post('/cart/clear', [CartsController::class, 'clear_cart']);
});
?>