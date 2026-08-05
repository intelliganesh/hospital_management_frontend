import React from "react";
import View from "../view";
import Text from "../text";
import { ArchiveX } from "lucide-react";
import BouncingLoader from "../BouncingLoader";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "./table";

interface DynamicTableProps {
  tableData: any[];
  tableHeaders: string[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  renderCell?: (
    rowIndex: number,
    colIndex: number,
    value: any
  ) => React.ReactNode;
  getRowKey?: (row: any, rowIndex: number) => string | number;
  onRowClick?: (row: any, rowIndex: number) => void;
  header?: {
    search?: React.ReactNode;
    sort?: React.ReactNode;
    filter?: React.ReactNode;
    action?: React.ReactNode;
  };
  footer?: {
    pagination?: React.ReactNode;
  };
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  tableData,
  tableHeaders,
  isLoading = false,
  emptyMessage = "No Data Found!",
  emptyIcon = (
    <ArchiveX className="w-10 h-10 mx-auto mb-2 bg-primary-100 p-2 rounded-full text-primary" />
  ),
  renderCell,
  getRowKey,
  onRowClick,
  header,
  footer,
}) => {
  return (
    <View>
      {/* Header controls */}
      {/* {(header?.search || header?.sort || header?.filter || header?.action) && ( */}
      {/* <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none"> */}
      <View className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <View className="flex gap-2 w-full  justify-between items-center ">
          {header?.search}
          <View className="flex gap-3">
            {header?.sort}
            {header?.filter}
            {header?.action && (
              <View className="shrink-0">{header.action}</View>
            )}
          </View>
        </View>
      </View>
      {/* )} */}

      {/* Table */}
      <View className="overflow-x-auto">
        <Table className="w-full min-w-max">
          <TableHeader>
            {/* <TableRow className="bg-neutral-100 font-bold border-b border-neutral-200 dark:bg-background dark:border-none"> */}
            <TableRow className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  // className={`py-3 px-4 text-sm text-text-light dark:text-gray-400"}`}
                  className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left"
                  // style={{ fontWeight: "bold" }}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  className="py-4 text-center relative"
                >
                  <View className="w-full z-50">
                    <BouncingLoader notFixed isLoading={isLoading} />
                  </View>
                </TableCell>
              </TableRow>
            ) : !tableData || tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaders.length}
                  // className="py-6 px-4 text-center text-text-light"
                   className="py-12 px-6 text-center text-slate-500 dark:text-slate-400"
                >
                  {/* {emptyIcon}
                  <Text as="span">{emptyMessage}</Text> */}
                   <View className="flex flex-col items-center">
                    {emptyIcon}
                    <Text as="span" className="text-lg font-medium">{emptyMessage}</Text>
                  </View>
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((row, rowIndex) => (
                <TableRow
                  key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  // className={`border-b border-neutral-200 hover:bg-neutral-50 dark:hover:bg-background dark:border-none ${
                  //   onRowClick ? "cursor-pointer" : ""
                  // }`}
                  className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {Array.isArray(row) &&
                    row.map((cell, colIndex) => (
                      <TableCell
                        key={"td_" + colIndex}
                        // className={`py-3 px-4 } whitespace-nowrap`}
                        className="py-4 px-6 text-sm text-slate-900 dark:text-slate-100"
                      >
                        {renderCell
                          ? renderCell(rowIndex, colIndex, cell)
                          : cell}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </View>

      {/* Footer (pagination) */}
      {/* {footer?.pagination && <View className="pt-4">{footer.pagination}</View>} */}
      {footer?.pagination && (
        <View className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          {footer.pagination}
        </View>
      )}
    </View>
  );
};

export default DynamicTable;
