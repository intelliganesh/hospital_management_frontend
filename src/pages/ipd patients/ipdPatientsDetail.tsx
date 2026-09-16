import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams, useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  Phone,
  Mail,
  FileText,
  Stethoscope,
  Shield,
  FileOutput,
  Scissors,
  Receipt,
  HeartPulse,
  Building2,
  Bed,
  MapPin,
  UserCircle2,
  ExternalLink,
  DownloadIcon,
  UsersRound,
  UserRound,
} from "lucide-react";
import BouncingLoader from "@/components/BouncingLoader";
import {
  // CHIEF_COMPLAINT_DETAILS_URL,
  // CHIEF_COMPLAINT_URL,
  CONSULTATION_DETAILS_URL,
  CONSULTATION_TABLE_URL,
  DOCTOR_NOTES_URL,
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
  NURSE_NOTES_URL,
  PRELIMINARY_NOTES_URL,
  SURGERY_LIST_URL,
  DOWNLOAD_SURGERY_FORM,
  DOWNLOAD_SURGERY_REPORTS,
  PREFILLED_UPLOADED_FILES_URL,
  IPD_BILL_DETAILS_URL,
  USER_TABLE_URL,
  USER_DETAIL_URL,
  // PAC_LIST_URL,
} from "@/utils/urls/frontend";
import { useIpdPatients } from "@/actions/calls/ipd";
import { LoadingStatus } from "@/interfaces";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { usePreliminaryNotes } from "@/actions/calls/ipd/preliminaryNotes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SurgeryList from "./SurgeryList";
import DynamicTable from "@/components/ui/DynamicTable";
import dayjs from "dayjs";

// ... existing imports

