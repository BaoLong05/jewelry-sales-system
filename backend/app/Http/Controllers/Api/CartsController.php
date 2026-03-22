<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartsController extends Controller
{
    // Get user's cart with items
    public function get_cart(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $cart = Cart::with(['items.product', 'items.product.images'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => null,
                    'user_id' => $user->id,
                    'items' => []
                ]
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $cart
        ], 200);
    }

    // Add product to cart
    public function add_to_cart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Check product exists and has enough stock
        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if ($product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough stock available'
            ], 400);
        }

        // Get or create cart for user
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id]
        );

        // Check if product already in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Update quantity if product already exists
            $newQuantity = $cartItem->quantity + $request->quantity;
            
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available'
                ], 400);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            // Create new cart item
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        // Get updated cart
        $cart = Cart::with(['items.product', 'items.product.images'])->find($cart->id);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart',
            'data' => $cart
        ], 200);
    }

    // Update cart item quantity
    public function update_cart_item(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Get cart item
        $cartItem = CartItem::find($id);
        
        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        // Verify item belongs to user's cart
        $cart = Cart::where('user_id', $user->id)
            ->where('id', $cartItem->cart_id)
            ->first();

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check stock
        $product = Product::find($cartItem->product_id);
        if ($product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough stock available'
            ], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        // Get updated cart
        $cart = Cart::with(['items.product', 'items.product.images'])->find($cart->id);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated',
            'data' => $cart
        ], 200);
    }

    // Remove product from cart
    public function remove_from_cart(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $cartItem = CartItem::find($id);
        
        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        // Verify item belongs to user's cart
        $cart = Cart::where('user_id', $user->id)
            ->where('id', $cartItem->cart_id)
            ->first();

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $cartItem->delete();

        // Get updated cart
        $cart = Cart::with(['items.product', 'items.product.images'])->find($cart->id);

        return response()->json([
            'success' => true,
            'message' => 'Product removed from cart',
            'data' => $cart
        ], 200);
    }

    // Clear all items from cart
    public function clear_cart(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json([
                'success' => true,
                'message' => 'Cart is empty',
                'data' => ['items' => []]
            ], 200);
        }

        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
            'data' => ['items' => []]
        ], 200);
    }
}
