import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/button";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useManagement } from "@/actions/calls/management";
import BouncingLoader from "@/components/BouncingLoader";
import View from "@/components/view";
import Text from "@/components/text";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";
import dayjs from "dayjs";

interface ManagementData {
  id: number;
  management_name: string;
  description: string | null;
  department_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ManagementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { managementDetail, cleanUp } = useManagement();

  const managementData = useSelector(
    (state: RootState) => state.management.managementDetails as ManagementData
  );

  useEffect(() => {
    if (id) {
      managementDetail(
        id,
        () => {},
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

    return () => {
      cleanUp();
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!managementData) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No management data found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      <BouncingLoader isLoading={isLoading} />

      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View className="p-2 bg-blue-50 rounded-lg">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {managementData.management_name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {managementData.id}
              </Text>
            </View>
          </View>
        </View>
        <Button
          variant="outline"
          onPress={() => navigate(-1)}
          className="w-full md:w-auto flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Management
        </Button>
      </View>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Management Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row: Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department
              </Text>
              <Text as="p" className="font-medium">
                {managementData.department_type || "Not specified"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <Text
                as="span"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  managementData.is_active
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {managementData.is_active ? "Active" : "Inactive"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Last Updated
              </Text>
              <Text as="p" className="font-medium">
                {dayjs(managementData.updated_at).format("DD-MM-YYYY")}
              </Text>
            </View>
          </View>

          {/* Description Section */}
          {managementData.description && (
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-2">
                Description
              </Text>
              <View
                dangerouslySetInnerHTML={{ __html: managementData.description }}
              ></View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default ManagementDetail;
