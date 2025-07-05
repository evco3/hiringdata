import { Player } from "@/app/columns"
import { PointsPerChart } from "./pointsPerChart"
import { ScoutingPerChart } from "./scoutingPerChart"
import { PlayerSelect } from "./playerSelect";
import * as React from "react"

interface ExpandedRowProps {
  player: Player,
  stats: Player[],
  averagePoints?: { season: string; avgPoints: number }[]
  averageSG?: { season: string; avgScoutingGrade: number }[]
}

export function ExpandedRow({ player, stats, averagePoints, averageSG }: ExpandedRowProps) {
  const careerStats = stats.filter(stat => stat.player_name === player.player_name);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const selectedStats = selectedPlayer? stats.filter(stat => stat.player_name === selectedPlayer.player_name) : null;


  return (
    <div className="p-4 bg-gray-50 border-l-4 border-blue-200">
      <div className="flex gap-4 items-center justify-around mx-20">
        <div>
            <PointsPerChart playerData={careerStats} compareWith={selectedStats} averagePoints={averagePoints}  />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Compare With:</h2>
          <PlayerSelect 
            players={stats} 
            selectedPlayer={selectedPlayer}
            onChange={setSelectedPlayer}
          />  
        </div>
        <div>
            <ScoutingPerChart playerData={careerStats} compareWith={selectedStats} averageSG={averageSG} />
        </div>
      </div>
    </div>
  )
}