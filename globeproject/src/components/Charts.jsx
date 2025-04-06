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

  // Bar Chart: Dispatch & Delay
  const barChartData = {
    labels: dates,
    datasets: [
      ...names.map((name) => ({
        label: `${name} - Dispatch`,
        data: dates.map((date) => {
          const entry = filteredData.find((item) => item.date === date && item.name === name);
          return entry ? entry.dispatch : 0;
        }),
        backgroundColor: activeBar === `${name} - Dispatch` ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hidden: activeBar && activeBar !== `${name} - Dispatch`, // Hide other dispatch bars if one is active
      })),
      ...names.map((name) => ({
        label: `${name} - Delay`,
        data: dates.map((date) => {
          const entry = filteredData.find((item) => item.date === date && item.name === name);
          return entry ? entry.delays : 0;
        }),
        backgroundColor: activeBar === `${name} - Delay` ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hidden: activeBar && activeBar !== `${name} - Delay`, // Hide other delay bars if one is active
      })),
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
    <div className="my-4 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">📈 Line Chart: Completion</h2>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true, // Make the chart responsive
            plugins: {
              tooltip: {
                enabled: true, // Enable tooltip
                mode: 'nearest', // Show tooltip for nearest data point
                intersect: true, // Only show tooltip when hovering directly over a point
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0]?.dataset.label, // Show the name of the dataset in the tooltip title
                  label: (tooltipItem) => {
                    return `${tooltipItem.dataset.label}: Completion: ${tooltipItem.raw}`; // Display name and completion value
                  },
                },
                bodyFont: { size: 10 }, // Make the tooltip text small
                titleFont: { size: 10 }, // Make the tooltip title small
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
            maintainAspectRatio: true, // Make the chart responsive
            plugins: {
              tooltip: {
                enabled: true, // Enable tooltip
                mode: 'nearest', // Only show the nearest bar
                intersect: true, // Only show tooltip when hovering directly over a bar
                callbacks: {
                  title: () => '', // Remove the title (just show value and label)
                  label: (tooltipItem) => {
                    const dataset = tooltipItem.dataset.label.split(' - ');
                    return `${dataset[0]}: ${tooltipItem.raw}`; // Show only the label and value
                  },
                },
                bodyFont: { size: 10 }, // Make the tooltip text small
                titleFont: { size: 10 }, // Make the tooltip title small
              },
            },
            onClick: handleBarClick,
          }}
        />
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium">Filter by Date:</h3>
          <select
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={selectedDate || 'All'}
            onChange={handleDateChange}
          >
            <option value="All">All Dates</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium">Filter by Name:</h3>
          <select
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={selectedName || 'All'}
            onChange={handleNameChange}
          >
            <option value="All">All Names</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={restoreCharts}
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
      >
        Restore All Charts
      </button>
    </div>
  );
};

export default Charts;
