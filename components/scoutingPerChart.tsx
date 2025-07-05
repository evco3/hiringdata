import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Player } from '@/app/columns'

interface ScoutingPerChartProps {
    playerData: Player[]
    compareWith?: Player[] | null
    averageSG?: { season: string; avgScoutingGrade: number }[]
}

export function ScoutingPerChart({ playerData, compareWith, averageSG }: ScoutingPerChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    //removes mutliple grades for players traded and takes highest grade each season
    const processGrades = playerData.map(player => {
            if (player.scouting_grade && player.scouting_grade.includes(',')) {
                const grades = player.scouting_grade.split(',').map(Number);
                return { ...player, scouting_grade: Math.max(...grades) }; 
            }
            return { ...player, scouting_grade: parseFloat(player.scouting_grade) || 0 };
        });
    
    const processCompareGrades = (compareWith || []).map(player => {
        if (player.scouting_grade && player.scouting_grade.includes(',')) {
            const grades = player.scouting_grade.split(',').map(Number);
            return { ...player, scouting_grade: Math.max(...grades) };
        }
        return { ...player, scouting_grade: parseFloat(player.scouting_grade) || 0 };
    });

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 50, left: 40 };

        svg.attr('width', width).attr('height', height);
        svg.selectAll('*').remove(); 
        const x = d3.scaleBand()
            .domain(processGrades.map(d => d.season.toString()))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, 10])
            .nice()
            .range([height - margin.bottom, margin.top]);   
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .selectAll('text')
            .attr('font-size', '10px')
            .attr('fill', '#333');
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis)
            .selectAll('text')
            .attr('font-size', '10px')
            .attr('fill', '#333');  
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#333')
            .text(`Scout Grade per Season`);   

        const barWidth = compareWith && compareWith.length > 0 ? x.bandwidth() / 2.4 : x.bandwidth();

        svg.selectAll('.bar')
            .data(processGrades)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.season.toString()) || 0)
            .attr('y', d => y(d.scouting_grade))
            .attr('width', barWidth)
            .attr('height', d => y(0) - y(d.scouting_grade))
            .attr('fill', '#69b3a2');

        svg.selectAll('.compare-bar')
            .data(processCompareGrades)
            .enter()
            .append('rect')
            .attr('class', 'compare-bar')
            .attr('x', d => (x(d.season.toString()) || 0) + barWidth + 1)
            .attr('y', d => y(d.scouting_grade))
            .attr('width', barWidth)
            .attr('height', d => y(0) - y(d.scouting_grade))
            .attr('fill', '#94a3b8');

        const filteredAverageSG = averageSG?.filter(d =>
            processGrades.some(player => player.season.toString() === d.season)
        ) || [];

        const line = d3.line<{ season: string; avgScoutingGrade: number }>()
                    .x(d => (x(d.season) || 0) + x.bandwidth() / 2)
                    .y(d => y(d.avgScoutingGrade));

        svg.append('path')
                    .datum(filteredAverageSG)
                    .attr('fill', 'none')
                    .attr('stroke', '#ff6347')
                    .attr('stroke-width', 2)
                    .attr('d', line);
        
        svg.selectAll('.average-point')
                    .data(filteredAverageSG)
                    .enter()
                    .append('circle')
                    .attr('class', 'average-point')
                    .attr('cx', d => (x(d.season) || 0) + x.bandwidth() / 2)
                    .attr('cy', d => y(d.avgScoutingGrade))
                    .attr('r', 3)
                    .attr('fill', '#ff6347');
        
        const legend = svg.append('g')
            .attr('transform', `translate(${width / 2 - 50}, ${height - margin.bottom + 20})`);

        legend.append('rect')
            .attr('x', -40)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#69b3a2');
        legend.append('text')
            .attr('x', -25)
            .attr('y', 10)
            .attr('font-size', '10px')
            .attr('fill', '#333')
            .text(processGrades[0].player_name);

        legend.append('line')
            .attr('x1', 70)
            .attr('y1', 7)
            .attr('x2', 88)
            .attr('y2', 7)
            .attr('stroke', '#ff6347')
            .attr('stroke-width', 2);
        legend.append('text')
            .attr('x', 90)
            .attr('y', 10)
            .attr('font-size', '10px')
            .attr('fill', '#333')
            .text('League Average');

        if (processCompareGrades.length > 0) {
            legend.append('rect')
                .attr('x', 2)
                .attr('y', 16)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', '#94a3b8');
            legend.append('text')
                .attr('x', 18)
                .attr('y', 26)
                .attr('font-size', '10px')
                .attr('fill', '#333')
                .text(processCompareGrades[0].player_name);
        }
    }, [playerData, compareWith]);
    return <svg ref={svgRef} />;
}