<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $rent->invoice_code }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #334155; line-height: 1.5; margin: 0; padding: 0; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; }
        
        /* Header */
        .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
        .header table { width: 100%; border: none; }
        .title { font-size: 28px; font-weight: bold; color: #1e293b; }
        .company-info { text-align: right; }
        .company-info h2 { margin: 0; font-size: 18px; color: #1e293b; }
        .company-info p { margin: 0; font-size: 12px; color: #64748b; }

        /* Info Pelanggan */
        .info-section { width: 100%; margin-bottom: 30px; }
        .info-section td { vertical-align: top; width: 50%; }
        .label { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #94a3b8; margin-bottom: 5px; }
        .value { font-size: 14px; font-weight: bold; color: #1e293b; }
        .sub-value { font-size: 12px; color: #64748b; }

        /* Tabel Item */
        table.items { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table.items th { border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; background: #f8fafc; padding: 12px; text-align: left; font-size: 12px; color: #475569; }
        table.items td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Summary */
        .summary { margin-top: 30px; width: 100%; }
        .summary-table { width: 250px; margin-left: auto; }
        .summary-table td { padding: 5px 0; font-size: 14px; }
        .total-row { border-top: 1px solid #e2e8f0; font-weight: bold; font-size: 16px; color: #1e293b; }
        .text-red { color: #dc2626; }
        .text-green { color: #16a34a; }

        /* Footer */
        .footer { margin-top: 50px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        .footer p { margin: 0; font-size: 11px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="title">INVOICE</div>
                        <p style="font-family: monospace; font-size: 12px; color: #64748b; margin: 0;">{{ $rent->invoice_code }}</p>
                    </td>
                    <td class="company-info">
                        <h2>Rental Baju</h2>
                        <p>Jl. Raya Madiun No. 123</p>
                        <p>WhatsApp: 0812-3456-7890</p>
                    </td>
                </tr>
            </table>
        </div>

        <table class="info-section">
            <tr>
                <td>
                    <div class="label">Ditujukan Untuk:</div>
                    <div class="value">{{ $rent->customer_name }}</div>
                    <div class="sub-value">{{ $rent->customer_phone }}</div>
                    <div class="sub-value">KTP: {{ $rent->customer_ktp }}</div>
                </td>
                <td style="text-align: right;">
                    <div class="label">Detail Sewa:</div>
                    <div class="sub-value">Pinjam: <strong>{{ \Carbon\Carbon::parse($rent->rent_date)->format('d/m/Y') }}</strong></div>
                    <div class="sub-value">Kembali: <strong>{{ \Carbon\Carbon::parse($rent->return_date)->format('d/m/Y') }}</strong></div>
                    <div class="sub-value">Status: <span style="text-transform: uppercase;">{{ $rent->status }}</span></div>
                </td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th>Deskripsi Baju</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Harga</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rent->details as $item)
                <tr>
                    <td>
                        <strong>{{ $item->cloth->name }}</strong><br>
                        <small style="color: #64748b;">Kode: {{ $item->clothes_kode }}</small>
                    </td>
                    <td class="text-center">{{ $item->qty }}</td>
                    <td class="text-right">Rp {{ number_format($item->price_per_item, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->price_per_item * $item->qty, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="summary">
            <table class="summary-table">
                <tr>
                    <td>Total Harga:</td>
                    <td class="text-right">Rp {{ number_format($rent->total_price, 0, ',', '.') }}</td>
                </tr>
                @if($rent->denda > 0)
                <tr>
                    <td class="text-red">Denda Telat:</td>
                    <td class="text-right text-red">+ Rp {{ number_format($rent->denda, 0, ',', '.') }}</td>
                </tr>
                @endif
                <tr>
                    <td class="text-green">DP / Dibayar:</td>
                    <td class="text-right text-green">- Rp {{ number_format($rent->down_payment, 0, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td>Sisa Tagihan:</td>
                    <td class="text-right">Rp {{ number_format(($rent->total_price + ($rent->denda ?? 0)) - $rent->down_payment, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Terima kasih telah mempercayakan persewaan baju pada kami.</p>
            <p style="font-style: italic;">* Harap simpan invoice ini sebagai bukti pengembalian.</p>
        </div>
    </div>
</body>
</html>