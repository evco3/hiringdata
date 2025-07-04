import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Player } from '@/app/columns'

interface ScoutingPerChartProps {
    playerData: Player[]
}

export function ScoutingPerChart({ playerData }: ScoutingPerChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const processGrades = playerData.map(player => {
            if (player.scouting_grade && player.scouting_grade.includes(',')) {
                const grades = player.scouting_grade.split(',').map(Number);
                return { ...player, scouting_grade: Math.max(...grades) }; // Take the highest grade
            }
            return { ...player, scouting_grade: parseFloat(player.scouting_grade) || 0 };
        });

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        svg.attr('width', width).attr('height', height);
        svg.selectAll('*').remove(); 
        const x = d3.scaleBand()
            .domain(processGrades.map(d => d.season.toString()))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        const y = d3.scaleLinear()
            .domain([0, d3.max(processGrades, d => d.scouting_grade) || 0]) // Fallback to 0 if scouting_grade is missing
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
            .text(`Scout Grade by Season`);   

        svg.selectAll('.bar')
            .data(processGrades)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.season.toString()) || 0)
            .attr('y', d => y(d.scouting_grade))
            .attr('width', x.bandwidth())
            .attr('height', d => y(0) - y(d.scouting_grade))
            .attr('fill', '#69b3a2');

    }, [playerData]);

    return <svg ref={svgRef} />;
}