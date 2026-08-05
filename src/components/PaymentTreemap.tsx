import React from "react";
import Chart from "react-apexcharts";

interface PaymentData {
  payment_type: string;
  total_collected: number;
}

interface PaymentTreemapProps {
  data: PaymentData[];
  currencySymbol?: string;
}

const PaymentTreemap: React.FC<PaymentTreemapProps> = ({
  data,
  currencySymbol = "₹",
}) => {
  // Color gradients matching the project's InfoCard icon style
  const gradientColors = [
    { start: "#10b981", end: "#059669" }, // Emerald
    { start: "#8b5cf6", end: "#7c3aed" }, // Purple
    { start: "#3b82f6", end: "#2563eb" }, // Blue
    { start: "#f59e0b", end: "#d97706" }, // Amber
    { start: "#ec4899", end: "#db2777" }, // Pink
    { start: "#06b6d4", end: "#0891b2" }, // Cyan
    { start: "#f97316", end: "#ea580c" }, // Orange
    { start: "#6366f1", end: "#4f46e5" }, // Indigo
    { start: "#484848ff", end: "#393939ff" }, // black
  ];

  // Prepare data for treemap - take up to 8 items
  // Use square root scaling to balance visualization between large and small values
  const treemapData = data.map((item, index) => {
    // Use square root to compress the range and make small values more visible
    // Add a larger constant to ensure zero/small values are clearly visible
    const scaledValue = Math.sqrt(item.total_collected + 5000);

    return {
      x: item.payment_type,
      y: scaledValue,
      actualValue: item.total_collected, // Store actual value for label
      fillColor: gradientColors[index % gradientColors.length].start,
    };
  });

  const options: any = {
    chart: {
      type: "treemap",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        colors: ["#ffffff"],
      },
      formatter: function (text: string, op: any) {
        // Use actualValue if available, otherwise use the y value
        const value = op.value || 0;
        const actualValue =
          treemapData.find((item) => item.x === text)?.actualValue ?? value;
        return [text, `${currencySymbol}${actualValue.toLocaleString()}`];
      },
      offsetY: -4,
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        colorScale: {
          ranges: treemapData.map((item, index) => ({
            from: item.y,
            to: item.y,
            color: gradientColors[index % gradientColors.length].start,
          })),
        },
      },
    },
    tooltip: {
      enabled: false,
      theme: "light",
      style: {
        fontSize: "12px",
        fontWeight: 600,
        // fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: function (value: number, { dataPointIndex }: any) {
          // formatter: function (value: number, { seriesIndex, dataPointIndex, w }: any) {
          // Get the actual value from our treemapData
          const actualValue = treemapData[dataPointIndex]?.actualValue ?? value;
          return `${currencySymbol}${actualValue.toLocaleString()}`;
        },
        title: {
          formatter: (seriesName: string) => seriesName + ":",
        },
      },
    },
    theme: {
      mode: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    },
  };

  const series = [
    {
      data: treemapData,
    },
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="treemap" height={220} />
    </div>
  );
};

export default PaymentTreemap;
