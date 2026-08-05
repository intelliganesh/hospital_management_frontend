// import AppointmentIndex from ".";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ChefHat, FileText, Zap } from "lucide-react";
import Button from "@/components/button";
import { ArrowLeft } from "lucide-react";
// import parseDescription from "@/utils/parseDescription";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import View from "@/components/view";
import Text from "@/components/text";
import { useDiet } from "@/actions/calls/diet";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import { clearDieticianDetailSlice } from "@/actions/slices/diet";

const DietDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { dietDetailHandler, cleanUp } = useDiet();

  const dietData = useSelector((state: RootState) => state.diet.dietDetailData);

  useEffect(() => {
    if (params?.id) {
      dietDetailHandler(
        params.id,
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
      dispatch(clearDieticianDetailSlice());
    };
  }, [params?.id]);

  return (
    <View className="min-h-screen p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <View className="flex items-center gap-4 mb-6 flex item-center justify-between">
          <View>
            <Text as="h1" weight="font-semibold" className="text-2xl">
              Diet Details
            </Text>
            <Text as="p" className="text-muted-foreground">
              Details of {dietData?.diet_name || "N/A"}
            </Text>
          </View>
          <Button
            variant="outline"
            className="flex items-center"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </View>

        <View className="flex flex justify-end">
          <Text
            className="px-2 py-1 text-xs font-medium rounded-full"
            style={getStatusColorScheme(
              dietData?.is_active
                ? GenericStatus.ACTIVE
                : GenericStatus.INACTIVE
            )}
          >
            {dietData?.is_active}
          </Text>
        </View>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Diet Name Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <ChefHat className="w-5 h-5" />
                </div>
                Diet Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {dietData?.diet_name || "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Calories Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Zap className="w-5 h-5" />
                </div>
                Calories
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">
                {dietData?.calories || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">kcal</p>
            </CardContent>
          </Card>

          {/* Department Type Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Building2 className="w-5 h-5" />
                </div>
                Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">
                {dietData?.department_type || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        <View>
          {/* Description Card - Spans 2 columns */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <FileText className="w-5 h-5" />
                </div>
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {dietData?.description || "N/A"}
              </p>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default DietDetailsPage;
