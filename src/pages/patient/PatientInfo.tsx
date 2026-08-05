import Text from "@/components/text";
import Button from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import View from "@/components/view";
import { APPOINTMENT_FORM_URL, DATE_FORMAT, PATIENTS_FORM_URL, POST_SURGERY_FOLLOW_UP_URL } from "@/utils/urls/frontend";
import dayjs from "dayjs";
import {
  Calendar,
  Mail,
  MapPin,
  Mars,
  Phone,
  Venus,
  VenusAndMars,
  Activity,
  Shield,
  AlertCircle,
  User,
  Utensils,
  Heart,
  UserCheck,
  CheckCircle2,
  XCircle,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientInfo: React.FC<{
  patient: any;
  need?: boolean;
  inPatient?: boolean;
}> = ({ patient, need = true, inPatient = false }) => {
  return (
    <Card className={`${need ? "mb-6" : "mb-0"} overflow-hidden`}>
      <View className="flex flex-col lg:flex-row">
        {/* Left Section - Patient Details Only */}
        <View className="flex-1 lg:border-r border-slate-200 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-6">
            <View className="flex items-start justify-between">
              <View className="flex items-center">
                <View className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-4 border-2 border-primary/20">
                  {patient?.first_name?.charAt(0)}
                  {patient?.last_name?.charAt(0)}
                </View>
                <View>
                  <CardTitle className="text-2xl text-primary mb-1">
                    {patient?.first_name} {patient?.last_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-base">
                    <Text as="span" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      ID: {patient?.patient_number || "N/A"}
                    </Text>
                    <Text as="span" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {patient?.dob
                        ? dayjs(patient?.dob).format(DATE_FORMAT)
                        : ""}{" "}
                      {
                        patient?.age ? (
                          <span className="text-muted-foreground">
                            ({patient?.age} years)
                          </span>
                        ) : (
                          "N/A"
                        )
                      }
                    </Text>
                  </CardDescription>
                </View>
              </View>
              <View className=" px-4 py-2 flex items-center gap-2">
                {patient?.status && (
                  <View className="flex items-center">
                    <View
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-800"
                          : patient.status.toLowerCase() === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status.toLowerCase() === "active" ? (
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {patient.status}
                    </View>
                  </View>
                )}
                {patient?.gender ? (
                  patient?.gender === "male" ? (
                    <Text
                      as="span"
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      <Mars className="size-4" />
                      {patient?.gender.charAt(0).toUpperCase() +
                        patient?.gender.slice(1)}
                    </Text>
                  ) : patient?.gender === "female" ? (
                    <Text
                      as="span"
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      <Venus className="size-4" />
                      {patient?.gender.charAt(0).toUpperCase() +
                        patient?.gender.slice(1)}
                    </Text>
                  ) : (
                    <Text
                      as="span"
                      className="flex items-center gap-2 text-primary font-medium"
                    >
                      <VenusAndMars className="size-4" />
                      {patient?.gender}
                    </Text>
                  )
                ) : (
                  <Text
                    as="span"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <VenusAndMars className="size-4" />
                    Not specified
                  </Text>
                )}
              </View>
            </View>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Contact Information */}
            <View className={`${need ? "mb-4" : "mb-0"}`}>
              <Text
                as="h4"
                className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
              >
                Contact Information
              </Text>
              <View className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Phone
                    </Text>
                    <Text as="p" className="font-medium">
                      <a
                        href={`tel:${patient?.phone_no}`}
                        className="hover:text-primary transition-colors"
                      >
                        {patient?.phone_no?.length <= 4
                          ? "N/A"
                          : patient?.phone_no}
                      </a>
                    </Text>
                  </View>
                </View>

                <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Email
                    </Text>
                    <Text as="p" className="font-medium">
                      <a
                        href={`mailto:${patient?.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {patient?.email || "N/A"}
                      </a>
                    </Text>
                  </View>
                </View>

                <View className="flex items-start p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors lg:col-span-1">
                  <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Address
                    </Text>
                    <Text
                      as="p"
                      className="font-medium text-sm leading-relaxed"
                    >
                      {patient?.address
                        ? `${patient.address}, ${patient?.city || ""}, ${
                            patient?.state || ""
                          }, ${patient?.pincode || ""}`
                        : "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Marital Status */}
                <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Heart className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground">
                      Marital Status
                    </Text>
                    <Text as="p" className="font-medium">
                      {patient?.marital_status
                        ? patient.marital_status.charAt(0).toUpperCase() +
                          patient.marital_status.slice(1)
                        : "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Attendant with Patient */}
                {patient?.attendant_with_patient_name && (
                  <View className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <UserCheck className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <View>
                      <Text as="p" className="text-sm text-muted-foreground">
                        Attendant
                      </Text>
                      <Text as="p" className="font-medium">
                        {patient.attendant_with_patient_name}
                      </Text>
                      {patient?.attendant_with_patient_phone_no && (
                        <Text as="p" className="text-sm text-muted-foreground">
                          {patient.attendant_with_patient_phone_no}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Medical Information */}
            {need && (
              <View>
                <Text
                  as="h4"
                  className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
                >
                  Medical Information
                </Text>

                <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <View className="flex items-center p-4 rounded-lg border border-red-200 bg-red-50 transition-colors">
                    <Activity className="h-6 w-6 text-red-600 mr-3" />
                    <View>
                      <Text
                        as="p"
                        className="text-sm text-red-600/80 font-medium"
                      >
                        Blood Type
                      </Text>
                      <Text as="p" className="text-lg font-bold text-red-700">
                        {patient?.blood_group || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex items-center p-4 rounded-lg border border-blue-200 bg-blue-50 transition-colors">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    <View>
                      <Text
                        as="p"
                        className="text-sm text-blue-600/80 font-medium"
                      >
                        Insurance (Policy No)
                      </Text>
                      <Text as="p" className="text-lg font-bold text-blue-700">
                        {patient?.insurance_provider || "N/A"}{" "}
                        {patient?.insurance_policy_no
                          ? `(${patient?.insurance_policy_no})`
                          : ""}
                      </Text>
                    </View>
                  </View>

                  <View className="flex items-center p-4 rounded-lg border border-amber-200 bg-amber-50 transition-colors">
                    <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                    <View>
                      <Text
                        as="p"
                        className="text-sm text-amber-600/80 font-medium"
                      >
                        Emergency Contact
                      </Text>
                      <Text as="p" className="text-lg font-bold text-amber-700">
                        {patient?.attendant_with_patient_phone_no?.length <= 4 ? "N/A" : patient?.attendant_with_patient_phone_no}
                      </Text>
                    </View>
                  </View>

                  {/* Dietary Preference */}
                  {patient?.dietary_preference && (
                    <View className="flex items-center p-4 rounded-lg border border-green-200 bg-green-50 transition-colors">
                      <Utensils className="h-6 w-6 text-green-600 mr-3" />
                      <View>
                        <Text
                          as="p"
                          className="text-sm text-green-600/80 font-medium"
                        >
                          Dietary Preference
                        </Text>
                        <Text
                          as="p"
                          className="text-lg font-bold text-green-700"
                        >
                          {patient?.dietary_preference || "N/A"}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Payment Information */}
                  {/* {(patient?.amount_for || patient?.front_desk_user_id) && (
              <View className="flex items-start p-4 rounded-lg border border-indigo-200 bg-indigo-50 transition-colors">
                <FileCheck className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <View>
                  <Text
                    as="p"
                    className="text-sm text-indigo-600/80 font-medium mb-2"
                  >
                    Payment Information
                  </Text>
                  <View className="space-y-2">
                    {patient?.amount_for && (
                      <View className="text-sm">
                        <Text as="span" className="font-medium text-indigo-800">
                          Amount For:{" "}
                        </Text>
                        <Text as="span" className="text-indigo-700">
                          {patient?.amount_for || "N/A"}
                        </Text>
                      </View>
                    )}
                    {patient?.front_desk_user_id && (
                      <View className="text-sm">
                        <Text as="span" className="font-medium text-indigo-800">
                          Front Desk ID:{" "}
                        </Text>
                        <Text as="span" className="text-indigo-700">
                          {patient?.front_desk_user_id || "N/A"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )} */}
                </View>
              </View>
            )}
          </CardContent>
        </View>

        {/* Right Section - Action Buttons Only */}
        {
          inPatient && (
            <View className="w-full lg:w-80 p-6 bg-slate-50 dark:bg-slate-800/50">
          <Text
            as="h4"
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4"
          >
            Actions
          </Text>

          <View className="flex flex-col gap-3">
            <Link to={APPOINTMENT_FORM_URL + "?patientId=" + patient?.id} target="_blank">
            <Button
              variant="primary"
              className="w-full justify-start gap-2 flex items-center"
            >
              <Calendar className="w-4 h-4" />
              Add Appointment
            </Button>
            </Link>

            <Link to={PATIENTS_FORM_URL + "/" + patient?.id} target="_blank">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Patient
            </Button>
          </Link>

            <Link to={POST_SURGERY_FOLLOW_UP_URL + "/" + patient?.id} target="_blank">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 flex items-center"
            >
              <Activity className="w-4 h-4" />
              Post Surgery Follow Up
            </Button>
            </Link>

            {/* <Link to={"#"}>
            <Button
              variant="outline" 
              className="w-full justify-start gap-2 flex items-center"
              onPress={() => {
                // Navigate to pre-operative checklist
                window.location.href = `/pre-operative-checklist/${patient?.id}`;
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Pre-Operative Checklist
            </Button>
            </Link> */}
          </View>
        </View>
          )
        }
      </View>
    </Card>
  );
};

export default PatientInfo;
