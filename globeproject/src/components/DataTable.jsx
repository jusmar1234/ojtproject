// DataTable.jsx
import React from 'react';

const Table = ({ data, columns }) => {
  if (!data || data.length === 0) return <div>No data available to display.</div>;
  if (!columns || columns.length === 0) return <div>Table</div>;

  return (
    <div className="overflow-auto max-h-[400px] border rounded-lg mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="p-2 font-medium">{column.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b">
              {columns.map((column) => (
                <td key={column.accessor} className="p-2">{row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
