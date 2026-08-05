import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Button from "@/components/button";
import { Calendar, Clock, Activity, Phone, Mail } from "lucide-react";
import { useAppointments } from "@/actions/calls/appointments";

import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import dayjs from "dayjs";
import { PATIENT_DETAIL_URL, PATIENT_TABLE_URL } from "@/utils/urls/frontend";
import View from "@/components/view";
import Text from "@/components/text";

const ExaminationDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { appointmentDetailHandler } = useAppointments();

  const currentSymbol = useSelector(
    (state: RootState) => state.systemSettings.settings.currency_symbol
  );
  const appointmentDetails = useSelector(
    (state: RootState) => state.appointment.appointmentDetailData
  );

  useEffect(() => {
    if (params.id) {
      appointmentDetailHandler(params.id, () => {});
    }
  }, [params.id]);

  

  // Helper to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <View className="space-y-6 container mx-auto py-8">
      <View className="flex justify-between items-center">
        <View>
          <Text as="h1" className="text-2xl font-bold">Appointment Details</Text>
          <Text as="p" className="text-muted-foreground">
            View and manage appointment information
          </Text>
        </View>
        <View className="flex space-x-2">
          <Button variant="outline" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>
      </View>

      {/* Appointment Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <View className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Appointment #
              <Text as="span" className="text-muted-foreground">
                {appointmentDetails?.appointment_number}
              </Text>
            </CardTitle>
            <Text as="span"
              className={`px-3 py-1 rounded-full text-xs   font-medium ${getStatusColor(
                appointmentDetails?.status
              )}`}
            >
              {appointmentDetails?.status}
            </Text>
          </View>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <View className="flex items-center text-sm">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <Text as="span">{appointmentDetails?.appointment_date || "N/A"}</Text>
              {/* <span>{formatDate(appointment.date)}</span> */}
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
            {/* <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span>{appointment.location}</span>
            </div> */}
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View>
              <Text as="h3" className="text-md font-semibold mb-2">Appointment Type</Text>
              <Text as="p" className="text-muted-foreground text-sm">
                {appointmentDetails?.type || "N/A"}
              </Text>
            </View>
            <View>
              <Text as="h3" className="text-md font-semibold mb-2">Enrollment Fees</Text>
              <Text as="p" className="text-muted-foreground text-sm">
                {currentSymbol}
                {appointmentDetails?.appointment_fees || "N/A"}
              </Text>
            </View>
          </View>

          {appointmentDetails?.complaint && (
            <View className="mt-4 p-4 bg-primary-50 rounded-md dark:bg-background">
              <Text as="h3" className="text-md font-semibold mb-2">Complaints</Text>
              <Text as="p" className="text-sm">
                {appointmentDetails?.complaint || "N/A"}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Patient Summary Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg mb-4">Patient Summary</CardTitle>

          <View className="flex items-start justify-between ">
            <View className="flex items-center">
              <View className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary text-xl font-bold mr-4">
                {appointmentDetails?.patient_name?.split(" ")[0][0]}
              </View>
              <View>
                <CardTitle className="text-xl">
                  {appointmentDetails?.patient_name || "N/A"}
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
              <Text as="span">{appointmentDetails?.patient_phone || "N/A"}</Text>
            </View>
            <View className="flex items-center">
              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{appointmentDetails?.patient_email || "N/A"}</Text>
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

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Doctor Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent text-lg  font-bold mr-4">
              {appointmentDetails?.doctor_name?.split(" ")[0][0]}
            </View>
            <View>
              <Text as="h3" className="font-medium text-lg">
                {appointmentDetails?.doctor_name}
              </Text>
              <Text as="p" className="text-muted-foreground text-sm">
                ID: {appointmentDetails?.doctor_id || "N/A"}
              </Text>
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <View className="flex items-center">
              <Phone className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{appointmentDetails?.doctor_phone || "N/A"}</Text>
            </View>
            <View className="flex items-center">
              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{appointmentDetails?.doctor_email || "N/A"}</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default ExaminationDetailsPage;
