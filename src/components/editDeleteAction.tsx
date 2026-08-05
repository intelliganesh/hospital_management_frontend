import Button from "./button";
import {
  Download,
  Edit,
  Eye,
  FileText,
  Pill,
  Stethoscope,
  Trash,
} from "lucide-react";
import View from "./view";
interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDownload?: () => void;
  onDownloadPrescription?: () => void;
  onDownloadConsultation?: () => void;
  onDownloadVoucher?: () => void;
  editTitle?: string;
  deleteTitle?: string;
  downloadTitle?: string;
  downloadPrescriptionTitle?: string;
  downloadConsultationTitle?: string;
}
const ActionMenu: React.FC<ActionMenuProps> = ({
  onEdit,
  onDelete,
  onView,
  onDownload,
  editTitle,
  deleteTitle,
  downloadTitle,
  downloadPrescriptionTitle,
  onDownloadPrescription,
  onDownloadConsultation,
  downloadConsultationTitle,
  downloadVoucherTitle,
  onDownloadVoucher
}: any) => {
  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
  };
  const handleDownload = () => {
    if (onDownload) onDownload();
  };
  const handleDownloadPrescription = () => {
    if (onDownloadPrescription) onDownloadPrescription();
  };
  const handleDownloadConsultation = () => {
    if (onDownloadConsultation) onDownloadConsultation();
  };
  const handleDownloadVoucher = () => {
    if (onDownloadVoucher) onDownloadVoucher();
  };

  const handleView = () => {
    if (onView) onView();
  };
  

  return (
    <>
      <View className="relative flex items-center">
        {onView && (
          <Button
            variant="ghost"
            onPress={handleView}
            className="flex items-center w-auto px-2 py-2 text-sm text-green-600 hover:bg-primary-100"
            title={downloadTitle || ""}
          >
            <Eye size={18} className=" text-primary" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            onPress={handleEdit}
            className="flex items-center w-auto px-2 py-2 text-sm text-primary-700 hover:bg-primary-100"
            title={editTitle || ""}
          >
            <Edit size={18} className=" text-primary" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            onPress={handleDelete}
            className="flex items-center w-auto px-2 py-2 text-sm text-red-600 hover:bg-red-100"
            title={deleteTitle || ""}
          >
            <Trash size={18} className=" text-danger" />
          </Button>
        )}
        {onDownloadPrescription && (
          <Button
            variant="ghost"
            onPress={handleDownloadPrescription}
            className="flex items-center w-auto px-2 py-2 text-sm hover:bg-primary-100"
            title={downloadPrescriptionTitle || ""}
          >
            <View className="flex flex-col gap-1 items-center">
              <Pill size={18} className=" text-primary" />
              <span className="ml-1 text-xs">PRE</span>
            </View>
          </Button>
        )}
        {onDownloadConsultation && (
          <Button
            variant="ghost"
            onPress={handleDownloadConsultation}
            className="flex items-center w-auto px-2 py-2 text-sm  hover:bg-primary-100"
            title={downloadConsultationTitle || ""}
          >
            <View className="flex flex-col gap-1 items-center">
              <Stethoscope size={18} className=" text-primary" />
              <span className="ml-1 text-xs">CON</span>
            </View>
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            onPress={handleDownload}
            className="flex items-center w-auto px-2 py-2 text-sm hover:bg-primary-100"
            title={downloadTitle || ""}
          >
            <View className="flex flex-col gap-1 items-center">
              <FileText size={18} className=" text-primary" />
              <span className="ml-1 text-xs">INV</span>
            </View>
          </Button>
        )}
        {onDownloadVoucher && (
          <Button
            variant="ghost"
            onPress={handleDownloadVoucher}
            className="flex items-center w-auto px-2 py-2 text-sm hover:bg-primary-100"
            title={downloadVoucherTitle || ""}
          >
            {/* <View className="flex flex-col gap-1 items-center"> */}
              <Download size={18} className=" text-primary" />
              {/* <span className="ml-1 text-xs">INV</span>
            </View> */}
          </Button>
        )}
      </View>
    </>
  );
};

export default ActionMenu;
