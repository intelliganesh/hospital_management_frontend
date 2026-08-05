import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { usePatient } from "@/actions/calls/patient";
// import { toast } from "@/utils/custom-hooks/use-toast";
// import {
//   DOWNLOAD_PATIENT_FILES_URL,
//   DOWNLOAD_ANESTHESIA_FILES_URL,
// } from "@/utils/urls/backend";
import { Card, CardContent } from "@/components/ui/card";
import {
  // Download,
  Calendar,
  Clock,
  Stethoscope,
  // Plus,
  // Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  APPOINTMENT_DETAILS_URL,
  // APPOINTMENT_FORM_URL,
  APPOINTMENT_TABLE_URL,
  CONSULTATION_DETAILS_URL,
  CONSULTATION_TABLE_URL,
  PATIENT_TABLE_URL,
  // PATIENTS_FORM_URL,
  // POST_SURGERY_FOLLOW_UP_URL,
  USER_DETAIL_URL,
  USER_TABLE_URL,
} from "@/utils/urls/frontend";
import { useNavigate } from "react-router-dom";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import dayjs from "dayjs";
import PatientInfo from "./PatientInfo";
import BouncingLoader from "@/components/BouncingLoader";
import TabbedCollapsible from "@/components/TabbedCollapsible";
import { clearPatientDetailsSlice } from "@/actions/slices/patient";
import PatientExtraInfo from "./PatientExtraInfo";
import ConsultationItem from "./ConsultationItem";
import PostSurgeryFollowUp from "../postSurgeryFollowUp";
import FistulaDetails from "../consultation/FistulaDetails";

