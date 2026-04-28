<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $rent->invoice_code }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&poppins:400,500,600,700&display=swap" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', 'Figtree', sans-serif; 
            color: #2c2c2c; 
            line-height: 1.6; 
            background-color: #FBFAF5;
        }
        .invoice-box { 
            max-width: 800px; 
            margin: 20px auto; 
            padding: 40px; 
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(201, 168, 52, 0.1);
            border-radius: 8px;
        }
        
        /* Header */
        .header { 
            border-bottom: 3px solid #C9A834; 
            padding-bottom: 25px; 
            margin-bottom: 30px; 
        }
        .header table { width: 100%; border: none; }
        .title { 
            font-size: 32px; 
            font-weight: 700; 
            color: #C9A834; 
            font-family: 'Poppins', sans-serif;
            letter-spacing: 0.5px;
        }
        .invoice-code { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            color: #B38F1E; 
            margin-top: 5px;
            font-weight: 600;
        }
        .company-info { text-align: right; }
        .company-info h2 { 
            margin: 0; 
            font-size: 18px; 
            color: #B38F1E;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
        }
        .company-info p { 
            margin: 3px 0; 
            font-size: 12px; 
            color: #666666; 
        }

        /* Info Pelanggan */
        .info-section { width: 100%; margin-bottom: 30px; }
        .info-section td { vertical-align: top; width: 50%; }
        .label { 
            font-size: 11px; 
            text-transform: uppercase; 
            font-weight: 600; 
            color: #B38F1E; 
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .value { 
            font-size: 15px; 
            font-weight: 600; 
            color: #1a1a1a;
            margin-bottom: 3px;
        }
        .sub-value { 
            font-size: 13px; 
            color: #666666;
            margin: 2px 0;
        }

        /* Tabel Item */
        table.items { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table.items th { 
            border-top: 2px solid #C9A834; 
            border-bottom: 2px solid #C9A834; 
            background: #FBFAF5; 
            padding: 14px 12px; 
            text-align: left; 
            font-size: 12px; 
            color: #B38F1E;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        table.items td { 
            padding: 14px 12px; 
            border-bottom: 1px solid #E8E8E8; 
            font-size: 13px; 
        }
        table.items tbody tr:hover { background-color: #FEFEF9; }
        table.items strong { color: #1a1a1a; font-weight: 600; }
        table.items small { color: #999999; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Summary */
        .summary { margin-top: 35px; width: 100%; }
        .summary-table { width: 280px; margin-left: auto; }
        .summary-table td { 
            padding: 8px 0; 
            font-size: 14px;
            border-bottom: 1px solid #E8E8E8;
        }
        .summary-table td:first-child { padding-left: 20px; }
        .summary-table td:last-child { padding-right: 20px; text-align: right; }
        .total-row td { 
            border-top: 2px solid #C9A834; 
            border-bottom: 2px solid #C9A834;
            font-weight: 700; 
            font-size: 16px; 
            color: #C9A834;
            padding: 12px 20px !important;
        }
        .text-red { color: #E74C3C; font-weight: 600; }
        .text-green { color: #27AE60; font-weight: 600; }
        .summary-label { color: #666666; font-weight: 500; }

        /* Footer */
        .footer { 
            margin-top: 50px; 
            text-align: center; 
            border-top: 2px solid #C9A834; 
            padding-top: 25px; 
        }
        .footer p { 
            margin: 5px 0; 
            font-size: 12px; 
            color: #666666; 
        }
        .footer p strong { color: #B38F1E; }

        @media print {
            body { background-color: white; }
            .invoice-box { box-shadow: none; margin: 0; padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="title">INVOICE</div>
                        <div class="invoice-code">{{ $rent->invoice_code }}</div>
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
                    <div class="sub-value">Status: <span style="color: #B38F1E; font-weight: 600; text-transform: uppercase;">{{ $rent->status }}</span></div>
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
                        <small style="color: #999999;">Kode: {{ $item->clothes_kode }}</small>
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
                    <td class="summary-label">Total Harga:</td>
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
            <p style="font-style: italic;">* <strong>Harap simpan invoice ini</strong> sebagai bukti pengembalian.</p>
        </div>
    </div>
</body>
</html>
