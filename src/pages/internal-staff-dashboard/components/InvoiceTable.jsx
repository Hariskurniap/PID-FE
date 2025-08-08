import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const InvoiceTable = ({ invoices }) => {
  const columns = useMemo(() => [
    {
      header: 'No. Invoice',
      accessorKey: 'nomorInvoice',
      cell: info => <span className="font-mono text-sm">{info.getValue()}</span>,
    },
    {
      header: 'Vendor',
      accessorFn: row => row.vendor?.namaVendor || '-',
    },
    {
      header: 'Jumlah',
      accessorKey: 'jumlahTagihan',
      cell: info => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(info.getValue()),
    },
    {
      header: 'Tgl. Invoice',
      accessorKey: 'tanggalInvoice',
      cell: info => new Date(info.getValue()).toLocaleDateString('id-ID'),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: info => <StatusIndicator status={info.getValue()} size="sm" />,
    },
    {
      header: 'Sisa Waktu',
      accessorFn: row => {
        const deadline = new Date(row.tanggalJatuhTempo);
        const now = new Date();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        if (row.status === 'paid') return '-';
        if (diffDays < 0) return 'Terlambat';
        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return '1 hari';
        return `${diffDays} hari`;
      },
    },
    {
      header: 'Aksi',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            onClick={() => window.open(`/invoice-mapping-pic/${row.original.id}`, '_blank')}
          />
          {row.original.dokumen && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={() => handleDownload(row.original.dokumen)}
            />
          )}
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {},
  });

  const handleDownload = (filename) => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/invoice/download/${filename}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch(err => console.error('Download error:', err));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/30 sticky top-0 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-3 text-left">
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center cursor-pointer space-x-1"
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getIsSorted() === 'asc' && <Icon name="ArrowUp" size={12} />}
                        {header.column.getIsSorted() === 'desc' && <Icon name="ArrowDown" size={12} />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-border">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Tidak Ada Invoice</h3>
          <p className="text-sm text-muted-foreground">Belum ada data invoice tersedia</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