const PatientDetailsPage = () => {
  const { id } = useParams();
  const { patientDetailHandler, cleanUp } = usePatient();

  const patient = useSelector(
    (state: RootState) => state?.patient?.patientDetailData,
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleRefreshPatientData = () => {
    if (id) {
      patientDetailHandler(
        id,
        () => {},
        [],
        () => {},
      );
    }
  };

  useEffect(() => {
    if (id) {
      patientDetailHandler(
        id,
        () => {
          setLoading(false);
        },
        [],
        (status) => {
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
      dispatch(clearPatientDetailsSlice());
    };
  }, [id]);

  const FistulaDetailData = patient?.fistula_info;

  // const handleDownload = (path: string) => {
  //   if (id) {
  //     setIsLoading(true);
  //     downloadPatientHandler(id, path, async (success: boolean) => {
  //       if (success) {
  //         toast({
  //           title: "Success!",
  //           description: "Successfully downloaded patient details",
  //           variant: "success",
  //         });
  //         setIsLoading(false);
  //       } else {
  //         toast({
  //           title: "Error",
  //           description: "Failed to download patient details",
  //           variant: "destructive",
  //         });
  //         setIsLoading(false);
  //       }
  //     });
  //   }
  // };

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <View className="space-y-6">
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-text-DEFAULT"
            >
              Patient Details
            </Text>
            <Text as="p" className="text-text-light">
              View and manage patient information
            </Text>
          </View>
          <View className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate(`${PATIENT_TABLE_URL}?currentPage=1`, {
                  state: { refresh: true },
                })
              }
              className="flex justify-center items-center gap-2"
            >
              Back
            </Button>
            {/* <Button
              style={{ alignItems: "center" }}
              onClick={() => handleDownload(DOWNLOAD_PATIENT_FILES_URL)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex item-center gap-2"
            >
              <Download size={16} /> Patient Files
            </Button>
            <Button
              style={{ alignItems: "center" }}
              onClick={() => handleDownload(DOWNLOAD_ANESTHESIA_FILES_URL)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex item-center gap-2"
            >
              <Download size={16} /> Anaesthesia Files
            </Button> */}
          </View>
        </View>

        {/* Patient Summary Card */}
        <PatientInfo patient={patient} inPatient={true} />

        <PatientExtraInfo
          patient={patient}
          handleRefreshPatientData={handleRefreshPatientData}
        />
        <View>
          <FistulaDetails data={FistulaDetailData} />
        </View>

        {/* Consultations Section */}
        {patient?.consultation && patient.consultation.length > 0 && (
          <View className="pt-4">
            <View className="flex justify-between items-center mb-4">
              <Text as="h2" weight="font-semibold" className="!text-2xl">
                Recent Consultations{" "}
                <span className="text-muted-foreground">
                  (Last {Math.min(4, patient.consultation.length)})
                </span>
              </Text>
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...patient.consultation]
                .sort((a: any, b: any) => {
                  const d1: any = new Date(
                    `${a.appointment_date}T${a.appointment_time}`,
                  );
                  const d2: any = new Date(
                    `${b.appointment_date}T${b.appointment_time}`,
                  );
                  return d2 - d1;
                })
                .slice(
                  0,
                  patient.consultation.length > 4
                    ? 4
                    : patient.consultation.length,
                )
                .map((consultation: any, index: number) => (
                  <ConsultationItem
                    key={consultation.id}
                    consultation={consultation}
                    index={patient.consultation.length - (index + 1)}
                    showMore={false}
                    // showMore={(consultation.type === "Proctology" || patient.consultation.type === "Allopathy") ? true : false}
                  />
                ))}
            </View>
          </View>
        )}

        <View className="pt-4">
          <View className="flex justify-between items-center mb-4">
            <Text as="h2" weight="font-semibold" className="!text-2xl">
              Patient Post Surgery Follow ups
            </Text>
          </View>

          <View>
            <PostSurgeryFollowUp
              patient_id={patient?.id}
              viewMode={true}
              showDownloadButton={true}
              features={{
                showAPNColumn: true,
              }}
            />
          </View>
        </View>
      </View>

      <View className="flex justify-between items-center mt-8">
        {patient?.appointments?.length > 0 ? (
          <Text as="h2" weight="font-semibold" className="!text-2xl font-bold">
            Appointments{" "}
            <span className="text-muted-foreground">
              ({patient?.appointments?.length})
            </span>
          </Text>
        ) : (
          ""
        )}
      </View>
      {patient?.appointments?.map((data: any, index: number) => {
        return (
          <View key={data.id} className="space-y-6 py-8 border-b">
            <Card>
              <View className="flex justify-between items-center mx-4 mb-6 pt-6">
                <View className="flex !items-center gap-2">
                  <Text
                    as="h2"
                    className="text-lg font-bold flex items-center gap-2"
                  >
                    <View className="flex items-center">
                      Appointment #
                      <Text
                        as="h2"
                        className="text-muted-foreground hover:underline"
                      >
                        {/* {data?.appointment_number} */}
                        <Link
                          to={
                            APPOINTMENT_TABLE_URL +
                            APPOINTMENT_DETAILS_URL +
                            "/" +
                            data?.id
                          }
                        >
                          {data?.appointment_number}
                        </Link>
                      </Text>
                    </View>
                  </Text>
                  {patient?.consultation && (
                    <>
                      {" -> "}
                      <Text as="span">
                        <Link
                          target="_blank"
                          className="text-primary hover:underline"
                          to={
                            CONSULTATION_TABLE_URL +
                            CONSULTATION_DETAILS_URL +
                            "/" +
                            patient?.consultation[index]?.id
                          }
                        >
                          Consultation ({index + 1})
                        </Link>
                      </Text>
                    </>
                  )}

                  {data?.doctor_name && (
                    <>
                      {" -> "}
                      <Text as="span">
                        <Link
                          target="_blank"
                          className=" flex  text-primary hover:underline"
                          to={
                            USER_TABLE_URL +
                            USER_DETAIL_URL +
                            "/" +
                            data?.doctor_id
                          }
                        >
                          <Stethoscope className="h-5 w-5 text-primary mr-2" />
                          <span>{data?.doctor_name}</span>
                        </Link>
                      </Text>
                    </>
                  )}
                </View>

                <Text
                  as="span"
                  className={`px-3 py-1 rounded-full text-xs   font-medium `}
                  style={getStatusColorScheme(data?.status)}
                >
                  {data?.status}
                </Text>
              </View>

              {/* <AppointmentIndex readOnly appointmentDetails={data} showPatientDetails={false} usingAppointmentCardStyle={false} /> */}
              <View>
                {/* Appointment Status Card */}
                <Card className="border-none">
                  <CardContent>
                    <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <View className="">
                        <View>
                          <Text as="h3" className="text-md font-semibold mb-2">
                            Appointment Date & Time
                          </Text>
                        </View>
                        <View className="flex items-center gap-4">
                          <View className="flex !items-center">
                            <Calendar className="h-5 w-5 text-primary mr-2" />
                            <Text as="span">
                              {data?.appointment_date || "N/A"}
                            </Text>
                            {/* <span>{formatDate(appointment.date)}</span> */}
                          </View>
                          <View className="flex !items-center">
                            <Clock className="h-5 w-5 text-primary mr-2" />
                            <Text as="span">
                              {dayjs(
                                dayjs().format("YYYY-MM-DD") +
                                  " " +
                                  data?.appointment_time,
                                "YYYY-MM-DD HH:mm:ss",
                              ).format("hh:mm A")}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View>
                        <Text as="h3" className="text-md font-semibold mb-2">
                          Appointment Type
                        </Text>
                        <Text as="p" className="text-muted-foreground ">
                          {data?.type || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {data?.complaint && (
                      <View className="mt-4 p-4 bg-neutral-100 border border-border rounded-md dark:bg-background">
                        <Text as="h3" className="text-md font-semibold mb-2">
                          Complaints
                        </Text>
                        <Text as="p" className="text-sm">
                          {data?.complaint || "N/A"}
                        </Text>
                      </View>
                    )}

                    <View className="mt-6">
                      <Text as="h3" className="text-md font-semibold mb-2">
                        Consultation Details
                      </Text>
                    </View>
                    {patient?.consultation.length > 0 ? (
                      <>
                        {patient?.consultation.map((consultation: any) => {
                          const departmentType =
                            consultation?.type === "Proctology"
                              ? "proctology"
                              : consultation?.type === "Non Proctology"
                                ? "non_proctology"
                                : "allopathy";
                          return (
                            data?.id === consultation?.appointment_id && (
                              <View key={consultation.id} className="mt-4">
                                <TabbedCollapsible
                                  tabs={[
                                    {
                                      title: "Chief Complaints",
                                      items: consultation[departmentType]
                                        ?.chief_complaints
                                        ? JSON.parse(
                                            consultation[departmentType]
                                              ?.chief_complaints,
                                          ).map((item: any) => item.label)
                                        : ["N/A"],
                                      badge: consultation[departmentType]
                                        ?.chief_complaints
                                        ? JSON.parse(
                                            consultation[departmentType]
                                              ?.chief_complaints,
                                          ).length.toString()
                                        : "0",
                                    },
                                    {
                                      title: "On Examination",
                                      items: consultation[departmentType]
                                        ?.on_examination
                                        ? JSON.parse(
                                            consultation[departmentType]
                                              ?.on_examination,
                                          ).map((item: any) => item.label)
                                        : ["N/A"],
                                      badge: consultation[departmentType]
                                        ?.on_examination
                                        ? JSON.parse(
                                            consultation[departmentType]
                                              ?.on_examination,
                                          ).length.toString()
                                        : "0",
                                    },

                                    // {
                                    //   title: "Documents",
                                    //   items: (
                                    //     <DocumentUploadComponent
                                    //       id={consultation[departmentType]?.id}
                                    //       modalType={departmentType}
                                    //       existingDocuments={
                                    //         consultation[departmentType]
                                    //           ?.doc_upload
                                    //       }
                                    //       onUploadSuccess={
                                    //         handleRefreshPatientData
                                    //       }
                                    //     />
                                    //   ),
                                    //   badge: safeParseDocs(
                                    //     consultation[departmentType]?.doc_upload
                                    //   ).length.toString(),
                                    // },
                                  ]}
                                />
                              </View>
                            )
                          );
                        })}
                      </>
                    ) : (
                      <View className="mt-4 p-4 bg-neutral-100 border border-border rounded-md dark:bg-background">
                        <Text as="h5" className="text-md font-semibold">
                          No Consultation Details Found
                        </Text>
                      </View>
                    )}
                  </CardContent>
                </Card>

                {/* Provider Information */}

                {/* <Card className={!readOnly ? "" : "border-none"}>
                        <CardHeader>
                          <CardTitle className="text-lg">Doctor Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <View className="flex items-center mb-4">
                            <View className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center text-accent text-xl font-bold mr-4">
                              {appointmentDetails?.doctor_name?.split(" ")[0][0]}
                            </View>
                            <View>
                              <Text as="h3" className="font-semibold text-xl">
                                <Link
                                  className="text-accent hover:underline"
                                  to={
                                    USER_TABLE_URL +
                                    USER_DETAIL_URL +
                                    "/" +
                                    appointmentDetails?.doctor_id
                                  }
                                >
                                  {appointmentDetails?.doctor_name}
                                </Link>
                              </Text>
                            </View>
                          </View>
              
                          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <View className="flex items-center">
                              <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                              <Text as="span">
                                {appointmentDetails?.doctor_phone || "N/A"}
                              </Text>
                            </View>
                            <View className="flex items-center">
                              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                              <Text as="span">
                                {appointmentDetails?.doctor_email || "N/A"}
                              </Text>
                            </View>
                          </View>
                        </CardContent>
                      </Card> */}
              </View>
            </Card>
          </View>
        );
      })}
    </React.Fragment>
  );
};

export default PatientDetailsPage;
