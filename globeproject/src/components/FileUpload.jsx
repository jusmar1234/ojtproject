import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { cleanData } from './CleanData';

const FileUpload = ({ onDataCleaned }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
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
      onDataCleaned(cleaned);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 bg-[#111827] rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">📁 Upload Your Excel File</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full md:w-auto text-sm text-gray-300 
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0 file:text-sm file:font-semibold
            file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700"
        />
        <Button onClick={handleFileUpload} className="flex items-center space-x-2">
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </Button>
      </div>

      {fileName && (
        <p className="text-sm text-green-400 mt-3">
          ✅ <strong>{fileName}</strong> ready for upload
        </p>
      )}
    </div>
  );
};

export default FileUpload;
