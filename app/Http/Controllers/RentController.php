<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use App\Models\Rent;
use App\Models\RentItem;
use App\Exports\RentExport;
use App\Models\Cashflow;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RentController extends Controller
{
    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────

    /**
     * Hitung jumlah "periode 3 hari" dari rentDays.
     * Contoh: 3 hari → 1 periode, 4 hari → 2 periode, 6 hari → 2 periode, 7 hari → 3 periode.
     */
    private function calculatePeriods(int $rentDays): int
    {
        return (int) ceil($rentDays / 3);
    }

    /**
     * Hitung subtotal satu item berdasarkan harga per-3-hari × jumlah periode × qty.
     */
    private function calculateSubtotal(float $pricePerThreeDays, int $rentDays, int $qty): float
    {
        $periods = $this->calculatePeriods($rentDays);
        return $pricePerThreeDays * $periods * $qty;
    }

    // ─────────────────────────────────────────────
    // Index
    // ─────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = Rent::with(['details.cloth'])->orderBy('created_at', 'desc');

        if ($request->filled('month')) {
            $query->whereMonth('rent_date', $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('rent_date', $request->year);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('rent_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('rent_date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('invoice_code', 'like', "%{$search}%")
              ->orWhere('customer_name', 'like', "%{$search}%");
        });
    }

        $rents = $query->paginate(10)->withQueryString();

        return inertia('Rents/Index', [
            'rents' => $rents,
            'month' => $request->month,
            'year'  => $request->year,
            'search' => $request->search,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
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
  
            'customer_ktp'   => 'required|string|max:20',
            'rent_date'      => 'required|date|after_or_equal:today',
            'return_date'    => 'required|date|after:rent_date',
            'down_payment'   => 'nullable|integer|min:0',
            'note'           => 'nullable|string|max:500',
        
            'items'             => 'required|array|min:1|max:10',
            'items.*.kode'      => 'required|exists:clothes,kode',
            'items.*.qty'       => 'required|integer|min:1|max:50',
        ]);

    
        $kodes = array_column($validated['items'], 'kode');
        if (count($kodes) !== count(array_unique($kodes))) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Terdapat produk yang sama dalam satu transaksi. Gabungkan qty-nya.');
        }

        try {
            $rentData = null;

            DB::transaction(function () use ($validated, &$rentData) {

                $rentDays = Carbon::parse($validated['rent_date'])
                    ->diffInDays($validated['return_date']);

                if ($rentDays < 3) {
                    throw new \Exception("Minimum sewa adalah 3 hari. Anda memilih {$rentDays} hari.");
                }

                // Validasi ketersediaan stok untuk semua item
                $this->validateInventoryAvailability(
                    $validated['items'],
                    $validated['rent_date'],
                    $validated['return_date']
                );

                // Buat header invoice
                $rent = Rent::create([
                    'invoice_code'   => 'INV-' . now()->format('YmdHis') . '-' . rand(1000, 9999),
                    'customer_name'  => $validated['customer_name'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_ktp'   => $validated['customer_ktp'],
                    'rent_date'      => $validated['rent_date'],
                    'return_date'    => $validated['return_date'],
                    'down_payment'   => $validated['down_payment'] ?? 0,
                    'note'           => $validated['note'] ?? '',
                    'status'         => 'booked',
                    'total_price'    => 0,
                    'denda'          => 0,
                ]);

                $totalInvoice = 0;

                foreach ($validated['items'] as $item) {
                    $clothes = Clothes::where('kode', $item['kode'])
                        ->lockForUpdate()
                        ->first();

                    if (!$clothes) {
                        throw new \Exception("Pakaian dengan kode {$item['kode']} tidak ditemukan.");
                    }

                    if ($clothes->stock < $item['qty']) {
                        throw new \Exception(
                            "Stok {$clothes->name} tidak cukup. " .
                            "Tersedia: {$clothes->stock}, diminta: {$item['qty']}"
                        );
                    }

                    // ── PERBAIKAN UTAMA: hitung subtotal per 3 hari ──
                    $subTotal = $this->calculateSubtotal($clothes->price, $rentDays, $item['qty']);

                    RentItem::create([
                        'rent_id'        => $rent->id,
                        'clothes_kode'   => $clothes->kode,
                        'qty'            => $item['qty'],
                        'price_per_item' => $clothes->price,   // harga per-3-hari (satuan)
                        'subtotal'       => $subTotal,          // simpan subtotal agar invoice akurat
                    ]);

                    $clothes->decrement('stock', $item['qty']);
                    $totalInvoice += $subTotal;
                }

                $rent->update([
                    'total_price' => $totalInvoice,
                    'rent_price'  => $totalInvoice,
                ]);

                $rentData = $rent;

                if (!empty($validated['down_payment']) && $validated['down_payment'] > 0) {
                    $lastBalance = Cashflow::latest('id')->value('balance_after') ?? 0;
                    Cashflow::create([
                        'date'          => now(),
                        'user_id' => Auth::id(),
                        'type'          => 'income',
                        'amount'        => $validated['down_payment'],
                        'balance_after' => $lastBalance + $validated['down_payment'],
                        'description'   => "DP Sewa Baru INV: {$rent->invoice_code}",
                    ]);
                }
            });

            return redirect()->route('rents.index');
             

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error: ' . $e->getMessage());
        }
    }

    private function validateInventoryAvailability(array $items, string $rentDate, string $returnDate): void
    {
        foreach ($items as $item) {
            $kode = $item['kode'];
            $qty  = $item['qty'];

            // Hitung total qty yang sudah ter-booking pada periode yang overlap
            $bookedQty = RentItem::whereHas('rent', function ($query) use ($rentDate, $returnDate) {
                $query->whereNotIn('status', ['cancelled', 'completed'])
                    ->where(function ($q) use ($rentDate, $returnDate) {
                        // Overlap: (start_existing <= returnDate) AND (end_existing >= rentDate)
                        $q->where('rent_date', '<=', $returnDate)
                          ->where('return_date', '>=', $rentDate);
                    });
            })->where('clothes_kode', $kode)->sum('qty');

            $clothes      = Clothes::where('kode', $kode)->firstOrFail();
            $availableQty = $clothes->stock - $bookedQty;

            if ($availableQty < $qty) {
                throw new \Exception(
                    "{$clothes->name} ({$kode}) hanya tersedia {$availableQty} unit pada periode " .
                    Carbon::parse($rentDate)->format('d-m-Y') . ' s/d ' .
                    Carbon::parse($returnDate)->format('d-m-Y') . '.'
                );
            }
        }
    }

  
    public function pelunasan(Request $request, $invoiceCode)
    {
        $rent     = Rent::where('invoice_code', $invoiceCode)->firstOrFail();
        $sisaBayar = max(0, $rent->total_price - $rent->down_payment);

        DB::transaction(function () use ($rent, $sisaBayar) {
            $rent->update([
                'status'       => 'ongoing',
                'down_payment' => $rent->total_price,
            ]);

            if ($sisaBayar > 0) {
                $lastBalance = Cashflow::latest('id')->value('balance_after') ?? 0;
                Cashflow::create([
                    'date'          => now(),
                    'type'          => 'income',
                    'amount'        => $sisaBayar,
                        'user_id' => Auth::id(),
                    'balance_after' => $lastBalance + $sisaBayar,
                    'description'   => "Pelunasan Sewa INV: {$rent->invoice_code}",
                ]);
            }
        });

        return back()->with('success', 'Pelunasan berhasil, status menjadi Ongoing.');
    }

    // ─────────────────────────────────────────────
    // Selesai / Return
    // ─────────────────────────────────────────────

    public function selesai(Request $request, $invoiceCode)
    {
        $rent  = Rent::with('details.cloth.category')->where('invoice_code', $invoiceCode)->firstOrFail();
        $denda = $this->calculateFine($rent);

        DB::transaction(function () use ($rent, $denda) {
            foreach ($rent->details as $item) {
                $clothes = Clothes::where('kode', $item->clothes_kode)->lockForUpdate()->first();
                if ($clothes) {
                    $clothes->increment('stock', $item->qty);
                }
            }

            $rent->update([
                'status'             => 'completed',
                'actual_return_date' => now(),
                'denda'              => $denda,
            ]);

            if ($denda > 0) {
                $lastBalance = Cashflow::latest('id')->value('balance_after') ?? 0;
                Cashflow::create([
                    'date'          => now(),
                    'type'          => 'income',
                    'amount'        => $denda,
                    'balance_after' => $lastBalance + $denda,
                    'description'   => "Denda Keterlambatan {$rent->invoice_code}",
                ]);
            }
        });

        return back()->with('success', 'Transaksi Selesai. Denda: Rp ' . number_format($denda, 0, ',', '.'));
    }


    public function edit(Rent $rent)
    {
        if ($rent->status !== 'booked') {
            return redirect()->route('rents.index')
                ->with('error', 'Hanya order berstatus "booked" yang bisa diedit.');
        }

        $rent->load('details.cloth');
        $clothes = Clothes::active()->where('stock', '>', 0)->get();

        return inertia('Rents/Edit', compact('rent', 'clothes'));
    }

    public function update(Request $request, Rent $rent)
    {
        if ($rent->status !== 'booked') {
            return redirect()->route('rents.index')
                ->with('error', 'Hanya order berstatus "booked" yang bisa diedit.');
        }

        $validated = $request->validate([
            'customer_name'  => 'required|string|max:30',
            'customer_phone' => 'required|string|max:15',
            'customer_ktp'   => 'required|string|max:20',
            'rent_date'      => 'required|date',
            'return_date'    => 'required|date|after:rent_date',
            'down_payment'   => 'nullable|integer|min:0',
            'note'           => 'nullable|string|max:500',
        ]);

        try {
            DB::transaction(function () use ($rent, $validated) {
                $rentDays = Carbon::parse($validated['rent_date'])
                    ->diffInDays($validated['return_date']);

                if ($rentDays < 3) {
                    throw new \Exception("Minimum sewa adalah 3 hari. Anda memilih {$rentDays} hari.");
                }

                // Hitung ulang total berdasarkan periode baru
                $rent->load('details.cloth');
                $newTotal = 0;
                foreach ($rent->details as $item) {
                    $newTotal += $this->calculateSubtotal($item->cloth->price, $rentDays, $item->qty);
                }

                $rent->update([
                    'customer_name'  => $validated['customer_name'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_ktp'   => $validated['customer_ktp'],
                    'rent_date'      => $validated['rent_date'],
                    'return_date'    => $validated['return_date'],
                    'down_payment'   => $validated['down_payment'] ?? 0,
                    'note'           => $validated['note'] ?? '',
                    'total_price'    => $newTotal,
                    'rent_price'     => $newTotal,
                ]);
            });

            return redirect()->route('rents.index')
                ->with('success', 'Order sewa berhasil diperbarui.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // Return Baju manual (dengan override denda)
    // ─────────────────────────────────────────────

    public function returnBaju(Request $request, Rent $rent)
    {
        if ($rent->status === 'completed') {
            return back()->with('error', 'Sewa sudah dikembalikan sebelumnya.');
        }

        $validated = $request->validate([
            'denda' => 'nullable|integer|min:0',
        ]);

        try {
            $fineAmount = 0;

            DB::transaction(function () use ($rent, $validated, &$fineAmount) {
                $actualReturnDate = now()->toDateString();
                $returnDate       = Carbon::parse($rent->return_date)->startOfDay();
                $actualDate       = Carbon::parse($actualReturnDate)->startOfDay();

                $denda = 0;

                if ($actualDate->greaterThan($returnDate)) {
              
                $lateDays = $returnDate->diffInDays($actualDate, true);
                
                $rent->loadMissing('details.cloth.category');
                $totalFine = 0;

                foreach ($rent->details as $item) {
                    $fine_per_day = $item->cloth?->category?->fine_per_day ?? 35000;
                    $totalFine   += ($lateDays * $fine_per_day) * $item->qty;
                }

                $denda = $totalFine;
            }
                // Jika admin override denda secara manual
                if (isset($validated['denda']) && $validated['denda'] > 0) {
                    $denda = $validated['denda'];
                }

                $rent->loadMissing('details');
                foreach ($rent->details as $item) {
                    $clothes = Clothes::where('kode', $item->clothes_kode)->lockForUpdate()->first();
                    if ($clothes) {
                        $clothes->increment('stock', $item->qty);
                    }
                }

                $rent->update([
                    'status'             => 'completed',
                    'denda'              => $denda,
                    'actual_return_date' => $actualReturnDate,
                    'total_price'        => $rent->rent_price + $denda,
                ]);

                $fineAmount = $denda;

                if ($denda > 0) {
                    $lastBalance = Cashflow::latest('id')->value('balance_after') ?? 0;
                    Cashflow::create([
                        'date'          => now(),
                        'type'          => 'income',
                        'amount'        => $denda,
                        'balance_after' => $lastBalance + $denda,
                        'description'   => "Denda Keterlambatan {$rent->invoice_code}",
                    ]);
                }
            });

            return back()->with('success', 'Baju berhasil dikembalikan. Denda: Rp ' . number_format($fineAmount, 0, ',', '.'));

        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // Destroy
    // ─────────────────────────────────────────────

    public function destroy(Rent $rent)
    {
        try {
            DB::transaction(function () use ($rent) {
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
            return redirect()->back()->with('error', 'Gagal menghapus data: ' . $e->getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // Export
    // ─────────────────────────────────────────────

    public function export(Request $request)
    {
        $status = $request->query('status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $query  = Rent::with(['details.cloth'])->orderBy('rent_date', 'desc');

        if ($status && in_array($status, ['booked', 'ongoing', 'completed', 'cancelled'])) {
            $query->where('status', $status);
        }

        if ($dateFrom) {
            $query->whereDate('rent_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('rent_date', '<=', $dateTo);
        }

        $rents    = $query->get();
        $bulan    = Carbon::now()->translatedFormat('F');
        $fileName = 'Laporan_Bulan_' . $bulan . ($status ? '_' . ucfirst($status) : '') . '.xlsx';

        return Excel::download(new RentExport($rents), $fileName);
    }

    // ─────────────────────────────────────────────
    // Hitung Denda Keterlambatan
    // ─────────────────────────────────────────────

private function calculateFine(Rent $rent): float
{
    $rent->loadMissing('details.cloth.category');

    $expectedReturn = Carbon::parse($rent->return_date)->startOfDay();
    $actualReturn   = Carbon::now()->startOfDay();

    if ($actualReturn->lte($expectedReturn)) {
        return 0;
    }

 
    $lateDays  = $expectedReturn->diffInDays($actualReturn, true);
    $totalFine = 0;

    foreach ($rent->details as $item) {
        $fine_per_day = $item->cloth?->category?->fine_per_day ?? 35000;
        $totalFine   += ($lateDays * $fine_per_day) * $item->qty;
    }

    return $totalFine;
}

    // ─────────────────────────────────────────────
    // Invoice PDF
    // ─────────────────────────────────────────────

    public function invoice($invoiceCode)
    {
        $rent = Rent::with('details.cloth')->where('invoice_code', $invoiceCode)->firstOrFail();
        $pdf  = Pdf::loadView('invoice', compact('rent'));
        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('Invoice-' . $rent->invoice_code . '.pdf');
    }
}