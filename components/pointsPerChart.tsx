import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Player } from '@/app/columns'

interface PointsPerChartProps {
    playerData: Player[],
    averagePoints?: { season: string; avgPoints: number }[]
}

export function PointsPerChart({ playerData, averagePoints }: PointsPerChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 }; 

        svg.attr('width', width).attr('height', height);
        svg.selectAll('*').remove();

        const x = d3.scaleBand()
            .domain(playerData.map(d => d.season.toString()))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, 80])
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
            .text(`Points per Season`);

        svg.selectAll('.bar')
            .data(playerData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.season.toString()) || 0)
            .attr('y', d => y(d.points))
            .attr('width', x.bandwidth())
            .attr('height', d => y(0) - y(d.points))
            .attr('fill', '#69b3a2');

        const filteredAveragePoints = averagePoints?.filter(d => 
            playerData.some(player => player.season.toString() === d.season)
        ) || [];
        const line = d3.line<{ season: string; avgPoints: number }>()
            .x(d => (x(d.season) || 0) + x.bandwidth() / 2)
            .y(d => y(d.avgPoints));

        svg.append('path')
            .datum(filteredAveragePoints)
            .attr('fill', 'none')
            .attr('stroke', '#ff6347')
            .attr('stroke-width', 2)
            .attr('d', line);

        svg.selectAll('.average-point')
            .data(filteredAveragePoints)
            .enter()
            .append('circle')
            .attr('class', 'average-point')
            .attr('cx', d => (x(d.season) || 0) + x.bandwidth() / 2)
            .attr('cy', d => y(d.avgPoints))
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
            .text("Player's Points");

        legend.append('line')
            .attr('x1', 60)
            .attr('y1', 7)
            .attr('x2', 78)
            .attr('y2', 7)
            .attr('stroke', '#ff6347')
            .attr('stroke-width', 2);
        legend.append('text')
            .attr('x', 80)
            .attr('y', 10)
            .attr('font-size', '10px')
            .attr('fill', '#333')
            .text('League Average');
    }, [playerData]);
    return <svg ref={svgRef} />;
}