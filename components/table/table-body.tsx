import * as React from 'react';
import {
  flexRender,
  Row,
  ColumnDef,
  Table as ReactTable,
} from '@tanstack/react-table';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';

interface TableProps<T> {
  table: ReactTable<T>;
  columns: ColumnDef<T>[];
}

export function TableBodyComponent<T>({ table, columns }: TableProps<T>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: Row<T>) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Nenhum resultado
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
