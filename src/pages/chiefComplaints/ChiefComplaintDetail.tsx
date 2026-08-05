import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useNavigate, useParams } from "react-router-dom";
import { useChiefComplaint } from "@/actions/calls/chiefComplaints";
import { clearChiefComplaintDetailSlice } from "@/actions/slices/chiefComplaints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, Stethoscope } from "lucide-react";
import Button from "@/components/button";
import View from "@/components/view";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

interface ChiefComplaintData {
  id: number;
  complaint_name: string;
  description: string | null;
  is_active: string;
  created_at: string;
  updated_at: string;
  department_type: string;
}

const ChiefComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { chiefComplaintDetailHandler, cleanUp } = useChiefComplaint();
  const complaintData = useSelector(
    (state: RootState) =>
      state.chiefComplaint.chiefComplaintDetailData as ChiefComplaintData | null
  );

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    chiefComplaintDetailHandler(
      id,
      () => {
        setNotFound(false);
        setIsLoading(false);
      },
      [],
      (status) => {
        setIsLoading(status === "pending" || status === "failed");
        if (status === "failed") {
          setNotFound(true);
        }
      }
    );

    return () => {
      cleanUp();
      dispatch(clearChiefComplaintDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (notFound || !complaintData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No chief complaint details found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View>
          <Text as="h2" className="text-2xl font-bold tracking-tight">
            {complaintData.complaint_name || "Chief Complaint Details"}
          </Text>
          <Text as="p" className="text-sm text-muted-foreground">
            ID: {complaintData.id}
          </Text>
        </View>
        <Button
          variant="outline"
          onPress={() => navigate(-1)}
          className="w-full md:w-auto flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </View>

      {/* Complaint Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Complaint Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Complaint Name
              </Text>
              <Text as="p" className="font-medium">
                {complaintData.complaint_name || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <View
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  complaintData.is_active === "Active"
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {complaintData.is_active || "N/A"}
              </View>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Type
              </Text>
              <Text as="p" className="font-medium">
                {complaintData.department_type || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Created At
              </Text>
              <Text as="p" className="font-medium">
                {new Date(complaintData.created_at).toLocaleDateString() ||
                  "N/A"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {complaintData.description &&
            complaintData.description !== "<p></p>" && (
              <View>
                <Text
                  as="p"
                  className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" /> Description
                </Text>
                <View className="bg-muted/30 rounded-md">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: complaintData.description,
                    }}
                  />
                </View>
              </View>
            )}
        </CardContent>
      </Card>
    </View>
  );
};

export default ChiefComplaintDetail;
