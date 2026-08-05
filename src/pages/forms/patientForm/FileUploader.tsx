import WebcamCapture from "@/components/Capture";
import React from "react";

interface FileUploaderProps {
  name: string; // <-- dynamic field name
  label?: string;
  existingFiles?: string | string[];
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange: (
    fieldName: string,
    data: {
      existingUrls: string[];
      newFiles: File[];
      combined: (string | File)[];
    }
  ) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  label = "Upload Files",
  existingFiles,
  accept = "image/*,.pdf,.doc,.docx,.txt",
  multiple = true,
  maxSize = 1024 * 1024 * 10,
  onChange,
}) => {
  const existing =
    typeof existingFiles === "string"
      ? existingFiles
      : Array.isArray(existingFiles)
      ? existingFiles.filter((x) => typeof x === "string").join(",")
      : "";

  return (
    <div className="border border-gray-300 dark:border-gray-600 dark:bg-background rounded-lg py-6 my-6 mt-2">
      <h5 className="text-gray-700 dark:text-white text-lg font-semibold mb-4 px-6">
        {label}
      </h5>
      <div className="border-b border-gray-300 dark:border-gray-600 mb-6" />
      <div className="px-6">
        <WebcamCapture
          name={name}
          //   label={label}
          accept={accept}
          multiple={multiple}
          maxSize={maxSize}
          existingFiles={existing}
          onChange={(fileList: any) => {
            const existingUrls: string[] = [];
            const newFiles: File[] = [];

            fileList.forEach((item: any) => {
              if (item.isExisting && item.url) existingUrls.push(item.url);
              else if (item.file instanceof File) newFiles.push(item.file);
            });

            // send data back with field name
            onChange(name, {
              existingUrls,
              newFiles,
              combined: [...existingUrls, ...newFiles],
            });
          }}
        />
      </div>
    </div>
  );
};

export default FileUploader;
