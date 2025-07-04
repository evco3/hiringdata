import { fetchCSVData } from "@/lib/csv-utils";
import { columns, Player } from "@/app/columns";
import { SortTable } from "@/components/sortTable";
import { joinTrades } from "@/lib/trade-utils";
import { calculateAveragePoints, calculateAverageScoutingGrades } from "@/lib/avg-utils";


export default async function Home() {
  const data = await fetchCSVData("/HiringDataSet.csv");
  const cleanData = joinTrades(data.rows);

  const averagePoints = calculateAveragePoints(cleanData);
  const averageScoutingGrades = calculateAverageScoutingGrades(cleanData);

  return (
    <div className="m-6">
      <h1 className="text-2xl font-bold mb-4">Hiring Data Set</h1>
      <SortTable columns={columns} data={cleanData} averagePoints={averagePoints} averageSG={averageScoutingGrades} />
    </div>
  );
}