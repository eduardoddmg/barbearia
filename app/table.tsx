'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  HeaderGroup,
  Row,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pen,
  Trash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { removeOneItem } from '@/firebase';
import { DocumentData } from 'firebase/firestore';
import { EditClient } from './dialog-edit';
import { useFirebaseStore } from '@/hooks/use-firebase';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tipagem para o Cliente
export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  data: string;
  horario: string;
};

// Tipagem para a Tabela
interface TableProps {
  table: ReactTable<Cliente | DocumentData>;
}

// Tipagem para as Ações da Tabela
interface TableActionsProps {
  table: ReactTable<Cliente | DocumentData>;
  fetchData: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  columns: ColumnDef<Cliente | DocumentData>[];
}

// Tipagem para o Menu de Ações
interface ActionMenuProps {
  cliente: Cliente | DocumentData;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: () => void;
}

// Component: TableHeader
function TableHeaderComponent({ table }: TableProps) {
  return (
    <TableHeader>
      {table
        .getHeaderGroups()
        .map((headerGroup: HeaderGroup<Cliente | DocumentData>) => (
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

// Component: TableBody
function TableBodyComponent({
  table,
  columns,
}: TableProps & { columns: ColumnDef<Cliente | DocumentData>[] }) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: Row<Cliente | DocumentData>) => (
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
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

// Component: ActionMenu
function ActionMenu({ cliente, setId, setOpen, fetchData }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setId(cliente.id);
            setOpen(true);
          }}
        >
          <Pen className="text-orange-400" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await removeOneItem('items', cliente.id);
            fetchData();
          }}
        >
          <Trash className="text-red-500" />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Component: TableActions
function TableActions({
  table,
  fetchData,
  open,
  setOpen,
  id,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <EditClient id={id} fetchData={fetchData} open={open} setOpen={setOpen} />
    </div>
  );
}

// Component: ItemsPerPageSelect
function ItemsPerPageSelect({ table }: TableProps) {
  return (
    <Select
      value={table.getState().pagination.pageSize.toString()}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      <SelectTrigger className="w-[180px] mt-5">
        <SelectValue placeholder="Selecione a quantidade de itens por página" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Quantidade</SelectLabel>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="40">40</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Component: DataTableDemo
export function DataTableDemo() {
  const { data, fetchData } = useFirebaseStore();
  const [open, setOpen] = React.useState<boolean>(false);
  const [id, setId] = React.useState<string>('');

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnDef<Cliente | DocumentData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nome',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="">{row.getValue('nome')}</div>,
    },
    {
      accessorKey: 'telefone',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="">{row.getValue('telefone')}</div>,
    },
    {
      accessorKey: 'data',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="">{row.getValue('data')}</div>,
    },
    {
      accessorKey: 'horario',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-5">{row.getValue('horario')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const cliente = row.original as Cliente;
        return (
          <ActionMenu
            cliente={cliente}
            setId={setId}
            setOpen={setOpen}
            fetchData={fetchData}
          />
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtre pelo nome ..."
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeaderComponent table={table} />
          <TableBodyComponent table={table} columns={columns} />
        </Table>
      </div>
      <ItemsPerPageSelect table={table} />
      <TableActions
        table={table}
        fetchData={fetchData}
        open={open}
        setOpen={setOpen}
        columns={columns}
        id={id}
      />
    </div>
  );
}
