import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import StepForm, { Step } from "@/components/ui/StepForm";
import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";
import { toast } from "@/components/ui/use-toast";
import { usePatient } from "@/actions/calls/patient";
import BouncingLoader from "@/components/BouncingLoader";
import { LoadingStatus } from "@/interfaces";
import dayjs from "dayjs";
import useForm from "@/utils/custom-hooks/use-form";
import { NewIPDPatientWithEnrollment } from "@/interfaces/ipd/ipdEnrollment";
import { Edit } from "lucide-react";
import IPDModels from "./IPDModels";
import { setPatientModel } from "@/actions/slices/medicalStatus";
import { clearPatientDetailsSlice } from "@/actions/slices/patient";
// import SearchSelect from "@/components/SearchSelect";
import MultiSelector from "@/components/MultiSelector";
import { admisstionAndAllocationStepSchema, medicalAssignementStepSchema, patientDetailsStepSchema, paymentAndEnrollmentStepSchema, validationSchema } from "./IpdEnrollmentFormValidation";
import { useIpdPatients } from "@/actions/calls/ipd";
import { useWards } from "@/actions/calls/wards";
import { useRoom } from "@/actions/calls/rooms";
import { useBeds } from "@/actions/calls/beds";
import { genderOptions } from "../patientForm/patientFormOptions";
import { useOpd } from "@/actions/calls/opd";
import { RootState } from "@/actions/store";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";

