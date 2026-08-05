import React, { useState, useEffect } from "react";

import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import { OnlineAppointment } from "@/types/onlineAppointment.types";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
// import { useOpd } from "@/actions/calls/opd";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import dayjs from "dayjs";
import Sheet from "@/components/ui/Sheet";
import { toast } from "@/utils/custom-hooks/use-toast";
import { LoadingStatus } from "@/interfaces";
import { useSearchParams } from "react-router-dom";
import BouncingLoader from "@/components/BouncingLoader";
import Textarea from "@/components/Textarea";

interface EditAppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: OnlineAppointment | null;
}

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const EditAppointmentDrawer: React.FC<EditAppointmentDrawerProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const {
    onlineAppointmentEditHandler,
    onlineAppointmentDetailHandler,
    onlineAppointmentsListHandler,
  } = useOnlineAppointments();
  // const { userListHandler } = useOpd();
  const doctors = useSelector((state: RootState) => state.opd.userList);

  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (isOpen && appointment?.id) {
      onlineAppointmentDetailHandler(
        appointment.id.toString(),
        (success: boolean, data: any) => {
          if (success && data) {
            setFormData({
              patientName: data.name || "",
              phone: data.phone || "",
              email: data.email || "",
              age: data.age || "",
              gender: data.gender || "",
              doctorId: data.doctor_id || "",
              appointmentDate: data.appointment_datetime
                ? dayjs(data.appointment_datetime).format("YYYY-MM-DDTHH:mm")
                : "",
              // alternateDate: data.alternate_date
              //   ? dayjs(data.alternate_date).format("YYYY-MM-DDTHH:mm")
              //   : "",
              appointmentType: data.appointment_type || "",
              symptoms: data.symptoms || "",
            });
          }
        },
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
  }, [isOpen, appointment?.id]);

  const doctorOptions =
    doctors?.map((doc: any) => ({
      label: doc.name,
      value: doc.id,
    })) || [];

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.patientName,
      phone: formData.phone,
      email: formData.email,
      age: formData.age,
      gender: formData.gender,
      doctor_id: formData.doctorId,
      appointment_datetime: formData.appointmentDate
        ? formData.appointmentDate.replace("T", " ")
        : undefined,
      // alternate_date: formData.alternateDate
      //   ? formData.alternateDate.replace("T", " ")
      //   : undefined,
      appointment_type: formData.appointmentType,
      symptoms: formData.symptoms,
    };

    await onlineAppointmentEditHandler(
      appointment.id.toString(),
      payload,
      (success: boolean) => {
        setIsSubmitting(false);
        if (success) {
          toast({
            title: "Success",
            description: "Appointment updated successfully",
            variant: "success",
          });
          onClose();
          onlineAppointmentDetailHandler(
            appointment.id.toString(),
            () => {},
            [],
            (status) =>
              setIsLoading(
                status === "pending"
                  ? true
                  : status === "failed"
                    ? true
                    : status === "success" && false,
              ),
          );
          onlineAppointmentsListHandler(
            searchParams?.get("currentPage") ?? 1,
            () => {},
            searchParams.get("search") ?? null,
            searchParams.get("sort_by") ?? null,
            searchParams.get("sort_order") ?? null,
            null,
            null,
            null,
            (status: LoadingStatus) => {
              setIsLoading(status === "pending");
            },
          );
        } else {
          // Error is handled globally
        }
      },
    );
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Online Appointment"
      description="Update patient or appointment request details."
      size="lg"
      footer={
        <View className="flex justify-end gap-3 w-full">
          <Button variant="outline" onPress={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} loading={isSubmitting || isLoading}>
            Save Changes
          </Button>
        </View>
      }
    >
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <form onSubmit={handleSubmit}>
        <View className="space-y-4">
          <Text className="text-sm font-bold border-b pb-2 text-slate-400 uppercase tracking-tight">
            Patient Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Patient Name"
              value={formData?.patientName || ""}
              onChange={(e) => handleInputChange("patientName", e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
            <Input
              label="Email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <Input
              label="Age"
              type="number"
              value={formData.age || ""}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
            <SingleSelector
              label="Gender"
              name="gender"
              options={genderOptions}
              value={formData.gender || ""}
              onChange={(val) => handleInputChange("gender", val)}
            />
          </View>
          {/* <Input 
            label="Address" 
            value={formData.address || ""} 
            onChange={(e) => handleInputChange("address", e.target.value)}
          /> */}
        </View>

        <View className="space-y-4 mt-6">
          <Text className="text-sm font-bold border-b pb-2 text-slate-400 uppercase tracking-tight">
            Appointment Details
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SingleSelector
              label="Assigned Doctor"
              name="doctorId"
              options={doctorOptions}
              value={formData.doctorId || ""}
              onChange={(val) => handleInputChange("doctorId", val)}
            />
            <SingleSelector
              label="Appointment Type"
              name="appointmentType"
              options={[
                { label: "ONLINE", value: "ONLINE" },
                { label: "OFFLINE", value: "OFFLINE" },
              ]}
              value={formData.appointmentType || ""}
              onChange={(val) => handleInputChange("appointmentType", val)}
            />
            <Input
              label="Appointment Date & Time"
              type="datetime-local"
              value={formData.appointmentDate || ""}
              onChange={(e) =>
                handleInputChange("appointmentDate", e.target.value)
              }
            />

            {/* <Input
              label="Alternate Date"
              type="datetime-local"
              value={formData.alternateDate || ""}
              onChange={(e) =>
                handleInputChange("alternateDate", e.target.value)
              }
            /> */}
          </View>
          <View className="space-y-1">
            <label className="text-sm font-medium text-slate-300">
              Symptoms / Notes
            </label>
            <Textarea
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] outline-none text-sm"
              value={formData.symptoms || ""}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
            />
          </View>
        </View>
      </form>
    </Sheet>
  );
};

export default EditAppointmentDrawer;
