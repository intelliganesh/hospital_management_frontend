import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Activity,
  
} from "lucide-react";
import Button from "@/components/button";
import { ArrowLeft } from "lucide-react";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import View from "@/components/view";
import Text from "@/components/text";
import { useFistula } from "@/actions/calls/fistula";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import { clearFistulaDetailSlice } from "@/actions/slices/fistula";
import dayjs from "dayjs";

interface FistulaData {
  id: number;
  fistula_name: string;
  description: string | null;
  department_type: string;
  is_active: boolean;
  sub_fistula_name: string | null;
  created_at: string;
  updated_at: string;
}

const FistulaDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { fistulaDetailHandler, cleanUp } = useFistula();
  const fistulaData = useSelector(
    (state: RootState) => state.fistula.fistulaDetailData
  ) as FistulaData | null;

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    fistulaDetailHandler(
      id,
      () => {
        setNotFound(false);
        setIsLoading(false);
      },
      [],
      (status) => {
        setIsLoading(status === "pending");
        if (status === "failed") {
          setNotFound(true);
        }
      }
    );

    return () => {
      cleanUp();
      dispatch(clearFistulaDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (notFound || !fistulaData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No fistula details found.
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
              {fistulaData.fistula_name || "Fistula Details"}
            </Text>
            <Text as="p" className="text-sm text-muted-foreground">
              ID: {fistulaData.id || "N/A"}
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
            <Activity className="h-5 w-5 text-primary" />
            Fistula Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Fistula Name
              </Text>
              <Text as="p" className="font-medium">
                {fistulaData.fistula_name || "N/A"}
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
                  fistulaData.is_active
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {fistulaData.is_active ? "Active" : "Inactive"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Fistula Type
              </Text>
              <Text as="p" className="font-medium">
                {fistulaData.sub_fistula_name || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Type
              </Text>
              <Text as="p" className="font-medium">
                {fistulaData.department_type || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Created At
              </Text>
              <Text as="p" className="font-medium">
                {dayjs(fistulaData.created_at).format("DD-MM-YYYY")}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Last Updated
              </Text>
              <Text as="p" className="font-medium">
                {dayjs(fistulaData.updated_at).format("DD-MM-YYYY")}
              </Text>
            </View>
          </View>

          {/* Description */}
          {fistulaData.description && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Description
              </Text>
              <View className="bg-muted/30 rounded-md ">
                <Text as="p">{fistulaData.description}</Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default FistulaDetailsPage;
