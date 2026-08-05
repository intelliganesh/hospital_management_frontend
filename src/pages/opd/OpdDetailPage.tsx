import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Activity,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import { useEffect, useState } from "react";
import { clearOpdDetailSlice } from "@/actions/slices/opd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
  APPOINTMENT_DETAILS_URL,
  PATIENT_DETAIL_URL,
} from "@/utils/urls/frontend";
import View from "@/components/view";
import Text from "@/components/text";

const OpdDetail = () => {
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "discharged":
        return "bg-purple-100 text-purple-800";
      case "converted to ipd":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { opdDetailHandler, cleanUp } = useOpd();

  const opdData = useSelector(
    (state: RootState) => state.opd.opdFullDetailData
  );
  useEffect(() => {
    if (id) {
      opdDetailHandler(id, () => {});
      setLoading(false);
    }
    return () => {
      cleanUp();
      dispatch(clearOpdDetailSlice());
    };
  }, []);

  if (loading || !opdData) {
    return (
      <View className="text-center text-muted py-10">Loading OPD data...</View>
    );
  }

  return (
    <View className="container mx-auto p-4 space-y-6">
      <View className="flex justify-between items-center">
        <View>
          <Text as="h1" className="text-2xl font-bold">OPD Details</Text>
          <Text as="p" className="text-muted-foreground">
            Viewing details for OPD number {opdData?.opd?.opd_number}
          </Text>
        </View>
      </View>

      {/* OPD Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <View className="flex justify-between items-center">
            <CardTitle className="text-lg">
              OPD #
              <Text as="span" className="text-muted-foreground">
                {opdData?.opd?.opd_number}
              </Text>
            </CardTitle>
            <Badge className={getStatusColor(opdData?.opd?.status)}>
              {opdData?.opd?.status}
            </Badge>
          </View>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <View className="flex items-center text-sm">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <Text as="span">
                {dayjs(opdData?.opd?.visit_date).format("YYYY-MM-DD")}
              </Text>
            </View>
            <View className="flex items-center text-sm">
              <Clock className="h-5 w-5 text-primary mr-2" />
              {/* <span>{formatDateTime(opdData?.opd?.visit_date).split(',')[1]}</span> */}
              <Text as="span">{dayjs(opdData?.opd?.visit_date).format("HH:mm:ss")}</Text>
            </View>
            <Link to={`${APPOINTMENT_DETAILS_URL}/${opdData?.appointment?.id}`}>
              <View className="flex items-center text-sm">
                <User className="h-5 w-5 text-primary mr-2" />
                <Text as="span">Appointment: {opdData?.appointment?.number}</Text>
              </View>
            </Link>
          </View>

          {opdData?.opd?.complaint && (
            <View className="mt-4 p-4 bg-muted rounded-md">
              <Text as="h3" className="text-md font-semibold mb-2">Complaints</Text>
              <Text as="p" className="text-sm">{opdData?.opd?.complaint}</Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Patient Summary Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg mb-4">Patient Summary</CardTitle>

          <View className="flex items-start justify-between">
            <Link
              to={`${PATIENT_DETAIL_URL}/${opdData?.patient?.id}`}
              className="flex items-center"
            >
              <View className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary text-xl font-bold mr-4">
                {opdData?.patient?.first_name?.charAt(0)}
                {opdData?.patient?.last_name?.charAt(0)}
              </View>
              <View>
                <CardTitle className="text-xl">
                  {opdData?.patient?.first_name} {opdData?.patient?.last_name}
                </CardTitle>
                <CardDescription className="flex items-center mt-1 text-sm">
                  <Text as="span" className="mr-4">
                    PN: {opdData?.patient?.patient_number || "N/A"}
                  </Text>
                  <Text as="span" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />{" "}
                    {opdData?.patient?.dob} ({opdData?.patient?.age} years)
                  </Text>
                </CardDescription>
              </View>
            </Link>
          </View>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <View className="flex items-center">
              <Phone className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{opdData?.patient?.phone_no}</Text>
            </View>
            <View className="flex items-center">
              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{opdData?.patient?.email}</Text>
            </View>
            <View className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <Text as="span">{`${opdData?.patient?.address}, ${
                opdData?.patient?.city
              }, ${opdData?.patient?.state} ${
                opdData?.patient?.pincode || ""
              }`}</Text>
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              label="Blood Type"
              value={opdData?.patient?.blood_group || "Unknown"}
              icon={<Activity className="h-5 w-5 text-red-500" />}
            />
            <InfoCard
              label="Insurance"
              value={opdData?.patient?.insurance_provider || "N/A"}
              subValue={opdData?.patient?.insurance_policy_no || ""}
              icon={<CreditCard className="h-5 w-5 text-primary" />}
            />
            <InfoCard
              label="Treatment Status"
              value={opdData?.patient?.treatment_status || "N/A"}
              icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
            />
            <InfoCard
              label="Marital Status"
              value={opdData?.patient?.marital_status || "Not specified"}
              icon={<User className="h-5 w-5 text-blue-500" />}
            />
          </View>
        </CardContent>
      </Card>

      {/* Doctor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Doctor Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-primary text-lg font-bold mr-4">
              {opdData?.doctor?.name?.charAt(0)}
            </View>
            <View>
              <Text as="h3" className="font-medium text-lg">{opdData?.doctor?.name}</Text>
              {/* <p className="text-muted-foreground text-sm">ID: {opdData?.doctor?.id || 'N/A'}</p> */}
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <View>
              <Text as="h3" className="text-md font-semibold mb-2">Referral Status</Text>
              <Text as="p" className="text-muted-foreground">
                {opdData?.patient?.referral_status || "N/A"}
              </Text>
            </View>
            <View>
              <Text as="h3" className="text-md font-semibold mb-2">Referred By</Text>
              <Text as="p" className="text-muted-foreground">
                {opdData?.patient?.referred_by || "N/A"}
              </Text>
              {opdData?.patient?.referred_by_phone_no && (
                <Text as="p" className="text-muted-foreground mt-1">
                  Phone: {opdData.patient.referred_by_phone_no}
                </Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};
export default OpdDetail;
