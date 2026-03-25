<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Clothes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request){
        $clothes = Clothes::query()
                  ->select('kode', 'category_id', 'name', 'size', 'price', 'description')
                   ->with(['category:id,name', 'images'])
                    ->where('is_active',true)
                   ->when($request->search, function ($query, $search) {
                    $query->where(function($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('kode', 'like', '%' . $search . '%');
                    });
                })
                    ->when($request->category,function($query,$categoryId){
                        return $query->where('category_id',$categoryId);
                    })
                    ->latest()
                    ->paginate(12)
                    ->withQueryString();
                    
      return Inertia::render('Catalog', [
        'clothes'    => $clothes,
        'categories' => Category::all(['id', 'name']),
        'filters'    => $request->only(['search', 'category'])
    ]);
    }

    public function show(Clothes $cloth){
        $cloth->load(['category','images']);

        return Inertia::render('CatalogDetail',[
            'cloth' => $cloth
        ]);
    }
}
