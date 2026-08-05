import React from "react";
import dayjs from "dayjs";
import Text from "@/components/text";
import View from "@/components/view";
import Button from "@/components/button";
import { Link, useNavigate } from "react-router-dom";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { Activity, Calendar, Clock, Mail, Phone } from "lucide-react";
import {
  PATIENT_DETAIL_URL,
  PATIENT_TABLE_URL,
  USER_DETAIL_URL,
  USER_TABLE_URL,
} from "@/utils/urls/frontend";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const AppointmentIndex: React.FC<{
  readOnly?: boolean;
  appointmentDetails: any;
  showPatientDetails?: boolean;
  showDoctorDetails?: boolean;
}> = ({
  readOnly = false,
  appointmentDetails,
  showPatientDetails = true,
  showDoctorDetails = true,
}) => {
  const navigate = useNavigate();
  // const currentSymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol
  // );
  return (
    <React.Fragment>
      <View className={!readOnly ? "space-y-6 container mx-auto py-8" : ""}>
        {!readOnly && (
          <View className="flex justify-between items-center">
            <View>
              <Text
                as="h1"
                weight="font-semibold"
                className="text-2xl font-bold"
              >
                Appointment Details
              </Text>
              <Text as="p" className="text-muted-foreground">
                View and manage appointment information
              </Text>
            </View>
            <View className="flex space-x-2">
              <Button variant="outline" onPress={() => navigate(-1)}>
                Back to Home
              </Button>
            </View>
          </View>
        )}

        {/* Appointment Status Card */}
        <Card className={!readOnly ? "" : "border-none"}>
          <CardHeader className="pb-2">
            <View className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Appointment #
                <Text as="span" className="text-muted-foreground">
                  {appointmentDetails?.appointment_number}
                </Text>
              </CardTitle>
              <Text
                as="span"
                className={`px-3 py-1 rounded-full text-xs   font-medium`}
                style={getStatusColorScheme(appointmentDetails?.status)}
              >
                {appointmentDetails?.status}
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <View className="flex items-center text-sm">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <Text as="span">
                  {appointmentDetails?.appointment_date || "N/A"}
                </Text>
              </View>
              <View className="flex items-center text-sm">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <Text as="span">
                  {dayjs(
                    dayjs().format("YYYY-MM-DD") +
                      " " +
                      appointmentDetails?.appointment_time,
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("hh:mm A")}
                </Text>
              </View>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Appointment Type
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  {appointmentDetails?.type || "N/A"}
                </Text>
              </View>
              {/* <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Enrollment Fees
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  {appointmentDetails?.amount ? currentSymbol : ""}
                  {appointmentDetails?.amount || "N/A"}
                </Text>
              </View> */}
            </View>

            {appointmentDetails?.complaint && (
              <View className="mt-4 p-4 bg-neutral-100 border border-border rounded-md dark:bg-background">
                <Text as="h3" className="text-md font-semibold mb-2">
                  Complaints
                </Text>
                <Text as="p" className="text-sm">
                  {appointmentDetails?.complaint || "N/A"}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Patient Summary Card */}
        {showPatientDetails && (
          <Card className={!readOnly ? "" : "border-none"}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg mb-4">Patient Summary</CardTitle>

              <View className="flex items-start justify-between ">
                <View className="flex items-center">
                  <View className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center text-secondary text-xl font-bold mr-4">
                    {appointmentDetails?.patient_name?.split(" ")[0][0]}
                  </View>
                  <View>
                    <CardTitle className="text-xl">
                      <Link
                        to={`${PATIENT_TABLE_URL}${PATIENT_DETAIL_URL}/${appointmentDetails?.patient_id}`}
                        className="text-secondary hover:underline"
                      >
                        {appointmentDetails?.patient_name || "N/A"}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1 text-sm ">
                      <Text as="span" className="mr-4">
                        PN: {appointmentDetails?.patient_number || "N/A"}
                      </Text>
                    </CardDescription>
                  </View>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <View className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                  <Text as="span">
                    <a href={`tel:${appointmentDetails?.patient_phone}`}>
                      {appointmentDetails?.patient_phone || "N/A"}
                    </a>
                  </Text>
                </View>
                <View className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                  <Text as="span">
                    <a href={`mailto:${appointmentDetails?.patient_email}`}>
                      {appointmentDetails?.patient_email || "N/A"}
                    </a>
                  </Text>
                </View>
                <View className="flex items-center">
                  <Activity className="h-5 w-5 text-red-500 mr-2" />
                  <Link
                    to={`${PATIENT_TABLE_URL}${PATIENT_DETAIL_URL}/${appointmentDetails?.patient_id}`}
                    className="text-accent hover:underline"
                  >
                    View Patient Record
                  </Link>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Provider Information */}

        {showDoctorDetails && (
          <Card className={!readOnly ? "" : "border-none"}>
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
                    <a href={`tel:${appointmentDetails?.doctor_email}`}>
                      {appointmentDetails?.doctor_phone || "N/A"}
                    </a>
                  </Text>
                </View>
                <View className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                  <Text as="span">
                    <a href={`mailto:${appointmentDetails?.doctor_email}`}>
                      {appointmentDetails?.doctor_email || "N/A"}
                    </a>
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        )}
      </View>
    </React.Fragment>
  );
};

export default AppointmentIndex;
