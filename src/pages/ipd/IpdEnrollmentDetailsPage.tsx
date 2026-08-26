import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useIpdPatients } from "@/actions/calls/ipd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { clearIpdEnrollmentDetailsSlice } from "@/actions/slices/ipd/ipdEnrollment";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import {
  MoveLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/urls/frontend";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
// import InfoCard from "@/components/ui/infoCard";

const IpdEnrollmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ipdEnrolledPatientDetailHandler, cleanUp } = useIpdPatients();
  const [isLoading, setIsLoading] = useState(true);

  const enrollmentDetails = useSelector(
    (state: RootState) => state.ipd.ipdEnrolledPatientDetails,
  );

  useEffect(() => {
    if (id) {
      ipdEnrolledPatientDetailHandler(
        id,
        () => {
          setIsLoading(false);
        },
        undefined,
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
      dispatch(clearIpdEnrollmentDetailsSlice());
    };
  }, [id]);

  console.log(enrollmentDetails);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!enrollmentDetails) {
    return (
      <View className="flex flex-col items-center justify-center p-8">
        <Text as="h2" className="text-xl font-semibold mb-4">
          Enrollment details not found.
        </Text>
        <Button variant="outline" onPress={() => navigate(-1)}>
          <MoveLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </View>
    );
  }

  return (
    <View className="p-4 md:p-6 space-y-6">
      <View className="flex items-center justify-between mb-6">
        <View className="flex items-center gap-4">
          <Button
            variant="outline"
            size="small"
            onPress={() => navigate(-1)}
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          >
            <MoveLeft className="h-5 w-5" />
          </Button>
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold flex items-center gap-3"
            >
              Enrollment Details
              <span
                className="text-sm px-3 py-1 rounded-full font-medium"
                style={getStatusColorScheme(enrollmentDetails.status)}
              >
                {enrollmentDetails.status}
              </span>
            </Text>
            <Text className="text-muted-foreground">
              Appointment No:{" "}
              <span className="font-semibold text-foreground">
                {enrollmentDetails.appointment_number}
              </span>
            </Text>
          </View>
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Details Card */}
        <Card className="p-6 space-y-4">
          <View className="flex items-center gap-3 pb-3 border-b border-border">
            <View className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="h-5 w-5" />
            </View>
            <View>
              <Text as="h3" className="font-semibold text-lg">
                Patient Information
              </Text>
              <Text className="text-xs text-muted-foreground">
                Personal details
              </Text>
            </View>
          </View>

          <View className="space-y-3 pt-2">
            <View>
              <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Full Name
              </Text>
              <Text className="font-medium text-base">
                {enrollmentDetails.patient?.first_name}{" "}
                {enrollmentDetails.patient?.last_name}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Contact Details
              </Text>
              <Text className="font-medium">
                {enrollmentDetails.patient?.email}
              </Text>
              <Text className="font-medium">
                {enrollmentDetails.patient?.phone_no}
              </Text>
            </View>
          </View>
        </Card>

        {/* Doctor Details Card */}
        <Card className="p-6 space-y-4">
          <View className="flex items-center gap-3 pb-3 border-b border-border">
            <View className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Stethoscope className="h-5 w-5" />
            </View>
            <View>
              <Text as="h3" className="font-semibold text-lg">
                Doctor Information
              </Text>
              <Text className="text-xs text-muted-foreground">
                Assigned details
              </Text>
            </View>
          </View>

          <View className="space-y-3 pt-2">
            <View>
              <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Doctor Name
              </Text>
              <Text className="font-medium text-base">
                {enrollmentDetails.doctor?.name}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Contact Details
              </Text>
              <Text className="font-medium">
                {enrollmentDetails.doctor?.email}
              </Text>
              <Text className="font-medium">
                {enrollmentDetails.doctor?.phone_no}
              </Text>
            </View>
          </View>
        </Card>

        {/* Appointment Info Card */}
        <Card className="p-6 space-y-4">
          <View className="flex items-center gap-3 pb-3 border-b border-border">
            <View className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Calendar className="h-5 w-5" />
            </View>
            <View>
              <Text as="h3" className="font-semibold text-lg">
                Appointment Info
              </Text>
              <Text className="text-xs text-muted-foreground">
                Schedule details
              </Text>
            </View>
          </View>

          <View className="space-y-3 pt-2">
            <View className="grid grid-cols-2 gap-4">
              <View>
                <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Date
                </Text>
                <View className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Text className="font-medium">
                    {dayjs(enrollmentDetails.appointment_date).format(
                      DATE_FORMAT,
                    )}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Time
                </Text>
                <View className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Text className="font-medium">
                    {dayjs(
                      `2000-01-01 ${enrollmentDetails.appointment_time}`,
                    ).format(TIME_FORMAT)}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Type
              </Text>
              <Text className="font-medium text-base">
                {enrollmentDetails.type}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Action Buttons */}
      <Card className="p-6">
        <View className="flex items-center justify-between mb-4">
          <Text as="h3" className="font-semibold text-lg">
            Actions
          </Text>
        </View>
        <View className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onPress={() => navigate(`/ipd/${id}/discharge-summary/new`)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Create Discharge Summary
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default IpdEnrollmentDetailsPage;
