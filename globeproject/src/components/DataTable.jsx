import React from 'react';

const Table = ({ data, columns }) => {
  if (!data || data.length === 0) return <div className="text-gray-400">No data available to display.</div>;
  if (!columns || columns.length === 0) return <div className="text-gray-400">Table</div>;

  return (
    <div className="overflow-auto max-h-[880px] border border-gray-700 rounded-lg mt-4 custom-scrollbar">
  <table className="min-w-full text-sm text-left text-gray-200">
    <thead className="bg-gray-800 sticky top-0 z-10">
      <tr>
        {columns.map((column) => (
          <th key={column.accessor} className="p-3 font-semibold text-white border-b border-gray-700 whitespace-nowrap">
            {column.Header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-[#1f2937]">
      {data.map((row, idx) => (
        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
          {columns.map((column) => (
            <td key={column.accessor} className="p-3 whitespace-nowrap">
              {row[column.accessor]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default Table;
