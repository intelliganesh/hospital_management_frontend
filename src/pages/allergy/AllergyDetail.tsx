import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import { useDispatch, useSelector } from "react-redux";
import { useAllergies } from "@/actions/calls/allergies";
import { clearAllergies } from "@/actions/slices/allergies";
import BouncingLoader from "@/components/BouncingLoader";
import { RootState } from "@/actions/store";

interface AllergyData {
  id: number;
  allergen_name: string;
  notes: string;
  department_type: string;
}

const AllergyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { allergyDetailHandler, cleanUp } = useAllergies();

  const allergyData = useSelector(
    (state: RootState) => state.allergies.allergiesDetailData as AllergyData
  );

  useEffect(() => {
    if (id) {
      allergyDetailHandler(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(status === "pending");
        }
      );
    }

    return () => {
      cleanUp();
      dispatch(clearAllergies());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!allergyData) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No allergy data found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View className="p-2 bg-amber-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {allergyData.allergen_name}
            </Text>
            <View className="flex items-center gap-2 mt-1">
              <Text as="span" className="text-sm text-muted-foreground">
                ID: {allergyData.id}
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
          Back to Allergies
        </Button>
      </View>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Allergy Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View className="space-y-4">
              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Allergen Name
                </Text>
                <Text as="p" className="font-medium">
                  {allergyData.allergen_name}
                </Text>
              </View>

              <View>
                <Text as="p" className="text-sm text-muted-foreground mb-1">
                  Department
                </Text>
                <Text as="p" className="font-medium">
                  {allergyData.department_type || "Not specified"}
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              {allergyData.notes &&
                allergyData.notes !== '<p class="text-left"></p>' && (
                  <View>
                    <Text as="p" className="text-sm text-muted-foreground mb-1">
                      Notes
                    </Text>
                    <View
                      dangerouslySetInnerHTML={{ __html: allergyData.notes }}
                    />
                  </View>
                )}
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default AllergyDetail;
