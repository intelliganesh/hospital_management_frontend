import { CSSProperties } from "react";

export interface FileItem {
  file: File;
  id?: string;
  progress?: number;
  status?: "uploading" | "done" | "error";
  url?: string;
}

export interface ExtendedFileItem {
  file?: File;
  url?: string;
  name: string;
  size: number;
  type: string;
  id: string;
  status?: "uploading" | "done" | "error";
  progress?: number;
  isExisting?: boolean;
}

export interface UploadProps {
  onChange?: (fileList: ExtendedFileItem[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  maxCount?: number;
  minFiles?: number;
  maxFiles?: number;
  maxFileNameLength?: number; // max characters in filename
  uploadSize?: "small" | "medium" | "large";
  variant?: "default" | "outlined" | "filled" | "error";
  fullWidth?: boolean;
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  "aria-label"?: string;
  style?: CSSProperties;
  className?: string;
  uploadIcon?: React.ReactNode;
  children?: React.ReactNode;
  defaultFileList?: ExtendedFileItem[];
  fileList?: ExtendedFileItem[];
  showFileList?: boolean;
  showOnlyFileList?: boolean;
  dragDropText?: string;
  browseText?: string;
  showPreview?: boolean;
  existingFiles?: string[] | string | null;
}
