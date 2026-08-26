import { useParams } from "react-router-dom";
import { ArrowLeft, Building, MapPin, Stethoscope, Hash } from "lucide-react";
import Button from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import View from "@/components/view";
import Text from "@/components/text";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useWards } from "@/actions/calls/wards";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { toast } from "@/utils/custom-hooks/use-toast";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
// import Input from "@/components/input";
// import { Ward, WardType, WardStatus } from "@/types/ward";

const WardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wardDetailHandler, cleanUp } = useWards();

  const wardData = useSelector((state: RootState) => state.wards.wardDetailData);

  useEffect(() => {
    if (!id) {
      navigate(-1);
      toast({
        title: "Error",
        description: "Ward data not found!",
        variant: "destructive",
      });
    }else {
      wardDetailHandler(id, () => {});
    }
    return () => {
      cleanUp();
    };

  }, [id, navigate]);


  return (
    <View className="min-h-screen p-4">
      <View className=" space-y-6">
        {/* Header */}
        <View className="flex items-center justify-between gap-4 mb-6">
            
          <View>
            <Text as="h1" weight="font-semibold" className="text-2xl">Ward Details</Text>
            <Text as="p" className="text-muted-foreground">Ward ID: {wardData.id}</Text>
          </View>
          <Button variant="outline" className="flex items-center" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
        </View>

        {/* Ward Information Card */}
        <Card>
          <CardHeader>
            <View className="flex items-center justify-between">
              <View>
                <CardTitle className="text-2xl">{wardData.name}</CardTitle>
                <View className="flex items-center gap-2 mt-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <Text as="span" className="text-sm text-muted-foreground">Ward Number: {wardData.ward_number || 'Not assigned'}</Text>
                </View>
              </View>
              <View className="flex items-center gap-2">
                <Badge style={getStatusColorScheme(wardData.status)}>
                  {wardData.status}
                </Badge>
              </View>
            </View>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <View>
              <Text as="h3" weight="font-semibold" className=" mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                Basic Information
              </Text>
              <View className="grid md:grid-cols-2 gap-4">
                <View>
                  <Text as="label" className="text-sm font-medium text-muted-foreground">Floor</Text>
                  <Text as="p" >{wardData.floor}</Text>
                </View>
                <View>
                  <Text as="label" className="text-sm font-medium text-muted-foreground">Type</Text>
                  <Text as="p" >{wardData.type}</Text>
                </View>
                <View>
                  <Text as="label" className="text-sm font-medium text-muted-foreground ">Status</Text>
                  <Text as="p" >{wardData.status}</Text>
                </View>
                <View>
                  <Text as="label" className="text-sm font-medium text-muted-foreground">Ward Number</Text>
                  <Text as="p" >{wardData.ward_number || 'Not assigned'}</Text>
                </View>
              </View>
            </View>

            {/* Location Information */}
            <View className="border-t pt-4">
              <Text as="h3" weight="font-semibold" className=" mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Location Details
              </Text>
              <View className="grid md:grid-cols-2 gap-4">
                {/* <View>
                  <Text as="label" className="text-sm font-medium text-gray-500">Building</Text>
                  <Text as="p" >{wardData.location.building}</Text>
                </View> */}
                <View>
                  <Text as="label" weight="font-medium" className="text-sm text-muted-foreground">Wing</Text>
                  <Text as="p">{wardData.location || 'Not specified'}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {wardData.description && (
              <View className="border-t pt-4">
                <Text as="h3"  weight="font-semibold" className=" mb-2 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  Description
                </Text>
                <View dangerouslySetInnerHTML={{
                        __html: wardData?.description || "N/A",
                      }} className="leading-relaxed" ></View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Ward Statistics Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Ward Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Total Beds</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-gray-600">Occupied Beds</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">6</div>
                <div className="text-sm text-gray-600">Available Beds</div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </View>
    </View>
  );
};

export default WardDetails;
