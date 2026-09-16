import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { clearBedDetailSlice } from "@/actions/slices/beds";
import View from "@/components/view";
import Text from "@/components/text";
import { useBeds } from "@/actions/calls/beds"; // Hook for Beds
// import { LoadingStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import Empty from "@/components/Empty";

const BedDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { bedDetailHandler, cleanUp } = useBeds();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const bedData = useSelector((state: RootState) => state.beds.bedDetailData);

  useEffect(() => {
    if (id) {
      bedDetailHandler(id, (_: boolean) => {
        setLoading(false);
      });
    }
    return () => {
      cleanUp();
      dispatch(clearBedDetailSlice());
    };
  }, [id]);

  if (loading) {
    return <BouncingLoader isLoading={true} />;
  }

  if (!bedData) {
    return (
      <Empty message="Bed details not found" />
    );
  }

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 flex justify-center">
      <View className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              Bed Details
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Viewing details for bed {bedData?.bed_no}
            </Text>
          </View>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>

        {/* Content Container */}
        <View className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-8">
          
          {/* Basic Information Section */}
          <View>
            <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
              Basic Information
            </Text>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <View className="mb-3">
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Bed Number
                </Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                  {bedData?.bed_no || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Bed Type
                </Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {bedData?.bed_type || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Size
                </Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                  {bedData?.size || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </Text>
                <View className="inline-block">
                     <Text className={`text-sm font-semibold px-2 py-0.5 rounded ${
                        bedData?.status === "vacant" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                        bedData?.status === "occupied" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                     }`}>
                        {bedData?.status?.toUpperCase() || "N/A"}
                     </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Location Details Section */}
          <View>
            <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
              Location Details
            </Text>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Ward
                </Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                  {bedData?.ward_id || "N/A"}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Room
                </Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                  {bedData?.room_id || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BedDetails;
