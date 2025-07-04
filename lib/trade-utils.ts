import { Player } from "@/app/columns";
import { parse } from "path";

function formatValues(existing: number, newValue: number): number {
  if (!existing) return newValue;
  if (!newValue) return existing;
  const val1 = Number(existing);
  const val2 = Number(newValue);

  if (!isNaN(val1) && !isNaN(val2)) {
    return val1 + val2;
  }
  return existing;
}

function formatTOI(existing: string, newValue: string): string {
  if (!existing) return newValue;
  if (!newValue) return existing;
  const val1 = existing.split(":");
  const val1Min = (parseInt(val1[0]) || 0) * 60;
  const val1Sec = parseInt(val1[1]) || 0;

  const val2 = newValue.split(":");
  const val2Min = (parseInt(val2[0]) || 0) * 60;
  const val2Sec = parseInt(val2[1]) || 0;

  const total = val1Min + val1Sec + val2Min + val2Sec;

  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds}`;
}

export function joinTrades(players: Player[]): Player[] {
  const playerMap = new Map<string, Player>();
  for (const player of players) {
    const key = `${player.player_name}-${player.season}`;
    if (playerMap.has(key)) {
      const existing = playerMap.get(key)!;
      existing.team = `${existing.team}, ${player.team}`;
      existing.gp = formatValues(existing.gp, player.gp);
      existing.toi = formatTOI(existing.toi, player.toi);
      existing.shots = formatValues(existing.shots, player.shots);
      existing.goals = formatValues(existing.goals, player.goals);
      existing.assists = formatValues(existing.assists, player.assists);
      existing.points = formatValues(existing.points, player.points);
      existing.scouting_grade = `${existing.scouting_grade}, ${player.scouting_grade}`;
    } else {
      playerMap.set(key, { ...player });
    }
  }
  return Array.from(playerMap.values()).sort((a, b) => parseInt(a.season) - parseInt(b.season));
}