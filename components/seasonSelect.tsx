"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SeasonSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function SeasonSelect({ value, onValueChange }: SeasonSelectProps) {
  const seasons = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019"]

  return (
    <div className="flex items-center gap-2">
      <span className="text-md font-medium ml-10">Season:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season} value={season}>
              {season}
            </SelectItem>
            
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}