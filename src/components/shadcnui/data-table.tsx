"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Input } from "@/components/shadcnui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table"

import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  toolbar?: React.ReactNode
  showPagination?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  manualSorting?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  toolbar,
  showPagination = true,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  manualSorting = false,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const sorting = externalSorting ?? internalSorting
  const setSorting: OnChangeFn<SortingState> = externalOnSortingChange
    ? (updaterOrValue) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(sorting)
            : updaterOrValue
        externalOnSortingChange(next)
      }
    : setInternalSorting
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      {(toolbar || filterColumn) && (
        <div className="flex items-center gap-4">
          {filterColumn && (
            <Input
              placeholder={
                filterPlaceholder ?? `Filter ${filterColumn}...`
              }
              value={
                (table
                  .getColumn(filterColumn)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {toolbar}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} />}
    </div>
  )
}
