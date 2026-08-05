import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import {
  Calendar,
  Hash,
  Mail,
  Phone,
  StethoscopeIcon,
  User,
} from "lucide-react";
import SingleSelector from "@/components/SingleSelector";
import { appointmentTypeOptions } from "../consultationFormOptions";
// import Textarea from "@/components/Textarea";
import Text from "@/components/text";
import { useDispatch } from "react-redux";
import { useDepartment } from "@/actions/calls/department";
import { consultationDetailSlice } from "@/actions/slices/consultation";
import { useOpd } from "@/actions/calls/opd";
import { usePatient } from "@/actions/calls/patient";

interface Props {
  errorsPatientId: any;
  mainOnSetHandler?: (key: string, value: any) => void;
}

const SectionOne: React.FC<Props> = ({ errorsPatientId, mainOnSetHandler }) => {
  const dispatch = useDispatch();
  const { departmentDropdownHandler } = useDepartment();
  const { patientDetailHandler } = usePatient();
  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  const consultationDetail = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.consultations,
  );

  const consultationDetailData = useSelector(
    (state: RootState) => state.consultation.consultationDetailData,
  );

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetail,
  );

  const patients = useSelector((state: RootState) => state.opd.patientList);

  const patientObj = patients?.map((patient: any) => ({
    id: patient.id,
    label:
      patient.patient_number +
      "(" +
      patient.first_name +
      " " +
      patient.last_name +
      ")",
    value: patient.id,
  }));

  const departmentTypeDropdownData = useSelector(
    (state: RootState) => state.department.departmentDropdownData,
  )?.map((data) => {
    return {
      id: data?.id,
      label: data?.name,
      value: data?.name,
    };
  });

  useEffect(() => {
    departmentDropdownHandler(() => {});
  }, []);

  return (
    <>
      <Card className="mt-2 shadow-none border-none p-4">
        <View className="flex grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Information Card */}
          <Card className="!bg-background ">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                  <User className="h-5 w-5 text-black dark:text-white" />
                </View>
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {/* <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Patient ID</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{consultationDetail?.patient_id}</p>
              </div> */}
                  <div>
                    <div className="flex items-center gap-2 ">
                      <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                        <Hash className="h-4 w-4 text-black dark:text-white" />
                      </View>
                      <span className="text-sm font-medium">
                        Patient Number
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      {consultationDetail?.patient_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                        <User className="h-4 w-4 text-black dark:text-white" />
                      </View>
                      <span className="text-sm font-medium">Name</span>
                    </div>
                    <p className="text-sm ml-10">
                      {consultationDetail?.patient_name || "N/A"}
                      {consultationDetail?.patient_age
                        ? ` (Age:${consultationDetail.patient_age})`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                        <Mail className="h-4 w-4 text-black dark:text-white" />
                      </View>
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      {consultationDetail?.patient_email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                        <Phone className="h-4 w-4 text-black dark:text-white" />
                      </View>
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                      {consultationDetail?.patient_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Information Card */}
          <Card className="!bg-background">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-black dark:text-white" />
                </View>
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {/* <div>
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Appointment ID</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{consultationDetail?.appointment_id}</p>
            </div> */}
                <View>
                  <View className="flex items-center gap-2">
                    <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                      <Hash className="h-4 w-4 text-black dark:text-white" />
                    </View>
                    <Text as="span" className="text-sm font-medium">
                      Appointment Number
                    </Text>
                  </View>
                  <Text className="text-sm text-muted-foreground ml-10">
                    {consultationDetail?.appointment_number || "N/A"}
                  </Text>
                </View>
                <View>
                  <View className="flex items-center gap-2">
                    <View className="bg-primary-300 p-2 rounded-md inline-flex items-center justify-center">
                      <StethoscopeIcon className="h-4 w-4 text-black dark:text-white" />
                    </View>
                    <Text as="span" className="text-sm font-medium">
                      Doctor
                    </Text>
                  </View>
                  <Text className="text-sm text-muted-foreground ml-10">
                    {consultationDetail?.doctor_name ||
                      "N/A" + ` (${consultationDetail?.doctor_id || "N/A"})`}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Doctor Information Card */}
          {/* <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5" />
            Doctor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Doctor ID</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{consultationDetail?.doctor_id}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Doctor Name</span>
                </div>
                <p className="text-sm font-semibold">{consultationDetail?.doctor_name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-sm text-muted-foreground">{consultationDetail?.doctor_email}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <p className="text-sm text-muted-foreground">{consultationDetail?.doctor_phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
        </View>

        <View className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-4">
          {/* appointment type */}
          <View
          // className={`${
          //   values?.appointment_type === "First Visit" ? "" : "col-span-2"
          // }`}
          >
            <SingleSelector
              id="appointment_type"
              label="Appointment Type"
              name="appointment_type"
              // error={errorsType}
              value={values?.appointment_type || ""}
              placeholder="Select Appointment Type"
              onChange={(value) => {
                onSetHandler("appointment_type", value);
              }}
              options={appointmentTypeOptions}
              required={true}
            />
          </View>
          {values?.appointment_type === "First Visit" ? (
            <View>
              <Input
                id="referred_by_name"
                name="referred_by_name"
                label="Referred By Name"
                onChange={handleChange}
                // error={errorsReferredByName}
                value={values?.referred_by_name ?? ""}
                placeholder="Referred By Name"
              />
            </View>
          ) : null}
          <View
          // className={`${
          //   values?.appointment_type === "First Visit" ? "col-span-2" : ""
          // }`}
          >
            <SingleSelector
              id="type"
              label="Consultation Type"
              name="type"
              value={values?.type || ""}
              placeholder="Select Consultation Type"
              onChange={(value) => {
                onSetHandler("type", value);
                dispatch(
                  consultationDetailSlice({
                    ...consultationDetailData,
                    consultations: {
                      ...consultationDetailData?.consultations,
                      type: value,
                    },
                  }),
                );
              }}
              options={departmentTypeDropdownData}
              required={true}
            />
          </View>
          {values?.relinkPatient ? (
            <View>
              <SingleSelector
                id="patient_id"
                label="Patient"
                name="patient_id"
                error={errorsPatientId}
                value={values?.relinkPatient ? "" : (values?.patient_id || "")}
                placeholder="Select Patient"
                onChange={(value) => {
                  patientDetailHandler(value, () => {});
                  onSetHandler("patient_id", value); 
                  mainOnSetHandler?.("patient_id", value);
                }}
                options={patientObj}
                required={true}
              />
            </View>
          ) : null}
        </View>

        {/* <View className="mt-4">
            <Textarea
              id="complaint"
              name="complaint"
              label="Complaint"
              onChange={(e) => 
                onSetHandler("complaint", e.target.value)
              }
              // error={errorsReferredByName}
              value={values?.complaint || ""}
              placeholder="Enter Complaint"
            />
          </View> */}
        {/* </CardContent> */}
      </Card>
    </>
  );
};

export default SectionOne;
