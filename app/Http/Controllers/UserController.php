<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class UserController extends Controller
{

    public function index(){
        $admins = User::where('role','admin')->get();
    
        return Inertia::render('Admin/Index',['admins' =>$admins]);
    }

    public function toggleStatus(User $user){
        if ($user->id === Auth::id()) {
        return back()->with('error', 'Tidak bisa menonaktifkan diri sendiri.');
    }

    $user->update(['is_active' => !$user->is_active]);


    return back()->with('success', 'Status berhasil diperbarui.');
    }
}
