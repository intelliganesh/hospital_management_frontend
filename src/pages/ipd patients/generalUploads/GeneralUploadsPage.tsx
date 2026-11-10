import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Eye, FileText, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";
import Modal from "@/components/Modal";
import SingleSelector from "@/components/SingleSelector";
import BouncingLoader from "@/components/BouncingLoader";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { RootState } from "@/actions/store";
import { useIpdPatients } from "@/actions/calls/ipd";
import { useIpdGeneralUploads } from "@/actions/calls/ipd/generalUploads";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { usePermissions } from "@/utils/custom-hooks/use-permissions";
import { ExtendedFileItem } from "@/interfaces/components/input/uploadProps";
import { IpdGeneralUpload } from "@/interfaces/ipd/generalUploads";

const CATEGORY_OPTIONS = [
  { value: "external_test_report", label: "External test report" },
  { value: "previous_hospital_records", label: "Previous hospital records" },
  { value: "other", label: "Other" },
];
const FILTER_OPTIONS = [{ value: "", label: "All categories" }, ...CATEGORY_OPTIONS];

// Same roles the API allows to delete any upload (the uploader may also delete their own).
const DELETE_ROLES = ["Admin", "Super Admin", "Front Desk User"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (also enforced by the API)
const ACCEPT = ".pdf,.jpg,.jpeg,.png";

const formatSize = (bytes?: number | null) => {
  if (!bytes) return "-";
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const GeneralUploadsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, getUserRole } = usePermissions();
  const { ipdPatientDetailHandler, cleanUp: cleanUpIpd } = useIpdPatients();
  const { listHandler, uploadHandler, deleteHandler, fetchFileBlob, cleanUp } =
    useIpdGeneralUploads();

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );

  const [items, setItems] = useState<IpdGeneralUpload[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // upload form
  const [category, setCategory] = useState("external_test_report");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<ExtendedFileItem[]>([]);
  const [formError, setFormError] = useState("");

  // preview / delete
  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    mime: string;
  } | null>(null);
  const [toDelete, setToDelete] = useState<IpdGeneralUpload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const role = getUserRole();
  const canDelete = (item: IpdGeneralUpload) =>
    (!!role && DELETE_ROLES.includes(role)) ||
    (!!user?.id && Number(item.uploaded_by) === Number(user.id));

  const loadList = useCallback(
    (cat: string) => {
      if (!id) return;
      listHandler(
        id,
        cat,
        (success, result) => {
          if (success) setItems(Array.isArray(result?.data) ? result.data : []);
        },
        (status) => setIsLoading(status === "pending"),
      );
    },
    [id],
  );

  useEffect(() => {
    if (!id) return;
    ipdPatientDetailHandler(id, () => {}, []);
    return () => {
      cleanUpIpd();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [id, dispatch]);

  useEffect(() => {
    loadList(filter);
    return () => cleanUp();
  }, [filter, loadList]);

  useEffect(() => {
    // release object URL used by the preview
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const handleUpload = async () => {
    const picked = files.map((f) => f.file).filter((f): f is File => !!f);
    if (!id) return;
    if (!category) return setFormError("Please select a category.");
    if (picked.length === 0) return setFormError("Please choose at least one file.");
    if (picked.some((f) => f.size > MAX_FILE_SIZE))
      return setFormError("Each file must be 10 MB or smaller.");
    setFormError("");

    const formData = new FormData();
    formData.append("ipd_id", id);
    formData.append("category", category);
    if (title.trim()) formData.append("title", title.trim());
    if (description.trim()) formData.append("description", description.trim());
    picked.forEach((f) => formData.append("files[]", f));

    setIsUploading(true);
    uploadHandler(formData, (success) => {
      setIsUploading(false);
      if (success) {
        toast({
          title: "Success!",
          description: `${picked.length} file(s) uploaded successfully.`,
          variant: "success",
        });
        setFiles([]);
        setTitle("");
        setDescription("");
        loadList(filter);
      }
    });
  };

  const handleView = async (item: IpdGeneralUpload) => {
    try {
      setIsLoading(true);
      const blob = await fetchFileBlob(item.id);
      setPreview({
        url: URL.createObjectURL(blob),
        title: item.title || item.original_name || "Document",
        mime: item.mime_type || blob.type,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unable to open the file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (item: IpdGeneralUpload) => {
    try {
      setIsLoading(true);
      const blob = await fetchFileBlob(item.id, true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.original_name || `${item.title || "document"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unable to download the file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setIsDeleting(true);
    deleteHandler(toDelete.id, (success) => {
      setIsDeleting(false);
      if (success) {
        toast({
          title: "Success!",
          description: "Document deleted successfully.",
          variant: "success",
        });
        setToDelete(null);
        loadList(filter);
      }
    });
  };

  return (
    <View className="p-6 space-y-6 mx-auto">
      <BouncingLoader isLoading={isLoading || isUploading} />
      <View className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            General Uploads / Scanned Records
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            {ipdPatientDetailData?.patient_name || "Patient"}
            {ipdPatientDetailData?.ipd_number
              ? ` - IPD ${ipdPatientDetailData.ipd_number}`
              : ""}
            {" - external test reports, previous hospital records and other scans"}
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

      {/* Upload */}
      <Card className="p-6 space-y-4">
        <Text
          as="h2"
          className="text-xl font-semibold text-slate-900 dark:text-white"
        >
          Upload files
        </Text>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelector
            label="Category"
            required
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(value) => setCategory(value)}
          />
          <Input
            label="Title"
            placeholder="e.g. CBC report - City Lab (defaults to file name)"
            value={title}
            maxLength={255}
            onChange={(e) => setTitle(e.target.value)}
          />
        </View>
        <Textarea
          label="Description"
          placeholder="Optional notes about these files"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Upload
          name="general_upload_files"
          label="Files (PDF, JPG, JPEG, PNG - max 10 MB each, up to 10 files)"
          multiple
          maxCount={10}
          accept={ACCEPT}
          maxSize={MAX_FILE_SIZE}
          fileList={files}
          onChange={(list) => setFiles(list)}
        />
        {formError && (
          <Text className="text-sm text-red-500 dark:text-red-400">
            {formError}
          </Text>
        )}
        <View className="flex justify-end">
          <Button
            variant="primary"
            onPress={handleUpload}
            loading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </View>
      </Card>

      {/* List */}
      <Card className="p-6 space-y-4">
        <View className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <View className="flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            <Text
              as="h2"
              className="text-xl font-semibold text-slate-900 dark:text-white"
            >
              Uploaded records ({items.length})
            </Text>
          </View>
          <View className="w-full sm:w-64">
            <SingleSelector
              label="Filter by category"
              options={FILTER_OPTIONS}
              value={filter}
              onChange={(value) => setFilter(value ?? "")}
            />
          </View>
        </View>

        {items.length > 0 ? (
          <View className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              <View
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
              >
                <View className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title || item.original_name}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {item.category_label} - {formatSize(item.file_size)} -{" "}
                    {item.created_at
                      ? dayjs(item.created_at).format("DD-MM-YYYY hh:mm a")
                      : ""}
                    {item.uploaded_by_name ? ` - by ${item.uploaded_by_name}` : ""}
                  </Text>
                  {item.description && (
                    <Text className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {item.description}
                    </Text>
                  )}
                </View>
                <View className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    className="flex items-center gap-1"
                    onPress={() => handleView(item)}
                  >
                    <Eye size={14} /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    className="flex items-center gap-1"
                    onPress={() => handleDownload(item)}
                  >
                    <Download size={14} /> Download
                  </Button>
                  {canDelete(item) && (
                    <Button
                      variant="danger"
                      size="small"
                      className="flex items-center gap-1"
                      onPress={() => setToDelete(item)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          !isLoading && (
            <View className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <FileText className="mx-auto mb-3 text-slate-300" size={36} />
              <Text className="text-sm font-medium text-slate-500">
                No uploaded records found.
              </Text>
            </View>
          )
        )}
      </Card>

      {/* Preview */}
      <Modal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        closeOnOutsideClick={false}
        title={preview?.title || "Preview"}
        size="full"
      >
        <View className="flex flex-col items-center justify-center min-h-[60vh]">
          {preview?.mime?.startsWith("image/") ? (
            <img
              src={preview.url}
              alt={preview.title}
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            />
          ) : preview ? (
            <iframe
              src={preview.url}
              className="w-full h-[70vh] rounded-lg border-0"
              title={preview.title}
            />
          ) : null}
        </View>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!toDelete}
        onClose={() => !isDeleting && setToDelete(null)}
        closeOnOutsideClick={false}
        title="Delete document"
        description="This permanently removes the file and cannot be undone."
      >
        <View className="space-y-4">
          <Text className="text-sm">
            Delete <b>{toDelete?.title || toDelete?.original_name}</b>?
          </Text>
          <View className="flex justify-end gap-3">
            <Button
              variant="outline"
              onPress={() => setToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onPress={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GeneralUploadsPage;
