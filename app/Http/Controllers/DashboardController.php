<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\Rent;
use App\Models\RentItem;
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

        $activeOrders = Rent::where('status', '!=', 'cancelled')
            ->where('status', '!=', 'pending')
            ->whereRaw('down_payment >= total_price')
            ->count();

       
        $lateOrders = Rent::where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->where('return_date', '<', now()->toDateString())
            ->count();

        $totalLateFine = 0;
        if ($lateOrders > 0) {
            $lateRents = Rent::with('details.cloth.category')
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->where('return_date', '<', now()->toDateString())
                ->get();

            foreach ($lateRents as $rent) {
                $daysLate = Carbon::parse($rent->return_date)
                 ->startOfDay()
                ->diffInDays(now()->startOfDay());    

                foreach ($rent->details as $item) {
                    $finePerDay    = $item->cloth?->category?->fine_per_day ?? 35000;
                    $totalLateFine +=   $daysLate * $finePerDay * $item->qty;
                }
            }
        }

     
        $bookingDP = Rent::where('status', '=', 'booked')
            ->where('down_payment', '>', 0)
            ->whereColumn('down_payment', '<' ,'total_price')
            ->count();

       
        $monthlyRevenue = 0;
        $yearlyRevenue = 0;
        $monthlySales = collect([]);
        $monthlyVolume = collect([]);

        if ($user->role === 'owner') {
            $yearlyRevenue = Rent::whereYear('rent_date', $now->year)
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');

            $monthlyRevenue = Rent::whereYear('rent_date', $now->year)
                ->whereMonth('rent_date', $now->month)
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');

         $monthlySales = Rent::selectRaw("EXTRACT(YEAR FROM rent_date) as year, EXTRACT(MONTH FROM rent_date) as month, SUM(total_price) as revenue")
    ->where('status', '!=', 'cancelled')
    ->groupBy('year', 'month')
    ->orderBy('year')->orderBy('month')
    ->get()
    ->map(fn($row) => [
        'label' => \Carbon\Carbon::create((int)$row->year, (int)$row->month, 1)->format('M Y'),
        'revenue' => (float) $row->revenue
    ]);

           // Ganti baris 81 jadi ini:
$monthlyVolume = Rent::selectRaw("EXTRACT(YEAR FROM rent_date) as year, EXTRACT(MONTH FROM rent_date) as month, COUNT(id) as volume")
    ->where('status', '!=', 'cancelled')
    ->groupBy('year', 'month')
    ->orderBy('year')->orderBy('month')
    ->get()
    ->map(fn($row) => [
        'label' => \Carbon\Carbon::create((int)$row->year, (int)$row->month, 1)->format('M Y'),
        'volume' => (int) $row->volume
    ]);
        }

     
        $topRented = [];
        if ($user->role === 'admin') {
            $topRented = RentItem::with('cloth.category')
                ->select('clothes_kode', DB::raw('COUNT(DISTINCT rent_id) as rent_count, SUM(qty) as total_qty'))
                ->groupBy('clothes_kode')
                ->orderByDesc('rent_count')
                ->limit(5)
                ->get()
                ->map(fn($item) => [
                    'kode' => $item->clothes_kode,
                    'name' => $item->cloth->name ?? 'N/A',
                    'category' => $item->cloth->category->name ?? 'N/A',
                    'rent_frequency' => (int) $item->rent_count,
                    'total_qty' => (int) $item->total_qty
                ]);
        }

        // 7. KALENDER BOOKING LAMA (Format Basic)
        $bookings = Rent::select('rent_date', 'return_date', 'status')
            ->where('status', '!=', 'cancelled')
            ->get()
            ->map(fn($rent) => [
                'start' => $rent->rent_date,
                'end' => $rent->return_date,
                'status' => $rent->status
            ]);

   
        $clothes = Clothes::active()
            // 1. FILTER: Hanya ambil baju yang punya rentItems dengan status booked/ongoing
            ->whereHas('rentItems', function($query) {
                $query->whereHas('rent', function($q) {
                    $q->whereIn('status', ['booked', 'ongoing']); 
                });
            })
       
            ->with(['rentItems' => function($query) {
                $query->whereHas('rent', function($q) {
                    $q->whereIn('status', ['booked', 'ongoing']); 
                })->with('rent');
            }])
            ->get();

        return inertia('Dashboard', [
            'auth_role' => $user->role,
            'metrics' => [
                'total_clothes' => $totalClothes,
                'active_orders' => $activeOrders,
                'late_orders' => $lateOrders,
                'total_late_fine' => $totalLateFine,
                'booking_dp' => $bookingDP,
                'monthly_revenue' => $user->role === 'owner' ? $monthlyRevenue : null,
                'yearly_revenue' => $user->role === 'owner' ? $yearlyRevenue : null,
            ],
            'monthly_sales' => $monthlySales,
            'monthly_volume' => $monthlyVolume,
            'top_rented' => $topRented,
            'bookings' => $bookings,
            'clothes' => $clothes, 
        ]);
    }
}