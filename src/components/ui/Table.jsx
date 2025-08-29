// src/components/ui/Table.jsx
import React from 'react';

const Table = ({ columns, rows }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-border">
                <thead>
                    <tr className="bg-muted text-left">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-2 border-b border-border font-semibold text-foreground"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-6 text-center text-muted-foreground"
                            >
                                Tidak ada data ditemukan
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/20 transition-colors">
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-2 border-t border-border text-foreground"
                                    >
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;