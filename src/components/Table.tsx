import React from "react";
import type { TableProps } from "../types";


const Table: React.FC<TableProps> = ({ 
  title, 
  columns, 
  data, 
  keyField = 'id',
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={row[keyField] || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
