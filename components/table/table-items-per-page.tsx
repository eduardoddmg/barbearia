import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table as ReactTable } from '@tanstack/react-table';

interface TableProps<T> {
  table: ReactTable<T>;
}

export function ItemsPerPageSelectComponent<T>({ table }: TableProps<T>) {
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
