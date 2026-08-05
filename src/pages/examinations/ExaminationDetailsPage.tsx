import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Button from "@/components/button";
import InfoCard from "@/components/ui/infoCard";
import {
  Calendar,
  User,
  Thermometer,
  HeartPulse,
  Stethoscope,
  Mail,
  Phone,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useExaminations } from "@/actions/calls/examination";
import View from "@/components/view";
import Text from "@/components/text";

const ExaminationDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  const { examinationDetailHandler} = useExaminations();

  useEffect(() => {
    if (params.id) {
      examinationDetailHandler(params.id, () => {});
      setLoading(false)
    }
  }, [params.id]);

  const examinationDetails = useSelector(
    (state: RootState) => state.examinations.examinationDetails
  );

  if (loading) {
    return (
      <View className="text-center text-muted py-10">
        Loading examination data...
      </View>
    );
  }

  return (
    <View className="space-y-6 container mx-auto py-8">
      <View className="flex justify-between items-center">
        <View>
          <Text as="h1" className="text-2xl font-bold">
            Examination Details
          </Text>
          <Text as="p" className="text-muted-foreground">
            Medical examination information
          </Text>
        </View>
        <View className="flex space-x-2">
          <Link to={`/appointment/${examinationDetails?.appointment_id}`}>
            <Button variant="outline">View Appointment</Button>
          </Link>
          <Button onClick={() => navigate(-1)} className="flex gap-2">
            Back
          </Button>
        </View>
      </View>

      {/* Patient & Visit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient & Visit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <InfoCard
              label="Patient ID"
              value={examinationDetails?.patient_id}
              icon={<User className="h-5 w-5 text-primary" />}
            /> */}
            <InfoCard
              label="Patient Number"
              value={examinationDetails?.patient_number || "N/A"}
              icon={<User className="h-5 w-5 text-primary" />}
            />
            <InfoCard
              label="Appointment ID"
              value={examinationDetails?.appointment_id || "N/A"}
              icon={<Calendar className="h-5 w-5 text-primary" />}
            />
            <InfoCard
              label="Doctor ID"
              value={examinationDetails?.doctor_id || "N/A"}
              icon={<User className="h-5 w-5 text-primary" />}
            />
          </View>

          <View className="mt-6">
            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <View className="space-y-2">
                <Text as="h3" className="font-semibold">
                  Patient Information
                </Text>
                <View className="flex items-start space-x-4">
                  <View className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary text-lg font-bold">
                    {examinationDetails?.patient_name?.charAt(0) || "N/A"}
                  </View>
                  <View>
                    <Text as="h3" className="font-medium text-lg">
                      {examinationDetails?.patient_name || "N/A"}
                    </Text>
                    <View className="text-sm text-muted-foreground mt-1">
                      <View className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {examinationDetails?.patient_email || "N/A"}
                      </View>
                      <View className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4" />
                        {examinationDetails?.patient_number || "N/A"}
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
                  <View className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center text-accent text-lg font-bold">
                    {examinationDetails?.doctor_name?.charAt(0) || "N/A"}
                  </View>
                  <View>
                    <Text as="h3" className="font-medium text-lg">
                      Dr. {examinationDetails?.doctor_name || "N/A"}
                    </Text>
                    <View className="text-sm text-muted-foreground mt-1">
                      <View className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {examinationDetails?.doctor_email || "N/A"}
                      </View>
                      <View className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4" />
                        {examinationDetails?.doctor_phone || "N/A"}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Examination Details */}
      <Card>
        <CardHeader>
          <CardTitle>Examination Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              label="Temperature"
              value={`${examinationDetails?.temperature}` || "N/A"}
              icon={<Thermometer className="h-5 w-5 text-red-500" />}
            />
            <InfoCard
              label="Blood Pressure"
              value={`${examinationDetails?.bp} mmHg ` || "N/A"}
              icon={<HeartPulse className="h-5 w-5 text-red-500" />}
            />
            <InfoCard
              label="Pulse"
              value={`${examinationDetails?.pulse} bpm` || "N/A"}
              icon={<HeartPulse className="h-5 w-5 text-red-500" />}
            />
          </View>

          <View>
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
                        __html: examinationDetails?.cvs || "N/A",
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" /> RS
                  </TableCell>
                  <TableCell>
                    <View
                      dangerouslySetInnerHTML={{
                        __html: examinationDetails?.rs || "N/A",
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </View>

          <View className="space-y-3">
            <View>
              <Text as="h3" className="text-lg font-semibold mb-1">
                Description
              </Text>
              <View className="text-sm border rounded-md p-3 bg-gray-50 dark:bg-background border-border">
                <View
                  dangerouslySetInnerHTML={{
                    __html: examinationDetails?.description || "N/A",
                  }}
                />
              </View>
            </View>

            <View>
              <Text as="h3" className="text-lg font-semibold mb-1">
                Examination Overview
              </Text>
              <View className="text-sm border rounded-md p-3 bg-gray-50 dark:bg-background border-border">
                <View
                  dangerouslySetInnerHTML={{
                    __html: examinationDetails?.examination_overview || "N/A",
                  }}
                />
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default ExaminationDetailsPage;
