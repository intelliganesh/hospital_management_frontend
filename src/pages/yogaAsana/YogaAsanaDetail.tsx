import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, ArrowLeft, Activity, AlertTriangle, Info } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useYogaAsana } from "@/actions/calls/yogaAsana";
import { clearYogaAsanaDetailSlice } from "@/actions/slices/yogaAsana";
import BouncingLoader from "@/components/BouncingLoader";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

interface YogaAsanaData {
  id: number;
  asana_name: string;
  description: string;
  benefits: string;
  contraindications: string;
  difficulty_level: string;
  recommended_duration: number;
  status: string;
}

const YogaAsanaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { yogaAsanaDetailHandler, cleanUp } = useYogaAsana();
  const [isLoading, setIsLoading] = useState(true);

  const yogasanaDetails = useSelector(
    (state: RootState) => state?.yogaAsana?.yogaAsanaDetailData as YogaAsanaData
  );

  useEffect(() => {
    if (id) {
      yogaAsanaDetailHandler(
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
      dispatch(clearYogaAsanaDetailSlice());
    };
  }, [id]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!yogasanaDetails) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No yoga asana data found.
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
            <Activity className="h-6 w-6 text-blue-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {yogasanaDetails.asana_name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {yogasanaDetails.id}
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
          Back to Asanas
        </Button>
      </View>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Asana Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row: Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Difficulty Level
              </Text>
              <Text
                as="span"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  yogasanaDetails.difficulty_level === "Beginner"
                    ? GenericStatus.ACTIVE
                    : yogasanaDetails.difficulty_level === "Intermediate"
                    ? GenericStatus.ONGOING
                    : GenericStatus.INACTIVE
                )}
              >
                {yogasanaDetails.difficulty_level}
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
                  yogasanaDetails.status === "Active"
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {yogasanaDetails.status}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Recommended Duration
              </Text>
              <View className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Text as="p" className="font-medium">
                  {formatDuration(yogasanaDetails.recommended_duration)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          {yogasanaDetails.description && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <Info className="h-4 w-4" /> Description
              </Text>
              <View
                dangerouslySetInnerHTML={{
                  __html: yogasanaDetails.description,
                }}
              />
            </View>
          )}

          {/* Benefits Section */}
          <View>
            <Text
              as="p"
              className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
            >
              <Activity className="h-4 w-4 text-green-600" /> Benefits
            </Text>
            <View className="bg-green-50/50 p-4 rounded-md border border-border dark:border-border dark:bg-green-900/20">
              <View
                dangerouslySetInnerHTML={{ __html: yogasanaDetails.benefits }}
              />
            </View>
          </View>

          {/* Contraindications Section */}
          <View>
            <Text
              as="p"
              className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />{" "}
              Contraindications
            </Text>
            <View className="bg-amber-50/50 p-4 rounded-md border border-border dark:border-border dark:bg-amber-900/20">
              <View
                dangerouslySetInnerHTML={{
                  __html: yogasanaDetails.contraindications,
                }}
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default YogaAsanaDetail;
