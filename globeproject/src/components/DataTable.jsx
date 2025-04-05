import React from "react";

const DataTable = ({ data }) => {
  if (!data.length) return <div>No data uploaded</div>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-auto max-h-[400px] border rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {headers.map((header) => (
              <th key={header} className="p-2 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b">
              {headers.map((header) => (
                <td key={header} className="p-2">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
