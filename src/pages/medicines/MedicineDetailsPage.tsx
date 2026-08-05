import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/button";
import { ArrowLeft, Pill } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/actions/store";
import { useMedicine } from "@/actions/calls/medicine";
import { clearMedicineDetailReducer } from "@/actions/slices/medicine";
import Text from "@/components/text";
import View from "@/components/view";
import BouncingLoader from "@/components/BouncingLoader";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";

// interface Medicine {
//   id: number;
//   medicine_name: string;
//   generic_name: string | null;
//   dosage_form: string;
//   strength: string;
//   strength_unit: string;
//   manufacturer: string | null;
//   is_active: boolean;
//   department_type: string;
// }

const MedicineDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { medicineDetailHandler } = useMedicine();
  const [isLoading, setIsLoading] = useState(false);

  // const currentSymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol
  // );
  const medicineDetails = useSelector(
    (state: RootState) => state.medicines.medicineDetailData
  );

  useEffect(() => {
    if (params.id) {
      medicineDetailHandler(
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
      dispatch(clearMedicineDetailReducer());
    };
  }, [params.id]);

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View className="p-2 bg-blue-50 rounded-lg">
            <Pill className="h-6 w-6 text-blue-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {medicineDetails?.medicine_name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {medicineDetails?.id}
              </Text>
            </View>
          </View>
        </View>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full md:w-auto flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medicines
        </Button>
      </View>

      <BouncingLoader isLoading={isLoading} />

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Medicine Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View className="space-y-4">
              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Generic Name
                </Text>
                <Text as="p" className="font-medium">
                  {medicineDetails?.generic_name || "Not specified"}
                </Text>
              </View>

              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Dosage Form
                </Text>
                <Text as="p" className="font-medium">
                  {medicineDetails?.dosage_form || "Not specified"}
                </Text>
              </View>

              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Department
                </Text>
                <Text as="p" className="font-medium">
                  {medicineDetails?.department_type || "Not specified"}
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Strength
                </Text>
                <Text as="p" className="font-medium">
                  {medicineDetails?.strength || "Not specified"}{" "}
                  {medicineDetails?.strength_unit}
                </Text>
              </View>

              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Manufacturer
                </Text>
                <Text as="p" className="font-medium">
                  {medicineDetails?.manufacturer || "Not specified"}
                </Text>
              </View>

              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Status
                </Text>
                <Text
                  as="span"
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                  style={getStatusColorScheme(
                    medicineDetails?.is_active
                      ? GenericStatus.ACTIVE
                      : GenericStatus.INACTIVE
                  )}
                >
                  {medicineDetails?.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default MedicineDetailsPage;
