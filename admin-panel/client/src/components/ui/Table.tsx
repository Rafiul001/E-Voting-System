import React, { useRef, useState } from "react";
import Flex from "./Flex";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

type Column<T> = {
  header: string;
  accessor: keyof T; // ensures accessor is a valid key
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onEdit?: (row: T, index: number) => void;
  onDelete?: (row: T, index: number) => void;
};

const Table = <T extends object>({
  columns,
  data,
  pageSize = 10,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const totalData = data.length;
  const pageCount = Math.ceil(totalData / pageSize);
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <div className="text-nowrap overflow-x-auto">
      <table
        ref={tableRef}
        className="table-auto text-left w-full rounded-md overflow-hidden mt-5"
      >
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="w-10 p-2 text-center">Sl No.</th>
            {columns.map((col, i) => (
              <th key={i} className="p-2 text-center">
                {col.header}
              </th>
            ))}
            <th className="w-[100px] text-center p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data
            .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
            .map((row, rowIndex) => {
              const globalIndex = (pageNumber - 1) * pageSize + rowIndex;
              return (
                <tr
                  key={globalIndex}
                  className="odd:bg-gray-100 even:bg-gray-200"
                >
                  <td className="p-2 text-center">{globalIndex + 1}</td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-2 text-center">
                      {col.render
                        ? col.render(
                            row[col.accessor as keyof T],
                            row,
                            globalIndex
                          )
                        : String(row[col.accessor as keyof T])}
                    </td>
                  ))}
                  <td className="text-center p-2">
                    <Flex className="gap-3 justify-center">
                      {onEdit && (
                        <div
                          onClick={() => onEdit(row, globalIndex)}
                          className="p-2 cursor-pointer bg-indigo-500 hover:bg-indigo-800 text-white rounded-3xl"
                        >
                          <CiEdit size={24} />
                        </div>
                      )}
                      {onDelete && (
                        <div
                          onClick={() => onDelete(row, globalIndex)}
                          className="p-2 cursor-pointer bg-rose-500 hover:bg-rose-800 text-white rounded-3xl"
                        >
                          <MdDelete size={24} />
                        </div>
                      )}
                    </Flex>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Pagination */}
      {pageCount > 1 && (
        <Flex className="justify-center gap-2 mt-4">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPageNumber(i + 1)}
              className={`px-3 py-1 rounded ${
                pageNumber === i + 1
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </Flex>
      )}
    </div>
  );
};

export default Table;
