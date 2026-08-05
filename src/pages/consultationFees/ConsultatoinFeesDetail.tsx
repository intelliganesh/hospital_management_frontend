import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import React, { useEffect } from "react";
import { Edit, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearFindingDetailSlice } from "@/actions/slices/findings";
import { useFindings } from "@/actions/calls/findings";

const FindingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { findingDetailHandler, cleanUp } = useFindings();
  const findingData = useSelector(
    (state: any) => state.findings.findingDetailData
  );

  useEffect(() => {
    if (id) {
      findingDetailHandler(id, (_: boolean) => {});
    }
  }, [id]);

  useEffect(() => {
    return () => {
      cleanUp();
      dispatch(clearFindingDetailSlice());
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <View className="space-y-6 container mx-auto py-8">
        {/* Header Section */}
        <View className="flex justify-between items-center mb-6">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl md:text-3xl font-bold text-primary dark:text-white"
            >
              Finding Details
            </Text>
            <Text as="p" className="text-muted-foreground">
              View detailed information about the finding
            </Text>
          </View>
          <View className="flex gap-3">
            <Button variant="outline" size="small">
              <Link to="/findings" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Findings
              </Link>
            </Button>
            {id && (
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate("/findings/edit/" + id);
                }}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Finding
              </Button>
            )}
          </View>
        </View>

        {/* Finding Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <View className="flex justify-between items-center">
              <CardTitle className="text-lg">Finding Information</CardTitle>
              <Text
                as="span"
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  findingData?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : findingData?.status === "inactive"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {findingData?.status}
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Finding Code
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  {findingData?.finding_code || "N/A"}
                </Text>
              </View>
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Finding Name
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  {findingData?.finding_name || "N/A"}
                </Text>
              </View>
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Category
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  {findingData?.category || "N/A"}
                </Text>
              </View>

              {/* <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Status
                </Text>
                <Text as="p" className="text-muted-foreground text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      findingData?.status === "active"
                        ? "bg-success text-white"
                        : findingData?.status === "inactive"
                        ? "bg-neutral-400 text-white"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {findingData?.status || "N/A"}
                  </span>
                </Text>
              </View> */}
            </View>

            <View className="mt-4 p-4 bg-neutral-100 border border-border rounded-md dark:bg-background">
              <Text as="h3" className="text-md font-semibold mb-2">
                Finding Description
              </Text>
              <Text as="p" className="text-sm">
                {findingData?.finding_description || "N/A"}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* System Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Finding ID
                </Text>
                <Text as="p" className="text-muted-foreground font-mono">
                  {findingData?.id || "N/A"}
                </Text>
              </View> */}
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Created Date
                </Text>
                <Text as="p" className="text-muted-foreground">
                  {findingData?.created_at
                    ? new Date(findingData?.created_at)?.toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
              <View>
                <Text as="h3" className="text-md font-semibold mb-2">
                  Last Updated
                </Text>
                <Text as="p" className="text-muted-foreground">
                  {findingData?.updated_at
                    ? new Date(findingData?.updated_at)?.toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </React.Fragment>
  );
};

export default FindingDetail;
