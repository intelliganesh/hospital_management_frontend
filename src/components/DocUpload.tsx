import React, { useState, useEffect } from "react";
import View from "@/components/view";
import Button from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebcamCapture from "@/components/Capture";
import { toast } from "@/utils/custom-hooks/use-toast";
import { imageUpload } from "@/actions/calls/uesImage";

interface DocumentUploadComponentProps {
  // Data props
  id: string | number;
  existingDocuments?: any;
  maxFiles?: number;
  // Configuration props
  modalType: "proctology" | "non_proctology" | "allopathy" | string;
  fileName?: string;
  folderName?: string;
  
  // UI customization props
  title?: string;
  label?: string;
  accept?: string;
  maxSize?: number;
  browseText?: string;
  submitButtonText?: string;
  
  // Behavior props
  showCard?: boolean;
  allowMultiple?: boolean;
  autoSubmit?: boolean;
  
  // Callback props
  onUploadSuccess?: (data?: any) => void;
  onUploadError?: (error?: any) => void;
  onFilesChange?: (files: any[]) => void;
}

const DocumentUploadComponent: React.FC<DocumentUploadComponentProps> = ({
  id,
  existingDocuments,
  modalType,
  fileName = "doc_upload",
  maxFiles,
  folderName,
  title = "Uploaded Documents",
  label = "Upload Documents & Files",
  accept = "image/*,.pdf,.doc,.docx,.txt,.mp4,.mov,.mkv,.webm,.webp",
  maxSize = 1024 * 1024 * 15,
  browseText = "Browse Files",
  submitButtonText = "Upload",
  showCard = true,
  allowMultiple = true,
  autoSubmit = false,
  onUploadSuccess,
  onUploadError,
  onFilesChange,
}) => {
  const [formValues, setFormValues] = useState({
    doc_upload: [],
    existing_file_urls: "",
    new_files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalFolderName = folderName || `${modalType}_image`;

  useEffect(() => {
    if (existingDocuments) {
      setFormValues((prev) => ({
        ...prev,
        doc_upload: existingDocuments || [],
      }));
    }
  }, [existingDocuments]);

  const handleFormChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const performUpload = () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Record ID not found",
        variant: "destructive",
      });
      return;
    }

    const existingUrls = formValues.existing_file_urls
      ? formValues.existing_file_urls
          .split(",")
          .filter((url: string) => url?.trim())
      : [];
    const newFiles = formValues.new_files || [];
    const combinedFiles = [...existingUrls, ...newFiles].filter(
      (item: any) => typeof item === "string" || (item instanceof File && item.name)
    );

    if (combinedFiles.length === 0) {
      toast({
        title: "Warning",
        description: "No files to upload",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const imageUploaddata = {
      id: id,
      modal_type: modalType,
      file_name: fileName,
      
      folder_name: finalFolderName,
      image: combinedFiles
        .filter((data: any) => data instanceof File)
        .map((data) => data),
      oldImage: combinedFiles.filter((data) => typeof data === "string"),
    };

    imageUpload(imageUploaddata, (uploadSuccess, responseData) => {
      setIsSubmitting(false);
      if (uploadSuccess) {
        toast({
          title: "Success!",
          description: "Documents uploaded successfully",
          variant: "success",
        });
        setFormValues((prev) => ({
          ...prev,
          new_files: [],
          existing_file_urls: "",
        }));
        if (onUploadSuccess) {
          onUploadSuccess(responseData);
        }
      } else {
        toast({
          title: "Error!",
          description: "Failed to upload documents",
          variant: "destructive",
        });
        if (onUploadError) {
          onUploadError(responseData);
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performUpload();
  };

  const handleFileChange = (fileList: any) => {
    const existingUrls: string[] = [];
    const newFiles: File[] = [];

    fileList?.forEach((item: any) => {
      if (item.isExisting && item.url) {
        existingUrls.push(item.url);
      } else if (
        !item.isExisting &&
        item.file &&
        item.file instanceof File
      ) {
        newFiles.push(item.file);
      }
    });

    const urlsString = existingUrls.join(",");
    const combinedFiles = [...existingUrls, ...newFiles];

    handleFormChange("existing_file_urls", urlsString);
    handleFormChange("new_files", newFiles);
    handleFormChange("doc_upload", combinedFiles);

    if (onFilesChange) {
      onFilesChange(combinedFiles);
    }

    if (autoSubmit && newFiles.length > 0) {
      setTimeout(() => performUpload(), 100);
    }
  };

  const formattedExistingFiles = React.useMemo(() => {
    if (typeof existingDocuments === "string") {
      return existingDocuments;
    }
    if (Array.isArray(existingDocuments) && existingDocuments.length > 0) {
      return existingDocuments
        .filter((item: any) => typeof item === "string")
        .join(",");
    }
    return "";
  }, [existingDocuments]);

  const FormContent = (
    <form onSubmit={handleSubmit}>
      <View className="space-y-4">
        <View>
          {/* {label && (
            <Text as="h3" className="text-lg font-semibold mb-2">
              {label}
            </Text>
          )} */}
          <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
            <WebcamCapture
              name={fileName}
              maxFiles ={maxFiles}
              accept={accept}
              multiple={allowMultiple}
              maxSize={maxSize}
              browseText={browseText}
              existingFiles={formattedExistingFiles}
              label={label}
              onChange={handleFileChange}
            />
          </View>
        </View>
      </View>

      {!autoSubmit && (
        <View className="mt-6">
          <Button
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
          >
            {isSubmitting ? "Uploading..." : submitButtonText}
          </Button>
        </View>
      )}
    </form>
  );

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{FormContent}</CardContent>
      </Card>
    );
  }

  return FormContent;
};

export default DocumentUploadComponent;