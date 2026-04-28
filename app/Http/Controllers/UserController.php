<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
class UserController extends Controller
{

    public function index(){
        $admins = User::where('role','admin')->get();
    
        return Inertia::render('Admin/Index',['admins' =>$admins]);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
           'password' => 'required|string|min:8|confirmed',
           'phone' => 'required|string|unique:users,phone'
        ]);
        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password), // Wajib di-hash!
            'role'     => 'admin',
            'phone'    => $request->phone,
        ]);
      
    return redirect()->back()->with('message', 'Admin berhasil dibuat! Silahkan cek email untuk verifikasi.');
    }

    public function toggleStatus(User $user){
        if ($user->id === Auth::id()) {
        return back()->with('error', 'Tidak bisa menonaktifkan diri sendiri.');
    }

    $user->update(['is_active' => !$user->is_active]);


    return back()->with('success', 'Status berhasil diperbarui.');
    }
}
