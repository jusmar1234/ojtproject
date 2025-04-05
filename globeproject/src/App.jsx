import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Charts from "@/components/Charts";


const App = () => {
  const [data, setData] = useState([]);

  const handleDataCleaned = (cleanedData) => {
    setData(cleanedData);
  };

  const generateSuggestions = (data) => {
    if (!data || data.length === 0) return [];

    const avgCompletion = data.reduce((acc, item) => acc + item.completion, 0) / data.length;
    const avgDispatch = data.reduce((acc, item) => acc + item.dispatch, 0) / data.length;

    let suggestions = [];
    if (avgCompletion < 70) {
      suggestions.push('Completion rate is low. Focus on improving performance.');
    }
    if (avgDispatch < 50) {
      suggestions.push('Dispatch rate is lower than expected. Consider increasing resources.');
    }

    return suggestions;
  };

  const suggestions = generateSuggestions(data);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">XLSX Data Analysis</h1>
      <FileUpload onDataCleaned={handleDataCleaned} />
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
