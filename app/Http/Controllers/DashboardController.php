<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\Rent;
use App\Models\RentItem; // Panggil model detail
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $now = Carbon::now();

        $totalClothes = Clothes::count();
        $activeClothes = Clothes::where('is_active', 1)->count();
        

        $thisYearRentsCount = Rent::whereYear('rent_date', $now->year)->count();


        $currentYearRevenue = 0;
        $monthlySales = collect([]);

        if ($user->role === 'owner') {
            $currentYearRevenue = Rent::whereYear('rent_date', $now->year)
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');

            $monthlySales = Rent::selectRaw('YEAR(rent_date) as year, MONTH(rent_date) as month, SUM(total_price) as revenue')
                ->where('status', '!=', 'cancelled')
                ->groupBy('year', 'month')
                ->get()
                ->map(fn($row) => [
                    'label' => Carbon::create($row->year, $row->month, 1)->format('M Y'),
                    'revenue' => (float) $row->revenue
                ]);
        }

      
        $topRented = RentItem::with('cloth')
            ->select('clothes_kode', DB::raw('SUM(qty) as total_qty'))
            ->groupBy('clothes_kode')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'kode' => $item->clothes_kode,
                'name' => $item->cloth->name ?? 'N/A',
                'rented_count' => (int) $item->total_qty
            ]);

        return inertia('Dashboard', [
            'auth_role' => $user->role,
            'metrics' => [
                'total_clothes' => $totalClothes,
                'active_clothes' => $activeClothes,
                'this_year_rents' => $thisYearRentsCount,
                'current_year_revenue' => $user->role === 'owner' ? $currentYearRevenue : null,
            ],
            'monthly_sales' => $monthlySales,
            'top_rented' => $topRented,
        ]);
    }
}