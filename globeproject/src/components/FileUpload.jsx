import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";


const FileUpload = ({ onDataCleaned }) => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      const cleanedData = cleanData(data);
      setTableData(cleanedData);
      onDataCleaned(cleanedData); // Send cleaned data to parent component
    };
    reader.readAsBinaryString(file);
  };

  const cleanData = (data) => {
    const aggregatedData = {};

    data.forEach((row) => {
      const formattedDate = formatDate(row['date']);
      const key = `${formattedDate}-${row['name']}`;

      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          date: formattedDate,
          name: row['name'],
          dispatch: 0,
          delay: 0,
          completion: 0,
        };
      }

      aggregatedData[key].dispatch += row['dispatch'];
      aggregatedData[key].delay += row['delay'];
      aggregatedData[key].completion += row['completion'];
    });

    return Object.values(aggregatedData);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // Format to DD M YYYY (e.g., 03 2 2025)
  };

  return (
    <div className="my-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button onClick={handleFileUpload}>Upload File</Button>

      {tableData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold my-4">Uploaded Data Table</h2>
          <Table data={tableData} columns={tableColumns} className="my-4" />
        </div>
      )}
    </div>
  );
};

const tableColumns = [
  { Header: 'Date', accessor: 'date' },
  { Header: 'Name', accessor: 'name' },
  { Header: 'Dispatch', accessor: 'dispatch' },
  { Header: 'Delay', accessor: 'delay' },
  { Header: 'Completion', accessor: 'completion' },
];

export default FileUpload;
