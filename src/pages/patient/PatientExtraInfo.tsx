import DocumentUploadComponent from "@/components/DocUpload";
import Text from "@/components/text";
import { Card, CardContent } from "@/components/ui/card";
import Upload from "@/components/Upload";
import View from "@/components/view";
import { GenericStatus } from "@/interfaces";
import {
  DATE_FORMAT,
  TIME_FORMAT,
  USER_DETAIL_URL,
  USER_TABLE_URL,
} from "@/utils/urls/frontend";
import dayjs from "dayjs";
import { User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientExtraInfo: React.FC<{
  patient: any;
  handleRefreshPatientData: () => void;
}> = ({ patient, handleRefreshPatientData }) => {
  const navigate = useNavigate();
  return (
    <>
      <Card className="mb-6 overflow-hidden">
        <CardContent className="pt-6">
          {/* Medical Information */}
          <View>
            <View className="mt-6">
              <Text
                as="h4"
                className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
              >
                Patient ID Proofs
              </Text>
              <View className="rounded-lg border border-muted bg-muted/30 transition-colors p-4">
                <View>
                  {/* ID Proof */}
                  {(patient?.id_type || patient?.id_number_masked) && (
                    <View className="flex items-start ">
                      <FileText className="h-6 w-6 text-muted mr-3 mt-1 flex-shrink-0" />
                      <View className="flex-1">
                        <Text
                          as="p"
                          className="text-sm text-muted/80 font-medium mb-2"
                        >
                          ID Proof
                        </Text>
                        <View className="grid grid-cols-1 gap-4">
                          <View className="space-y-2 flex justify-between">
                            {patient?.id_type && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Type
                                </Text>
                                <Text className="text-sm">
                                  {patient?.id_type || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.id_number_masked && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Number
                                </Text>
                                <Text className="text-sm font-mono">
                                  {patient?.id_number_masked || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.id_proof_for_pan && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  PAN
                                </Text>
                                <Text className="text-sm font-mono">
                                  {patient?.id_proof_for_pan || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.consent && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Consent Accepted?
                                </Text>
                                <Text className="text-sm">
                                  {patient.consent ? (
                                    <span className="text-green-600">
                                      {GenericStatus.YES}
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      {GenericStatus.NO}
                                    </span>
                                  )}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <View className="">
                  {patient?.image ? (
                    // <img
                    //   src={`${import.meta.env.VITE_APP_URL}/${
                    //     expensesData.image
                    //   }`}
                    //   alt="Proof of Purchase"
                    // />
                    <Upload
                      name="image"
                      maxFiles={2}
                      existingFiles={
                        typeof patient?.image === "string"
                          ? patient?.image
                          : Array.isArray(patient?.image) &&
                            patient?.image.length > 0
                          ? patient?.image
                              .filter((item: any) => typeof item === "string")
                              .join(",")
                          : ""
                      }
                      showOnlyFileList={true}
                    />
                  ) : (
                    <View className="mt-4 flex items-center justify-center bg-muted p-4 rounded-lg">
                      <Text className="flex items-center gap-2 text-muted-foreground">
                        <FileText />
                        No Files uploaded
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className="mt-6">
              <Text
                as="h4"
                className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
              >
                Attendant ID Proofs
              </Text>
              <View className="rounded-lg border border-muted bg-muted/30 transition-colors p-4">
                <View>
                  {/* ID Proof */}
                  {(patient?.attendant_id_type ||
                    patient?.attendant_id_number_masked) && (
                    <View className="flex items-start ">
                      <FileText className="h-6 w-6 text-muted mr-3 mt-1 flex-shrink-0" />
                      <View className="flex-1">
                        <Text
                          as="p"
                          className="text-sm text-muted/80 font-medium mb-2"
                        >
                          ID Proof
                        </Text>
                        <View className="grid grid-cols-1 gap-4">
                          <View className="space-y-2 flex justify-between">
                            {patient?.attendant_id_type && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Type
                                </Text>
                                <Text className="text-sm">
                                  {patient?.attendant_id_type || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.attendant_id_number_masked && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Number
                                </Text>
                                <Text className="text-sm font-mono">
                                  {patient?.attendant_id_number_masked || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.attendant_id_proof_for_pan && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  PAN
                                </Text>
                                <Text className="text-sm font-mono">
                                  {patient?.attendant_id_proof_for_pan || "N/A"}
                                </Text>
                              </View>
                            )}
                            {patient?.attendant_consent && (
                              <View>
                                <Text className="text-xs text-muted-foreground font-medium">
                                  Consent Accepted?
                                </Text>
                                <Text className="text-sm">
                                  {patient.attendant_consent ? (
                                    <span className="text-green-600">
                                      {GenericStatus.YES}
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      {GenericStatus.NO}
                                    </span>
                                  )}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <View className="">
                  {patient?.attendant_image ? (
                    <Upload
                      name="image"
                      maxFiles={2}
                      existingFiles={
                        typeof patient?.attendant_image === "string"
                          ? patient?.attendant_image
                          : Array.isArray(patient?.attendant_image) &&
                            patient?.attendant_image.length > 0
                          ? patient?.attendant_image
                              .filter((item: any) => typeof item === "string")
                              .join(",")
                          : ""
                      }
                      showOnlyFileList={true}
                    />
                  ) : (
                    <View className="mt-4 flex items-center justify-center bg-muted p-4 rounded-lg">
                      <Text className="flex items-center gap-2 text-muted-foreground">
                        <FileText />
                        No Files uploaded
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className="mt-6">
              <Text
                as="h4"
                className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
              >
                Patient Entry Details
              </Text>
              <View className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <User className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Front Desk User
                    </Text>
                    <Text
                      as="p"
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() =>
                        navigate(
                          USER_TABLE_URL +
                            USER_DETAIL_URL +
                            "/" +
                            patient?.front_desk_user_id
                        )
                      }
                    >
                      {patient?.front_desk_user_name || "N/A"}
                    </Text>
                  </View>
                </View>

                <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <User className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Patient created at
                    </Text>
                    <Text as="p" className="font-medium">
                      {dayjs(patient?.created_at).format(DATE_FORMAT) +
                        " " +
                        dayjs(patient?.created_at).format(TIME_FORMAT) || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
      <DocumentUploadComponent
        id={patient?.id}
        fileName="document_path"
        modalType="patient_documents"
        folderName="patient_documents"
        existingDocuments={patient?.patient_document}
        onUploadSuccess={handleRefreshPatientData}
      />
    </>
  );
};

export default PatientExtraInfo;
