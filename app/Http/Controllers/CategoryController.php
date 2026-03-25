<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    private function authorizeAdmin()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak.');
        }
    }

    /**
     * Show list of categories.
     */
    public function index(Request $request)
    {
     
        $categories = Category::withCount('clothes')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return inertia('Categories/Index', compact('categories'));
    }

    /**
     * Store a new category.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, Category $category)
    {
     
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Delete category.
     */
    public function destroy(Category $category)
{

        if ($category->clothes()->exists()) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh minimal satu baju.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
