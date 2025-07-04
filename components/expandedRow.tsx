import { Player } from "@/app/columns"
import { PointsPerChart } from "./pointsPerChart"
import { ScoutingPerChart } from "./scoutingPerChart"

interface ExpandedRowProps {
  player: Player,
  stats: Player[],
  averagePoints?: { season: string; avgPoints: number }[]
  averageSG?: { season: string; avgScoutingGrade: number }[]
}

export function ExpandedRow({ player, stats, averagePoints, averageSG }: ExpandedRowProps) {
  const careerStats = stats.filter(stat => stat.player_name === player.player_name);


  return (
    <div className="p-4 bg-gray-50 border-l-4 border-blue-200">
      <div className="flex gap-4 items-center justify-around">
        <div>
            <PointsPerChart playerData={careerStats} averagePoints={averagePoints} />
        </div>
        <div>
            <ScoutingPerChart playerData={careerStats} averageSG={averageSG} />
        </div>
      </div>
    </div>
  )
}