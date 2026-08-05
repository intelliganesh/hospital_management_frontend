import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { useComorbidity } from "@/actions/calls/comorbidities";
import { useEffect, useState } from "react";
import BouncingLoader from "@/components/BouncingLoader";
import { clearComorbiditySlice } from "@/actions/slices/comorbidities";
import View from "@/components/view";
import Text from "@/components/text";
import { RootState } from "@/actions/store";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

interface ComorbidityData {
  id: number;
  name: string;
  description: string | null;
  is_active: string;
  department_type: string;
}

const ComorbidityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { comorbidityDetail, cleanUp } = useComorbidity();
  const [isLoading, setIsLoading] = useState(true);

  const comorbidityData = useSelector(
    (state: RootState) =>
      state.comorbidities.comorbidityDetails as ComorbidityData
  );

  useEffect(() => {
    if (id) {
      comorbidityDetail(
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
      dispatch(clearComorbiditySlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!comorbidityData) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No comorbidity data found.
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
          <View className="p-2 bg-amber-50 rounded-lg">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {comorbidityData.name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {comorbidityData.id}
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
          Back to List
        </Button>
      </View>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Comorbidity Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row: Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Condition Name
              </Text>
              <Text as="p" className="font-medium">
                {comorbidityData.name}
              </Text>
            </View> */}

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department
              </Text>
              <Text as="p" className="font-medium">
                {comorbidityData.department_type || "Not specified"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <Text
                as="span"
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `}
                style={getStatusColorScheme(
                  comorbidityData.is_active
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {comorbidityData.is_active}
              </Text>
            </View>
          </View>

          {/* Second Row: Notes */}
          {comorbidityData.description && (
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-2">
                Description
              </Text>
              <View
                dangerouslySetInnerHTML={{
                  __html: comorbidityData.description,
                }}
              />
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default ComorbidityDetail;
