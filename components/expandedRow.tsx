import { Player } from "@/app/columns"
import { PointsPerChart } from "./pointsPerChart"
import { ScoutingPerChart } from "./scoutingPerChart"

interface ExpandedRowProps {
  player: Player
}

export function ExpandedRow({ player }: ExpandedRowProps) {
  return (
    <div className="p-4 bg-gray-50 border-l-4 border-blue-200">
      <div className="flex gap-4">
        <div>
            <PointsPerChart player={player} />
        </div>
        <div>
            <ScoutingPerChart player={player} />
        </div>
        <div>
          <span className="font-semibold text-sm text-gray-600">Goals:</span>
          <p className="text-sm">{player.goals}</p>
        </div>
        <div>
          <span className="font-semibold text-sm text-gray-600">Assists:</span>
          <p className="text-sm">{player.assists}</p>
        </div>
        <div>
          <span className="font-semibold text-sm text-gray-600">Points:</span>
          <p className="text-sm">{player.points}</p>
        </div>
        <div>
          <span className="font-semibold text-sm text-gray-600">Scouting Grade:</span>
          <p className="text-sm">{player.scouting_grade}</p>
        </div>
      </div>
    </div>
  )
}