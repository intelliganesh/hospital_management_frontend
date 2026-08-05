import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useNavigate, useParams } from "react-router-dom";
import { useAmountType } from "@/actions/calls/amountType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, ArrowLeft } from "lucide-react";
import Button from "@/components/button";
import View from "@/components/view";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import { clearAmountTypeDetailSlice } from "@/actions/slices/amountType";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

interface AmountTypeData {
  id: number;
  amount_for: string;
  description: string | null;
  status: string;
}

const AmountTypeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { amountTypeDetailHandler, cleanUp } = useAmountType();

  const amountTypeData = useSelector(
    (state: RootState) =>
      state.amountType.amountTypeDetailData as AmountTypeData | null
  );

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    amountTypeDetailHandler(
      id,
      () => {
        setNotFound(false);
        setIsLoading(false);
      },
      [],
      (status) => {
        setIsLoading(status === "pending" || status === "failed");
        if (status === "failed") {
          setNotFound(true);
        }
      }
    );

    return () => {
      cleanUp();
      dispatch(clearAmountTypeDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (notFound || !amountTypeData) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text as="p" className="text-muted-foreground">
          No amount type details found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View>
          <Text as="h2" className="text-2xl font-bold tracking-tight">
            {amountTypeData.amount_for || "Amount Type Details"}
          </Text>
          <Text as="p" className="text-sm text-muted-foreground">
            ID: {amountTypeData.id}
          </Text>
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
            <DollarSign className="h-5 w-5 text-primary" />
            Amount Type Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Amount For
              </Text>
              <Text as="p" className="font-medium">
                {amountTypeData?.amount_for || "N/A"}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-sm text-muted-foreground mb-1">
                Status
              </Text>
              <View
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusColorScheme(
                  amountTypeData?.status === "Active"
                    ? GenericStatus.ACTIVE
                    : GenericStatus.INACTIVE
                )}
              >
                {amountTypeData?.status || "N/A"}
              </View>
            </View>
          </View>

          {/* Description */}
          {amountTypeData?.description &&
            amountTypeData?.description !== "<p></p>" && (
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
                      __html: amountTypeData?.description,
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

export default AmountTypeDetailsPage;
