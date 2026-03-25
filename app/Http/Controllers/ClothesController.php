<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\ClothesImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $validated['kode'] = 'BJ'.Str::upper(Str::random(5));

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

        return redirect()->route('clothes.index')->with('success', 'Pakaian berhasil ditambahkan.');
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
