import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTest } from "@/actions/calls/test";
import { clearTestDetailSlice } from "@/actions/slices/test";
import { RootState } from "@/actions/store";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import BouncingLoader from "@/components/BouncingLoader";
import { FileText, ArrowLeft } from "lucide-react";

interface TestData {
  id: number;
  test_name: string;
  test_number: string;
  test_description: string | null;
  tax_price: number | null;
  test_price: number | null;
  department_type: string;
}

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { testDetailHandler, cleanUp } = useTest();
  const testData = useSelector(
    (state: RootState) => state.test.testDetailData as TestData | null
  );

  const currencySymbol = useSelector(
    (state: RootState) => state.systemSettings.settings.currency_symbol || "₹"
  );

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    testDetailHandler(
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
      dispatch(clearTestDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (notFound || !testData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No test details found.
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
              {testData.test_name || "Test Details"}
            </Text>
            <Text as="p" className="text-sm text-muted-foreground">
              ID: {testData?.id}
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
            <FileText className="h-5 w-5 text-primary" />
            Test Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Test Name
              </Text>
              <Text as="p" className="font-medium">
                {testData.test_name || "N/A"}
              </Text>
            </View> */}

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Test Number
              </Text>
              <Text as="p" className="font-medium">
                {testData?.test_number ||
                  `TEST${testData?.id.toString().padStart(4, "0")}`}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Department Type
              </Text>
              <Text as="p" className="font-medium">
                {testData?.department_type || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Test Price
              </Text>
              <Text as="p" className="font-medium">
                {testData?.test_price !== null
                  ? `${currencySymbol}${testData?.test_price.toFixed(2)}`
                  : "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Tax Price
              </Text>
              <Text as="p" className="font-medium">
                {testData?.tax_price !== null
                  ? `${currencySymbol}${testData?.tax_price.toFixed(2)}`
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Description */}
          {testData?.test_description &&
            testData?.test_description !== "<p></p>" && (
              <View>
                <Text
                  as="p"
                  className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" /> Description
                </Text>
                <View className="bg-muted/30 rounded-md">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: testData?.test_description,
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

export default TestDetails;
