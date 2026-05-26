import type React from "react";

export function DataTable<T extends { id: string }>({
  rows,
  columns
}: {
  rows: T[];
  columns: Array<{ key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }>;
}) {
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3">
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
