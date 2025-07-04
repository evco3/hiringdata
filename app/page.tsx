import { fetchCSVData } from "@/lib/csv-utils";
import { columns, Player } from "@/app/columns";
import { SortTable } from "@/components/sortTable";
import { joinTrades } from "@/lib/trade-utils";


export default async function Home() {
  const data = await fetchCSVData("/HiringDataSet.csv");
  const cleanData = joinTrades(data.rows);

  const seasonMap = new Map<string, number>();
  cleanData.forEach((row) => {
    const season = row.season.toString();
    const points = row.points || 0;
    if (seasonMap.has(season)) {
      seasonMap.set(season, seasonMap.get(season)! + points);
    } else {
      seasonMap.set(season, points);
    }
  });

  const averagePoints = Array.from(seasonMap.entries()).map(([season, totalPoints]) => ({
    season,
    avgPoints: parseFloat((totalPoints / cleanData.filter(row => row.season.toString() === season).length).toFixed(2))
  }));

  console.log("Average Points per Season:", averagePoints);


  return (
    <div className="m-6">
      <h1 className="text-2xl font-bold mb-4">Hiring Data Set</h1>
      <SortTable columns={columns} data={cleanData} averagePoints={averagePoints} />
    </div>
  );
}
