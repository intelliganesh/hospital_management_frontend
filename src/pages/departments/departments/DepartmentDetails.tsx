import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Building2 } from "lucide-react";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { clearRoomByIdSuccess } from "@/actions/slices/room";
import View from "@/components/view";
import Text from "@/components/text";
import { useDepartment } from "@/actions/calls/department";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";

interface DepartmentData {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  is_active: boolean;
  department_type: string;
}

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { departmentDetailHandler, cleanUp } = useDepartment();
  const departmentData = useSelector(
    (state: RootState) =>
      state.department.departmentDetailData as DepartmentData | null
  );

  useEffect(() => {
    if (id) {
      departmentDetailHandler(
        id,
        () => {
          setIsLoading(false);
        },
        [],
        (status) => {
          setIsLoading(status === "pending" || status === "failed");
        }
      );
    }

    return () => {
      cleanUp();
      dispatch(clearRoomByIdSuccess());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!departmentData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No department details found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View>
            <Text as="h2" className="text-2xl font-bold tracking-tight">
              {departmentData.name || "Department Details"}
            </Text>
            <Text as="p" className="text-sm text-muted-foreground">
              ID: {departmentData.id || "N/A"}
            </Text>
          </View>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Name
              </Text>
              <Text as="p" className="font-medium">
                {departmentData.name || "N/A"}
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
                  departmentData.is_active
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {departmentData.is_active ? "Active" : "Inactive"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Code
              </Text>
              <Text as="p" className="font-medium">
                {departmentData.code || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Type
              </Text>
              <Text as="p" className="font-medium">
                {departmentData.department_type || "N/A"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {departmentData.description && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Description
              </Text>
              <View className="bg-muted/30 rounded-md">
                <Text as="p">{departmentData.description}</Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default DepartmentDetails;
