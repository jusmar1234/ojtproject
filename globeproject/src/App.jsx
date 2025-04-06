import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Charts from "@/components/Charts";
import { generateSuggestions } from '@/components/Suggestions';
import Table from '@/components/DataTable';

const App = () => {
  const [data, setData] = useState([]);
  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Dispatch', accessor: 'dispatch' },
    { Header: 'Delays', accessor: 'delays' },
    { Header: 'Completion', accessor: 'completion' },
  ];

  const handleDataCleaned = (cleanedData) => {
    setData(cleanedData);
  };

  const suggestions = generateSuggestions(data);

  return (
    <div className="min-h-screen bg-[#1f2937] font-sans text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="mb-8 bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-md tracking-wide">
            📊 XLSX Data Analysis Dashboard
          </h1>
          <p className="text-center text-gray-300 mt-2 text-sm">
            Upload, analyze, and visualize your technician performance data
          </p>
        </header>

        {/* File Upload Section */}
        <div className="bg-[#111827] shadow-xl rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Upload Your XLSX File</h2>
          <FileUpload onDataCleaned={handleDataCleaned} />
        </div>

        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table Section */}
            <div className="bg-[#111827] shadow-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">📋 Data Table</h3>
              <Table data={data} columns={columns} />
            </div>

            {/* Charts Section */}
            <div className="bg-[#111827] shadow-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-white">📈 Data Insights</h3>
              <Charts data={data} />
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {data.length > 0 && (
          <div className="bg-[#111827] shadow-xl rounded-xl p-6 mt-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">📌 Suggestions</h3>
            <ul className="list-disc ml-6 text-sm text-gray-300">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
