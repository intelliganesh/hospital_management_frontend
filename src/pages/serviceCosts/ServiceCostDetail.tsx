import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Building,
  FileText,
  Clipboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useServiceCost } from "@/actions/calls/serviceCost";
import { clearserviceCostDetailSlice } from "@/actions/slices/serviceCost";
import BouncingLoader from "@/components/BouncingLoader";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

interface ServiceCostData {
  id: number;
  cost: string;
  service_name: string;
  description: string | null;
  status: string;
  department_type: string;
  case_type: string;
}

const ServiceCostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { serviceCostDetailHandler, cleanUp } = useServiceCost();
  const serviceData = useSelector(
    (state: RootState) =>
      state.serviceCost.serviceCostDetailData as ServiceCostData
  );

  const currencySymbol = useSelector(
    (state: RootState) => state.systemSettings.settings.currency_symbol
  );

  useEffect(() => {
    if (id) {
      serviceCostDetailHandler(
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
      dispatch(clearserviceCostDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!serviceData) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No service cost data found.
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
            <DollarSign className="h-6 w-6 text-blue-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {serviceData.service_name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {serviceData.id}
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
          Back to Services
        </Button>
      </View>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Service Cost Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row: Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Cost
              </Text>
              <View className="flex items-center gap-2">
                <Text as="p" className="font-medium">
                  {currencySymbol}
                  {parseFloat(serviceData?.cost).toFixed(2) || "N/A"}
                </Text>
              </View>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Case Type
              </Text>
              <View className="flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-muted-foreground" />
                <Text as="p" className="font-medium">
                  {serviceData?.case_type || "N/A"}
                </Text>
              </View>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <Text
                as="span"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  serviceData?.status === "Active"
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {serviceData?.status}
              </Text>
            </View>
          </View>

          {/* Second Row: Department Information */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <Building className="h-4 w-4" /> Department
              </Text>
              <View className="bg-muted/30 rounded-md">
                <Text as="p">{serviceData?.department_type || "N/A"}</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          {serviceData.description && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Description
              </Text>
              <View className="bg-muted/30 rounded-md">
                <View
                  dangerouslySetInnerHTML={{
                    __html: serviceData?.description || "N/A",
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

export default ServiceCostDetail;
