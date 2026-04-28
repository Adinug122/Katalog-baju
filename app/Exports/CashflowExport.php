<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Carbon\Carbon; // <-- Pastikan Carbon di-import

class CashflowExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    private $transactions;

    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    public function collection()
    {
        return $this->transactions;
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Tipe',
            'Deskripsi',
            'Jumlah',
            'Catatan',
            'Saldo Setelah',
            'User',
        ];
    }

    public function map($transaction): array
    {
        $typeLabel = [
            'initial_capital' => 'Modal',
            'income' => 'Pemasukan',
            'expense' => 'Pengeluaran',
        ][$transaction->type] ?? $transaction->type;

        return [
         
            Carbon::parse($transaction->date)->format('d-m-Y'), 
            $typeLabel,
            $transaction->description,
            number_format($transaction->amount, 0, ',', '.'),
            $transaction->notes,
            number_format($transaction->balance_after, 0, ',', '.'),
            $transaction->user->name ?? '-',
        ];
    }
}