const IpdPatientDetailsPage = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const { ipdPatientDetailHandler, cleanUp } = useIpdPatients();
  const { preliminaryNotesDetail } = usePreliminaryNotes();

  const handlePreliminaryNotesClick = () => {
    if (!patientId) return;

    setIsLoading(true); // Show loading indicator

    preliminaryNotesDetail(patientId, (success: boolean) => {
      setIsLoading(false);

      if (success) {
        // Notes exist - navigate to EDIT form
        navigate(
          `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${PRELIMINARY_NOTES_URL}/edit/${patientId}`,
        );
      } else {
        // Notes don't exist - navigate to ADD form
        navigate(
          `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${PRELIMINARY_NOTES_URL}/add/${patientId}`,
        );
      }
    });
  };

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );

  useEffect(() => {
    if (patientId) {
      ipdPatientDetailHandler(
        patientId,
        () => { },
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
    return () => {
      cleanUp();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [patientId, dispatch]);

  const actionGroups = [
    {
      title: "Clinical Notes",
      description: "Medical records and daily patient care",
      actions: [
        {
          label: "Preliminary Notes",
          icon: FileText,
          bgGradient:
            "bg-blue-100 text-blue-700 shadow-blue-500/25 hover:bg-blue-200",
          onClick: handlePreliminaryNotesClick,
        },
        {
          label: "Doctor Notes",
          icon: Stethoscope,
          bgGradient:
            "bg-teal-100 text-teal-700 shadow-teal-500/25 hover:bg-teal-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOCTOR_NOTES_URL}/${patientId}`,
        },
        {
          label: "Nurse Notes",
          icon: HeartPulse,
          bgGradient:
            "bg-fuchsia-100 text-fuchsia-700 shadow-fuchsia-500/25 hover:bg-fuchsia-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${patientId}${NURSE_NOTES_URL}`,
        },
      ],
    },
    {
      title: "Clearances & Consents",
      description: "Legal and procedural documentation",
      actions: [
        {
          label: "Procedure",
          icon: Scissors,
          bgGradient:
            "bg-orange-100 text-orange-700 shadow-orange-500/25 hover:bg-orange-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${SURGERY_LIST_URL}/${patientId}`,
        },
        {
          label: "Anesthesia",
          icon: Shield,
          bgGradient:
            "bg-rose-100 text-rose-700 shadow-rose-500/25 hover:bg-rose-200",
          url: `/ipd/${patientId}/pac?currentPage=1`,
        },
      ],
    },
    {
      title: "Administrative & Billing",
      description: "Management and financials",
      actions: [
        {
          label: "Discharge Summary",
          icon: FileOutput,
          bgGradient:
            "bg-indigo-100 text-indigo-700 shadow-indigo-500/25 hover:bg-indigo-200",
          url: `/ipd/${patientId}/discharge-summary/new`,
        },
        {
          label: "Bill / Invoice",
          icon: Receipt,
          bgGradient:
            "bg-emerald-200 text-emerald-700 shadow-emerald-500/25 hover:bg-emerald-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${IPD_BILL_DETAILS_URL}/${patientId}`,
        },
      ],
    },
    {
      title: "Forms & Reports",
      description: "Patient forms, clinical documents and reports",
      actions: [
        {
          label: "Download Empty Forms",
          icon: DownloadIcon,
          bgGradient:
            "bg-violet-100 text-violet-700 shadow-violet-500/25 hover:bg-violet-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOWNLOAD_SURGERY_FORM}/${patientId}`,
        },
        {
          label: "Download Reports",
          icon: DownloadIcon,
          bgGradient:
            "bg-blue-100 text-blue-700 shadow-blue-500/25 hover:bg-blue-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOWNLOAD_SURGERY_REPORTS}/${patientId}`,
        },
        {
          label: "Prefilled Uploaded Files",
          icon: FileText,
          bgGradient:
            "bg-amber-100 text-amber-700 shadow-amber-500/25 hover:bg-amber-200",
          url: `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${PREFILLED_UPLOADED_FILES_URL}/${patientId}`,
        },
      ],
    },
  ];
  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <View className="space-y-6 p-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to="/ipd/patients">IPD Patients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {ipdPatientDetailData?.patient_name || "Details"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-text-DEFAULT"
            >
              IPD Patient Details
            </Text>
            <Text as="p" className="text-text-light">
              View and manage IPD patient information
            </Text>
          </View>
          <View className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate(`${IPD_PATIENTS_URL}?currentPage=1`, {
                  state: { refresh: true },
                })
              }
              className="flex justify-center items-center gap-2"
            >
              Back
            </Button>
          </View>
        </View>

        {/* Patient Information Card */}
        <Card className="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20">
          <CardContent className="p-2">
            <View className="flex items-start justify-between mb-6 pt-6">
              <View className="flex items-center gap-4">
                <View className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </View>
                <View>
                  <Text as="h2" className="text-2xl font-semibold">
                    {ipdPatientDetailData?.patient_name || "N/A"}
                  </Text>
                  <View className="flex gap-3 mt-1">
                    <Text as="p" className="text-foreground font-medium">
                      Patient:{" "}
                      {ipdPatientDetailData?.patient_number || "PT-2024-0847"}
                    </Text>
                    <Text as="p" className="text-foreground font-medium">
                      IPD: {ipdPatientDetailData?.ipd_number || "IPD-2024-0001"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-medium text-sm">
                {ipdPatientDetailData?.status || "Active"}
              </View>
            </View>

            {/* Patient Details Grid */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <View className="bg-white/30 dark:bg-white/10 p-4 rounded-lg">
                <View className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-foreground dark:text-white" />
                  <View>
                    <Text
                      as="p"
                      className="text-sm text-foreground dark:text-white"
                    >
                      Age
                    </Text>
                    <Text as="p" className="font-semibold">
                      {ipdPatientDetailData?.patient_age ||
                        ipdPatientDetailData?.patient?.age ||
                        "N/A"}{" "}
                      years
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white/30 dark:bg-white/10 p-4 rounded-lg">
                <View className="flex items-center gap-3">
                  <User className="w-5 h-5 text-foreground dark:text-white" />
                  <View>
                    <Text
                      as="p"
                      className="text-sm text-foreground dark:text-white"
                    >
                      Gender
                    </Text>
                    <Text as="p" className="font-semibold">
                      {ipdPatientDetailData?.patient?.gender || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white/30 dark:bg-white/10 p-4 rounded-lg">
                <View className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-foreground dark:text-white" />
                  <View>
                    <Text
                      as="p"
                      className="text-sm text-foreground dark:text-white"
                    >
                      Phone
                    </Text>
                    <Text as="p" className="font-semibold">
                      {ipdPatientDetailData?.patient_phone || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admission & Stay Card */}
          <Card className="shadow-md py-4">
            <CardContent className="p-6">
              <Text
                as="h3"
                className="text-lg font-semibold mb-4 flex items-center gap-2"
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                Admission & Stay
              </Text>
              <View className="space-y-3">
                <View>
                  <Text as="p" className="text-sm text-muted-foreground">
                    Admission Date & Time
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.admission_date_time
                      ? new Date(
                        ipdPatientDetailData.admission_date_time,
                      ).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : "N/A"}
                  </Text>
                </View>
                <View>
                  <Text as="p" className="text-sm text-muted-foreground">
                    Discharge Date & Time
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.discharge_date_time
                      ? new Date(
                        ipdPatientDetailData.discharge_date_time,
                      ).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                      : "Not Discharged"}
                  </Text>
                </View>
                <View>
                  <Text as="p" className="text-sm text-muted-foreground">
                    Ward / Room / Bed
                  </Text>
                  <View className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <Text as="p" className="font-medium">
                      {ipdPatientDetailData?.ward_type || "N/A"} /{" "}
                      {ipdPatientDetailData?.room_number || "N/A"} /{" "}
                      {ipdPatientDetailData?.bed_number || "N/A"}
                    </Text>
                  </View>
                </View>
                {ipdPatientDetailData?.consultation?.appointment_number && (
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Consultation Number
                    </Text>
                    {ipdPatientDetailData?.consultation?.appointment_number ? (
                      <Link
                        to={
                          CONSULTATION_TABLE_URL +
                          CONSULTATION_DETAILS_URL +
                          "/" +
                          ipdPatientDetailData?.consultation?.id
                        }
                        className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {ipdPatientDetailData?.consultation?.appointment_number}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Text as="p" className="font-medium">
                        N/A
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </CardContent>
          </Card>

          {/* Contact & Emergency Card */}
          <Card className="shadow-md py-4">
            <CardContent className="p-6">
              <Text
                as="h3"
                className="text-lg font-semibold mb-4 flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-green-600" />
                Contact & Emergency
              </Text>
              <View className="space-y-3">
                {/* <View>
                  <Text as="p" className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Patient Phone
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.patient_phone || "N/A"}
                  </Text>
                </View> */}
                <View>
                  <Text
                    as="p"
                    className="text-sm text-muted-foreground flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" /> Patient Email
                  </Text>
                  <Text as="p" className="font-medium break-all">
                    {ipdPatientDetailData?.patient_email || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text
                    as="p"
                    className="text-sm text-muted-foreground flex items-center gap-1"
                  >
                    <UserCircle2 className="w-3 h-3" /> Attendant Name
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.patient_attendant_name || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text
                    as="p"
                    className="text-sm text-muted-foreground flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Attendant Phone
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.patient_attendant_phone &&
                      ipdPatientDetailData?.patient_attendant_phone.length > 4
                      ? ipdPatientDetailData?.patient_attendant_phone
                      : "N/A"}
                  </Text>
                </View>
                <View>
                  <Text
                    as="p"
                    className="text-sm text-muted-foreground flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Address
                  </Text>
                  <Text as="p" className="font-medium">
                    {ipdPatientDetailData?.patient_address || "N/A"}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Assigned Staff Card */}
          {/* <Card className="shadow-md py-4">
            <CardContent className="p-6">
              <Text
                as="h3"
                className="text-lg font-semibold mb-4 flex items-center gap-2"
              >
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Assigned Staff
              </Text>
              <View className="space-y-3">
                {ipdPatientDetailData?.staffs &&
                  ipdPatientDetailData.staffs.length > 0 ? (
                  ipdPatientDetailData.staffs.map(
                    (staff: any, index: number) => (
                      <View
                        key={staff.id || index}
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <View className="flex items-center justify-between">
                          <View>
                            <Text as="p" className="font-medium">
                              {staff.user_name || `Staff ${index + 1}`}
                            </Text>
                            <Text
                              as="p"
                              className="text-sm text-muted-foreground capitalize"
                            >
                              {staff.user_role?.replace("_", " ") || "N/A"}
                            </Text>
                          </View>
                          {staff.shift && (
                            <View className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {staff.shift}
                            </View>
                          )}
                        </View>
                        {staff.assigned_date && (
                          <Text
                            as="p"
                            className="text-xs text-muted-foreground mt-1"
                          >
                            Assigned:{" "}
                            {new Date(staff.assigned_date).toLocaleDateString(
                              "en-IN",
                            )}
                          </Text>
                        )}
                      </View>
                    ),
                  )
                ) : (
                  <Text as="p" className="text-muted-foreground">
                    No staff assigned yet
                  </Text>
                )}
              </View>
            </CardContent>
          </Card> */}
        </View>

        {/* primary consultant doctor details */}
        <Card className="shadow-md py-4">
          <CardContent>
            <Text as="h3" className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-green-600" /> Primary Consultant Doctor
            </Text>
            {/* doctor name, phone, email, id */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <View>
                <Text as="p" className="text-sm text-muted-foreground">
                  Doctor Name
                </Text>
                <Link to={`${USER_TABLE_URL}${USER_DETAIL_URL}/${ipdPatientDetailData?.doctor_id}`} >
                  <Text as="p" className="font-medium hover:underline cursor-pointer w-fit">
                    Dr. {ipdPatientDetailData?.doctor_name || "N/A"}
                  </Text>
                </Link>
              </View>
              <View>
                <Text as="p" className="text-sm text-muted-foreground">
                  Doctor Phone
                </Text>
                <Text as="p" className="font-medium">
                  {ipdPatientDetailData?.doctor_phone || "N/A"}
                </Text>
              </View>
              <View>
                <Text as="p" className="text-sm text-muted-foreground">
                  Doctor Email
                </Text>
                <Text as="p" className="font-medium">
                  {ipdPatientDetailData?.doctor_email || "N/A"}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <View className="">

          {/* Assigned Staff Card */}
          <Card className="shadow-md py-4">
            <CardContent className="p-6">
              <Text
                as="h3"
                className="text-lg font-semibold mb-4 flex items-center gap-2"
              >
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Assigned Staff
              </Text>
              <View className=" gap-4">
                {ipdPatientDetailData?.staffs &&
                  ipdPatientDetailData.staffs.length > 0 ? (
                  // ipdPatientDetailData.staffs.map(
                  //   (staff: any, index: number) => (
                  //     <View
                  //       key={staff.id || index}
                  //       className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  //     >
                  //       <View className="flex items-center justify-between">
                  //         <View>
                  //           <Text as="p" className="font-medium">
                  //             {staff.user_name || `Staff ${index + 1}`}
                  //           </Text>
                  //           <Text
                  //             as="p"
                  //             className="text-sm text-muted-foreground capitalize"
                  //           >
                  //             {staff.user_role?.replace("_", " ") || "N/A"}
                  //           </Text>
                  //         </View>
                  //         {staff.shift && (
                  //           <View className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  //             {staff.shift}
                  //           </View>
                  //         )}
                  //       </View>
                  //       {staff.assigned_date && (
                  //         <Text
                  //           as="p"
                  //           className="text-xs text-muted-foreground mt-1"
                  //         >
                  //           Assigned:{" "}
                  //           {new Date(staff.assigned_date).toLocaleDateString(
                  //             "en-IN",
                  //           )}
                  //         </Text>
                  //       )}
                  //     </View>
                  //   ),
                  // )
                  <DynamicTable
                    tableHeaders={[
                      "Name",
                      "Phone",
                      "Role",
                      "Assigned Date"
                    ]}
                    tableData={ipdPatientDetailData?.staffs.length > 0 && ipdPatientDetailData?.staffs?.map((staff: any) => ([
                      <Link to={`${USER_TABLE_URL}${USER_DETAIL_URL}/${staff?.user_id}`} >
                        <Text as="p" className="flex items-center gap-2 text-primary cursor-pointer w-fit">
                          <UserRound className="w-4 h-4" />{staff?.user_name || "N/A"}
                        </Text>
                      </Link>,
                      staff?.user_phone || "N/A",
                      staff?.user_role?.replace("_", " ").split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "N/A",
                      staff?.assigned_date && dayjs(staff?.assigned_date).format("DD-MM-YYYY") || "N/A"
                    ])) || []}
                  />
                ) : (
                  <Text as="p" className="text-muted-foreground">
                    No staff assigned yet
                  </Text>
                )}
              </View>
            </CardContent>
          </Card>
        </View>

        <SurgeryList />

        {/* Quick Actions Groups */}
        <View className="space-y-12">
          {actionGroups.map((group, groupIndex) => (
            <View key={groupIndex} className="space-y-4 mt-12">
              <View>
                <Text as="h2" className="text-xl font-semibold mb-1">
                  {group.title}
                </Text>
                <Text as="p" className="text-muted-foreground">
                  {group.description}
                </Text>
              </View>

              <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.actions.map((action, index) => {
                  const Icon = action.icon;
                  if (action.onClick) {
                    return (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`bg-gradient-to-br ${action.bgGradient} shadow-md p-4 rounded-lg transition-all duration-200 hover:shadow-lg`}
                      >
                        <View className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <Text as="span" className="font-medium">
                            {action.label}
                          </Text>
                        </View>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={index}
                      to={action.url}
                      className={`bg-gradient-to-br ${action.bgGradient} shadow-md p-4 rounded-lg transition-all duration-200 hover:shadow-lg`}
                    >
                      <View className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <Text as="span" className="font-medium">
                          {action.label}
                        </Text>
                      </View>
                    </Link>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>
    </React.Fragment>
  );
};

export default IpdPatientDetailsPage;
