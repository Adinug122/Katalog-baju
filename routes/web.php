<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RentController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');
Route::get('/about',function(){
    return Inertia::render('About');
})->name('about');
Route::get('/contact',function(){
    return Inertia::render('Contact');
})->name('contact');
Route::get('/catalog/{cloth:kode}', [CatalogController::class, 'show'])->name('catalog.show');
Route::get('/catalog',[CatalogController::class,'index'])->name('catalog');
Route::middleware(['auth','role:owner'])->group(function(){
    Route::get('/manage-admin', [UserController::class, 'index']);
        Route::post('/manage-admin/{user}/toggle', [UserController::class, 'toggleStatus'])->name('manage.admin');
});
Route::middleware(['auth', 'verified','role:admin,owner'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('rent/export/',[RentController::class,'export'])->name('laporan.export');
    Route::controller(\App\Http\Controllers\CategoryController::class)->group(function () {
        Route::get('categories', 'index')->name('categories.index');
        Route::post('categories', 'store')->name('categories.store');
        Route::put('categories/{category}', 'update')->name('categories.update');
        Route::delete('categories/{category}', 'destroy')->name('categories.destroy');
    });

    Route::controller(\App\Http\Controllers\ClothesController::class)->group(function () {
        Route::get('clothes', 'index')->name('clothes.index');
        Route::get('clothes/create', 'create')->name('clothes.create');
        Route::post('clothes', 'store')->name('clothes.store');
        Route::get('clothes/{clothes}/edit', 'edit')->name('clothes.edit');
        Route::put('clothes/{clothes}', 'update')->name('clothes.update');
        Route::delete('clothes/{clothes}', 'destroy')->name('clothes.destroy');
    });

    Route::controller(\App\Http\Controllers\ClothesImageController::class)->group(function () {
        Route::post('clothes-images', 'store')->name('clothes-images.store');
        Route::delete('clothes-images/{clothesImage}', 'destroy')->name('clothes-images.destroy');
    });

    Route::controller(\App\Http\Controllers\RentController::class)->group(function () {
        Route::get('rents', 'index')->name('rents.index');
        Route::get('rents/create', 'create')->name('rents.create');
        Route::get('rents/{rent}/edit', 'edit')->name('rents.edit');
        Route::post('rents', 'store')->name('rents.store');
        Route::patch('rents/{rent}/return','returnBaju')->name('rents.return');
        Route::put('rents/{rent}', 'update')->name('rents.update');
        Route::delete('rents/{rent}', 'destroy')->name('rents.destroy');
        Route::get('rents/export', 'export')->name('laporan.export');
    });
});

require __DIR__.'/auth.php';
