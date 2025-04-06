import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Charts from "@/components/Charts";
import { generateSuggestions } from '@/components/Suggestions'; // Optional: for suggestion logic
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

  // Function to handle cleaned data from FileUpload
  const handleDataCleaned = (cleanedData) => {
    setData(cleanedData);
  };

  // Generate suggestions based on the cleaned data
  const suggestions = generateSuggestions(data);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">XLSX Data Analysis</h1>
      <FileUpload onDataCleaned={handleDataCleaned} />
       
        {data.length > 0 && (
        <Table data={data} columns={columns} />
      )}
      {data.length > 0 && <Charts data={data} />}
      
      <div className="mt-6">
        <h3 className="text-2xl font-medium">Suggestions:</h3>
        <ul className="list-disc ml-6">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
