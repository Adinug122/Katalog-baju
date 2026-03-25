<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\Rent;
use App\Models\RentItem;
use App\Exports\RentExport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RentController extends Controller
{
    public function index(Request $request)
    {
        $query = Rent::with(['details.cloth'])->orderBy('created_at', 'desc');

        if ($request->filled('month')) {
            $query->whereMonth('rent_date', $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('rent_date', $request->year);
        }

        $rents = $query->paginate(10)->withQueryString();

        return inertia('Rents/Index', [
            'rents' => $rents,
            'month' => $request->month,
            'year' => $request->year,
        ]);
    }

    public function create()
    {
        $clothes = Clothes::active()->where('stock', '>', 0)->get();
        return inertia('Rents/Create', compact('clothes'));
    }

    public function store(Request $request)
    {
    
        $validated = $request->validate([
            'customer_name'  => 'required|string|max:30',
            'customer_phone' => 'required|string|max:15',
            'rent_date'      => 'required|date',
            'return_date'    => 'required|date|after_or_equal:rent_date',
            'items'          => 'required|array|min:1',
            'items.*.kode'   => 'required|exists:clothes,kode',
            'items.*.qty'    => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $rent = Rent::create([
                    'invoice_code'   => 'INV-' . now()->format('YmdHis'),
                    'customer_name'  => $validated['customer_name'],
                    'customer_phone' => $validated['customer_phone'],
                    'rent_date'      => $validated['rent_date'],
                    'return_date'    => $validated['return_date'],
                    'status'         => 'booked',
                    'total_price'    => 0,
                    'denda'          => 0,
                ]);

                $totalInvoice = 0;

                foreach ($validated['items'] as $item) {
                    $clothes = Clothes::where('kode', $item['kode'])->lockForUpdate()->first();

                    if ($clothes->stock < $item['qty']) {
                        throw new \Exception("Stok {$clothes->name} tidak cukup.");
                    }

                    $rentDays = Carbon::parse($validated['rent_date'])
                    ->diffInDays($validated['return_date']);
                    $subTotal = $clothes->price * $item['qty'] * $rentDays;

                    RentItem::create([
                        'rent_id'        => $rent->id,
                        'clothes_kode'   => $clothes->kode,
                        'qty'            => $item['qty'],
                        'price_per_item' => $clothes->price
                    ]);

                    $clothes->decrement('stock', $item['qty']);
                    $totalInvoice += $subTotal;
                }

                // Update total setelah semua item dihitung
                $rent->update(['total_price' => $totalInvoice]);
            });

            return redirect()->route('rents.index')->with('success', 'Sewa berhasil dibuat.');
            
        } catch (\Exception $e) {
               dd($e->getMessage(), $e->getTraceAsString()); 
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function returnBaju(Request $request, Rent $rent)
    {
        if ($rent->status === 'completed') {
            return back()->with('error', 'Sewa sudah dikembalikan sebelumnya.');
        }

        $validated = $request->validate([
            'denda' => 'nullable|integer|min:0',
        ]);

        try {
            DB::transaction(function () use ($rent, $validated) {
                $denda = $validated['denda'] ?? 0;
                
                // Muat detail jika belum ada
                $rent->load('details');

                foreach ($rent->details as $item) {
                    $clothes = Clothes::where('kode', $item->clothes_kode)->lockForUpdate()->first();
                    if ($clothes) {
                        $clothes->increment('stock', $item->qty);
                    }
                }

                $rent->update([
                    'status'             => 'completed',
                    'denda'              => $denda,
                    'actual_return_date' => now()->toDateString(),
                    'total_price'        => $rent->total_price + $denda,
                ]);
            });

            return back()->with('success', 'Baju berhasil dikembalikan dan stok diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function destroy(Rent $rent)
    {
        try {
            DB::transaction(function () use ($rent) {
                // Kembalikan stok jika status belum selesai/batal
                if (in_array($rent->status, ['booked', 'ongoing'])) {
                    $rent->load('details');
                    foreach ($rent->details as $item) {
                        Clothes::where('kode', $item->clothes_kode)->increment('stock', $item->qty);
                    }
                }
                $rent->delete();
            });

            return redirect()->back()->with('success', 'Data sewa berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus data.');
        }
    }

    public function export(Request $request)
    {
        $status = $request->query('status');
        $query = Rent::with(['details.cloth'])->orderBy('rent_date', 'desc');

        if ($status && in_array($status, ['booked', 'ongoing', 'completed', 'cancelled'])) {
            $query->where('status', $status);
        }

        $rents = $query->get();
        $bulan = Carbon::now()->translatedFormat('F');
        $fileName = 'Laporan_Bulan_' . $bulan . ($status ? '_' . ucfirst($status) : '') . '.xlsx';

        return Excel::download(new RentExport($rents), $fileName);
    }
}