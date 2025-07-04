"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Player } from "@/app/columns"
import { SeasonSelect } from "./seasonSelect"
import { ExpandedRow } from "./expandedRow"
import {
  ColumnDef,
  SortingState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  averagePoints?: { season: string; avgPoints: number }[]
  averageSG?: { season: string; avgScoutingGrade: number }[]
}

export function SortTable<TData extends Player, TValue>({
  columns,
  data,
  averagePoints,
  averageSG,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {id: "points", desc: false },
  ])

  const [yearFilter, setYearFilter] = React.useState<string>("2025")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const filteredData = React.useMemo(() => {
    if(yearFilter === "All") {
      return data
    }
    return data.filter((row) => row.season.toString() === yearFilter)
  }, [data, yearFilter])

  const filteredColumns = React.useMemo(() => {
    if(yearFilter === "All") {
      return columns
    }
    return columns.filter ((column) => column.id !== "season")
  }, [columns, yearFilter])

  //console.log("Filtered Data:", filteredData)

  React.useEffect(() => {
    setExpanded({})
  }, [yearFilter])

  const table = useReactTable({
    data: filteredData, 
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      sorting,
      expanded,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 m-2">
        <Input
          placeholder="Search players..."
          value={(table.getColumn("player_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("player_name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <SeasonSelect
          value={yearFilter}
          onValueChange={setYearFilter}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <ExpandedRow player={row.original} stats={data} averagePoints={averagePoints} averageSG={averageSG} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}