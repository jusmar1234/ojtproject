import React from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Charts = ({ data }) => {
  const dates = [...new Set(data.map((item) => item.date))]; // Unique dates
  const names = [...new Set(data.map((item) => item.name))]; // Unique names

  // Line Chart Data
  const lineChartData = {
    labels: dates,
    datasets: names.map((name) => ({
      label: name,
      data: dates.map((date) => {
        const filteredData = data.filter((item) => item.date === date && item.name === name);
        return filteredData.length > 0 ? filteredData[0].completion : 0; // Completion value
      }),
      fill: false,
      borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
      tension: 0.1,
    })),
  };

  // Bar Chart Data
  const barChartData = {
    labels: dates,
    datasets: names.map((name) => ({
      label: `${name} - Dispatch`,
      data: dates.map((date) => {
        const filteredData = data.filter((item) => item.date === date && item.name === name);
        return filteredData.length > 0 ? filteredData[0].dispatch : 0; // Dispatch value
      }),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    })).concat(
      names.map((name) => ({
        label: `${name} - Delay`,
        data: dates.map((date) => {
          const filteredData = data.filter((item) => item.date === date && item.name === name);
          return filteredData.length > 0 ? filteredData[0].delay : 0; // Delay value
        }),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }))
    ),
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold my-4">Line Chart: Date vs Name vs Completion</h2>
      <Line data={lineChartData} />

      <h2 className="text-xl font-semibold my-4">Bar Graph: Date vs Name vs Dispatch & Delay</h2>
      <Bar data={barChartData} />
    </div>
  );
};

export default Charts;
