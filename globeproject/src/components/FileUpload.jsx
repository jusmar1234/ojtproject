// FileUpload.jsx

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import DataTable from './DataTable'; // Use your own working DataTable
import { cleanData } from './CleanData';

const FileUpload = ({ onDataCleaned }) => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleFileUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet);
      const cleaned = cleanData(rawData);
      setTableData(cleaned);
      onDataCleaned(cleaned);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-4">
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <Button onClick={handleFileUpload} className="mt-2">Upload File</Button>

      {tableData.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Uploaded Data Table</h2>
          <DataTable data={tableData} />
        </>
      )}
    </div>
  );
};

export default FileUpload;
