import React, { useState, useCallback } from "react";
import View from "./view";
import Text from "./text";
import { ArchiveX, Check, X, Plus } from "lucide-react";
import BouncingLoader from "./BouncingLoader";
import Input from "./input";
import Button from "./button";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "./ui/table";

interface EditableTableProps {
  tableData: any[][];
  tableHeaders: string[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  getRowKey?: (row: any[], rowIndex: number) => string | number;
  onRowClick?: (row: any[], rowIndex: number) => void;
  onCellEdit?: (rowIndex: number, colIndex: number, value: any) => void;
  onRowAdd?: (newRow: any[]) => void;
  maxRows?: number;
  onRowDelete?: (rowIndex: number) => void;
  editable?: boolean;
  addRowEnabled?: boolean;
  deleteRowEnabled?: boolean;
  header?: {
    search?: React.ReactNode;
    sort?: React.ReactNode;
    filter?: React.ReactNode;
    action?: React.ReactNode;
  };
  footer?: {
    pagination?: React.ReactNode;
  };
  onSubmitCompleteRow?: (row: any[]) => void;
  editMode?: "click" | "always";
  showRowSave?: boolean | ((row: any[]) => boolean);
  showRowDelete?: boolean | ((row: any[]) => boolean);
  isReadOnly?: boolean;
  features?: {
    allowDelete?: boolean;
    showAPNColumn?: boolean;
  };
}

const EditableTable: React.FC<EditableTableProps> = ({
  tableData,
  tableHeaders,
  isLoading = false,
  emptyMessage = "No Data Found!",
  emptyIcon = (
    <ArchiveX className="w-10 h-10 mx-auto mb-2 bg-primary/10 p-2 rounded-full text-primary" />
  ),
  getRowKey,
  //   onRowClick,
  onCellEdit,
  onRowAdd,
  maxRows,
  onRowDelete,
  editable = true,
  addRowEnabled = true,
  deleteRowEnabled = false,
  header,
  footer,
  onSubmitCompleteRow,
  editMode = "click",
  showRowSave = true,
  showRowDelete = true,
  isReadOnly = false,
  features,
}) => {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [editValue, setEditValue] = useState<string>("");
  const [newRow, setNewRow] = useState<string[]>([]);
  const [isAddingRow, setIsAddingRow] = useState(false);

  const startEdit = useCallback(
    (rowIndex: number, colIndex: number, currentValue: any) => {
      setEditingCell({ row: rowIndex, col: colIndex });
      setEditValue(String(currentValue || ""));
    },
    []
  );

  const saveEdit = useCallback(() => {
    if (editingCell && onCellEdit) {
      onCellEdit(editingCell.row, editingCell.col + 1, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  }, [editingCell, editValue, onCellEdit]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  const startAddRow = useCallback(() => {
    const emptyRow = new Array(tableHeaders.length - 1).fill("");
    if (editMode === "always") {
      if (onRowAdd) onRowAdd(emptyRow);
      // Ensure adding state is false in always mode
      setIsAddingRow(false);
    } else {
      setNewRow(emptyRow);
      setIsAddingRow(true);
    }
  }, [tableHeaders.length, editMode, onRowAdd]);

  const saveNewRow = useCallback(() => {
    if (onRowAdd && newRow.some((cell) => cell.trim() !== "")) {
      onRowAdd(newRow);
    }
    setNewRow([]);
    setIsAddingRow(false);
  }, [newRow, onRowAdd]);

  const cancelAddRow = useCallback(() => {
    setNewRow([]);
    setIsAddingRow(false);
  }, []);

  const updateNewRowCell = useCallback((colIndex: number, value: string) => {
    setNewRow((prev) => {
      const updated = [...prev];
      updated[colIndex] = value;
      return updated;
    });
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit]
  );

  const handleNewRowKeyPress = useCallback(
    (e: React.KeyboardEvent, colIndex: number) => {
      if (e.key === "Enter") {
        if (colIndex === tableHeaders.length - 1) {
          saveNewRow();
        } else {
          // Focus next input
          const nextInput = e.currentTarget
            .closest("tr")
            ?.querySelector(
              `input[data-col="${colIndex + 1}"]`
            ) as HTMLInputElement;
          nextInput?.focus();
        }
      } else if (e.key === "Escape") {
        cancelAddRow();
      }
    },
    [tableHeaders.length, saveNewRow, cancelAddRow]
  );

  return (
    <View>
      {/* Header controls */}
      {addRowEnabled && !isReadOnly && (
        <View>
          <Button
            variant="primary"
            onClick={startAddRow}
            disabled={(maxRows && tableData.length >= maxRows ? true : editMode === "click" && isAddingRow)}
            className="flex items-center justify-center gap-2 w-full h-11 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Row
          </Button>
        </View>
      )}
      <View className="p-4 border-b border-border bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <View className="flex gap-2 w-full justify-between items-center">
          {header?.search}
          {/* <View className="flex gap-3"> */}
          <View>
            {header?.sort}
            {header?.filter}
            {header?.action && (
              <View className="shrink-0">{header.action}</View>
            )}
          </View>
        </View>
      </View>
      {/* Table */}
      <View className="overflow-x-auto">
        <Table className="w-full min-w-max">
          <TableHeader>
            <TableRow className="bg-muted/50 font-bold border-b border-border">
              {tableHeaders
                .filter((x) => {
                  if (x === "ID") {
                    return x !== "ID"
                  };
                  if (x === "Appointment Number") {
                    return features?.showAPNColumn ? true : false;
                  };
                  return true;
                })
                .map((header, index) => (
                  <TableHead
                    key={index}
                    className="py-3 px-4 text-sm font-bold text-muted-foreground"
                  >
                    {header}
                  </TableHead>
                ))}
              {(editable || deleteRowEnabled) && (
                <TableHead className="py-3 px-4 text-sm font-bold text-muted-foreground w-20">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    tableHeaders.length + (editable || deleteRowEnabled ? 1 : 0)
                  }
                  className="py-4 text-center relative"
                >
                  <View className="w-full z-50">
                    <BouncingLoader notFixed isLoading={isLoading} />
                  </View>
                </TableCell>
              </TableRow>
            ) : !tableData || (tableData.length === 0 && !isAddingRow) ? (
              <TableRow>
                <TableCell
                  colSpan={
                    tableHeaders.length + (editable || deleteRowEnabled ? 1 : 0)
                  }
                  className="py-6 px-4 text-center text-muted-foreground"
                >
                  {emptyIcon}
                  <Text as="span">{emptyMessage}</Text>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {tableData.map((row, rowIndex, completeCell) => (
                  <TableRow
                    key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {row
                      .filter((_, colIndex) => {
                        // colIndex 0 is ID, colIndex 1 is Appointment Number
                        if (colIndex === 0) return false;
                        if (colIndex === 1 && !features?.showAPNColumn)
                          return false;
                        return true;
                      })
                      .map((cell, colIndex) => (
                        <TableCell
                          key={`td_${rowIndex}_${colIndex}`}
                          className="py-3 px-4 whitespace-nowrap"
                        >
                          {editMode === "always" && editable && !isReadOnly ? (
                            // Always-edit mode: render input directly with premium styling
                            <Input
                              value={cell || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (onCellEdit) {
                                  onCellEdit(rowIndex, features?.showAPNColumn ? colIndex + 1 : colIndex + 2, e.target.value);
                                }
                              }}
                              className="min-w-[150px] h-10 border-muted-foreground/20 focus:border-primary transition-all rounded-lg"
                              placeholder="Type here..."
                            />
                          ) : editingCell?.row === rowIndex &&
                            editingCell?.col === colIndex ? (
                            // Click mode: editing state
                            <View className="flex items-center gap-2">
                              <Input
                                value={editValue}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="min-w-0 h-8"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                //   size="sm"
                                onClick={saveEdit}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                //   size="sm"
                                onClick={cancelEdit}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </View>
                          ) : (
                            // Click mode: display state
                            <View
                              className={`${
                                editable && !isReadOnly
                                  ? "cursor-pointer hover:bg-muted/30 rounded px-2 py-1 -mx-2 -my-1"
                                  : ""
                              }`}
                              onClick={() =>
                                editable && !isReadOnly && editMode === "click" && startEdit(rowIndex, colIndex, cell)
                              }
                            >
                              {cell || (
                                <span className="text-muted-foreground italic">
                                  {editable && !isReadOnly ? "Click to edit" : "—"}
                                </span>
                              )}
                            </View>
                          )}
                        </TableCell>
                      ))}
                    {(editable || deleteRowEnabled) && (
                      <TableCell className="px-4">
                        <View className="flex items-center gap-1">
                          {deleteRowEnabled &&
                            onRowDelete &&
                            (typeof showRowDelete === "function"
                              ? showRowDelete(row)
                              : showRowDelete) && (
                              <Button
                                variant="ghost"
                                disabled={!features?.allowDelete}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this row?"
                                    )
                                  ) {
                                    onRowDelete(rowIndex);
                                  }
                                }}
                                className="h-9 w-9 hover:bg-red-50 group transition-colors"
                              >
                                <X className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                              </Button>
                            )}
                          {(typeof showRowSave === "function"
                            ? showRowSave(row)
                            : showRowSave) && (
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-green-50"
                              onClick={() => {
                                onSubmitCompleteRow?.(completeCell[rowIndex]);
                              }}
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                        </View>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Add new row UI (only for click mode) */}
                {isAddingRow && editMode === "click" && (
                  <TableRow className="border-b border-border bg-muted/20">
                    {tableHeaders
                      .filter((x) => {
                        if (x === "ID") return false;
                        if (x === "Appointment Number") return features?.showAPNColumn;
                        return true;
                      })
                      .map((_, colIndex) => {
                        const actualColIndex = features?.showAPNColumn ? colIndex + 1 : colIndex + 2;
                        return (
                          <TableCell
                            key={`new_${colIndex}`}
                            className="py-3 px-4"
                          >
                            <Input
                              data-col={colIndex}
                              value={newRow[actualColIndex - 1] || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => updateNewRowCell(actualColIndex - 1, e.target.value)}
                              onKeyDown={(e: React.KeyboardEvent) =>
                                handleNewRowKeyPress(e, colIndex)
                              }
                              placeholder={`Enter ${tableHeaders[actualColIndex]}`}
                              className="h-10 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20"
                            />
                          </TableCell>
                        );
                      })}
                    {(editable || deleteRowEnabled) && (
                      <TableCell className="py-3 px-4">
                        <View className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            onClick={saveNewRow}
                            className="h-9 w-9 p-0 hover:bg-green-50 rounded-full"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={cancelAddRow}
                            className="h-9 w-9 p-0 hover:bg-red-50 rounded-full"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </View>
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </View>

      {/* Footer (pagination) */}
      {footer?.pagination && <View className="pt-4">{footer.pagination}</View>}
    </View>
  );
};

export default EditableTable;
