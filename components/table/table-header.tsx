import {
  flexRender,
  HeaderGroup,
  Table as ReactTable,
} from '@tanstack/react-table';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface TableProps<T> {
  table: ReactTable<T>;
}

export function TableHeaderComponent<T>({ table }: TableProps<T>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
