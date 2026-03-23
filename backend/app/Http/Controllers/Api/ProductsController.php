<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{

    public function index_product(Request $request)
    {

        // validate search
        $request->validate([
            'search' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer'
        ]);

       

        $query = Product::with('images');

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('material', 'like', '%' . $searchTerm . '%');
            });
            
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->latest()->paginate(20);

        

        return response()->json([
            'success' => true,
            'data' => $products
        ], 200);
    }


    // Chi tiết sản phẩm
    public function show_product($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ], 200);
    }

    //them
    public function them_sp(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'material' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        try {
            $product = Product::create($request->only([
                'name', 'description', 'price', 'stock', 'material', 'weight', 'category_id'
            ]));

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $product->images()->create([
                        'image_url' => $path
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Thêm sản phẩm thành công',
                'data' => $product->load('images', 'category')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm sản phẩm: ' . $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật sản phẩm
    public function sua_sp(Request $request, $id){
        

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại'
            ], 404);
        }

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'material' => 'nullable|string',
                'weight' => 'nullable|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $product->update($request->only([
                'name', 'description', 'price', 'stock', 'material', 'weight', 'category_id'
            ]));

            // Handle image uploads if provided
            if ($request->hasFile('images')) {
                // Delete old images
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image->image_url);
                    $image->delete();
                }

                // Upload new images
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $product->images()->create([
                        'image_url' => $path
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $product->load('images', 'category')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật sản phẩm: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa sản phẩm
    public function xoa_sp($id){
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại'
            ], 404);
        }

        try {
            // Delete images
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_url);
            }

            $product->images()->delete();
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa sản phẩm: ' . $e->getMessage()
            ], 500);
        }
    }
}