<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Đăng ký tài khoản
    public function register(Request $request)
    {

        // Xóa khoảng trắng đầu cuối email
        $request->merge([
            'email' => trim($request->email)
        ]);

        // Validate dữ liệu
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:100',

                'email' => [
                    'required',
                    'email:rfc,dns',
                    'max:255',
                    'unique:users,email',
                    'regex:/^[^\s]+@[^\s]+\.[^\s]+$/'
                ],

                'password' => 'required|string|min:6'
            ],
            [
                'name.required' => 'Tên không được để trống',
                'name.string' => 'Tên phải là chuỗi',
                'name.max' => 'Tên tối đa 100 ký tự',

                'email.required' => 'Email không được để trống',
                'email.email' => 'Email không đúng định dạng',
                'email.unique' => 'Email đã tồn tại',
                'email.regex' => 'Email không được chứa khoảng trắng',

                'password.required' => 'Mật khẩu không được để trống',
                'password.min' => 'Mật khẩu phải ít nhất 6 ký tự'
            ]
        );

        // Nếu validate thất bại
        if ($validator->fails()) {

            return response()->json([
                'success' => false,
                'message' => 'Kiểm tra dữ liệu thất bại!',
                'errors' => $validator->errors()
            ], 422);

        }

        // Tạo user
        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password)
        ]);

        // Trả response
        return response()->json([
            'success' => true,
            'message' => 'Đăng ký tài khoản thành công!',
            'data' => $user
        ], 201);

    }

    //login
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if(!Auth::attempt($request->only('email', 'password'))){
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        $request->session()->regenerate();
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'data' => Auth::user()
        ]);
    }


    //logout
    public function logout(Request $request){
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Đăng xuất thành công!'
        ]);
    }

    public function user(Request $request){
        return $request->user();
    }
}