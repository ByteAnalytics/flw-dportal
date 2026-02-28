"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const shadowPlugin = {
  id: "shadowPlugin",
  beforeDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx;
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
  },
  afterDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx;
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  },
};

const perfectCirclePlugin = {
  id: "perfectCirclePlugin",
  afterDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    const total = chart.data.datasets[0].data.reduce(
      (a: number, b: number) => a + b,
      0,
    );

    if (total === 0) return;

    meta.data.forEach((arc: any, index: number) => {
      const value = chart.data.datasets[0].data[index];
      const percentage = Math.round((value / total) * 100);

      if (!percentage || isNaN(percentage)) return;

      const angle = (arc.startAngle + arc.endAngle) / 2;
      const radius = arc.outerRadius;
      const offset = -10;

      const x = arc.x + Math.cos(angle) * (radius + offset);
      const y = arc.y + Math.sin(angle) * (radius + offset);

      const circleSize = 70;
      const circleRadius = circleSize / 2;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#000";
      ctx.font = "normal 15px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${percentage}%`, x, y);

      ctx.restore();
    });
  },
};

ChartJS.register(shadowPlugin, perfectCirclePlugin);

interface DoughnutChartProps {
  data: number[];
  labels: string[];
  colors: string[];
  cutout?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  labels,
  colors,
  cutout = "75%",
}) => {
  const hasData = data.some((value) => value > 0);

  const chartData = {
    labels: hasData ? labels : ["No Data"],
    datasets: [
      {
        data: hasData ? data : [1],
        backgroundColor: hasData ? colors : ["#E5E7EB"],
        borderWidth: 0,
        borderColor: hasData ? "white" : "#D1D5DB",
        cutout: cutout,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: 40,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: hasData,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="relative w-full h-full">
      <Doughnut data={chartData} options={options} />
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-sm font-medium">No Data</span>
        </div>
      )}
    </div>
  );
};
