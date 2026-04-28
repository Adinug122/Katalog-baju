<?php

namespace App\Http\Controllers;

use App\Models\Rent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Dashboard Laporan - Ringkasan semua laporan
     */
    public function dashboard(Request $request)
    {
        $timeRange = $request->get('range', '30'); // 7, 30, 90, all

        if ($timeRange === 'all') {
            $startDate = Rent::oldest('rent_date')->first()?->rent_date ?? now()->startOfYear();
        } else {
            $startDate = now()->subDays((int)$timeRange);
        }
        $endDate = now();

        // 1. PENDAPATAN
        $revenue = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->sum('total_price');

        // 2. PIUTANG (DP belum lunas)
        $debt = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->select(DB::raw('SUM(GREATEST(total_price - down_payment, 0)) as total_debt'))
            ->first()
            ->total_debt ?? 0;

        // 3. TOTAL DENDA
        $totalFines = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', 'completed')
            ->where('denda', '>', 0)
            ->sum('denda');

        // 4. TOTAL ORDER
        $totalOrders = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->count();

        // 5. ORDER SELESAI
        $completedOrders = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', 'completed')
            ->count();

        // 6. TERLAMBAT
        $lateOrders = Rent::whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', '!=', 'completed')
            ->where('return_date', '<', now()->toDateString())
            ->count();

        return inertia('Reports/Dashboard', [
            'summary' => [
                'revenue' => $revenue,
                'debt' => $debt,
                'total_fines' => $totalFines,
                'total_orders' => $totalOrders,
                'completed_orders' => $completedOrders,
                'late_orders' => $lateOrders,
            ],
            'time_range' => $timeRange,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Laporan Terlambat - Detail orders yang belum dikembalikan melewati return_date
     */
    public function lateOrders(Request $request)
    {
        $lateOrders = Rent::with('details.cloth')
            ->where('status', '!=', 'completed')
            ->where('return_date', '<', now()->toDateString())
            ->orderBy('return_date')
            ->paginate(20);

        // Add late days info
        $lateOrders->getCollection()->transform(function ($rent) {
            $lateDays = Carbon::parse($rent->return_date)->diffInDays(now());
            $estimatedFine = $rent->details->sum(function ($item) {
                return $item->cloth->category->fine_per_day ?? 35000;
            }) * $lateDays;

            return [
                ...$rent->toArray(),
                'late_days' => $lateDays,
                'estimated_fine' => $estimatedFine,
            ];
        });

        return inertia('Reports/LateOrders', [
            'orders' => $lateOrders
        ]);
    }

    /**
     * Laporan Piutang - DP yang belum lunas
     */
    public function debt(Request $request)
    {
        $debtOrders = Rent::with('details.cloth')
            ->where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->where(DB::raw('down_payment < total_price'))
            ->orderBy('rent_date', 'desc')
            ->paginate(20);

        // Add remaining debt info
        $debtOrders->getCollection()->transform(function ($rent) {
            $remaining = $rent->total_price - $rent->down_payment;
            
            return [
                ...$rent->toArray(),
                'remaining_payment' => $remaining,
                'payment_percentage' => $rent->down_payment > 0 ? 
                    round(($rent->down_payment / $rent->total_price) * 100, 2) : 0,
            ];
        });

        $totalDebt = $debtOrders->sum('remaining_payment') ?? 0;

        return inertia('Reports/Debt', [
            'orders' => $debtOrders,
            'total_debt' => $totalDebt,
        ]);
    }

    /**
     * Laporan Pendapatan - Breakdown pendapatan per bulan/kategori
     */
    public function revenue(Request $request)
    {
        $timeRange = $request->get('range', '30');
        $groupBy = $request->get('group_by', 'month'); // month, category, both

        if ($timeRange === 'all') {
            $startDate = now()->subYear();
        } else {
            $startDate = now()->subDays((int)$timeRange);
        }
        $endDate = now();

        $query = Rent::with(['details.cloth.category'])
            ->whereBetween('rent_date', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled');

        if ($groupBy === 'month' || $groupBy === 'both') {
$byMonth = $query->selectRaw("EXTRACT(YEAR FROM rent_date) as year, EXTRACT(MONTH FROM rent_date) as month, SUM(total_price) as revenue, COUNT(id) as order_count")
    ->groupBy('year', 'month')
    ->orderBy('year', 'desc')->orderBy('month', 'desc')
    ->get()
    ->map(fn($row) => [
        'label' => Carbon::create((int)$row->year, (int)$row->month, 1)->format('F Y'),
        'revenue' => (float) $row->revenue,
        'order_count' => (int) $row->order_count,
    ]);

            return inertia('Reports/Revenue', [
                'by_month' => $byMonth,
                'total' => $byMonth->sum('revenue'),
                'time_range' => $timeRange,
            ]);
        }

        if ($groupBy === 'category') {
            $byCategory = Rent::with('details.cloth.category')
                ->whereBetween('rent_date', [$startDate, $endDate])
                ->where('status', '!=', 'cancelled')
                ->get()
                ->flatMap->details
                ->groupBy('cloth.category.name')
                ->map(function ($items, $category) {
                    return [
                        'category' => $category,
                        'revenue' => $items->sum(fn($item) => $item->price_per_item * $item->qty * 
                            Carbon::parse($item->rent->rent_date)->diffInDays($item->rent->return_date)),
                        'order_count' => $items->count(),
                    ];
                })
                ->sortByDesc('revenue')
                ->values();

            return inertia('Reports/Revenue', [
                'by_category' => $byCategory,
                'total' => $byCategory->sum('revenue'),
                'time_range' => $timeRange,
            ]);
        }
    }

    /**
     * Export laporan ke Excel
     */
    public function export(Request $request)
    {
        $reportType = $request->get('type', 'summary');
        $timeRange = $request->get('range', '30');

        if ($timeRange === 'all') {
            $startDate = Rent::oldest('rent_date')->first()?->rent_date ?? now()->startOfYear();
        } else {
            $startDate = now()->subDays((int)$timeRange);
        }
        $endDate = now();

        $data = [];
        $fileName = '';

        switch ($reportType) {
            case 'late':
                $data = Rent::with('details.cloth')
                    ->where('status', '!=', 'completed')
                    ->where('return_date', '<', now()->toDateString())
                    ->orderBy('return_date')
                    ->get();
                $fileName = 'Late-Orders-' . now()->format('Y-m-d');
                break;

            case 'debt':
                $data = Rent::with('details.cloth')
                    ->whereBetween('rent_date', [$startDate, $endDate])
                    ->where('status', '!=', 'completed')
                    ->where('status', '!=', 'cancelled')
                    ->where(DB::raw('down_payment < total_price'))
                    ->orderBy('rent_date', 'desc')
                    ->get();
                $fileName = 'Debt-Report-' . now()->format('Y-m-d');
                break;

            default:
                // Summary laporan
                $data = Rent::whereBetween('rent_date', [$startDate, $endDate])
                    ->where('status', '!=', 'cancelled')
                    ->get();
                $fileName = 'Rent-Report-' . now()->format('Y-m-d');
        }

        // Gunakan RentExport yang sudah ada
        return Excel::download(
            new \App\Exports\RentExport($data),
            $fileName . '.xlsx'
        );
    }
}
