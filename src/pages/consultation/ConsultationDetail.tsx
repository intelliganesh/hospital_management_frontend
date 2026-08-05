import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/button";
import InfoCard from "@/components/ui/infoCard";
import {
  Calendar,
  User,
  Thermometer,
  HeartPulse,
  Pill,
  Mail,
  Phone,
  Download,
  History,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useConsultation } from "@/actions/calls/consultation";
import { RootState } from "@/actions/store";
import { clearConsultationDetailSlice } from "@/actions/slices/consultation";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import dayjs from "dayjs";
import {
  APPOINTMENT_DETAILS_URL,
  APPOINTMENT_TABLE_URL,
  COMORBIDITIES_DETAILS_URL,
  COMORBIDITIES_TABLE_URL,
  CONSULTATION_TABLE_URL,
  PREVIOUS_CONSULTATIONS_URL,
} from "@/utils/urls/frontend";
import View from "@/components/view";
import Text from "@/components/text";
import { useNavigate } from "react-router-dom";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useInvoice } from "@/actions/calls/invoice";
import DynamicTable from "@/components/ui/DynamicTable";
import WebcamCapture from "@/components/Capture";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import { imageUpload } from "@/actions/calls/uesImage";
import BouncingLoader from "@/components/BouncingLoader";
import { LoadingStatus } from "@/interfaces";
import TabbedCollapsible from "@/components/TabbedCollapsible";
// import PostSurgeryFollowUpForm from "../forms/consultationForm/Post Sergery Follow-up Form/PostSurgeryFollowUpForm";
// import { usePostSurgery } from "@/actions/calls/postSurgeryFollowUp";
// import { PostSurgeryFollowUpForm } from "@/interfaces/consultation/postSurgeryFollowUp";
import FistulaDetails from "./FistulaDetails";
// import PostSurgeryFollowUpComp from "@/pages/postSurgeryFollowUp";
// import { usePostSurgery } from "@/actions/calls/postSurgeryFollowUp";

const ConsultationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { downloadConsultationHandler } = useInvoice();
  const { consultationDetailHandler, cleanUp } = useConsultation();
  // const [searchParams] = useSearchParams();
  // const {postSurgeryFollowUpDownload} = usePostSurgery();

  const [isSubmitting] = useState(false);
  // const [postSurgeryData, setPostSurgeryData] = useState<any[]>([]);

  const [, setDocUpload] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [toogleForm, setToogleForm] = useState(false);
  // const [showFollowUps, setShowFollowUps] = useState(false);
  // const [postSurgeryId, setPostSurgeryId] = useState("");
  // const [postSurgeryFollowUpData] = useState<PostSurgeryFollowUpForm>({consultation_id: "", post_surgery_name: "", date: dayjs().format("YYYY-MM-DD")});
  const [currencySymbol, setCurrencySymbol] = useState("");
  const consultationData = useSelector(
    (state: RootState) => state.consultation.consultationDetailData,
  );

  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol,
  // );

  const { values, onSetHandler } = useForm<Consultation | null>(
    consultationData?.consultations,
  );

  const data = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.proctologyOrNonProctology,
  );

  // const { values, onSetHandler } = useForm<Consultation | null>(
  //   consultationData?.proctologyOrNonProctology
  // );

  // const postSurgeryFollowUpRef = useRef(null);
  useEffect(() => {
    setCurrencySymbol(consultationData?.consultations?.currency ?? null);
  }, [consultationData]);

  useEffect(() => {
    // postSurgeryFollowUpDownload("01988392-1a90-731c-bcf9-de534178964c", ()=>{})
    if (id) {
      consultationDetailHandler(
        id,
        () => {},
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
      dispatch(clearConsultationDetailSlice());
    };
  }, [id]);
  const handleDownloadConsultation = () => {
    if (id) {
      downloadConsultationHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded consultation",
            variant: "success",
          });
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download consultation",
          //   variant: "destructive",
          // });
        }
      });
    }
  };

  // const [data, setData] = useState<any[]>([]);

  //  const {
  //   postSurgeryListHandler,
  //   addpostSurgeryHandler,
  //   postSurgeryEditHandler,
  //   postSurgeryDeleteHandler,
  //   postSurgeryFollowUpCreationHandler,
  //   postSurgeryFollowUpDetailDropdownHandler,
  // } = usePostSurgery();

  // const postSurgeryListData = useSelector(
  //   (state: RootState) => state.postSurgery.postSurgeryListData
  // );

  // const postSurgeryFollowUpDetailDropdownData = useSelector(
  //   (state: RootState) => state.postSurgery.postSurgeryFollowUpDetailDropdownData
  // );

  // const postSurgeryDropdownData = postSurgeryFollowUpDetailDropdownData ?
  // postSurgeryFollowUpDetailDropdownData.map((item: any) => ({
  //   id: item.id,
  //   label: item.post_surgery_name + " - " + dayjs(item.date).format("MMM D, YYYY"),
  //   value: item.id,
  // })) : [];

  // const handleFollowUpFormOpen = () => {
  //   setToogleForm(!toogleForm);
  // };

  // const handlePostSurgeryFollowUpSubmit = () => {
  //   if (id) {
  //     postSurgeryFollowUpCreationHandler(
  //       { ...postSurgeryFollowUpData, patient_id: consultationData?.consultations?.patient_id, consultation_id: id },
  //       (status: boolean) => {
  //         if (status) {
  //           toast({
  //             title: "Success!",
  //             description: "Successfully Created Post Surgery Follow-up",
  //             variant: "success",
  //           });
  //           setToogleForm(false);
  //           setShowFollowUps(true);
  //           postSurgeryFollowUpDetailDropdownHandler(consultationData?.consultations?.patient_id, () => {});
  //         } else {
  //           toast({
  //             title: "Error",
  //             description: "Failed to Create post surgery follow up",
  //             variant: "destructive",
  //           });
  //           setToogleForm(false);
  //           setShowFollowUps(false);
  //         }
  //       }
  //     );

  //   }
  // };

  // useEffect(() => {
  //   postSurgeryListHandler(
  //     searchParams?.get("currentPage") ?? 1,
  //     () => {},
  //     // searchParams.get("search") ?? null,
  //     // searchParams.get("sort_by") ?? null,
  //     // searchParams.get("sort_order") ?? null,
  //     postSurgeryId,
  //     // id,
  //     [],
  //     (status) => {
  //       setIsLoading(
  //         status === "pending"
  //           ? true
  //           : status === "failed"
  //           ? true
  //           : status === "success" && false
  //       );
  //     }
  //   );
  // }, [
  //   // searchParams.get("search"),
  //   // searchParams.get("sort_by"),
  //   // searchParams.get("sort_order"),
  //   postSurgeryId,
  //   id,
  //   searchParams?.get("currentPage"),
  // ]);

  // useEffect(() => {
  //   const dummyData = {
  //     id: "",
  //     surgery_name: "",
  //     date: dayjs().format("YYYY-MM-DD"),
  //     ks_line: "",
  //     dressing: "",
  //     partial_lay_open: "",
  //     follow_up_examination: "",
  //     new_abscess_ind: "",
  //     new_tract_primary_threading: "",
  //     cut_through_or_any_other: "",
  //   };
  //   setData(
  //     postSurgeryListData?.data
  //       ? [...postSurgeryListData?.data, dummyData]
  //       : [dummyData]
  //   );
  // }, [postSurgeryListData]);

  // useEffect(() => {
  //   postSurgeryFollowUpDetailDropdownHandler(consultationData?.consultations?.patient_id, () => {});
  // }, [consultationData?.consultations?.patient_id]);

  // Define surgery name options
  // const surgeryNameOptions = [
  //   { value: 'hemorrhoidectomy', label: 'Hemorrhoidectomy' },
  //   { value: 'fistulotomy', label: 'Fistulotomy' },
  //   { value: 'fissurectomy', label: 'Fissurectomy' },
  //   { value: 'pilonidal_sinus', label: 'Pilonidal Sinus Surgery' },
  //   { value: 'other', label: 'Other' },
  // ];

  // const allTableHeaders = [
  //   { label: "ID", key: "id", type: 'text', hidden: true },
  //   {
  //     label: "Surgery Name",
  //     key: "surgery_name",
  //     type: 'select',
  //     options: surgeryNameOptions
  //   },
  //   { label: "Date", key: "date", type: 'text' },
  //   { label: "KS Changed", key: "ks_changed", type: 'text' },
  //   { label: "Dressing", key: "dressing", type: 'text' },
  //   { label: "Partial Lay Open", key: "partial_lay_open", type: 'text' },
  //   { label: "Follow-up Examination", key: "follow_up_examination", type: 'text' },
  //   { label: "New Abscess I&D", key: "new_abscess_threading", type: 'text' },
  //   {
  //     label: "New Tract Primary Threading",
  //     key: "new_abscess_threading",
  //     type: 'text'
  //   },
  //   { label: "Cut Through or Any Other", key: "cut_through", type: 'text' },
  // ];

  // // Filter out hidden columns for display
  // const visibleTableHeaders = allTableHeaders.filter(header => !header.hidden);

  // const handleCellEdit = (rowIndex: number, colIndex: number, value: any) => {
  //   const key = visibleTableHeaders[colIndex].key;
  //   setData((prev) => {
  //     const newData = [...prev];
  //     newData[rowIndex] = { ...newData[rowIndex], [key]: value };
  //     return newData;
  //   });
  // };

  // const handleRowAdd = (newRow: any[]) => {
  //   const newObj: Record<string, any> = {};
  //   allTableHeaders.forEach((header, index) => {
  //     newObj[header.key] = newRow[index] || "";
  //   });

  //   // setData(prev => [...prev, newObj]);
  // };

  // const handleRowDelete = (rowIndex: number) => {
  //   postSurgeryDeleteHandler(data[rowIndex]?.id, (status: boolean) => {
  //     if (status) {
  //       postSurgeryListHandler(
  //         searchParams?.get("currentPage") ?? 1,
  //         (status: boolean) => {
  //           if (!status) return;
  //           setData((prev) => prev.filter((_, index) => index !== rowIndex));
  //         },
  //         // searchParams.get("search") ?? null,
  //         // searchParams.get("sort_by") ?? null,
  //         // searchParams.get("sort_order") ?? null,
  //         postSurgeryId,
  //         id,
  //         [],
  //         (status) => {
  //           setIsLoading(
  //             status === "pending"
  //               ? true
  //               : status === "failed"
  //               ? true
  //               : status === "success" && false
  //           );
  //         }
  //       );
  //     }
  //   });
  // };

  // useEffect(() => {
  //   const dummyData = {
  //     id: "",
  //     date: dayjs().format("YYYY-MM-DD"),
  //     ks_line: "",
  //     dressing: "",
  //     partial_lay_open: "",
  //     follow_up_examination: "",
  //     new_abscess_ind: "",
  //     new_tract_primary_threading: "",
  //     cut_through_or_any_other: "",
  //   };
  //   setData(
  //     postSurgeryListData?.data
  //       ? [...postSurgeryListData?.data, dummyData]
  //       : [dummyData]
  //   );
  // }, [postSurgeryListData]);

  // const tableHeaders = [
  //   { lable: "ID", key: "id" },
  //   { label: "Date", key: "date" },
  //   { label: "KS Changed", key: "ks_changed" },
  //   { label: "Dressing", key: "dressing" },
  //   { label: "Partial Lay Open", key: "partial_lay_open" },
  //   { label: "Follow-up Examination", key: "follow_up_examination" },
  //   { label: "New Abscess I&D", key: "new_abscess_threading" },
  //   {
  //     label: "New Tract Primary Threading",
  //     key: "new_abscess_threading",
  //   },
  //   { label: "Cut Through or Any Other", key: "cut_through" },
  // ];

  // const handleCellEdit = (rowIndex: number, colIndex: number, value: any) => {
  //   const key = tableHeaders[colIndex].key;
  //   setData((prev) => {
  //     const newData = [...prev];
  //     newData[rowIndex] = { ...newData[rowIndex], [key]: value };
  //     return newData;
  //   });
  // };

  // const handleRowAdd = (newRow: any[]) => {
  //   const newObj: Record<string, any> = {};
  //   tableHeaders.forEach((header, index) => {
  //     newObj[header.key] = newRow[index] || "";
  //   });

  //   // setData(prev => [...prev, newObj]);
  // };

  // const handleRowDelete = (rowIndex: number) => {
  //   postSurgeryDeleteHandler(data[rowIndex]?.id, (status: boolean) => {
  //     if (status) {
  //       postSurgeryListHandler(
  //         searchParams?.get("currentPage") ?? 1,
  //         (status: boolean) => {
  //           if (!status) return;
  //           setData((prev) => prev.filter((_, index) => index !== rowIndex));
  //         },
  //         // searchParams.get("search") ?? null,
  //         // searchParams.get("sort_by") ?? null,
  //         // searchParams.get("sort_order") ?? null,
  //         postSurgeryId,
  //         // id,
  //         [],
  //         (status) => {
  //           setIsLoading(
  //             status === "pending"
  //               ? true
  //               : status === "failed"
  //               ? true
  //               : status === "success" && false
  //           );
  //         }
  //       );
  //     }
  //   });
  // };

  // const scrollToSection = (ref: any) => {
  //   ref.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  //   // setActiveSection(ref.current.id);
  // };

  // const handlePostSurgeryFollowUpNameChange = ( postSurgeryId: string) => {
  //   setPostSurgeryId(postSurgeryId);
  //   // setSearchParams(
  //   //   (prev) => ({
  //   //     ...prev,
  //   //     post_surgery_id: postSurgeryId,
  //   //     consultation_id: id,
  //   //   })
  //   // );
  //   postSurgeryListHandler(
  //     searchParams?.get("currentPage") ?? 1,
  //     () => {},
  //     // searchParams.get("search") ?? null,
  //     // searchParams.get("sort_by") ?? null,
  //     // searchParams.get("sort_order") ?? null,
  //     // searchParams.get("post_surgery_id") ?? null,
  //     // searchParams.get("consultation_id") ?? null,
  //     postSurgeryId,
  //     // id,
  //     [],
  //     (status) => {
  //       setIsLoading(
  //         status === "pending"
  //           ? true
  //           : status === "failed"
  //           ? true
  //           : status === "success" && false
  //       );
  //     }
  //   );
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let consultationFormObj: Partial<Consultation> = {};
    for (let [key, value] of formData.entries()) {
      consultationFormObj[key as keyof Consultation] = value as any;
    }

    // consultationFormObj["patient_document"] = values?.patient_document;

    if (values?.existing_file_urls || values?.new_files) {
      const existingUrls = values?.existing_file_urls
        ? values?.existing_file_urls
            ?.split(",")
            ?.filter((url: string) => url?.trim())
        : [];
      const newFiles = values?.new_files || [];

      // Include both existing URLs and new Files in patient_document
      // const combinedFiles = [...existingUrls, ...newFiles];
      const combinedFiles = [...existingUrls, ...newFiles].filter(
        (item) =>
          typeof item === "string" || (item instanceof File && item.name),
      );
      (consultationFormObj as any)["patient_document"] = combinedFiles;

      // Set docUpload state for file upload
      // const actualFiles = newFiles.filter((file: any) => file instanceof File);
      // setDocUpload(actualFiles);
      setDocUpload(combinedFiles);
    } else if (values?.patient_document) {
      // Fallback to original method
      consultationFormObj["patient_document"] = values?.patient_document;
      setDocUpload(
        Array.isArray(values?.patient_document)
          ? values?.patient_document.filter((item: any) => item instanceof File)
          : [],
      );
    }

    delete consultationFormObj["existing_file_urls"];
    delete consultationFormObj["new_files"];

    if (
      values?.patient_document &&
      values?.patient_document?.length > 0 &&
      consultationData?.proctologyOrNonProctology?.id
    ) {
      const docs =
        typeof values.patient_document === "string"
          ? values.patient_document
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : values.patient_document;
      const imageUploaddata = {
        id: consultationData?.proctologyOrNonProctology?.id,
        modal_type: "patient_documents",
        file_name: "document_path",
        folder_name: "patient_documents",
        image: docs.filter((x: any) => x instanceof File),
        oldImage: docs.filter((x: any) => typeof x === "string"),
      };
      imageUpload(imageUploaddata, (uploadSuccess, _) => {
        if (!uploadSuccess) {
          // toast({
          //   title: "Error!",
          //   description: "Failed to upload documents",
          //   variant: "destructive",
          // });
        } else {
          toast({
            title: "Success!",
            description: "Documents uploaded successfully",
            variant: "success",
          });
        }
      });
    }

    return;
  };

  return (
    <View className="space-y-6 container mx-auto px-4 py-6 md:px-6 md:py-8">
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <View className="flex flex-wrap justify-end gap-2">
        {/* {
          !toogleForm && (
            <> */}
        {/* <Button
          onClick={() => scrollToSection(postSurgeryFollowUpRef)}
          className="flex gap-2"
          variant="outline"
        >
          Create post surgery follow up
        </Button> */}

        {consultationData?.consultations?.status === "Pending" ? (
          ""
        ) : (
          <Button
            onClick={handleDownloadConsultation}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download Consultation
          </Button>
        )}
        {/* </>
          ) 
        } */}
      </View>
      {/* {
        !toogleForm && ( */}
      <View className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <View>
          <View className="flex flex-wrap items-center gap-2 mb-2">
            <Text as="h1" weight="font-semibold" className="text-2xl font-bold">
              Consultation Details
            </Text>
            <Badge
              style={getStatusColorScheme(
                consultationData?.consultations?.status,
              )}
            >
              {consultationData?.consultations?.status || "N/A"}
            </Badge>
          </View>
          <Text as="p" className="text-muted-foreground">
            Medical consultation information for{" "}
            {consultationData?.consultations?.patient_name || "N/A"}
          </Text>
        </View>

        <View className="flex flex-wrap gap-2 lg:justify-end">
          {consultationData?.consultations?.consutlation_type &&
            consultationData?.consultations?.status !== "Completed" &&
            consultationData?.consultations?.consutlation_type === "ONLINE" && (
              <Link
                to={consultationData?.consultations?.meeting_link || ""}
                target="_blank"
              >
                <Button>Join Meeting</Button>
              </Link>
            )}

          {consultationData?.consultations?.patient_id && (
            <Link
              to={`${CONSULTATION_TABLE_URL}${PREVIOUS_CONSULTATIONS_URL}/${consultationData.consultations.patient_id}/${id}`}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <History size={16} />
                Previous Consultations
              </Button>
            </Link>
          )}
          <Link
            to={`${APPOINTMENT_TABLE_URL}${APPOINTMENT_DETAILS_URL}/${consultationData?.consultations?.appointment_id}`}
          >
            <Button variant="outline">View Appointments</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => navigate(CONSULTATION_TABLE_URL + "?currentPage=1")}
            className="flex gap-2"
          >
            Back to Home
          </Button>
        </View>
      </View>
      {/* // )
      // } */}

      {/* {
        toogleForm ? (
          <PostSurgeryFollowUpForm formType="add" toogleValue={toogleForm} toogleForm={setToogleForm} />
        ) : ( */}
      <View className="space-y-4">
        {/* Basic Consultation Information */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Information</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard
                label="Appointment Number"
                value={
                  consultationData?.consultations?.appointment_number || "N/A"
                }
                icon={<Calendar className="h-5 w-5 text-primary" />}
              />
              <InfoCard
                label="Patient Number"
                value={consultationData?.consultations?.patient_number || "N/A"}
                icon={<User className="h-5 w-5 text-primary" />}
              />
              {/* <InfoCard
              label="Complaint"
              value={consultationData?.consultations?.complaint || "N/A"}
              icon={<MessageSquare className="h-5 w-5 text-primary" />}
            /> */}
              <InfoCard
                label="Next Visit"
                value={
                  consultationData?.consultations?.next_visit_date
                    ? dayjs(
                        consultationData?.consultations?.next_visit_date,
                      )?.format("MMM D, YYYY")
                    : "N/A"
                }
                icon={<Calendar className="h-5 w-5 text-primary" />}
              />
            </View>

            <View className="mt-6">
              <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Patient Information */}
                <View className="space-y-2">
                  <Text as="h3" className="font-semibold">
                    Patient Information
                  </Text>
                  <View className="flex items-start space-x-4">
                    <View className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary text-lg font-bold">
                      {consultationData?.consultations?.patient_name.charAt(0)}
                    </View>
                    <View>
                      <Text as="h3" className="font-medium text-lg">
                        {consultationData?.consultations?.patient_name || "N/A"}
                        {consultationData?.consultations?.patient_age
                          ? ` (Age:${consultationData.consultations.patient_age})`
                          : ""}
                      </Text>
                      <View className="text-sm text-muted-foreground mt-1">
                        <a
                          href={`mailto:${consultationData?.consultations?.patient_email}`}
                        >
                          <View className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {consultationData?.consultations?.patient_email ||
                              "N/A"}
                          </View>
                        </a>
                        <a
                          href={`tel:${consultationData?.consultations?.patient_phone}`}
                        >
                          <View className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4" />
                            {consultationData?.consultations?.patient_phone ||
                              "N/A"}
                          </View>
                        </a>
                        <View className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4" />
                          {consultationData?.consultations?.patient_number ||
                            "N/A"}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Doctor Information */}
                <View className="space-y-2">
                  <Text as="h3" className="font-semibold">
                    Doctor Information
                  </Text>
                  <View className="flex items-start space-x-4">
                    <View className="w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center text-secondary text-lg font-bold">
                      {consultationData?.consultations?.doctor_name?.charAt(0)}
                    </View>
                    <View>
                      <Text as="h3" className="font-medium text-lg">
                        Dr.{" "}
                        {consultationData?.consultations?.doctor_name || "N/A"}
                      </Text>
                      <View className="text-sm text-muted-foreground mt-1">
                        <a
                          href={`mailto:${consultationData?.consultations?.doctor_email}`}
                        >
                          <View className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {consultationData?.consultations?.doctor_email ||
                              "N/A"}
                          </View>
                        </a>
                        <a
                          href={`tel:${consultationData?.consultations?.doctor_phone}`}
                        >
                          <View className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4" />
                            {consultationData?.consultations?.doctor_phone ||
                              "N/A"}
                          </View>
                        </a>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Front Desk User Information */}
                <View className="space-y-2">
                  <Text as="h3" className="font-semibold">
                    Front Desk Information
                  </Text>
                  <View className="flex items-start space-x-4">
                    <View className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center text-accent text-lg font-bold">
                      {consultationData?.consultations?.front_desk_user_name?.charAt(
                        0,
                      )}
                    </View>
                    <View>
                      <Text as="h3" className="font-medium text-lg">
                        {consultationData?.consultations
                          ?.front_desk_user_name || "N/A"}
                      </Text>
                      <View className="text-sm text-muted-foreground mt-1">
                        <a
                          href={`mailto:${consultationData?.consultations?.front_desk_user_email}`}
                        >
                          <View className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {consultationData?.consultations
                              ?.front_desk_user_email || "N/A"}
                          </View>
                        </a>
                        <a
                          href={`tel:${consultationData?.consultations?.front_desk_user_phone}`}
                        >
                          <View className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4" />
                            {consultationData?.consultations
                              ?.front_desk_user_phone || "N/A"}
                          </View>
                        </a>
                      </View>
                    </View>
                  </View>
                </View>
                {consultationData?.consultations?.complaint && (
                  <View className="space-y-2">
                    <Text as="h3" className="font-semibold">
                      Complaint
                    </Text>
                    <Text as="p" className="text-muted-foreground">
                      {consultationData?.consultations?.complaint || "N/A"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View>
              <TabbedCollapsible
                tabs={[
                  {
                    title: "Chief Complaints",
                    items: consultationData?.proctologyOrNonProctology
                      ?.chief_complaints
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology
                            ?.chief_complaints,
                        ).map((item: any) => item.label)
                      : ["N/A"],
                    badge: consultationData?.proctologyOrNonProctology
                      ?.chief_complaints
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology
                            ?.chief_complaints,
                        ).length.toString()
                      : "0",
                  },
                  {
                    title: "Surgical History",
                    items: consultationData?.proctologyOrNonProctology
                      ?.surgical_history
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology
                            ?.surgical_history,
                        ).map((item: any) => item.label)
                      : ["N/A"],
                    badge: consultationData?.proctologyOrNonProctology
                      ?.surgical_history
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology
                            ?.surgical_history,
                        ).length.toString()
                      : "0",
                  },
                  {
                    title: "Co-Morbidities",
                    items: consultationData?.consultationComorbidities ? (
                      <DynamicTable
                        tableHeaders={["Name", "Description", "Chronic"]}
                        tableData={consultationData?.consultationComorbidities?.map(
                          (data: any) => [
                            <Link
                              to={`${
                                COMORBIDITIES_TABLE_URL +
                                COMORBIDITIES_DETAILS_URL
                              }/${data?.comorbidities_id}`}
                              className="font-medium  hover:text-secondary hover:underline"
                            >
                              {data?.name}
                            </Link>,
                            data?.description,
                            <Badge
                              variant={
                                data?.is_chronic ? "destructive" : "outline"
                              }
                            >
                              {data?.is_chronic ? "Yes" : "No"}
                            </Badge>,
                          ],
                        )}
                      />
                    ) : (
                      ["N/A"]
                    ),
                    badge: consultationData?.consultationComorbidities
                      ? consultationData?.consultationComorbidities.length.toString()
                      : "0",
                  },
                  {
                    title: "DRE",
                    items: consultationData?.proctologyOrNonProctology ? (
                      <View>
                        {consultationData?.proctologyOrNonProctology?.dre
                          ? JSON.parse(
                              consultationData?.proctologyOrNonProctology?.dre,
                            ).map((item: any) => {
                              return (
                                <View
                                  key={item.id}
                                  className="bg-neutral-100 dark:bg-card p-3 rounded-md mb-2"
                                >
                                  <Text as="p">{item.label}</Text>
                                  {item?.description && (
                                    <Text
                                      as="span"
                                      className="text-muted-foreground"
                                    >
                                      {item?.description}
                                    </Text>
                                  )}
                                </View>
                              );
                            })
                          : "N/A"}

                        <Separator className="my-4 bg-neutral-200" />

                        {(consultationData?.proctologyOrNonProctology
                          ?.dre_induration_at ||
                          consultationData?.proctologyOrNonProctology
                            ?.dre_secondary_position) && (
                          <View className="mt-6">
                            <Text as="h4" className="font-semibold">
                              DRE Induration and Secondary Position:
                            </Text>
                            <View className="space-y-2">
                              <Text as="h5">
                                <span className="font-semibold text-muted-foreground">
                                  Induration at:
                                </span>{" "}
                                {consultationData?.proctologyOrNonProctology
                                  ?.dre_induration_at
                                  ? consultationData?.proctologyOrNonProctology
                                      ?.dre_induration_at
                                  : "N/A"}
                              </Text>
                              <Text as="h5">
                                <span className="font-semibold text-muted-foreground">
                                  Secondary Position:{" "}
                                </span>
                                {consultationData?.proctologyOrNonProctology
                                  ?.dre_secondary_position || "N/A"}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ) : (
                      ["N/A"]
                    ),
                    badge: consultationData?.proctologyOrNonProctology?.dre
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology?.dre,
                        ).length.toString()
                      : "0",
                  },
                  {
                    title: "Proctoscopy",
                    items: consultationData?.proctologyOrNonProctology ? (
                      <View className="space-y-4">
                        {consultationData?.proctologyOrNonProctology
                          ?.proctoscopy
                          ? JSON.parse(
                              consultationData?.proctologyOrNonProctology
                                ?.proctoscopy,
                            ).map((item: any) => {
                              return (
                                <View
                                  key={item.id}
                                  className="bg-neutral-100 dark:bg-card p-3 rounded-md mb-2"
                                >
                                  <Text as="p">{item.label}</Text>
                                  {item?.description && (
                                    <Text
                                      as="span"
                                      className="text-muted-foreground"
                                    >
                                      {item?.description}
                                    </Text>
                                  )}
                                </View>
                              );
                            })
                          : "N/A"}
                        <Separator className="my-4 bg-neutral-200" />

                        {(consultationData?.proctologyOrNonProctology
                          ?.proctoscopy_secondary_position ||
                          consultationData?.proctologyOrNonProctology
                            ?.proctoscopy_anal_polyp_at) && (
                          <View className="mt-6">
                            {/* <Text as="h4" className="font-semibold">
                              Anal Polyp at:
                            </Text> */}
                            {/* <Text as="h4" className="font-semibold">
                              Proctoscopy Secondary Position and Anal Polyp at:
                            </Text> */}
                            <View className="space-y-2">
                              {/* <Text as="h5">
                                <span className="font-semibold text-muted-foreground">
                                  Secondary Position:
                                </span>{" "}
                                {consultationData?.proctologyOrNonProctology
                                  ?.proctoscopy_secondary_position || "N/A"}
                              </Text> */}
                              <Text as="h5">
                                <span className="font-semibold">
                                  Anal Polyp at:
                                </span>{" "}
                                {consultationData?.proctologyOrNonProctology
                                  ?.proctoscopy_anal_polyp_at || "N/A"}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ) : (
                      ["N/A"]
                    ),
                    badge: consultationData?.proctologyOrNonProctology
                      ?.proctoscopy
                      ? JSON.parse(
                          consultationData?.proctologyOrNonProctology
                            ?.proctoscopy,
                        ).length.toString()
                      : "0",
                  },
                ]}
              />
            </View>

            {/* <View>
            <Text as="h3" className="text-lg font-semibold mb-2">
              Chief Complaints <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.proctologyOrNonProctology?.chief_complaints && JSON.parse(consultationData?.proctologyOrNonProctology?.chief_complaints).length || "0"
                  }
                </Text>
            </Text> 
            <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
              {consultationData?.proctologyOrNonProctology?.chief_complaints ? JSON.parse(consultationData?.proctologyOrNonProctology?.chief_complaints).map(
                (item: any) => {
                  return (
                    <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                      <Text as="p" >
                        {item.label}
                      </Text>
                      {
                        item?.description && (
                        <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                  )
                }
              ) : "N/A"}
            </View>
          </View> */}

            {/* <View>
            <Text as="h3" className="text-lg font-semibold mb-2">
              Surgical History <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.proctologyOrNonProctology?.surgical_history && JSON.parse(consultationData?.proctologyOrNonProctology?.surgical_history).length || "0"
                  }
                </Text>
            </Text>
            <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
              {consultationData?.proctologyOrNonProctology?.surgical_history? JSON.parse(consultationData?.proctologyOrNonProctology?.surgical_history).map(
                (item: any) => {
                  return (
                    <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                      <Text as="p" >
                        {item.label}
                      </Text>
                      {
                        item?.description && (
                        <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                  )
                }
              ) : "N/A"}
            </View>
          </View> */}

            {/* <View>
            <Text as="h3" className="text-lg font-semibold">
              Co-morbidities <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.consultationComorbidities && consultationData?.consultationComorbidities.length || "0"
                  }
                </Text>
            </Text>
            {
              consultationData?.consultationComorbidities ? (
                <DynamicTable
            tableHeaders={["Name", "Description", "Chronic"]}
            tableData={consultationData?.consultationComorbidities?.map((data: any) => [
              <Link
                to={`${COMORBIDITIES_TABLE_URL + COMORBIDITIES_DETAILS_URL}/${data?.comorbidities_id}`}
                className="font-medium  hover:text-secondary hover:underline"
              >
                {data?.name}
              </Link>,
              data?.description,
              <Badge variant={data?.is_chronic ? "destructive" : "outline"}>
                {data?.is_chronic ? "Yes" : "No"}
              </Badge>,
            ])}
          />
              ) :  "N/A"
            }
          </View> */}
          </CardContent>
        </Card>

        {/* Vitals & Examination */}
        <Card>
          <CardHeader>
            {/* <CardTitle>Vitals & Examination</CardTitle> */}
            <CardTitle>Examination & Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard
                label="Temperature"
                value={consultationData?.vitals?.temperature || "N/A"}
                icon={<Thermometer className="h-5 w-5 text-red-500" />}
                iconStyle="bg-red-100"
              />
              <InfoCard
                label="Blood Pressure"
                value={`${consultationData?.vitals?.bp || "N/A"} mmHg`}
                icon={<HeartPulse className="h-5 w-5 text-red-500" />}
                iconStyle="bg-red-100"
              />
              <InfoCard
                label="Pulse"
                value={`${consultationData?.vitals?.pulse || "N/A"} bpm`}
                icon={<HeartPulse className="h-5 w-5 text-red-500" />}
                iconStyle="bg-red-100"
              />
            </View>

            {/* Prakriti, Vikruti, Agni, Koshta, Avastha */}
            {consultationData?.consultations?.type === "Non Proctology" && (
              <View className="grid grid-cols-1 md:grid-cols-2  gap-4">
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Prakriti
                  </Text>
                  <Text as="p" className="text-muted-foreground">
                    {consultationData?.proctologyOrNonProctology?.prakriti ||
                      "N/A"}
                  </Text>
                </View>
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Vikruti
                  </Text>
                  <Text as="p" className="text-muted-foreground">
                    {consultationData?.consultations?.vikruti || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Agni
                  </Text>
                  <Text as="p" className="text-muted-foreground">
                    {consultationData?.consultations?.agni || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Koshta
                  </Text>
                  <Text as="p" className="text-muted-foreground">
                    {consultationData?.consultations?.koshta || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Avastha
                  </Text>
                  <Text as="p" className="text-muted-foreground">
                    {consultationData?.consultations?.avastha || "N/A"}
                  </Text>
                </View>
              </View>
            )}

            <Separator className="my-4" />

            <View className="space-y-6">
              <View>
                <TabbedCollapsible
                  tabs={[
                    {
                      title: "On Examination",
                      items: consultationData?.proctologyOrNonProctology
                        ?.on_examination
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.on_examination,
                          ).map((item: any) => item.label)
                        : ["N/A"],
                      badge: consultationData?.proctologyOrNonProctology
                        ?.on_examination
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.on_examination,
                          ).length.toString()
                        : "0",
                    },
                    {
                      title: "Diagnosis",
                      items:
                        consultationData?.proctologyOrNonProctology
                          ?.diagnosis_summary || "N/A",

                      // items: consultationData?.consultations
                      //   ?.preliminary_diagnosis
                      //   ? JSON.parse(
                      //       consultationData?.consultations
                      //         ?.preliminary_diagnosis
                      //     ).map((item: any) => item.label)
                      //   : ["N/A"],
                      // badge: consultationData?.consultations
                      //   ?.preliminary_diagnosis
                      //   ? JSON.parse(
                      //       consultationData?.consultations
                      //         ?.preliminary_diagnosis
                      //     ).length.toString()
                      //   : "0",
                    },
                    {
                      title: "Tests",
                      items: consultationData?.proctologyOrNonProctology?.tests
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology?.tests,
                          ).map((item: any) => item.label)
                        : ["N/A"],
                      badge: consultationData?.proctologyOrNonProctology?.tests
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology?.tests,
                          ).length.toString()
                        : "0",
                    },
                  ]}
                />
              </View>
            </View>
            {/* <View>
              <Text as="h3" className="text-lg font-semibold mb-2 flex items-center gap-4">
                On Examinations <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.proctologyOrNonProctology?.on_examination && JSON.parse(consultationData?.proctologyOrNonProctology?.on_examination).length || "0"
                  }
                </Text>
              </Text>
              <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                {consultationData?.proctologyOrNonProctology?.on_examination ? JSON.parse(consultationData?.proctologyOrNonProctology?.on_examination).map(
                  (item: any) => {
                    return (
                      <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                        <Text as="p" >
                          {item.label}
                        </Text>
                        {
                          item?.description && (
                        <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                    )
                  }
                ) : "N/A"}
                </View>
              </View> */}

            {/* diagnonsis  */}
            {/* <View>
              <Text as="h3" className="text-lg font-semibold mb-2 flex items-center gap-4">
                Diagnosis <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.consultations?.preliminary_diagnosis && JSON.parse(consultationData?.consultations?.preliminary_diagnosis).length || "0"
                  }
                </Text>
              </Text>
              <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                {consultationData?.consultations?.preliminary_diagnosis ? JSON.parse(consultationData?.consultations?.preliminary_diagnosis).map(
                  (item: any) => {
                    return (
                      <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                        <Text as="p" >
                          {item.label}
                        </Text>
                        {
                          item?.description && (
                        <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                    )
                  }
                ) : "N/A"}
                </View>
              </View> */}

            {/* Tests  */}
            {/* <View>
              <Text as="h3" className="text-lg font-semibold mb-2 flex items-center gap-4">
                Tests <Text as="span" className="text-sm bg-primary px-2 py-1 rounded-full">
                  {
                    consultationData?.proctologyOrNonProctology?.tests && JSON.parse(consultationData?.proctologyOrNonProctology?.tests).length || "0"
                  }
                </Text>
              </Text>
              <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                {consultationData?.proctologyOrNonProctology?.tests ? JSON.parse(consultationData?.proctologyOrNonProctology?.tests).map(
                  (item: any) => {
                    return (
                      <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                        <Text as="p" >
                          {item.label}
                        </Text>
                        {
                          item?.description && (
                            <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                    )
                  }
                ) : "N/A"}
                </View>
              </View> */}
            {/* </View> */}

            {/* <View>
            <Text as="h3" className="text-lg font-semibold mb-2">
              System Examination
            </Text>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System</TableHead>
                  <TableHead>Findings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" /> CVS
                  </TableCell>
                  <TableCell>
                    <View
                      dangerouslySetInnerHTML={{
                        __html: consultationData?.vitals?.cvs || "N/A",
                      }}
                    >
                      {null}
                    </View>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" /> RS
                  </TableCell>
                  <TableCell>
                    <View
                      dangerouslySetInnerHTML={{
                        __html: consultationData?.vitals?.rs || "N/A",
                      }}
                    >
                      {null}
                    </View>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </View> */}

            {/* <View className="space-y-3">

            <View>
              <Text as="h3" className="text-lg font-semibold mb-1">
                Examination Overview
              </Text>
              <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                <View
                  dangerouslySetInnerHTML={{
                    __html:
                      consultationData?.examinations?.examination_overview ||
                      "N/A",
                  }}
                >
                  {null}
                </View>
              </View>
            </View>
          </View> */}
          </CardContent>
        </Card>

        {/* Fistula Information - Only for Proctology */}
        {consultationData?.consultations?.type === "Proctology" && (
          <FistulaDetails data={data} />
        )}

        {/* <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
            <CardTitle>Diagnosis & Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Text
              as="h4"
              className="font-semibold text-sm text-muted-foreground mb-1"
            >
              Managements
            </Text>
            <View className="flex flex-wrap gap-2">
              {consultationData?.proctologyOrNonProctology?.managements ? (
                JSON.parse(
                  consultationData?.proctologyOrNonProctology?.managements,
                ).map((m: any, i: number) => (
                  <Badge key={i} variant="primary" className="text-white">
                    {m?.label || m?.value || m}
                  </Badge>
                ))
              ) : (
                <Text as="p" className="text-sm">
                  N/A
                </Text>
              )}
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                label="Management Date"
                value={
                  consultationData?.proctologyOrNonProctology?.managements_date
                    ? dayjs(
                        consultationData?.proctologyOrNonProctology
                          ?.managements_date,
                      ).format("MMM D, YYYY")
                    : "N/A"
                }
              />

              <View>
                <InfoCard
                  label="Management Remark"
                  value={
                    consultationData?.proctologyOrNonProctology
                      ?.fistula_remark || "N/A"
                  }
                />
              </View>
            </View>
          </CardContent>
        </Card> */}

        {/* Diagnosis & Advice */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Plan</CardTitle>
            {/* <CardTitle>Diagnosis & Advice</CardTitle> */}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <View>
            <Text as="h3" className="text-lg font-semibold mb-1">
              Preliminary Diagnosis
            </Text>
            <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
              {consultationData?.consultations?.preliminary_diagnosis || "N/A"}
            </View>
          </View> */}

            {/* <View>
            <Text as="h3" className="text-lg font-semibold mb-1">
              Advice
            </Text>
            <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
              {consultationData?.consultations?.advice || "N/A"}
            </View>
          </View> */}

            {/* Treatment plan  */}
            <View>
              <Text as="h3" className="text-lg font-semibold mb-1">
                Treatment Plan
              </Text>
              <View
                className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border"
                dangerouslySetInnerHTML={{
                  __html:
                    consultationData?.proctologyOrNonProctology
                      ?.treatment_plan || "N/A",
                }}
              >
                {/* {consultationData?.proctologyOrNonProctology?.treatment_plan || "N/A"} */}
              </View>

              {/* Diet Plan  */}
              <View className="mt-6">
                <TabbedCollapsible
                  tabs={[
                    {
                      title: "Diet Plan",
                      items: consultationData?.proctologyOrNonProctology
                        ?.diet_plan
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.diet_plan,
                          ).map((item: any) => item.label)
                        : ["N/A"],
                      badge: consultationData?.proctologyOrNonProctology
                        ?.diet_plan
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.diet_plan,
                          ).length.toString()
                        : "0",
                    },
                  ]}
                />
              </View>
              {/* <View className="mt-6">
            <Text as="h3" className="text-lg font-semibold mb-1">
              Diet Plan
            </Text>
            <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
              {consultationData?.proctologyOrNonProctology?.diet_plan ? JSON.parse(consultationData?.proctologyOrNonProctology?.diet_plan).map(
                (item: any) => {
                  return (
                    <View key={item.id} className="bg-card p-3 rounded-md mb-2">
                      <Text as="p" >
                        {item.label}
                      </Text>
                      {
                        item?.description && (
                        <Text as="span" className="text-muted-foreground">
                          {item?.description}
                        </Text>
                      )
                      }
                    </View>
                  )
                }
              ) : "N/A"}
            </View>
            </View> */}

              {consultationData?.consultations?.type === "Non Proctology" && (
                <>
                  <View className="mt-6">
                    <Text as="h3" className="text-lg font-semibold mb-1">
                      Yoga Prescription{" "}
                      <Text
                        as="span"
                        className="text-sm bg-primary px-2 py-1 rounded-full"
                      >
                        {(consultationData?.proctologyOrNonProctology
                          ?.yoga_prescription &&
                          JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.yoga_prescription,
                          ).length) ||
                          "0"}
                      </Text>
                    </Text>
                    <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                      {consultationData?.proctologyOrNonProctology
                        ?.yoga_prescription
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.yoga_prescription,
                          ).map((item: any) => {
                            return (
                              <View
                                key={item.id}
                                className="bg-card p-3 rounded-md mb-2"
                              >
                                <Text as="p">{item.label}</Text>
                                {item?.description && (
                                  <Text
                                    as="span"
                                    className="text-muted-foreground"
                                  >
                                    {item?.description}
                                  </Text>
                                )}
                              </View>
                            );
                          })
                        : "N/A"}
                    </View>
                  </View>

                  <View className="mt-6">
                    <Text as="h3" className="text-lg font-semibold mb-1">
                      Food Advice
                    </Text>
                    <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                      {consultationData?.proctologyOrNonProctology?.food_advice
                        ? JSON.parse(
                            consultationData?.proctologyOrNonProctology
                              ?.food_advice,
                          ).map((item: any) => {
                            return (
                              <View
                                key={item.id}
                                className="bg-card p-3 rounded-md mb-2"
                              >
                                <Text as="p">{item.label}</Text>
                                {item?.description && (
                                  <Text
                                    as="span"
                                    className="text-muted-foreground"
                                  >
                                    {item?.description}
                                  </Text>
                                )}
                              </View>
                            );
                          })
                        : "N/A"}
                    </View>
                  </View>
                </>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Prescribed Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              {consultationData?.proctologyOrNonProctology?.medicines ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Timing</TableHead>
                      <TableHead>Take with</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultationData?.proctologyOrNonProctology?.medicines
                      ?.split(",")
                      ?.map((medicine: any, index: number) => {
                        const [
                          medicineName,
                          _,
                          dosage,
                          timing,
                          takeWith,
                          duration,
                        ] = medicine?.split("#");
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium flex items-center">
                              <Pill className="h-4 w-4 mr-2" />{" "}
                              {/* <Link
                          className="text-primary hover:underline"
                          to={`${MEDICINE_TABLE_URL}${MEDICINE_DETAILS_URL}/${medicineName}`}
                        >
                          {medicineName || "N/A"}
                        </Link> */}
                              {medicineName || "N/A"}
                            </TableCell>
                            <TableCell>
                              {["1_time", "2_time", "3_time"].includes(dosage)
                                ? dosage?.split("_")?.join(" ")
                                : dosage || "N/A"}
                            </TableCell>
                            <TableCell>{`${timing || "N/A"}`}</TableCell>
                            <TableCell>{`${takeWith || "N/A"}`}</TableCell>
                            <TableCell>{`${duration || "N/A"} days`}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <View className="text-center py-4 text-muted-foreground">
                  No medicines prescribed
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* combination medicines  */}
        <Card>
          <CardHeader>
            <CardTitle>Prescribed Combined Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              {consultationData?.proctologyOrNonProctology
                ?.combination_medicines ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Combinations</TableHead>
                      <TableHead className="w-[15%]">Dosage</TableHead>
                      <TableHead className="w-[15%]">Timing</TableHead>
                      <TableHead className="w-[15%]">Take with</TableHead>
                      <TableHead className="w-[15%]">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {JSON.parse(
                      consultationData?.proctologyOrNonProctology
                        ?.combination_medicines,
                    )?.map((combination: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <View className="flex flex-wrap items-center gap-2">
                              <Pill className="h-4 w-4 mr-2" />
                              {combination?.combination_ingredients?.map(
                                (ingredient: any, index: number) => {
                                  return (
                                    <View key={index}>
                                      <Text as="p" className="text-sm">{`${
                                        ingredient?.combination_medicine
                                      } (${
                                        ingredient?.combination_unit ===
                                        "tablet"
                                          ? ingredient?.combination_quantity +
                                            " " +
                                            ingredient?.combination_unit
                                          : ingredient?.combination_quantity +
                                            ingredient?.combination_unit
                                      }) ${
                                        index ===
                                        combination?.combination_ingredients
                                          ?.length -
                                          1
                                          ? ""
                                          : "+ "
                                      }`}</Text>
                                      {/* <Text as="p">{ingredient?.combination_medicine} {"(" + ingredient?.combination_quantity + "" + ingredient?.combination_unit + ")"} {index === combination?.combination_ingredients?.length - 1 ? "" : "+ "} </Text>  */}
                                    </View>
                                  );
                                },
                              )}
                            </View>
                          </TableCell>
                          <TableCell>
                            {["1_time", "2_time", "3_time"].includes(
                              combination?.combination_dosage,
                            )
                              ? combination?.combination_dosage
                                  ?.split("_")
                                  ?.join(" ")
                              : combination?.combination_dosage || "N/A"}
                          </TableCell>
                          <TableCell>{`${
                            combination?.combination_timing || "N/A"
                          }`}</TableCell>
                          <TableCell>{`${
                            combination?.combination_take_with || "N/A"
                          }`}</TableCell>
                          <TableCell>{`${
                            combination?.combination_medicine_days || "N/A"
                          } days`}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <View className="text-center py-4 text-muted-foreground">
                  No combined medicines prescribed
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* consultation and billing  */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation & Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <View>
                <InfoCard
                  label="Advice for Admission"
                  value={
                    consultationData?.consultations?.advice_admition
                      ? "Yes" +
                        ` ( On ${dayjs(
                          consultationData?.consultations?.advice_admition_date,
                        )?.format("MMM D, YYYY")})`
                      : "No"
                  }
                  // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                />
              </View>

              <View>
                <InfoCard
                  label="Consultation Type"
                  value={
                    consultationData?.consultations?.type
                      ? consultationData?.consultations?.type
                      : "N/A"
                  }
                  // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                />
              </View>

              <View>
                <InfoCard
                  label="Next Visit Date"
                  value={
                    consultationData?.consultations?.next_visit_date
                      ? dayjs(
                          consultationData?.consultations?.next_visit_date,
                        )?.format("MMM D, YYYY")
                      : "N/A"
                  }
                  // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                />
              </View>
              <View>
                <InfoCard
                  label="Estimated Cost"
                  // value={
                  //   consultationData?.proctologyOrNonProctology?.amount
                  //     ? currencySymbol +
                  //       consultationData?.proctologyOrNonProctology?.amount
                  //     : currencySymbol + 0
                  // }
                  value={
                    consultationData?.proctologyOrNonProctology?.amount
                      ? currencySymbol +
                        consultationData?.proctologyOrNonProctology?.amount
                      : currencySymbol + 0
                  }
                  // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                />
              </View>
            </View>
            <View className="mt-6">
              <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <View>
                  <InfoCard
                    label="Consultation Cost"
                    value={
                      consultationData?.consultations?.consultation_amount
                        ? currencySymbol +
                          consultationData?.consultations?.consultation_amount
                        : "N/A"
                    }
                    // value={
                    //   consultationData?.consultations?.consultation_amount
                    //     ? currencySymbol +
                    //       consultationData?.consultations?.consultation_amount
                    //     : "N/A"
                    // }
                    // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                  />
                </View>
                <View>
                  <InfoCard
                    label="Discount Amount"
                    value={
                      consultationData?.consultations?.discount_amount
                        ? currencySymbol +
                          consultationData?.consultations?.discount_amount
                        : "N/A"
                    }
                    // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                  />
                </View>
                <View>
                  <InfoCard
                    label="Total Amount"
                    value={
                      consultationData?.consultations?.total_amount
                        ? currencySymbol +
                          consultationData?.consultations?.total_amount
                        : "N/A"
                    }
                    // icon={<CurrencyDollar className="h-5 w-5 text-primary" />}
                  />
                </View>

                {/* <View>
                  <InfoCard
                    label="Surgical Cost"
                    value={
                      consultationData?.consultations?.surgical_cost
                        ? currencySymbol + consultationData?.consultations?.surgical_cost
                        : currencySymbol + 0
                    }
                  />
                </View> */}
              </View>
            </View>

            <View className="mt-6">
              <Text as="h3" className="text-lg font-semibold">
                Additional Cost
              </Text>
              <DynamicTable
                tableHeaders={["Services", "Cost"]}
                tableData={
                  consultationData?.additionalCost
                    ?.filter(
                      (service: any) => service?.include_in_invoice === 1,
                    )
                    ?.map((service: any) => [
                      service?.amount_for,
                      currencySymbol + service?.amount,
                    ]) || []
                }
              />
            </View>
          </CardContent>
        </Card>

        {/* Documents  */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <View className="space-y-4">
                <View>
                  <Text as="h3" className="text-lg font-semibold mb-2">
                    Consultation Document
                  </Text>
                  <View className="text-sm border rounded-md p-3 bg-neutral-100 dark:bg-background dark:border-border">
                    <WebcamCapture
                      name="patient_document"
                      // onChange={(event: any) => {
                      //   onSetHandler("patient_document", event?.target?.files[0]);
                      // }}
                      accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.mov,.mkv,.webm,.webp"
                      multiple
                      maxSize={1024 * 1024 * 15}
                      browseText="Browse Files"
                      existingFiles={
                        typeof values?.patient_document === "string"
                          ? values?.patient_document
                          : Array.isArray(values?.patient_document) &&
                              values?.patient_document.length > 0
                            ? values?.patient_document
                                .filter((item) => typeof item === "string")
                                .join(",")
                            : ""
                      }
                      label="Upload Documents & Files (Max 15MB)"
                      onChange={(fileList: any) => {
                        // Separate existing URLs and new files
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

                        // Store URLs and Files separately to avoid serialization issues
                        const urlsString = existingUrls.join(",");

                        // Store in local form (for this component)
                        onSetHandler("existing_file_urls", urlsString);
                        onSetHandler("new_files", newFiles);
                        onSetHandler("new_files_count", newFiles.length);
                        const combinedFiles = [...existingUrls, ...newFiles];
                        onSetHandler("patient_document", combinedFiles);

                        // IMPORTANT: Store in main consultation form (for submission)
                        // if (mainOnSetHandler) {
                        //   mainOnSetHandler("existing_file_urls", urlsString);
                        //   mainOnSetHandler("new_files", newFiles);

                        //   // Also store combined for backward compatibility
                        //   const combinedFiles = [...existingUrls, ...newFiles];
                        //   mainOnSetHandler("patient_document", combinedFiles);
                        // }
                      }}
                      // value={values?.consultation_image}
                    />
                  </View>
                </View>
              </View>

              <View className="mt-6">
                <Button
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </View>
            </form>
          </CardContent>
        </Card>

        {/* Post Surgery Follow-up */}
        {/* <View className="mt-6 ">
          <Text as="h3" className="text-lg font-semibold">
            Post Surgery Follow-up
          </Text>
        </View>

<View className=" flex items-center gap-2">
              <SingleSelector 
              // name="post_surgery_name" 
              placeholder="Select Post Surgery Name"
              value={postSurgeryId || ""} 
              onChange={handlePostSurgeryFollowUpNameChange} 
              options={postSurgeryDropdownData} />

              <Text weight="font-bold" className="text-xl text-text-light">
                /
              </Text>

              <Button onClick={handleFollowUpFormOpen} variant="primary" className="h-full">
                Create Post Surgery Follow-up
              </Button>
            </View>
            
       {
          toogleForm ? (
            <Card>
          <CardContent>
             <View className=" pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name" value={postSurgeryFollowUpData?.post_surgery_name || ""} onChange={(e) => setPostSurgeryFollowUpData({ ...postSurgeryFollowUpData, post_surgery_name: e.target.value })} />
              <Input type="date" label="Date" value={postSurgeryFollowUpData?.date || dayjs().format("YYYY-MM-DD")} onChange={(e) => setPostSurgeryFollowUpData({ ...postSurgeryFollowUpData, date: dayjs(e.target.value).format("YYYY-MM-DD") })} />
             </View>
             <View className="mt-6 flex justify-end">
                <Button onClick={handlePostSurgeryFollowUpSubmit}>
                  Create
                </Button>
              </View>

          </CardContent>
        </Card>
          ) : null
       }

        
             <Card ref={postSurgeryFollowUpRef}>
          <CardHeader>
            <CardTitle className={`${!postSurgeryId ? "mb-6" : ""}`}>Post Surgery Follow-up's</CardTitle>
            {
              !postSurgeryId && (
                <View className="text-center mt-6">
                  <Text className="text-lg font-semibold text-text-light">
                       Select post surgery name to see follow ups
                   </Text>
                </View>
              )
            }
          </CardHeader>
          <CardContent> */}

        {/* <EditableTable
              tableHeaders={allTableHeaders}
              tableData={data.map((row) =>
                allTableHeaders.map((h) => row[h.key as keyof typeof row])
              )}
              onCellEdit={handleCellEdit}
              onRowAdd={handleRowAdd}
              onRowDelete={handleRowDelete}
              editable={true}
              addRowEnabled={true}
              deleteRowEnabled={true}
              onSubmitCompleteRow={(rowData: any) => {
                // Map the row data back to the original data structure
                const result: Record<string, any> = {};
                
                // First, handle the ID separately
                const rowId = rowData[0]; // ID is the first column in the visible data
                
                // Map the rest of the data using allTableHeaders to maintain correct field order
                allTableHeaders.forEach((header, index) => {
                  if (header.hidden) return; // Skip hidden columns (like ID)
                  
                  // Find the index of this header in the visible headers
                  const visibleIndex = visibleTableHeaders.findIndex(h => h.key === header.key);
                  if (visibleIndex !== -1) {
                    result[header.key] = rowData[visibleIndex];
                  }
                });
                
                // If we have an ID, add it back to the result
                if (rowId) {
                  result.id = rowId;
                }
                if (id) {                  
                  if (rowId) {
                    postSurgeryEditHandler(
                      rowId,
                      { ...result, consultation_id: id },
                      (status: boolean) => {
                        if (status) {
                          postSurgeryListHandler(
                            searchParams?.get("currentPage") ?? 1,
                            () => {},
                            // searchParams.get("search") ?? null,
                            // searchParams.get("sort_by") ?? null,
                            // searchParams.get("sort_order") ?? null,
                            postSurgeryId,
                            id,
                            [],
                            (status) => {
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
                      }
                    );
                  } else {
                    addpostSurgeryHandler(
                      { ...result, consultation_id: id },
                      (status: boolean) => {
                        if (status) {
                          postSurgeryListHandler(
                            searchParams?.get("currentPage") ?? 1,
                            () => {},
                            // searchParams.get("search") ?? null,
                            // searchParams.get("sort_by") ?? null,
                            // searchParams.get("sort_order") ?? null,
                            postSurgeryId,
                            id,
                            [],
                            (status) => {
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
                      }
                    );
                  }
                }
              }}
            /> */}
        {/* {
              postSurgeryId && (
                <EditableTable
              tableHeaders={tableHeaders.map((h) => h.label ?? "")}
              tableData={data.map((row) =>
                tableHeaders.map((h) => row[h.key as keyof typeof row])
              )}
              onCellEdit={handleCellEdit}
              onRowAdd={handleRowAdd}
              onRowDelete={handleRowDelete}
              editable={true}
              addRowEnabled={true}
              deleteRowEnabled={true}
              onSubmitCompleteRow={(data: any) => {
                const result = tableHeaders.reduce((acc, h, index) => {
                  acc[h.key] = data[index];
                  return acc;
                }, {} as Record<string, any>);
                const rowId = result.id;
                delete result.id;
                if (id) {
                  if (rowId) {
                    postSurgeryEditHandler(
                      rowId,
                      // { ...result, consultation_id: id, post_surgery_details_id: postSurgeryId },
                      { ...result,  post_surgery_details_id: postSurgeryId },
                      (status: boolean) => {
                        if (status) {
                          postSurgeryListHandler(
                            searchParams?.get("currentPage") ?? 1,
                            () => {},
                            // searchParams.get("search") ?? null,
                            // searchParams.get("sort_by") ?? null,
                            // searchParams.get("sort_order") ?? null,
                            postSurgeryId,
                            // id,
                            [],
                            (status) => {
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
                      }
                    );
                  } else {
                    addpostSurgeryHandler(
                      // { ...result, consultation_id: id, post_surgery_details_id: postSurgeryId },
                      { ...result,  post_surgery_details_id: postSurgeryId },
                      (status: boolean) => {
                        if (status) {
                          postSurgeryListHandler(
                            searchParams?.get("currentPage") ?? 1,
                            () => {},
                            // searchParams.get("search") ?? null,
                            // searchParams.get("sort_by") ?? null,
                            // searchParams.get("sort_order") ?? null,
                            postSurgeryId,
                            // id,
                            [],
                            (status) => {
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
                      }
                    );
                  }
                }
              }}
            />
              )
            }
          </CardContent>
        </Card> */}
        {/* <View ref={postSurgeryFollowUpRef}>
          <PostSurgeryFollowUpComp
            patient_id={consultationData?.consultations?.patient_id}
            consultation_id={id}
            appointment_number={
              consultationData?.consultations?.appointment_number
            }
            formMode={true}
            viewMode={false}
            onRecordsChange={(data: any[]) => {
              setPostSurgeryData(data);
            }}
          />
        </View> */}
      </View>
    </View>
  );
};

export default ConsultationDetails;
