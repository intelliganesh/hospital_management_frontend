import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ChefHat, FileText, Zap } from "lucide-react";
import Button from "@/components/button";
import { ArrowLeft } from "lucide-react";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import View from "@/components/view";
import Text from "@/components/text";
import { useDiet } from "@/actions/calls/diet";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import { clearDieticianDetailSlice } from "@/actions/slices/diet";

interface DietData {
  id: number;
  diet_name: string;
  description: string;
  calories: number | null;
  is_active: string;
  department_type: string;
}

const DietDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { dietDetailHandler, cleanUp } = useDiet();
  const dietData = useSelector(
    (state: RootState) => state.diet.dietDetailData as DietData | null
  );

  useEffect(() => {
    if (id) {
      dietDetailHandler(
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
      dispatch(clearDieticianDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!dietData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No diet details found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          {/* <Button
            variant="ghost"
            onPress={() => navigate(-1)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button> */}
          <View>
            <Text as="h2" className="text-2xl font-bold tracking-tight">
              {dietData.diet_name || "Diet Details"}
            </Text>
            <Text as="p" className="text-sm text-muted-foreground">
              Id: {dietData.id || "N/A"}
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
            <ChefHat className="h-5 w-5 text-primary" />
            Diet Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Diet Name
              </Text>
              <Text as="p" className="font-medium">
                {dietData.diet_name || "N/A"}
              </Text>
            </View> */}

            {/* Department Information */}
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <Building2 className="h-4 w-4" /> Department
              </Text>
              <View className="bg-muted/30 rounded-md">
                <Text as="p">{dietData.department_type || "N/A"}</Text>
              </View>
            </View>

            {/* Calories (if available) */}
            {dietData.calories !== null && (
              <View>
                <Text
                  as="p"
                  className="text-sm text-muted-foreground mb-1 flex items-center gap-1"
                >
                  <Zap className="h-4 w-4" /> Calories
                </Text>
                <Text as="p" className="font-medium">
                  {dietData.calories} kcal
                </Text>
              </View>
            )}

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <Text
                as="span"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  dietData.is_active === "Active"
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {dietData.is_active || "N/A"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {dietData.description && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Description
              </Text>
              <View className="bg-muted/30 rounded-md">
                <Text as="p">{dietData.description}</Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default DietDetailsPage;
