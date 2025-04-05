import React, { useState } from "react";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/DataTable";
import ChartView from "@/components/Charts";
import Suggestions from "@/components/Suggestions";

const Home = () => {
  const [data, setData] = useState([]);

  // Debugging: Log the data to check its structure
  console.log("Current Data:", data);

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">📊 Survey / Task Dashboard</h1>
      <FileUploader onDataParsed={setData} />
      <DataTable data={data} />
      {data.length > 0 ? (
        <>
          <ChartView data={data} />
          <Suggestions data={data} />
        </>
      ) : (
        <p className="text-gray-500">No data uploaded yet.</p>
      )}
    </div>
  );
};

export default Home;
