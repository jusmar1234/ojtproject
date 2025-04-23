import React, { useState } from 'react';
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
  const [activeLine, setActiveLine] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [focusedBarDate, setFocusedBarDate] = useState(null); // NEW STATE

  const dates = [...new Set(data.map((item) => item.date))].sort((a, b) => new Date(a) - new Date(b));
  const names = [...new Set(data.map((item) => item.name))];

  const filteredData = data.filter((item) => {
    const dateMatch = !selectedDate || item.date === selectedDate;
    const nameMatch = !selectedName || item.name === selectedName;
    return dateMatch && nameMatch;
  });

  const handleLineClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const clickedLabel = elements[0].element.$context.dataset.label;
      setActiveLine((prev) => (clickedLabel === prev ? null : clickedLabel));
    } else {
      setActiveLine(null);
    }
  };

  const handleBarClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index;
      const clickedDate = focusedBarDate === dates[index] ? null : dates[index];
      setFocusedBarDate(clickedDate);
    } else {
      setFocusedBarDate(null);
    }
  };

  const dispatchColor = 'rgba(54, 162, 235, 0.8)';
  const delayColor = 'rgba(255, 159, 64, 0.8)';
const barChartData = focusedBarDate
  ? (() => {
      const filteredNames = names.filter((name) =>
        data.some((item) => item.name === name && item.date === focusedBarDate && (item.dispatch || item.delays))
      );

      return {
        labels: filteredNames,
        datasets: [
          {
            label: 'Dispatch',
            data: filteredNames.map((name) => {
              const entry = data.find((item) => item.name === name && item.date === focusedBarDate);
              return entry ? entry.dispatch : 0;
            }),
            backgroundColor: dispatchColor,
          },
          {
            label: 'Delay',
            data: filteredNames.map((name) => {
              const entry = data.find((item) => item.name === name && item.date === focusedBarDate);
              return entry ? entry.delays : 0;
            }),
            backgroundColor: delayColor,
          },
        ],
      };
    })()
  : {
      labels: dates,
      datasets: [
        {
          label: 'Dispatch',
          data: dates.map((date) =>
            filteredData.reduce((sum, item) => (item.date === date ? sum + item.dispatch : sum), 0)
          ),
          backgroundColor: dispatchColor,
        },
        {
          label: 'Delay',
          data: dates.map((date) =>
            filteredData.reduce((sum, item) => (item.date === date ? sum + item.delays : sum), 0)
          ),
          backgroundColor: delayColor,
        },
      ],
    };


  const lineChartData = {
    labels: dates,
    datasets: names.map((name) => ({
      label: name,
      data: dates.map((date) => {
        const entry = filteredData.find((item) => item.date === date && item.name === name);
        return entry ? entry.completion : 0;
      }),
      borderColor: activeLine === name ? 'red' : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
      tension: 0.1,
      hidden: activeLine && activeLine !== name,
      pointRadius: 5,
      pointHoverRadius: 8,
    })),
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value === 'All' ? null : value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setSelectedName(value === 'All' ? null : value);
  };

  const restoreCharts = () => {
    setActiveLine(null);
    setSelectedDate(null);
    setSelectedName(null);
    setFocusedBarDate(null);
  };

  return (
    <div className="my-8 space-y-8">
      {/* Filters */}
      <div className="p-6 bg-[#1f2937] rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between space-x-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Filter by Date:</h3>
            <select
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
              value={selectedDate || 'All'}
              onChange={handleDateChange}
            >
              <option value="All" className="text-gray-700">All Dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Filter by Name:</h3>
            <select
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
              value={selectedName || 'All'}
              onChange={handleNameChange}
            >
              <option value="All" className="text-gray-700">All Names</option>
              {names.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex items-end justify-end">
            <button
              onClick={restoreCharts}
              className="mt-6 p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500"
            >
              Restore All Charts
            </button>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📈 Line Chart: Completion</h2>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                enabled: true,
                callbacks: {
                  title: (items) => items[0]?.dataset.label,
                  label: (item) => `${item.dataset.label}: ${item.raw}`,
                },
              },
            },
            onClick: handleLineClick,
          }}
        />
      </div>

      {/* Bar Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          📊 Bar Chart: {focusedBarDate ? `Details on ${focusedBarDate}` : 'Dispatch & Delay'}
        </h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (item) => `${item.dataset.label}: ${item.raw}`,
                },
              },
            },
            onClick: handleBarClick,
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
