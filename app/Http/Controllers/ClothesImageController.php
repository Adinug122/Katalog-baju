<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\ClothesImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ClothesImageController extends Controller
{

    /**
     * Upload single clothes image and save path.
     */
    public function store(Request $request)
    {
    

        $validated = $request->validate([
            'clothes_kode' => 'required|exists:clothes,kode',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $clothes = Clothes::where('kode', $validated['clothes_kode'])->firstOrFail();

        $path = $request->file('image')->store('clothes_images', 'public');

        $clothesImage = ClothesImage::create([
            'clothes_kode' => $clothes->kode,
            'path' => $path,
        ]);

        return redirect()->back()->with('success', 'Gambar pakaian berhasil diunggah.');
    }

    public function destroy(ClothesImage $clothesImage)
    {
      
        if (Storage::disk('public')->exists($clothesImage->path)) {
            Storage::disk('public')->delete($clothesImage->path);
        }
        $clothesImage->delete();

        return redirect()->back()->with('success', 'Gambar pakaian berhasil dihapus.');
    }
}
