import { 
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem 
 } from "@/components/ui/select";
import * as React from "react";
import { Player } from "@/app/columns";

interface PlayerSelectProps {
  players: Player[];
  selectedPlayer: Player | null;
  onChange: (player: Player | null) => void;
}

export function PlayerSelect({ players, selectedPlayer, onChange }: PlayerSelectProps) {

    const options = Array.from(new Set(players.map(player => player.player_name)));

    const handleSelectChange = (value: string) => {
      if (value === "None") {
        onChange(null);
        return;
      }
      const player = players.find((p) => p.player_name === value);
      onChange(player || null);
    };

  return (
    <Select
      value={selectedPlayer ? selectedPlayer.player_name : ""}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a player" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="None">None</SelectItem>
        {options.map((player) => (
          <SelectItem key={player} value={player}>
            {player}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

