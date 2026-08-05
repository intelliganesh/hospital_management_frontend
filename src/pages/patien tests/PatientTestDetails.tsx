import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientTest } from "@/actions/calls/patientTest";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Link } from "react-router-dom";
import { clearPatientTestDetailSlice } from "@/actions/slices/patientTest";

const PatientTestDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { patientTestDetailHandler, cleanUp } = usePatientTest();
  const testData = useSelector(
    (state: any) => state.patientTest.patientTestDetailData
  );

  useEffect(() => {
    if (id) {
      patientTestDetailHandler(id, () => {});
      setLoading(false);
    }
    return () => {
      cleanUp();
      dispatch(clearPatientTestDetailSlice());
    };
  }, [id]);

  if (loading) {
    return (
      <View className="text-center text-muted py-10">Loading test data...</View>
    );
  }

  return (
    <View className="container mx-auto p-4 space-y-6">
      <View className="flex justify-between items-center">
        <View>
          <Text as="h1" weight="font-semibold" className="text-2xl font-bold">
            Patient Test Details
          </Text>
          <Text as="p" className="text-muted-foreground">
            Viewing details for test: {testData?.test_name}
          </Text>
        </View>
        <View className="flex gap-3">
          <Button variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </View>
      </View>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {testData?.test_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View
            className="text-muted-foreground text-sm"
            dangerouslySetInnerHTML={{
              __html: testData?.test_description || "",
            }}
          />
        </CardContent>
      </Card>
    </View>
  );
};

export default PatientTestDetails;
