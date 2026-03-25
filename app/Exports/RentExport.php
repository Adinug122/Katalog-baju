<?php

namespace App\Exports;

use App\Models\Rent;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class RentExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    private $rents;

    public function __construct($rents)
    {
        $this->rents = $rents;
    }

    public function collection()
    {
        return $this->rents;
    }

    public function headings(): array
    {
        return [
            'Invoice',           
            'Nama Pemesan',      
            'No. Telepon',       
            'Baju Disewa',       
            'Tgl Mulai',         
            'Tgl Kembali',       
            'Tgl Kembali Aktual',          
            'Total Harga',       
            'Denda',             
            'Status',            
        ];
    }

    public function map($rent): array
    {
        $bajuList = $rent->details->map(function ($item) {
            $nama = $item->cloth->name ?? $item->clothes_kode;
            return "{$nama} (x{$item->qty})";
        })->implode(', ');

   
        return [
            $rent->invoice_code,             
            $rent->customer_name,            
            $rent->customer_phone,           
            $bajuList,                       
            $rent->rent_date,                
            $rent->return_date,              
            $rent->actual_return_date ?? '-',            
            $rent->total_price,              
            $rent->denda ?? 0,               
            $rent->status,                   
        ];
    }
}