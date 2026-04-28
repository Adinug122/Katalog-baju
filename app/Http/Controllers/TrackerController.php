<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clothes;
use App\Models\RentItem;
use Carbon\Carbon;

class TrackerController extends Controller
{
    public function index(Request $request)
    {
        $checkDate = $request->input('date', now()->toDateString());

       
        $clothes = Clothes::active()->paginate(10)->through(function($cloth) use ($checkDate) {
            
            $activeRents = RentItem::where('clothes_kode', $cloth->kode)
                ->whereHas('rent', function($query) use ($checkDate) {
                    $query->whereIn('status', ['booked', 'ongoing'])
                          ->whereDate('rent_date', '<=', $checkDate)
                          ->where(function($q) use ($checkDate) {
                              $q->whereDate('return_date', '>=', $checkDate)
                                ->orWhereDate('return_date', '<', now()->toDateString());
                          });
                })->with('rent')->get();

            $rentedQty = $activeRents->sum('qty');
            $availableStock = $cloth->stock - $rentedQty;

            $isLate = $activeRents->contains(function($item) {
                return Carbon::parse($item->rent->return_date)->isPast();
            });

            $estAvailable = null;
            if ($availableStock <= 0 && $rentedQty > 0) {
                if ($isLate) {
                    $estAvailable = ' Menunggu Pengembalian (Telat)';
                } else {
                    $maxReturnDate = $activeRents->max(fn($item) => $item->rent->return_date);
                    $estAvailable = Carbon::parse($maxReturnDate)->addDay()->format('d M Y');
                }
            }

            return [
                'kode' => $cloth->kode,
                'name' => $cloth->name,
                'total_stock' => $cloth->stock,
                'available_stock' => $availableStock > 0 ? $availableStock : 0,
                'status' => $availableStock > 0 ? 'Tersedia' : 'Sedang Disewa',
                'est_available' => $estAvailable ?: 'Tersedia Hari Ini',
                'is_empty' => $availableStock <= 0,
                'is_late' => $isLate 
            ];
        });

 
        $clothes->appends(['date' => $checkDate]);

        return inertia('Tracker/Index', [
            'trackerData' => $clothes,
            'selectedDate' => $checkDate
        ]);
    }
}