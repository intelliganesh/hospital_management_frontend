import View from "@/components/view";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { Edit, PlusCircle, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/ui/DynamicTable";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import SingleSelector from "@/components/SingleSelector";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "@/actions/store";
import { useSelector } from "react-redux";
import Input from "@/components/input";
import DeleteLoader from "@/components/deleteLoader";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import {
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
  SURGERY_PROCEDURE_URL,
} from "@/utils/urls/frontend";
import { useOpd } from "@/actions/calls/opd";
import useForm from "@/utils/custom-hooks/use-form";
import * as yup from "yup";
import ActionMenu from "@/components/editDeleteAction";

const surgeryValidationSchema = yup.object().shape({
  surgery_type: yup.string().required("Surgery Type is required"),
  surgery_name: yup.string().required("Surgery Name is required"),
  surgery_date: yup.string().required("Surgery Date is required"),
  doctor_id: yup.string().required("Doctor is required"),
});

const SurgeryList: React.FC = () => {
  const navigate = useNavigate();
  const { id: patientId } = useParams();

  const { getSurgeryList, addSurgeryReport, deleteSurgery, cleanUp } =
    useSurgeryReport();

  const surgeryData = useSelector(
    (state: RootState) => state?.surgeryReport?.surgeryList,
  );
  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => { });
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { values, onSetHandler, resetForm } = useForm<any>({
    ipd_id: patientId,
    surgery_type: "Surgical",
    surgery_name: "",
    surgeon: "",
    doctor_id: "",
    surgery_date: "",
  });
  const doctors = useSelector((state: RootState) => state.opd.userList);

  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));

  /* ================== FETCH LIST ================== */
  useEffect(() => {
    if (patientId) {
      getSurgeryList(
        patientId,
        1,
        () => { },
        null,
        null,
        null,
        [],
        (status) => setIsLoading(status === "pending"),
      );
    }
    return () => cleanUp();
  }, [patientId]);

  /* ================== ADD SURGERY ================== */
  const handleSave = async () => {
    if (!patientId) return;

    try {
      await surgeryValidationSchema.validate(values, { abortEarly: false });
      setErrors({});

      const payload = {
        ipd_id: patientId,
        surgery_type: values.surgery_type,
        surgery_name: values.surgery_name,
        surgeon: values.surgeon,
        surgery_date: values.surgery_date,
      };

      addSurgeryReport(payload, (success, response: any) => {
        if (success) {
          setShowModal(false);
          resetForm();
          setErrors({});
          getSurgeryList(patientId, 1, () => { });
        } else {
          if (response?.errors) {
            const backendErrors: Record<string, string> = {};
            Object.keys(response.errors).forEach((field) => {
              const errMsg = Array.isArray(response.errors[field])
                ? response.errors[field][0]
                : response.errors[field];
              if (field === "surgeon") {
                backendErrors["doctor_id"] = errMsg;
              } else {
                backendErrors[field] = errMsg;
              }
            });
            setErrors(backendErrors);
          } else if (response?.message) {
            setErrors({ general: response.message });
          } else {
            setErrors({ general: "Failed to add surgery. Please try again." });
          }
        }
      });
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  /* ================== DELETE ================== */
  const handleDelete = () => {
    if (!deleteId) return;

    deleteSurgery(
      deleteId,
      (success) => {
        if (success) {
          setDeleteId(null);
          patientId && getSurgeryList(patientId, 1, () => { });
        }
      },
      (status) => setIsDeleting(status === "pending"),
    );
  };

  return (
    <View className="mt-4">
      <BouncingLoader isLoading={isLoading} />

      {/* Delete Modal */}
      <Modal
        title="Delete Surgery"
        isOpen={deleteId ? true : false}
        onClose={() => setDeleteId(null)}
        description="Are you sure you want to delete this surgery?"
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onPress={handleDelete}>
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>

      {/* Header */}
      <View className="flex justify-between items-center">
        <View>
          <Text as="h2" className="text-xl font-semibold mb-1">
            Surgery Details
          </Text>
          <Text as="p" className="text-muted-foreground">
            List of surgeries for this IPD patient
          </Text>
        </View>

        <Button
          variant="primary"
          className="flex items-center gap-2 px-6 py-3"
          onPress={() => {
            resetForm();
            setErrors({});
            setShowModal(true);
          }}
        >
          <PlusCircle className="h-5 w-5" />
          Add Surgery
        </Button>
      </View>

      {/* TABLE */}
      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            { label: "Date", key: "date" },
            { label: "Doctor", key: "doctor" },
            { label: "Surgery", key: "name" },
            { label: "Type", key: "type" },
            { label: "Status", key: "status" },
            "Action",
          ]}
          tableData={surgeryData?.data?.map((data: any) => [
            data.surgery_date,
            data.surgeon,
            data.surgery_name,
            data.surgery_type,
            data.status,
            ActionMenu({
              onView: () =>
                navigate(
                  IPD_PATIENTS_URL +
                  IPD_PATIENTS_DETAILS_URL +
                  SURGERY_PROCEDURE_URL +
                  `/${data.id}/view`,
                ),
              onEdit: () =>
                navigate(
                  IPD_PATIENTS_URL +
                  IPD_PATIENTS_DETAILS_URL +
                  SURGERY_PROCEDURE_URL +
                  `/${data.id}`,
                ),
              onDelete: () => setDeleteId(data.id),
            }),
          ])}
          emptyMessage="No surgeries found!"
        />
      </Card>

      {/* ADD MODAL */}
      {showModal && (
        <Modal
          title="Add Surgery"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
            setErrors({});
          }}
          size="xl"
        >
          {errors?.general && (
            <View className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Text className="text-red-600 dark:text-red-400 text-sm">{errors.general}</Text>
            </View>
          )}

          <View className="grid grid-cols-2 gap-4">
            <View>
              <SingleSelector
                id="surgery_type"
                label="Surgery Type"
                name="surgery_type"
                required={true}
                value={values?.surgery_type || "Surgical"}
                onChange={(value) => onSetHandler("surgery_type", value)}
                options={[
                  { label: "Surgical", value: "Surgical" },
                  { label: "Non-Surgical", value: "Non-Surgical" },
                ]}
                error={errors?.surgery_type}
              />
            </View>

            <View>
              <Input
                id="surgery_name"
                label="Surgery Name"
                name="surgery_name"
                required={true}
                value={values?.surgery_name || ""}
                onChange={(e) => onSetHandler("surgery_name", e.target.value)}
                placeholder="Enter surgery name"
                error={errors?.surgery_name}
              />
            </View>

            <View>
              <Input
                id="surgery_date"
                label="Surgery Date"
                name="surgery_date"
                required={true}
                type="date"
                value={values?.surgery_date || ""}
                onChange={(e) => onSetHandler("surgery_date", e.target.value)}
                error={errors?.surgery_date}
              />
            </View>

            <View>
              <SingleSelector
                id="doctor_id"
                label="Doctor"
                name="doctor_id"
                required={true}
                value={values?.doctor_id || ""}
                placeholder="Select Doctor"
                onChange={(value) => {
                  onSetHandler("doctor_id", value);
                  const selectedDoctor = doctors?.find((doc: any) => doc.id === value);
                  if (selectedDoctor) {
                    onSetHandler("surgeon", selectedDoctor.name);
                  }
                }}
                options={doctorsObj}
                error={errors?.doctor_id}
              />
            </View>
          </View>

          <View className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onPress={() => {
                setShowModal(false);
                resetForm();
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onPress={handleSave}>
              Save
            </Button>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SurgeryList;
