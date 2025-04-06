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
  const [activeLine, setActiveLine] = useState(null); // Track the active line in line chart
  const [activeBar, setActiveBar] = useState(null);   // Track the active bar in bar chart
  const [selectedDate, setSelectedDate] = useState(null); // Track the selected date
  const [selectedName, setSelectedName] = useState(null); // Track the selected name

  // Unique dates and names (sorted)
  const dates = [...new Set(data.map((item) => item.date))].sort((a, b) => new Date(a) - new Date(b));
  const names = [...new Set(data.map((item) => item.name))];

  // Filter data by selected date and name
  const filteredData = data.filter((item) => {
    const dateMatch = !selectedDate || item.date === selectedDate;
    const nameMatch = !selectedName || item.name === selectedName;
    return dateMatch && nameMatch;
  });

  // Handle line click event to highlight the clicked line and hide others
  const handleLineClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const clickedLabel = elements[0].element.$context.dataset.label;
      setActiveLine((prevActiveLine) => (clickedLabel === prevActiveLine ? null : clickedLabel)); // Toggle active line
    } else {
      setActiveLine(null); // Reset if clicked outside the lines
    }
  };

  // Handle bar click event to highlight the clicked bar and hide others
  const handleBarClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const clickedLabel = elements[0].element.$context.dataset.label;
      setActiveBar((prevActiveBar) => (clickedLabel === prevActiveBar ? null : clickedLabel)); // Toggle active bar
    } else {
      setActiveBar(null); // Reset if clicked outside the bars
    }
  };

  // Line Chart: Completion
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
      hidden: activeLine && activeLine !== name, // Hide other lines if one is active
      pointRadius: 5, // Make the points more visible
      pointHoverRadius: 8, // Increase the point size when hovered
    })),
  };
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12, // make legend text smaller
          },
          padding: 20, // add spacing between legend and chart
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  // Define distinct and vivid colors
  const dispatchColor = 'rgba(54, 162, 235, 0.8)';
  const delayColor = 'rgba(255, 159, 64, 0.8)';

  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Dispatch',
        data: dates.map((date) =>
          filteredData.reduce((sum, item) => (item.date === date ? sum + item.dispatch : sum), 0)
        ),
        backgroundColor: dispatchColor,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Delay',
        data: dates.map((date) =>
          filteredData.reduce((sum, item) => (item.date === date ? sum + item.delays : sum), 0)
        ),
        backgroundColor: delayColor,
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Handle Date Change (Filter by selected date)
  const handleDateChange = (event) => {
    const date = event.target.value === 'All' ? null : event.target.value;
    setSelectedDate(date);
  };

  // Handle Name Change (Filter by selected name)
  const handleNameChange = (event) => {
    const name = event.target.value === 'All' ? null : event.target.value;
    setSelectedName(name);
  };

  // Restore all lines and bars
  const restoreCharts = () => {
    setActiveLine(null);
    setActiveBar(null);
    setSelectedDate(null); // Reset to show all data
    setSelectedName(null); // Reset to show all names
  };

  return (
    <div className="my-8 space-y-8">
  {/* Filter Section */}
  <div className="p-6 bg-[#1f2937] rounded-lg shadow-lg border border-gray-700">
    <div className="flex justify-between space-x-6">
      {/* Date Filter */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">Filter by Date:</h3>
        <select
          className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white transition duration-300 ease-in-out hover:border-indigo-300"
          value={selectedDate || 'All'}
          onChange={handleDateChange}
        >
          <option value="All" className="text-gray-700">All Dates</option>
          {dates.map((date) => (
            <option key={date} value={date} className="text-gray-700">
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Name Filter */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">Filter by Name:</h3>
        <select
          className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white transition duration-300 ease-in-out hover:border-indigo-300"
          value={selectedName || 'All'}
          onChange={handleNameChange}
        >
          <option value="All" className="text-gray-700">All Names</option>
          {names.map((name) => (
            <option key={name} value={name} className="text-gray-700">
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Restore All Button */}
      <div className="flex-1 flex items-end justify-end">
        <button
          onClick={restoreCharts}
          className="mt-6 p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Restore All Charts
        </button>
      </div>
    </div>
  </div>


      {/* Charts Section */}
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
                mode: 'nearest',
                intersect: true,
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0]?.dataset.label,
                  label: (tooltipItem) => {
                    return `${tooltipItem.dataset.label}: Completion: ${tooltipItem.raw}`;
                  },
                },
                bodyFont: { size: 10 },
                titleFont: { size: 10 },
              },
            },
            onClick: handleLineClick,
          }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📊 Bar Chart: Dispatch & Delay</h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: true,
                callbacks: {
                  title: () => '',
                  label: (tooltipItem) => {
                    const dataset = tooltipItem.dataset.label.split(' - ');
                    return `${dataset[0]}: ${tooltipItem.raw}`;
                  },
                },
                bodyFont: { size: 10 },
                titleFont: { size: 10 },
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