interface IpdEnrollmentFormProps {
  formType?: "addEnrollment" | "editEnrollment" | "addPatientWithEnrollment";
}
const IpdEnrollmentForm: React.FC<IpdEnrollmentFormProps> = ({
  formType = "addEnrollment",
}) => {
  const { patientId, consultationId, ipdCaseId } = useParams<{ patientId: string, consultationId: string, ipdCaseId: string }>();

  // const { patientId } = useParams();
  const navigate = useNavigate();
  const { patientDetailHandler, cleanUp } = usePatient();
  const [isLoading, setIsLoading] = useState(false);
  const [, setFormErrors] = useState<Record<string, string>>({});
  const [patientDetailsStepErrors, setPatientDetailsStepErrors] = useState<Record<string, string>>({});
  const [medicalAssignementStepErrors, setMedicalAssignementStepErrors] = useState<Record<string, string>>({});
  const [, setAdmisstionAndAllocationStepErrors] = useState<Record<string, string>>({});
  const [, setPaymentAndEnrollmentStepErrors] = useState<Record<string, string>>({});
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();


  const { ipdPatientEnrollmentHandler, ipdPatientDetailHandler, editIpdPatientEnrollmentHandler } = useIpdPatients();
  const { wardDropdownHandler } = useWards();
  const { roomDropdownHandler } = useRoom();
  const { bedDropdownHandler } = useBeds();
  const { PuaListHandler } = useOpd()



  const patientDetailData = useSelector(
    (state: any) => state.patient.patientDetailData
  );

  const ipdPatientDetailData = useSelector(
    (state: any) => state.ipd.ipdPatientDetailData
  );


  const wardDropdownData = useSelector(
    (state: any) => state.wards.wardDropdownData
  )?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const roomDropdownData = useSelector(
    (state: any) => state.rooms.roomDropdownData
  )?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const bedDropdownData = useSelector(
    (state: any) => state.beds.bedDropdownData
  )?.map((item: any) => ({
    label: item.bed_number,
    value: item.id,
  }));

  const nurseList = useSelector((state: RootState) => state.opd.allUserList)?.filter((doctor: any) => doctor.role === "Nurse")?.map((nurse: any) => ({
    label: nurse.name,
    value: nurse.id,
  }));
  const doctorList = useSelector((state: RootState) => state.opd.userList)?.filter((doctor: any) => doctor.role === "Doctor")?.map((doctor: any) => ({
    label: doctor.name,
    value: doctor.id,
  }));

  useEffect(() => {
    if (patientId) {
      patientDetailHandler(
        patientId,
        () => { },
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false
          );
        }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearPatientDetailsSlice());
    };
  }, [patientId, dispatch]);

  useEffect(() => {
    if (ipdCaseId && formType === "editEnrollment") {
      ipdPatientDetailHandler(
        ipdCaseId,
        () => { },
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false
          );
        }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [ipdCaseId, dispatch, formType]);

  useEffect(() => {
    wardDropdownHandler(() => { });
  }, [patientId, consultationId])

  useEffect(() => {
    PuaListHandler(() => { });
  }, []);


  const initialValues: NewIPDPatientWithEnrollment = useMemo(() => {
    const commonValues = {
      patient_id: ipdPatientDetailData?.patient?.id || "",
      consultation_id: ipdPatientDetailData?.consultation_id || "",
      consultant_doctor_id: ipdPatientDetailData?.doctor_id || "",
      duty_doctor: ipdPatientDetailData?.staffs?.length > 0 ? ipdPatientDetailData?.staffs?.filter((staff: any) => staff.user_role === "duty_doctor")?.map((staff: any) => staff.user_id) : [],
      nurse: ipdPatientDetailData?.staffs?.length > 0 ? ipdPatientDetailData?.staffs?.filter((staff: any) => staff.user_role === "nurse")?.map((staff: any) => staff.user_id) : [],
      consultant_doctor: ipdPatientDetailData?.staffs?.length > 0 ? ipdPatientDetailData?.staffs?.filter((staff: any) => staff.user_role === "consultant_doctor")?.map((staff: any) => staff.user_id) : [],
      admission_date_time: dayjs(ipdPatientDetailData?.admission_date_time).format("YYYY-MM-DDTHH:mm") || dayjs().format("YYYY-MM-DDTHH:mm"),
      ward_id: ipdPatientDetailData?.ward_id || null,
      room_id: ipdPatientDetailData?.room_id || null,
      bed_id: ipdPatientDetailData?.bed_id || null,
      advance_amount: ipdPatientDetailData?.advance_amount || null,
    };

    // Always return the full shape to satisfy the strict NewIPDPatientWithEnrollment type.
    // For 'addEnrollment', the patient fields will be empty strings and ignored.
    return {
      patient_first_name: "",
      patient_last_name: "",
      patient_gender: "",
      patient_attendant_name: "",
      patient_attendant_phone: "",
      ...commonValues,
    };
  }, [ipdPatientDetailData]);

  const { values, onSetHandler } = useForm<NewIPDPatientWithEnrollment>(initialValues);


  useEffect(() => {
    if (values?.ward_id) {
      roomDropdownHandler(values?.ward_id, () => { });
    }
  }, [values?.ward_id]);

  useEffect(() => {
    if (values?.room_id) {
      bedDropdownHandler(values?.room_id, () => { });
    }
  }, [values?.room_id]);

  const validationSetter = async (schema: any, values: any, formType: string = "") => {
    let Errors = {};

    try {
      await schema.validate(values, { abortEarly: false, context: { formType } });
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        Errors = validationErrors
      }
    }
    return Errors;

  }

  const handleSubmit = async () => {
    try {
      let formData: any = {
        ...values,
        patient_id: patientId || "",
        consultation_id: consultationId || "",
        admission_date_time: dayjs(values?.admission_date_time).format("YYYY-MM-DD HH:mm:ss"),
      }

      if (formType === "editEnrollment") {
        delete formData.advance_amount;
        delete formData.admission_date_time;
        delete formData.patient_id;
        delete formData.consultation_id;
        delete formData.patient_attendant_name;
        delete formData.patient_attendant_phone;
        delete formData.patient_first_name;
        delete formData.patient_last_name;
        delete formData.patient_gender;
      }

      await validationSchema.validate(formData, { abortEarly: false, context: { formType } });
      setFormErrors({});
      setIsLoading(true);

      if (formType === "addEnrollment" || formType === "addPatientWithEnrollment") {
        ipdPatientEnrollmentHandler(formData, (success) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Patient enrolled to IPD successfully.",
              variant: "success",
            });
            navigate(-1);
          }
        });
      } else if (ipdCaseId && formType === "editEnrollment") {
        editIpdPatientEnrollmentHandler(ipdCaseId, formData, (success) => {
          if (success) {
            toast({
              title: "Success!",
              description: "IPD Patient updated successfully.",
              variant: "success",
            });
            navigate(-1);
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const stepOfExistingPatient = {
    id: "patient-details",
    title: "Patient Details",
    description: "Review patient information",
    uiForRightPartOfStepTitle: (
      <Button
        onPress={() => dispatch(setPatientModel(true))}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Edit className="w-4 h-4" /> Edit Patient
      </Button>
    ),
    content: (
      <View className="space-y-6">
        {/* Personal Information Section */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Personal Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Patient ID</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.patient_number || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">First Name</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.first_name || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Last Name</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.last_name || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Age</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.age ? patientDetailData?.age + " years" : "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Date of Birth</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.dob ? dayjs(patientDetailData.dob).format("DD MMM YYYY") : "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gender</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.gender || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Marital Status</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.marital_status || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Blood Group</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.blood_group || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dietary Preference</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.dietary_preference || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Contact Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone Number</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.phone_no?.length > 4 ? patientDetailData?.phone_no : "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.email || "N/A"}</Text>
            </View>
            <View className="md:col-span-2">
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Address</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.address || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">City</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.city || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">State</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.state || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Country</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.country || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pincode</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.pincode || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Identification Details Section */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Identification Details
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID Type</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.id_type || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID Number</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.id_value || patientDetailData?.id_number_masked || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID Proof for PAN</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.id_proof_for_pan || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Insurance Information Section */}
        {/* {(patientDetailData?.insurance_provider || patientDetailData?.insurance_policy_no) && ( */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Insurance Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Insurance Provider</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.insurance_provider || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Policy Number</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.insurance_policy_no || "N/A"}</Text>
            </View>
          </View>
        </View>
        {/* )} */}

        {/* Attendant Information Section */}
        {/* {patientDetailData?.attendant_with_patient_name && ( */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Attendant Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attendant Name</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.attendant_with_patient_name || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attendant Phone</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.attendant_with_patient_phone_no?.length > 4 ? patientDetailData?.attendant_with_patient_phone_no : "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attendant ID Type</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.attendant_id_type || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attendant ID Number</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.attendant_id_value || patientDetailData?.attendant_id_number_masked || "N/A"}</Text>
            </View>
          </View>
        </View>
        {/* )} */}

        {/* Referral Information Section */}
        {/* {(patientDetailData?.referred_by_name || patientDetailData?.referred_by) && ( */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Referral Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Referred By</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.referred_by_name || patientDetailData?.referred_by || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Referral Phone</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.referred_by_phone_no || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Referral Email</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.referred_by_email || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Referral Hospital</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.referred_by_hospital_name || "N/A"}</Text>
            </View>
          </View>
        </View>
        {/* )} */}

        {/* Status Information Section */}
        <View>
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            Current Status
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Patient Status</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.status || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Referral Status</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.referral_status || "N/A"}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Registration Date</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{patientDetailData?.created_at ? dayjs(patientDetailData.created_at).format("DD MMM YYYY, hh:mm A") : "N/A"}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    validate: () => {
      if (!patientDetailData) {
        toast({
          title: "Error",
          description: "Patient details not loaded",
          variant: "destructive",
        });
        // return false;
      }
      return true;
    },
  }

  const stepOfNewPatient = (
    {
      id: "patient-details",
      title: "Patient Details",
      description: "Save and Enroll new patient",
      content: (
        <View className="space-y-6 mt-6">
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <View>
              <Input
                id="patient_first_name"
                label="First Name"
                name="patient_first_name"
                value={values?.patient_first_name || ""}
                placeholder="Enter First Name"
                onChange={(e) => onSetHandler("patient_first_name", e.target.value)}
                error={patientDetailsStepErrors?.patient_first_name}
                required={true}
              />
            </View>

            <View>
              <Input
                id="patient_last_name"
                label="Last Name"
                name="patient_last_name"
                value={values?.patient_last_name || ""}
                placeholder="Enter Last Name"
                onChange={(e) => onSetHandler("patient_last_name", e.target.value)}
                error={patientDetailsStepErrors?.patient_last_name}
                required={true}
              />
            </View>

            <View>
              <SingleSelector
                id="patient_gender"
                label="Gender"
                name="patient_gender"
                value={values?.patient_gender || ""}
                placeholder="Select Gender"
                onChange={(value) => onSetHandler("patient_gender", value)}
                options={genderOptions}
                error={patientDetailsStepErrors?.patient_gender}
                required={true}
              />
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <View>
              <Input
                id="patient_attendant_name"
                label="Patient Attendant Name"
                name="patient_attendant_name"
                value={values?.patient_attendant_name || ""}
                placeholder="Enter Patient Attendant Name"
                onChange={(e) => onSetHandler("patient_attendant_name", e.target.value)}
                error={patientDetailsStepErrors?.patient_attendant_name}
                required={true}
              />
            </View>

            <View>
              <Input
                id="patient_attendant_phone"
                label="Patient Attendant Phone No"
                name="patient_attendant_phone"
                value={values?.patient_attendant_phone || ""}
                placeholder="Enter Patient Attendant Phone No"
                onChange={(e) => onSetHandler("patient_attendant_phone", e.target.value)}
                error={patientDetailsStepErrors?.patient_attendant_phone}
                required={true}
              />
            </View>
          </View>
        </View>
      ),
      validate: async () => {
        const errors = await validationSetter(patientDetailsStepSchema, {
          patient_first_name: values.patient_first_name,
          patient_last_name: values.patient_last_name,
          patient_gender: values.patient_gender,
          patient_attendant_name: values.patient_attendant_name,
          patient_attendant_phone: values.patient_attendant_phone,
        },
          formType);

        if (Object.keys(errors).length > 0) {
          setPatientDetailsStepErrors(errors);
          return false;
        }

        setPatientDetailsStepErrors({});
        return true;
      },
    }
  )

  const lastStep =
  {
    id: "payment-details",
    title: "Payment and Enrollment",
    description: "Enter payment information",
    content: (
      <View className="mt-6">
        <Input
          id="advance_amount"
          name="advance_amount"
          label="Advance Amount"
          type="number"
          placeholder="Enter advance amount"
          value={values?.advance_amount || 0}
          // onChange={(e) =>
          //   handleFieldChange("advance_amount", e.target.value)
          // }
          onChange={(value) => onSetHandler("advance_amount", Number(value.target.value))}
        />
        {/* <SingleSelector
            id="payment_mode"
            label="Payment Mode"
            name="payment_mode"
            value={values.payment_mode || ""}
            placeholder="Select Payment Mode"
            // onChange={(value) => handleFieldChange("payment_mode", value)}
            onChange={(value) => onSetHandler("payment_mode", value)}
            options={paymentModes}
          /> */}
      </View>
    ),
    validate: async () => {
      const errors = await validationSetter(paymentAndEnrollmentStepSchema, {
        advance_amount: values.advance_amount,
      });

      if (Object.keys(errors).length > 0) {
        setPaymentAndEnrollmentStepErrors(errors);
        return false;
      }
      setPaymentAndEnrollmentStepErrors({})
      return true;
    },
  }


  const steps: Step[] = [
    formType === "addPatientWithEnrollment" ? stepOfNewPatient : stepOfExistingPatient,
    {
      id: "medical-assignment",
      title: "Medical Assignment",
      description: "Assign medical staff",
      content: (
        <>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <SingleSelector
              id=""
              label="Primary Consultant Doctor"
              name="primary_consultant_doctor"
              value={values?.consultant_doctor_id || ""}
              placeholder="Select Primary Consultant Doctor"
              onChange={(value: string[]) => onSetHandler("consultant_doctor_id", value)}
              options={doctorList}
              error={medicalAssignementStepErrors?.consultant_doctor_id}
              required={true}
            />
            <MultiSelector
              id="consultant_doctor"
              label="Consultant Doctor"
              name="consultant_doctor"
              value={values?.consultant_doctor || []}
              placeholder="Select Consultant Doctor"
              // onChange={(value) => handleFieldChange("consultant_doctor_id", value)}
              onChange={(value) => onSetHandler("consultant_doctor", value)}
              options={doctorList}
              error={medicalAssignementStepErrors?.consultant_doctor}
            />
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <MultiSelector
              id="duty_doctor"
              label="Duty Doctor"
              name="duty_doctor"
              value={values?.duty_doctor || []}
              placeholder="Select Duty Doctor"
              // onChange={(value) => handleFieldChange("duty_doctor_id", value)}
              onChange={(value: string[]) => onSetHandler("duty_doctor", value)}
              options={doctorList}
              error={medicalAssignementStepErrors?.duty_doctor}
            />
            <MultiSelector
              id="nurse"
              label="Duty Nurse"
              name="nurse"
              value={values?.nurse || []}
              placeholder="Select Nurse"
              // onChange={(value) => handleFieldChange("duty_nurse_id", value)}
              onChange={(value) => onSetHandler("nurse", value)}
              options={nurseList}
              error={medicalAssignementStepErrors?.nurse}
            />
          </View>
        </>
      ),
      validate: async () => {
        const errors = await validationSetter(medicalAssignementStepSchema, {
          consultant_doctor_id: values.consultant_doctor_id,
          consultant_doctor: values.consultant_doctor,
          duty_doctor: values.duty_doctor,
          nurse: values.nurse,
        });

        if (Object.keys(errors).length > 0) {
          setMedicalAssignementStepErrors(errors);
          return false;
        }

        setMedicalAssignementStepErrors({});
        return true;
      },
    },
    {
      id: "bed-allocation",
      title: "Admission & Bed Allocation",
      description: "Allocate bed and set admission details",
      content: (
        <View className="space-y-4">
          <Input

            id="admission_date_time"
            name="admission_date_time"
            label="Admission Date and Time"
            type="datetime-local"
            value={values.admission_date_time || ""}
            onChange={(value) => onSetHandler("admission_date_time", value?.toString())}
          // onChange={(e) =>
          //   handleFieldChange("admission_date_time", e.target.value)
          // }
          />
          <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <SingleSelector
              id="ward_id"
              label="Ward"
              name="ward_id"
              value={values.ward_id || ""}
              placeholder="Select Ward"
              // onChange={(value) => handleFieldChange("ward_id", value)}
              onChange={(value) => onSetHandler("ward_id", value)}
              options={wardDropdownData}
            />
            <SingleSelector
              id="room_id"
              label="Room"
              name="room_id"
              value={values.room_id && roomDropdownData.find((room: any) => room.value === values.room_id)?.value || ""}
              placeholder="Select Room"
              // onChange={(value) => handleFieldChange("room_id", value)}
              onChange={(value) => onSetHandler("room_id", value)}
              options={roomDropdownData}
              disabled={!values.ward_id}
            />
            <SingleSelector
              id="bed_id"
              label="Bed"
              name="bed_id"
              value={values.bed_id && bedDropdownData.find((bed: any) => bed.value === values.bed_id)?.value || ""}
              placeholder="Select Bed"
              // onChange={(value) => handleFieldChange("bed_id", value)}
              onChange={(value) => onSetHandler("bed_id", value)}
              options={bedDropdownData}
              disabled={!values.room_id}
            />
          </View>
        </View>
      ),
      validate: async () => {
        const errors = await validationSetter(admisstionAndAllocationStepSchema, {
          admission_date_time: values.admission_date_time,
          ward_id: values.ward_id,
          room_id: values.room_id,
          bed_id: values.bed_id,
        });

        if (Object.keys(errors).length > 0) {
          setAdmisstionAndAllocationStepErrors(errors);
          return false;
        }
        setAdmisstionAndAllocationStepErrors({})
        return true;
      },
    },
  ];

  if (formType !== "editEnrollment") {
    steps.push(lastStep);
  }

  return (
    <>
      <BouncingLoader isLoading={isLoading} />
      <IPDModels patientId={patientId}>
        <View className=" bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
          <View className="w-full max-w-5xl">
            {
              formType !== "addPatientWithEnrollment" && (
                <View className="flex items-center justify-between mb-6">
                  <View>
                    <Text
                      as="h1"
                      weight="font-semibold"
                      className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                    >
                      IPD Patient Enrollment
                    </Text>
                    <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
                      Enroll patient into In-Patient Department
                    </Text>
                  </View>
                  <Button
                    onPress={() => navigate(-1)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Cancel
                  </Button>
                </View>
              )
            }

            <StepForm
              steps={steps}
              onSubmit={handleSubmit}
              submitButtonText="Enroll Patient"
            />
          </View>
        </View>
      </IPDModels>
    </>
  );
};

export default IpdEnrollmentForm;
