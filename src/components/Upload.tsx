import {
  UploadProps,
  ExtendedFileItem,
} from "@/interfaces/components/input/uploadProps";
import { useState, useRef, useEffect } from "react";
import View from "./view";
import Text from "./text";
import Input from "./input";
import Button from "./button";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const Upload: React.FC<UploadProps> = ({
  onChange,
  onUpload,
  accept,
  multiple = false,
  disabled = false,
  maxSize,
  minSize,
  maxCount,
  // minFiles,
  maxFiles,
  maxFileNameLength,
  // uploadSize = "medium",
  // variant = "default",
  fullWidth = false,
  // id,
  name,
  label,
  required = false,
  error,
  helperText,
  style,
  // existingFiles,
  className,
  // uploadIcon,
  // children,
  // defaultFileList = [],
  fileList: controlledFileList,
  showFileList = true,
  showPreview = true,
  showOnlyFileList = false,
  // dragDropText = "Drag files here or",
  browseText = "browse",
  existingFiles = null,
}) => {
  const maxAllowed = maxCount || maxFiles || 10;
  const [fileList, setFileList] = useState<ExtendedFileItem[]>([]);
  const inputHref = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<ExtendedFileItem | null>(null);
  const [showPreviewFile, setShowPreviewFile] = useState(false);

  const [errorState, setError] = useState<string | null>(null);

  // Initialize with existing files from backend
  useEffect(() => {
    if (
      existingFiles &&
      typeof existingFiles === "string" &&
      existingFiles.trim() !== ""
    ) {
      const existingFileUrls = existingFiles
        .split(",")
        .filter((url) => url.trim() !== "");
      const existingFileItems: ExtendedFileItem[] = existingFileUrls.map(
        (url, index) => {
          const fileName = url.split("/").pop() || "Unknown file";
          const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

          // Estimate file type based on extension
          let fileType = "application/octet-stream";
          if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
            fileType = `image/${
              fileExtension === "jpg" ? "jpeg" : fileExtension
            }`;
          } else if (["pdf"].includes(fileExtension)) {
            fileType = "application/pdf";
          } else if (["doc", "docx"].includes(fileExtension)) {
            fileType = "application/msword";
          } else if (["txt"].includes(fileExtension)) {
            fileType = "text/plain";
          }

          return {
            id: `existing-${index}`,
            url: url.trim(),
            name: fileName,
            size: 0, // Unknown size for existing files
            type: fileType,
            status: "done",
            isExisting: true,
          };
        }
      );

      setFileList(existingFileItems);

      if (onChange) {
        onChange(existingFileItems);
      }
    }
  }, [existingFiles]);

  useEffect(() => {
    if (controlledFileList && Array.isArray(controlledFileList)) {
      setFileList(controlledFileList);
    }
  }, [controlledFileList]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    if (minSize && file.size < minSize) {
      return `File size must be at least ${formatFileSize(minSize)}`;
    }

    // Check filename length
    if (maxFileNameLength && file.name.length > maxFileNameLength) {
      return `Filename must be less than ${maxFileNameLength} characters`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const newFiles: File[] = [];
    const newFileItems: ExtendedFileItem[] = [];

    Array.from(files).forEach((file) => {
      // Validate file using our validation function
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        // console.warn(`File ${file.name}: ${validationError}`);
        return;
      } else {
        setError(null);
      }

      newFiles.push(file);

      newFileItems.push({
        file,
        id: generateUniqueId(),
        name: file.name,
        size: file.size,
        type: file.type,
        isExisting: false,
      });
    });

    if (newFiles.length === 0) return;

    // Check max count including existing files
    const totalCount = fileList.length + newFileItems.length;
    const maxAllowed = maxCount || maxFiles || 10;

    let updatedFileList: ExtendedFileItem[];
    if (totalCount > maxAllowed) {
      const availableSlots = Math.max(
        0,
        maxAllowed - fileList.filter((item) => !item.isExisting).length
      );
      updatedFileList = [...fileList, ...newFileItems.slice(0, availableSlots)];
    } else {
      updatedFileList = [...fileList, ...newFileItems];
    }

    if (!controlledFileList) {
      setFileList(updatedFileList);
    }

    if (onChange) {
      onChange(updatedFileList);
    }

    if (onUpload) {
      onUpload(newFiles).catch((error) => {
        console.error("Upload error:", error);
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxCount && fileList.length >= maxCount) {
      setError(`Max ${maxCount} files allowed`);
      return;
    }
    handleFiles(e.target.files);
    // Reset the input value so the same file can be uploaded again if removed
    if (inputHref.current) {
      inputHref.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    if (disabled) return;

    const updatedFileList = fileList.filter((item: any) => item.id !== id);

    if (!controlledFileList) {
      setFileList(updatedFileList);
    }

    if (onChange) {
      onChange(updatedFileList);
    }

    const totalCount = updatedFileList.length;
    if (totalCount < maxAllowed) {
      setError(null); // Clear error state
    }
  };

  // Handle preview click
  const handlePreviewClick = (file: ExtendedFileItem | null) => {
    if (file) {
      setShowPreviewFile(true);
      setPreviewFile(file);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    setFileList([]);
    if (onChange) {
      onChange([]);
    }
    if (inputHref.current) {
      inputHref.current.value = "";
    }
  };

  // Get file icon based on type
  const getFileIcon = (type: string, isExisting: boolean) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎵";
    if (type.includes("word") || type.includes("doc")) return "📝";
    if (type.includes("excel") || type.includes("sheet")) return "📊";
    if (type.includes("text")) return "📄";
    return isExisting ? "🔗" : "📁";
  };

  return (
    <>
      {showPreviewFile && previewFile && (
        <Modal
          isOpen={showPreviewFile}
          size="full"
          onClose={() => setShowPreviewFile(false)}
          title={previewFile.name || "File Preview"}
          // description="Preview the selected file"
        >
          <View className="flex items-center justify-center max-h-[80vh]">
            {/* IMAGE */}
            {previewFile.type.startsWith("image/") && (
              <img
                src={
                  previewFile.file
                    ? URL.createObjectURL(previewFile.file)
                    : import.meta.env.VITE_APP_URL + previewFile.url || ""
                }
                alt="Preview"
                className="max-h-[75vh] max-w-full"
                onLoad={(e) => {
                  if (previewFile.file) {
                    URL.revokeObjectURL((e.target as HTMLImageElement).src);
                  }
                }}
              />
            )}

            {/* PDF */}
            {previewFile.type === "application/pdf" && (
              <embed
                src={
                  previewFile.file
                    ? URL.createObjectURL(previewFile.file)
                    : import.meta.env.VITE_APP_URL + previewFile.url || ""
                }
                type="application/pdf"
                width="100%"
                height="600px"
              />
            )}

            {/* VIDEO */}
            {previewFile.type.startsWith("video/") && (
              <video
                controls
                className="max-h-[75vh] max-w-full"
                src={
                  previewFile.file
                    ? URL.createObjectURL(previewFile.file)
                    : import.meta.env.VITE_APP_URL + previewFile.url || ""
                }
              />
            )}

            {/* AUDIO */}
            {previewFile.type.startsWith("audio/") && (
              <audio
                controls
                src={
                  previewFile.file
                    ? URL.createObjectURL(previewFile.file)
                    : import.meta.env.VITE_APP_URL + previewFile.url || ""
                }
              />
            )}

            {/* TEXT FILES */}
            {previewFile.type.startsWith("text/") && (
              <iframe
                src={
                  previewFile.file
                    ? URL.createObjectURL(previewFile.file)
                    : import.meta.env.VITE_APP_URL + previewFile.url || ""
                }
                className="w-full h-[75vh] border rounded"
                title="Text Preview"
              />
            )}

            {/* WORD / EXCEL / OTHERS */}
            {(previewFile.type.includes("word") ||
              previewFile.type.includes("sheet") ||
              previewFile.type.includes("excel") ||
              (!previewFile.type.startsWith("image/") &&
                !previewFile.type.startsWith("video/") &&
                !previewFile.type.startsWith("audio/") &&
                !previewFile.type.startsWith("text/") &&
                previewFile.type !== "application/pdf")) && (
              <>
                <View className="flex flex-col items-center justify-center gap-2">
                  <Text className="text-muted-foreground">
                    Preview is not available for this file
                  </Text>
                  <Link
                    to={
                      previewFile.file
                        ? URL.createObjectURL(previewFile.file)
                        : import.meta.env.VITE_APP_URL + previewFile.url || "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground p-2 border border-border rounded"
                  >
                    Open {previewFile.name}
                  </Link>
                </View>
              </>
            )}
          </View>
        </Modal>
      )}

      <View
        className={`upload-container ${fullWidth ? "w-full" : ""} ${
          className || ""
        }`}
        style={style}
      >
        {/* Label */}
        {label && (
          <View className="mb-2">
            <Text
              as="label"
              className="block text-sm font-medium text-text-DEFAULT"
            >
              {label}
              {required && <span className="text-red-600 ml-1">*</span>}
            </Text>
          </View>
        )}

        <Input
          ref={inputHref}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          tabIndex={-1}
          hidden
        />

        {!showOnlyFileList && (
          <Button
            variant="outline"
            className="w-full"
            onPress={() => {
              if (inputHref.current) {
                inputHref.current.click();
              }
            }}
            disabled={disabled}
          >
            <Text as="span">{browseText || "Upload Files"}</Text>
          </Button>
        )}
        {errorState && (
          <View className="mt-2">
            <Text as="p" className="text-sm text-red-500">
              {errorState}
            </Text>
          </View>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <View className="mt-2">
            <Text
              as="p"
              className="text-xs text-neutral-500 dark:text-neutral-400"
            >
              {helperText}
            </Text>
          </View>
        )}

        {showFileList && fileList.length > 0 && (
          <View className="mt-4">
            <View className="flex justify-between items-center mb-3">
              <Text
                as="h4"
                className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Files ({fileList.length}/{maxCount || maxFiles || "∞"})
              </Text>
              {fileList.length > 0 && !showOnlyFileList && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-red-500  hover:text-red-700 dark:hover:text-white"
                  onClick={clearAllFiles}
                >
                  Clear All
                </Button>
              )}
            </View>

            <ul className="upload-file-list space-y-2 max-h-60 overflow-y-auto border border-border rounded-lg p-2">
              {fileList?.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-border transition-colors"
                  style={{ background: `var(--background)` }}
                >
                  {/* File Icon/Preview */}
                  {showPreview && (
                    <View className="flex-shrink-0">
                      <View
                        className="w-10 h-10 bg-card rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-50"
                        onClick={() => handlePreviewClick(item)}
                      >
                        <Text as="span" className="text-sm">
                          {getFileIcon(item.type, item.isExisting || false)}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View className="flex-1 min-w-0">
                    <Text
                      as="p"
                      className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate cursor-pointer hover:text-primary hover:text-underline"
                      onClick={() => handlePreviewClick(item)}
                    >
                      {item.name}
                      {item.isExisting && (
                        <span className="ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">
                          Existing
                        </span>
                      )}
                    </Text>
                    <Text
                      as="p"
                      className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
                    >
                      {formatFileSize(item.size)} •{" "}
                      {item.type || "Unknown type"}
                      {item.url && (
                        <span className="ml-2 text-blue-500">
                          📎 Linked file
                        </span>
                      )}
                    </Text>
                  </View>

                  {!showOnlyFileList && (
                    <Button
                      type="button"
                      className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(item.id || "");
                      }}
                      disabled={disabled}
                      aria-label={`Remove file ${item.name}`}
                    >
                      ✕
                    </Button>
                  )}
                  {/* <Button
                    type="button"
                    className="flex-shrink-0 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id || "");
                    }}
                    disabled={disabled}
                    aria-label={`Remove file ${item.name}`}
                  >
                    ✕
                  </Button> */}
                </li>
              ))}
            </ul>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className="mt-2">
            <Text as="p" className="text-sm text-red-500">
              {error}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default Upload;
