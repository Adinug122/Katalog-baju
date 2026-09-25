<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\ClothesImage;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ClothesController extends Controller
{
 

    public function index()
    {
    

        $clothes = Clothes::with('category', 'images')->latest()->paginate(10);
        $categories = \App\Models\Category::orderBy('name')->get();
        return inertia('Clothes/Index', compact('clothes', 'categories'));
    }

    public function edit(Clothes $clothes)
    {
      

        $clothes->load('images');
        $categories = \App\Models\Category::orderBy('name')->get();
        return inertia('Clothes/Edit', compact('clothes','categories'));
    }

    public function create()
    {

        $categories = \App\Models\Category::orderBy('name')->get();
        return inertia('Clothes/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:30',
            'size' => 'required|in:S,M,L,XL',
            'price' => 'required|integer|min:0',
            'description' => 'required|string',
            'is_active' => 'sometimes|boolean',
            'stock' => 'required|integer|min:0',
            'condition' => 'required|in:Bagus,Cukup,Perlu Perbaikan',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        // Generate kode berdasarkan kategori
        $category = Category::find($validated['category_id']);
        
        // Ambil 3-4 huruf pertama dari kategori sebagai prefix
        $prefix = strtoupper(substr(str_replace(' ', '', $category->name), 0, 3));
        
        // Hitung berapa banyak kode dengan prefix ini sudah ada
        $lastClothes = Clothes::where('kode', 'LIKE', $prefix . '-%')
            ->orderBy('kode', 'desc')
            ->first();
        
        $nextNumber = 1;
        if ($lastClothes) {
            $lastNumber = (int) substr($lastClothes->kode, -4);
            $nextNumber = $lastNumber + 1;
        }
        
        $validated['kode'] = $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        $clothes = Clothes::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $path = $imageFile->store('clothes_images', 'public');
                ClothesImage::create([
                    'clothes_kode' => $clothes->kode,
                    'path' => $path,
                ]);
            }
        }

        return redirect()->route('clothes.index')->with('success', 'Pakaian berhasil ditambahkan dengan kode: ' . $clothes->kode);
    }

    public function update(Request $request, Clothes $clothes)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:30',
            'size' => 'required|in:S,M,L,XL',
            'price' => 'required|integer|min:0',
            'description' => 'required|string',
             'is_active' => 'sometimes|boolean',
            'stock' => 'required|integer|min:0',
        ]);

        $clothes->update($validated);

        return redirect()->route('clothes.index')->with('success', 'Pakaian berhasil diperbarui.');
    }

    public function destroy(Clothes $clothes)
    {
     
        foreach ($clothes->images as $image) {
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
            $image->delete();
        }

        $clothes->delete();
        return redirect()->back()->with('success', 'Pakaian berhasil dihapus.');
    }
}
