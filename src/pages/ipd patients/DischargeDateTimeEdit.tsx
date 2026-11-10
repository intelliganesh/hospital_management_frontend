import { useState } from "react";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import { toast } from "@/components/ui/use-toast";
import { usePermissions } from "@/utils/custom-hooks/use-permissions";
import {
  DISCHARGE_EDIT_ROLES,
  useIpdDischargeDateTime,
} from "@/actions/calls/ipd/dischargeDateTime";

interface Props {
  ipdId?: string;
  status?: string;
  admissionDateTime?: string | null;
  dischargeDateTime?: string | null;
  /** called after a successful save so the parent can refetch the IPD details */
  onUpdated: () => void;
}

const INPUT_FORMAT = "YYYY-MM-DDTHH:mm";

/**
 * "Edit discharge date & time" control for an already discharged IPD patient.
 * Rendered only for Front Desk User / Admin / Super Admin (the API enforces the same roles).
 */
const DischargeDateTimeEdit = ({
  ipdId,
  status,
  admissionDateTime,
  dischargeDateTime,
  onUpdated,
}: Props) => {
  const { getUserRole } = usePermissions();
  const { updateDischargeDateTimeHandler } = useIpdDischargeDateTime();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const role = getUserRole();
  if (!ipdId || status !== "Discharged" || !role || !DISCHARGE_EDIT_ROLES.includes(role)) {
    return null;
  }

  const open = () => {
    setValue(dischargeDateTime ? dayjs(dischargeDateTime).format(INPUT_FORMAT) : "");
    setError("");
    setIsOpen(true);
  };

  const validate = (): string => {
    if (!value) return "Discharge date and time is required.";
    const picked = dayjs(value);
    if (!picked.isValid()) return "Enter a valid date and time.";
    if (admissionDateTime && picked.isBefore(dayjs(admissionDateTime))) {
      return "Discharge date and time cannot be earlier than the admission date and time.";
    }
    if (picked.isAfter(dayjs().add(1, "day"))) {
      return "Discharge date and time cannot be in the future.";
    }
    return "";
  };

  const save = () => {
    const message = validate();
    setError(message);
    if (message || !ipdId) return;
    setIsSaving(true);
    updateDischargeDateTimeHandler(
      ipdId,
      dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
      (success) => {
        setIsSaving(false);
        if (success) {
          toast({
            title: "Success!",
            description: "Discharge date and time updated successfully.",
            variant: "success",
          });
          setIsOpen(false);
          onUpdated();
        }
      },
    );
  };

  return (
    <>
      <Button
        variant="outline"
        size="small"
        className="mt-2 flex items-center gap-1"
        onPress={open}
      >
        <Pencil size={14} /> Edit discharge date &amp; time
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => !isSaving && setIsOpen(false)}
        closeOnOutsideClick={false}
        title="Edit discharge date & time"
        description="Correct the recorded discharge time. Discharge summary, bill and reports will show the new value; the change is logged."
      >
        <View className="space-y-4">
          <Input
            id="discharge_date_time"
            name="discharge_date_time"
            label="Discharge Date and Time"
            type="datetime-local"
            required
            value={value}
            min={admissionDateTime ? dayjs(admissionDateTime).format(INPUT_FORMAT) : undefined}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            error={error}
          />
          <View className="flex justify-end gap-3">
            <Button variant="outline" onPress={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onPress={save} loading={isSaving} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </View>
          <Text className="text-xs text-slate-500">
            Stored PDFs (discharge summary, invoice, notes) are regenerated automatically.
          </Text>
        </View>
      </Modal>
    </>
  );
};

export default DischargeDateTimeEdit;
