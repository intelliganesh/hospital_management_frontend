import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useShloka } from "@/actions/calls/shloka";
import { clearShlokaDetailSlice } from "@/actions/slices/shloka";
import BouncingLoader from "@/components/BouncingLoader";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";

const ShlokaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shlokaDetailHandler, cleanUp } = useShloka();
  const [isLoading, setIsLoading] = useState(true);

  const shlokaDetails = useSelector(
    (state: RootState) => state?.shloka?.shlokaDetailData,
  );

  useEffect(() => {
    if (id) {
      shlokaDetailHandler(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }

    return () => {
      cleanUp();
      dispatch(clearShlokaDetailSlice());
    };
  }, [id]);

  if (isLoading) {
    return <BouncingLoader isLoading={isLoading} />;
  }

  if (!shlokaDetails) {
    return (
      <View className="container mx-auto p-4">
        <Text className="text-center text-muted-foreground py-10">
          No shloka data found.
        </Text>
      </View>
    );
  }

  return (
    <View className="container mx-auto p-4 max-w-4xl">
      <View className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <View className="flex items-center gap-3">
          <View className="p-2 bg-blue-50 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-semibold">
              {shlokaDetails.title}
            </Text>
            <Text as="span" className="text-sm text-muted-foreground">
              ID: {shlokaDetails.id}
            </Text>
          </View>
        </View>
        <Button
          variant="outline"
          onPress={() => navigate(-1)}
          className="w-full md:w-auto flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shlokas
        </Button>
      </View>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Shloka Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <View>
            <Text as="p" className="text-sm text-muted-foreground mb-1">
              Status
            </Text>
            <Text
              as="span"
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={getStatusColorScheme(shlokaDetails.status)}
            >
              {shlokaDetails.status}
            </Text>
          </View>
          <View>
            <Text as="p" className="text-sm text-muted-foreground mb-2">
              Verse
            </Text>
            <View className="bg-slate-50 p-4 rounded-md border border-border dark:bg-slate-800 whitespace-pre-wrap">
              {shlokaDetails.verse_text}
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default ShlokaDetail;
