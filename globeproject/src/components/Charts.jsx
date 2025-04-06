// Charts.jsx

import React, { useState, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Charts = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data); // To store filtered data
  const [highlighted, setHighlighted] = useState(null); // To store highlighted datasets (line/bar)

  // Unique dates (sorted)
  const dates = [...new Set(data.map((item) => item.date))].sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const names = [...new Set(data.map((item) => item.name))];

  // Handle chart click event
  const handleChartClick = useCallback((event, chartElement) => {
    if (!chartElement.length) return;
    const datasetIndex = chartElement[0].datasetIndex;
    const label = chartElement[0].element.$context.raw.label;

    // Highlight clicked dataset
    setHighlighted((prevState) =>
      prevState === datasetIndex ? null : datasetIndex
    );
  }, []);

  // Line Chart: Completion
  const lineChartData = {
    labels: dates,
    datasets: names.map((name, idx) => ({
      label: name,
      data: dates.map((date) => {
        const entry = data.find((item) => item.date === date && item.name === name);
        return entry ? entry.completion : 0;
      }),
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
      tension: 0.1,
      hidden: highlighted !== null && highlighted !== idx, // Hide unselected lines
    })),
  };

  // Bar Chart: Dispatch & Delay
  const barChartData = {
    labels: dates,
    datasets: [
      ...names.map((name, idx) => ({
        label: `${name} - Dispatch`,
        data: dates.map((date) => {
          const entry = data.find((item) => item.date === date && item.name === name);
          return entry ? entry.dispatch : 0;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hidden: highlighted !== null && highlighted !== idx, // Hide unselected bars
      })),
      ...names.map((name, idx) => ({
        label: `${name} - Delay`,
        data: dates.map((date) => {
          const entry = data.find((item) => item.date === date && item.name === name);
          return entry ? entry.delays : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hidden: highlighted !== null && highlighted !== idx, // Hide unselected bars
      })),
    ],
  };

  // Filter by Date
  const filterByDate = (date) => {
    const filtered = data.filter((item) => item.date === date);
    setFilteredData(filtered);
  };

  // Filter by Name
  const filterByName = (name) => {
    const filtered = data.filter((item) => item.name === name);
    setFilteredData(filtered);
  };

  // Restore original data
  const restoreChanges = () => {
    setFilteredData(data);
    setHighlighted(null); // Clear highlighted selection
  };

  return (
    <div className="my-4 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">📈 Line Chart: Completion</h2>
        <Line data={lineChartData} onClick={handleChartClick} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📊 Bar Chart: Dispatch & Delay</h2>
        <Bar data={barChartData} onClick={handleChartClick} />
      </div>

      {/* Filters */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Filter Data:</h3>
        <div className="flex space-x-4">
          <select onChange={(e) => filterByDate(e.target.value)} className="border rounded p-2">
            <option value="">Filter by Date</option>
            {dates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
            ))}
          </select>

          <select onChange={(e) => filterByName(e.target.value)} className="border rounded p-2">
            <option value="">Filter by Name</option>
            {names.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>

          <button
            onClick={restoreChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Restore Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Charts;
