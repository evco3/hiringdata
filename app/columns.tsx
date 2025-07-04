"use client"

import { ColumnDef, Column, SortingFn } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Player = {
  season: string
  player_name: string
  team: string
  gp: number
  toi: string
  shots: number
  goals: number
  assists: number
  points: number
  scouting_grade: string
}

interface HeaderProps {
  column: Column<Player>,
  title: string
}

const SortableHeader = ({ column, title }: HeaderProps) => {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

const parseTOI = (toi: string): number => {
  const [minutes, seconds] = toi.split(":").map(Number)
  return minutes * 60 + seconds
}

const sortTOI: SortingFn<Player> = (rowA, rowB) => {
  const toiA = parseTOI(rowA.original.toi); 
  const toiB = parseTOI(rowB.original.toi);
  return toiA - toiB;
};

export const columns: ColumnDef<Player>[] = [
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      return(
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-2" />
          ) : (
            <ChevronRight className="h-4 w-2" />
          )}
        </Button> 
      )
    }
  },
  {
    id: "season",
    accessorKey: "season",
    header: "Season",
  },
  {
    accessorKey: "player_name",
    header: ({ column }) => <SortableHeader column={column} title="Player Name" />,
  },
  {
    accessorKey: "team",
    header: ({ column }) => <SortableHeader column={column} title="Team" />,
  },
  {
    accessorKey: "gp",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="GP" />,
  },
  {
    accessorKey: "toi",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="TOI" />,
    sortingFn: sortTOI,
  },
  {
    accessorKey: "shots",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="Shots" />,
  },
  {
    accessorKey: "goals",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="Goals" />,
  },
  {
    accessorKey: "assists",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="Assists" />,
  },
  {
    accessorKey: "points",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="Points" />,
  },
  {
    accessorKey: "scouting_grade",
    invertSorting: true,
    header: ({ column }) => <SortableHeader column={column} title="Scouting Grade" />,
  },
]