<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use App\Models\Rent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class CashflowController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();
        
        $filterType = $request->input('filter_type', 'all');

        $transactions = Cashflow::whereBetween('date', [$startDate, $endDate])
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('notes', 'like', "%{$search}%")
                      ->orWhere('amount', 'like', "%{$search}%");
                });
            })
            ->when($filterType !== 'all', function ($query) use ($filterType) {
                $query->where('type', $filterType);
            })
            ->with('user')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString(); 

        $summary = $this->getCashflowSummary($startDate, $endDate);
      
        $rents = Rent::whereBetween('rent_date', [$startDate, $endDate])->get();
        $totalDp = 0;
        $totalUnpaid = 0;

        foreach ($rents as $rent) {
            $sisa = $rent->total_price - $rent->down_payment;
            if ($sisa > 0) {
                $totalDp += $rent->down_payment;
                $totalUnpaid += $sisa;
            }
        }

        $summary['total_dp'] = $totalDp;
        $summary['total_unpaid'] = $totalUnpaid;
  
        return inertia('Cashflow/Index', [
            'transactions' => $transactions,
            'summary' => $summary,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'filter_type' => $filterType
        ]);
    }

    public function create()
    {
        return inertia('Cashflow/Create', [
            'types' => [
                'initial_capital' => 'Modal/Saldo Awal',
                'income' => 'Pemasukan',
                'expense' => 'Pengeluaran',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:initial_capital,income,expense',
            'sumber_dana' => 'required|in:operasional,modal',
            'amount' => 'required|integer|min:1',
            'description' => 'required|string|max:200',
            'notes' => 'nullable|string|max:500',
        ]);
        if ($validated['type'] === 'expense') {
        
            $uangMasuk = Cashflow::where('sumber_dana', $validated['sumber_dana'])
                ->whereIn('type', ['income', 'initial_capital'])
                ->sum('amount');
                
            $uangKeluar = Cashflow::where('sumber_dana', $validated['sumber_dana'])
                ->where('type', 'expense')
                ->sum('amount');
                
            $saldoLaciSaatIni = $uangMasuk - $uangKeluar;

          
            if ($validated['amount'] > $saldoLaciSaatIni) {
                $namaLaci = ucfirst($validated['sumber_dana']);
                $sisaFormat = number_format($saldoLaciSaatIni, 0 ,',','.');
                $pesan = "Gagal! Saldo {$namaLaci} tidak cukup (Sisa: Rp {$sisaFormat}). ";
                if ($validated['sumber_dana'] === 'operasional') {
                    
                    $pesan .= "Silakan gunakan laci 'Modal/Darurat' jika mendesak.";
                } else {
                    $pesan = "KRITIS: Saldo Modal Owner juga sudah habis! Harap input 'Tambahan Modal' baru sebelum mencatat pengeluaran ini.";
                }

                return redirect()->back()
                    ->withInput()
                    ->with('error', $pesan);
            }
        }

        try {
            DB::beginTransaction();
         $previousGlobalBalance = $this->getBalanceBeforeDate($validated['date']);
$previousLaciBalance = $this->getLaciBalanceBeforeDate($validated['date'], $validated['sumber_dana']);
$change = $validated['type'] === 'expense' ? -$validated['amount'] : $validated['amount'];

            Cashflow::create([
                'date' => $validated['date'],
                'type' => $validated['type'],
                'sumber_dana' => $validated['sumber_dana'],
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'notes' => $validated['notes'] ?? null,
                'user_id' => Auth::id(),
               'balance_after' => $previousGlobalBalance + $change,
            'sumber_dana_balance_after' => $previousLaciBalance + $change
            ]);

            $this->updateSubsequentBalances($validated['date']);
            DB::commit();

            return redirect()->route('cashflow.index')->with('success', 'Transaksi cashflow berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withInput()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function edit(Cashflow $cashflow)
    {
        return inertia('Cashflow/Edit', [
            'cashflow' => $cashflow,
            'types' => [
                'initial_capital' => 'Modal/Saldo Awal',
                'income' => 'Pemasukan',
                'expense' => 'Pengeluaran',
            ]
        ]);
    }

    public function update(Request $request, Cashflow $cashflow)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:initial_capital,income,expense',
            'sumber_dana' => 'required|in:operasional,modal',
            'amount' => 'required|integer|min:1',
            'description' => 'required|string|max:200',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();
            $cashflow->update([
                'date' => $validated['date'],
                'type' => $validated['type'],
                'sumber_dana' => $validated['sumber_dana'],
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'notes' => $validated['notes'] ?? null,
            ]);

            $this->updateAllBalances();
            DB::commit();

            return redirect()->route('cashflow.index')->with('success', 'Transaksi cashflow berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function destroy(Cashflow $cashflow)
    {
        try {
            DB::beginTransaction();
            $deleteDate = $cashflow->date;
            $cashflow->delete();
            $this->updateSubsequentBalances($deleteDate);
            DB::commit();

            return redirect()->back()->with('success', 'Transaksi cashflow berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function export(Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();

        $transactions = Cashflow::whereBetween('date', [$startDate, $endDate])
            ->with('user')->orderBy('date', 'asc')->get();

        return Excel::download(
            new \App\Exports\CashflowExport($transactions),
            'Cashflow-' . now()->format('Y-m-d') . '.xlsx'
        );
    }

   
    private function getCashflowSummary($startDate, $endDate)
    {
        $balanceBefore = $this->getBalanceBeforeDate($startDate);

        // 1. STATISTIK PERIODE INI (Sesuai filter tanggal)
        $stats = DB::table('cashflows')
            ->whereBetween('date', [$startDate, $endDate])
            ->select('type', 'sumber_dana', DB::raw('SUM(amount) as total'))
            ->groupBy('type', 'sumber_dana')
            ->get();

        $income = $stats->where('type', 'income')->sum('total');
        $expense = $stats->where('type', 'expense')->sum('total');
        $initialCapital = $stats->where('type', 'initial_capital')->sum('total');

        // PENGELUARAN MURNI OPERASIONAL (Untuk ngitung Laba Bersih)
        $expenseOperasional = $stats->where('type', 'expense')
                                    ->where('sumber_dana', 'operasional')
                                    ->sum('total');

        $balanceAfter = $balanceBefore + $initialCapital + $income - $expense;

        // 2. STATISTIK TOTAL ALL-TIME (Untuk rincian Saldo Akhir)
        $allStats = DB::table('cashflows')
            ->where('date', '<=', $endDate)
            ->select('type', 'sumber_dana', DB::raw('SUM(amount) as total'))
            ->groupBy('type', 'sumber_dana')
            ->get();

        $incomeOps = $allStats->where('type', 'income')->where('sumber_dana', 'operasional')->sum('total');
        $expenseOpsTotal = $allStats->where('type', 'expense')->where('sumber_dana', 'operasional')->sum('total');
        $saldoOperasional = $incomeOps - $expenseOpsTotal;

        // Kita hitung modal masuk dari initial_capital, bisa juga kalau ada admin yang iseng masukin 'income' tapi sumbernya 'modal'
        $modalMasuk = $allStats->where('sumber_dana', 'modal')->whereIn('type', ['initial_capital', 'income'])->sum('total');
        $modalKeluar = $allStats->where('type', 'expense')->where('sumber_dana', 'modal')->sum('total');
        $saldoModal = $modalMasuk - $modalKeluar;

        return [
            'balance_before' => $balanceBefore,
            'initial_capital' => $initialCapital,
            'total_income' => $income,
            'total_expense' => $expense,
       
            'expense_operasional' => $expenseOperasional, 
            'balance_after' => $balanceAfter,
            'net_change' => $balanceAfter - $balanceBefore,
            // Variabel baru dilempar ke React:
            'saldo_operasional' => $saldoOperasional,
            'saldo_modal' => $saldoModal,
        ];
    }
    private function getLaciBalanceBeforeDate($date, $sumberDana)
{
    $last = Cashflow::where('date', '<', $date)
        ->where('sumber_dana', $sumberDana)
        ->orderBy('date', 'desc')
        ->orderBy('created_at', 'desc')
        ->first();
    return $last ? $last->sumber_dana_balance_after : 0;
}

    private function getBalanceBeforeDate($date)
    {
        $formattedDate = ($date instanceof \Carbon\Carbon) ? $date->format('Y-m-d') : \Carbon\Carbon::parse($date)->format('Y-m-d');
        $lastTransaction = Cashflow::where('date', '<', $formattedDate)
            ->orderBy('date', 'desc')->orderBy('created_at', 'desc')->first();
        return $lastTransaction ? $lastTransaction->balance_after : 0;
    }

    private function updateAllBalances()
    {
        $allTransactions = Cashflow::orderBy('date')->orderBy('created_at')->get();
        $balance = 0;
        $laciBalances = [
            'operasional' => 0,
            'modal' => 0,
        ];

        foreach ($allTransactions as $transaction) {
            // Update saldo global
            $balance += $transaction->type === 'expense' ? -$transaction->amount : $transaction->amount;
            
            // Update saldo per laci
            $laciBalances[$transaction->sumber_dana] += $transaction->type === 'expense' 
                ? -$transaction->amount 
                : $transaction->amount;

            $transaction->updateQuietly([
                'balance_after' => $balance,
                'sumber_dana_balance_after' => $laciBalances[$transaction->sumber_dana]
            ]);
        }
    }

    private function updateSubsequentBalances($fromDate)
    {
        $transactions = Cashflow::where('date', '>=', $fromDate)
            ->orderBy('date')->orderBy('created_at')->get();

        $balance = $this->getBalanceBeforeDate(Carbon::parse($fromDate));
        
        // Track balance per laci
        $laciBalances = [
            'operasional' => $this->getLaciBalanceBeforeDate(Carbon::parse($fromDate), 'operasional'),
            'modal' => $this->getLaciBalanceBeforeDate(Carbon::parse($fromDate), 'modal'),
        ];

        foreach ($transactions as $transaction) {
            // Update saldo global
            $balance += $transaction->type === 'expense' ? -$transaction->amount : $transaction->amount;
            
            // Update saldo per laci
            $laciBalances[$transaction->sumber_dana] += $transaction->type === 'expense' 
                ? -$transaction->amount 
                : $transaction->amount;

            $transaction->updateQuietly([
                'balance_after' => $balance,
                'sumber_dana_balance_after' => $laciBalances[$transaction->sumber_dana]
            ]);
        }
    }
}