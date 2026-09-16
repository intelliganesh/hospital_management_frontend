import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import BouncingLoader from "@/components/BouncingLoader";
import Modal from "@/components/Modal";
import { Card } from "@/components/ui/card";
import { RootState } from "@/actions/store";
import { useIpdPatients } from "@/actions/calls/ipd";
import { clearIpdPrefilledUploadedPdfSlice } from "@/actions/slices/ipd/ipdEnrollment";

const normalizePrefilledDocs = (data: any) => {
  const source = data?.url ?? data?.data?.url ?? data?.data ?? data;
  const list = Array.isArray(source) ? source : [];

  return list
    .filter((item: any) => Boolean(item?.content))
    .map((item: any) => ({
      type: item.type,
      label: item.label || item.type || "Prefilled Uploaded File",
      path: item.content,
    }));
};

const PrefilledUploadedFiles = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prefilledUploadedPdfHandler, cleanUp } = useIpdPatients();

  const prefilledUploadedPdfData = useSelector(
    (state: RootState) => state.ipd.prefilledUploadedPdfData,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    prefilledUploadedPdfHandler(
      id,
      () => {},
      [],
      (status) => setIsLoading(status === "pending"),
    );

    return () => {
      cleanUp();
      dispatch(clearIpdPrefilledUploadedPdfSlice());
    };
  }, [id, dispatch]);

  const docs = normalizePrefilledDocs(prefilledUploadedPdfData);

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const getPreviewSource = (url: string) =>
    /^https?:\/\//.test(url) ? url : import.meta.env.VITE_APP_URL + url;

  const getFileType = (url: string) => {
    const ext = url?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return "image";
    }
    if (ext === "pdf") return "pdf";
    return "other";
  };

  return (
    <View className="p-6 space-y-6 mx-auto">
      <BouncingLoader isLoading={isLoading} />
      <View className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            Prefilled Uploaded Files
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            View uploaded prefilled IPD documents
          </Text>
        </View>

        <Button
          variant="outline"
          className="flex items-center gap-2 border-slate-200 bg-white shadow-sm transition-none hover:!border-slate-200 hover:!bg-white dark:bg-slate-800 dark:hover:!bg-slate-800"
          onPress={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </View>

      <Card className="p-6 space-y-5">
        <View className="flex items-center gap-2">
          <FileText className="text-primary" size={20} />
          <Text
            as="h2"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Uploaded Files ({docs.length})
          </Text>
        </View>

        {docs.length > 0 ? (
          <View className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
            {docs.map((doc: any, index: number) => (
              <button
                key={`${doc.path}-${index}`}
                type="button"
                onClick={() => handlePreview(doc.path, doc.label)}
                className="relative flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-none hover:border-slate-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <View className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50 text-primary dark:bg-slate-700">
                  <FileText size={15} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {doc.label}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Click to preview
                  </Text>
                </View>
                <ExternalLink size={15} className="shrink-0 text-slate-400" />
              </button>
            ))}
          </View>
        ) : (
          !isLoading && (
            <View className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <FileText className="mx-auto mb-3 text-slate-300" size={36} />
              <Text className="text-sm font-medium text-slate-500">
                No prefilled uploaded files found.
              </Text>
            </View>
          )
        )}
      </Card>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        closeOnOutsideClick={false}
        title={previewTitle}
        size="full"
      >
        <View className="flex flex-col items-center justify-center min-h-[60vh]">
          {getFileType(previewUrl) === "image" ? (
            <img
              src={getPreviewSource(previewUrl)}
              alt={previewTitle}
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            />
          ) : getFileType(previewUrl) === "pdf" ? (
            <iframe
              src={getPreviewSource(previewUrl)}
              className="w-full h-[70vh] rounded-lg border-0"
              title={previewTitle}
            />
          ) : (
            <View className="text-center space-y-4">
              <Text className="text-slate-500">
                Preview not available for this file type.
              </Text>
              <Button
                variant="primary"
                onPress={() => window.open(getPreviewSource(previewUrl), "_blank")}
              >
                Open File
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PrefilledUploadedFiles;