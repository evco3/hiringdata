interface Player {
  season: string | number;
  points?: number;
  scouting_grade?: string;
}

export function calculateAveragePoints(data: Player[]): { season: string; avgPoints: number }[] {
  const seasonMap = new Map<string, number>();

  data.forEach((row) => {
    const season = row.season.toString();
    const points = row.points || 0;
    if (seasonMap.has(season)) {
      seasonMap.set(season, seasonMap.get(season)! + points);
    } else {
      seasonMap.set(season, points);
    }
  });

  return Array.from(seasonMap.entries()).map(([season, totalPoints]) => ({
    season,
    avgPoints: parseFloat((totalPoints / data.filter(row => row.season.toString() === season).length).toFixed(2)),
  }));
}

export function calculateAverageScoutingGrades(data: Player[]): { season: string; avgScoutingGrade: number }[] {
  const scoutingGradeMap = new Map<string, number>();

  data.forEach((row) => {
    const season = row.season.toString();
    const scoutingGrade = parseFloat(row.scouting_grade || "0");
    if (scoutingGradeMap.has(season)) {
      scoutingGradeMap.set(season, scoutingGradeMap.get(season)! + scoutingGrade);
    } else {
      scoutingGradeMap.set(season, scoutingGrade);
    }
  });

  return Array.from(scoutingGradeMap.entries()).map(([season, totalGrades]) => ({
    season,
    avgScoutingGrade: parseFloat((totalGrades / data.filter(row => row.season.toString() === season).length).toFixed(2)),
  }));
}