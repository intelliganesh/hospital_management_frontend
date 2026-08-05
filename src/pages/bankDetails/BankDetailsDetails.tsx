import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Building2 } from "lucide-react";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import View from "@/components/view";
import Text from "@/components/text";
import { useBankDetails } from "@/actions/calls/bankDetails";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import { BankDetails } from "@/interfaces/bankDetails";

const BankDetailsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { bankDetailsDetailHandler, cleanUp } = useBankDetails();
  const bankData = useSelector(
    (state: RootState) =>
      state.bankDetails.bankDetailsDetailData as BankDetails | null
  );

  useEffect(() => {
    if (id) {
      bankDetailsDetailHandler(
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
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!bankData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No bank details found.
        </Text>
      </View>
    );
  }
  const isActive = Number(bankData.is_active) === 1;

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View>
            <Text as="h2" className="text-2xl font-bold tracking-tight">
              {bankData.title || "Bank Details"}
            </Text>
            {/* <Text as="p" className="text-sm text-muted-foreground">
              ID: {bankData.id || "N/A"}
            </Text> */}
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
            Bank Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Bank Name
              </Text>
              <Text as="p" className="font-medium">
                {bankData.title || "N/A"}
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
                  isActive ? GenericStatus.ACTIVE : GenericStatus.INACTIVE
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* Account Details */}
          {bankData.details && (
            <View>
              <Text
                as="p"
                className="text-sm text-muted-foreground mb-2 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Account Details
              </Text>
              <View className="bg-muted/30 rounded-md p-3 border border-slate-100 dark:border-slate-700">
                <Text as="p" className="whitespace-pre-wrap">
                  {bankData.details}
                </Text>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default BankDetailsDetails;
