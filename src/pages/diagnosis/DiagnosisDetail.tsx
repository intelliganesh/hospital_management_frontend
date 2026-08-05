import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Building2, FileText, Shield } from "lucide-react";
import { useDiagnosis } from "@/actions/calls/diagnosis";
import { useDispatch, useSelector } from "react-redux";
import { clearDiagnosisSlice } from "@/actions/slices/diagnosis";
import BouncingLoader from "@/components/BouncingLoader";
import View from "@/components/view";
import Text from "@/components/text";

const DiagnosisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { diagnosisDetail, cleanUp } = useDiagnosis();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const diagnosisData = useSelector(
    (state: any) => state.diagnosis.diagnosisDetails
  );

  useEffect(() => {
    if (id) {
      diagnosisDetail(
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
      dispatch(clearDiagnosisSlice());
    };
  }, [id]);

  // Mock data - replace with actual API call

  const getStatusColor = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  return (
    <View>
      <BouncingLoader isLoading={isLoading} />
      <View className="container mx-auto px-6 py-8">
        {/* Hero Header */}
        <View className=" mb-12">
          <Text as="h1" className="text-3xl font-bold  mb-2">
            Diagnosis Details
          </Text>
          <Text className="text-muted-foreground">
            Comprehensive medical diagnosis information
          </Text>
        </View>

        {/* Main Content Grid */}
        <View className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Info Card */}
          <Card className="lg:col-span-2 border border-border shadow-lg bg-card ">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <View className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </View>
                {diagnosisData.diagnosis_name || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* ICD Code Section */}
              <View>
                <Text
                  as="label"
                  className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 block"
                >
                  ICD Code
                </Text>
                <View className=" p-6 rounded-xl border border-border">
                  <View className="flex items-center gap-3">
                    <View className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </View>
                    <Text as="span" className="text-2xl  font-bold ">
                      {diagnosisData.icd_code}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Description Section */}
              <View>
                <Text
                  as="label"
                  className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 block"
                >
                  Description
                </Text>
                <View className="bg-card p-6 rounded-xl border border-border">
                  <Text className="text-base leading-relaxed text-foreground/90">
                    {diagnosisData.description}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Sidebar Cards */}
          <View className="space-y-6">
            {/* Status Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6">
                <View className="flex items-center justify-between py-2">
                  <Text
                    as="label"
                    className="text-sm font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    Status
                  </Text>
                  <View className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </View>
                </View>
                <Badge
                  className={`${getStatusColor(
                    diagnosisData.is_active
                  )} px-4 py-2 text-sm font-medium`}
                >
                  {diagnosisData.is_active}
                </Badge>
              </CardContent>
            </Card>

            {/* Department Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-6">
                <View className="flex items-center justify-between py-2">
                  <Text
                    as="label"
                    className="text-sm font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    Department
                  </Text>
                  <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </View>
                </View>
                <Text className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {diagnosisData.department_type}
                </Text>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DiagnosisDetail;
