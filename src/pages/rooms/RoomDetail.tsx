import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, BedDouble } from "lucide-react";
// import { RoomStatus } from "@/interfaces/master/rooms";
import Button from "@/components/button";
import { useEffect, useState } from "react";
import { useRoom } from "@/actions/calls/room";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Badge } from "@/components/ui/badge";
import { clearRoomByIdSuccess } from "@/actions/slices/room";
import View from "@/components/view";
import Text from "@/components/text";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import BouncingLoader from "@/components/BouncingLoader";

const RoomDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { getRoomById, cleanUp } = useRoom();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const roomData = useSelector((state: RootState) => state.room.currentRoom);

  useEffect(() => {
    if (id) {
      getRoomById(id, () => {}, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
      setLoading(false);
    }
    return () => {
      cleanUp();
      dispatch(clearRoomByIdSuccess());
    };
  }, []);

  if (loading || !roomData) {
    return (
      <View className="text-center text-muted py-10">Loading Rooms data...</View>
    );
  }

  return (
    <View className="container mx-auto p-4 space-y-6">
      <BouncingLoader isLoading={isLoading} />
      <View className="flex justify-between items-center">
        <View>
          <Text as="h1" className="text-2xl font-bold">
            Room Details
          </Text>
          <Text as="p" className="text-muted-foreground">
            Viewing details for room {roomData?.name}
          </Text>
        </View>
        <View className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Home
          </Button>
        </View>
      </View>

      {/* Room Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <View className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Room #
              <Text as="span" className="text-muted-foreground">
                {roomData?.name}
              </Text>
            </CardTitle>

            <Badge style={getStatusColorScheme(roomData.status)}>
              {roomData.status}
            </Badge>
          </View>
        </CardHeader>
        <CardContent>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <View className="flex items-center text-sm">
              <Building className="h-5 w-5 text-primary mr-2" />
              <Text as="span">Location: {roomData?.location || "N/A"}</Text>
            </View>
            <View className="flex items-center text-sm">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <Text as="span">Floor {roomData?.floor || "N/A"}</Text>
            </View>
            <View className="flex items-center text-sm">
              <BedDouble className="h-5 w-5 text-primary mr-2" />
              <Text as="span">Capacity: {roomData?.capacity || "N/A"}</Text>
            </View>
          </View>

          {/* <h3 className="text-md font-semibold mb-2">Room Details</h3> */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <View className="flex items-center text-sm">
              {/* <Layout className="h-5 w-5 text-primary mr-2" /> */}
              <Text as="span">Type: {roomData?.type || "N/A"}</Text>
            </View>
            <View className="flex items-center text-sm">
              {/* <ListTree className="h-5 w-5 text-primary mr-2" /> */}
              <Text as="span">Ward Type: {roomData?.ward_type || "N/A"}</Text>
            </View>
            <View className="flex items-center text-sm">
              {/* <Hospital className="h-5 w-5 text-primary mr-2" /> */}
              <Text as="span">Ward Name: {roomData?.ward_name || "N/A"}</Text>
            </View>
          </View>

          {/* <View className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm">Type: {roomData?.type || "N/A"}</p>
          </div> */}
        </CardContent>
      </Card>

      {/* Ward Summary Card */}
      {/* <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg mb-4">Ward Summary</CardTitle>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary text-xl font-bold mr-4">
                {roomData?.ward_name || "W"}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {roomData?.ward_name || "N/A"}
                </CardTitle>
                <CardDescription className="flex items-center mt-1 text-sm">
                  <span className="mr-4">
                    Ward Type: {roomData?.ward_type || "N/A"}
                  </span>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Location: {roomData?.location || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <span>Floor: {roomData?.floor || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <BedDouble className="h-5 w-5 text-muted-foreground mr-2" />
              <span>
                Capacity:{" "}
                {typeof roomData?.capacity === "number"
                  ? `${roomData.capacity} ${
                      roomData.capacity > 1 ? "Beds" : "Bed"
                    }`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              label="Room Type"
              value={roomData?.type || "Unknown"}
              icon={<Building className="h-5 w-5 text-blue-500" />}
            />
            <InfoCard
              label="Room Status"
              value={roomData?.status.toLowerCase() || "N/A"}
              icon={<Activity className="h-5 w-5 text-amber-500" />}
            />
            <InfoCard
              label="Ward Type"
              value={roomData?.ward_type || "N/A"}
              icon={<User className="h-5 w-5 text-primary" />}
            />
            {/* <InfoCard
              label="Updated At"
              value={
                roomData?.updated_at
                  ? new Date(roomData.updated_at).toLocaleDateString()
                  : "N/A"
              }
              icon={<Calendar className="h-5 w-5 text-green-500" />}
            /> */}
      {/* </div>
        </CardContent>
      </Card> */}

      {/* Room Additional Information */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Room Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-primary text-lg font-bold mr-4">
              {roomData?.type || 'R'}
            </div>
            <div>
              <h3 className="font-medium text-lg">{roomData?.type}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-md font-semibold mb-2">Room Size</h3>
              <p className="text-muted-foreground">
                {roomData?.size || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Facilities</h3>
              <p className="text-muted-foreground">
                {roomData?.facilities?.join(", ") || "Standard facilities"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </View>
    // <View className="min-h-screen p-6">
    //   <View className="max-w-4xl mx-auto">
    //     <View className="flex justify-between items-center mb-6">
    //       <View>
    //         <Text as="h1" className="text-2xl font-bold text-neutral-100">
    //           Room Details
    //         </Text>
    //         <Text as="p" className="text-neutral-500">
    //           View detailed information about the room
    //         </Text>
    //       </View>
    //       <View className="flex gap-3">
    //         <Button variant="outline">
    //           <Link to="/">Back to Home</Link>
    //         </Button>
    //       </View>
    //     </View>

    //     <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //       {/* Main Info Card */}
    //       <Card className="lg:col-span-2">
    //         <View className="flex flex-row justify-between items-center space-y-1.5 p-6">
    //           <CardTitle className="text-xl font-semibold">
    //             {roomData?.name}
    //           </CardTitle>
    //           <Badge
    //             className={`${getStatusColor(roomData.status)} px-3 py-1 w-auto`}
    //             variant="secondary"
    //           >
    //             {roomData.status.toLowerCase()}
    //           </Badge>
    //         </View>
    //         <CardContent className="grid gap-6">
    //           <View className="grid grid-cols-2 gap-4">
    //             <View className="space-y-1">
    //               <Text as="p" className="text-sm text-neutral-500">Room Type</Text>
    //               <Text as="p" className="font-medium">{roomData?.type}</Text>
    //             </View>
    //             <View className="space-y-1">
    //               <Text as="p" className="text-sm text-neutral-500">Capacity</Text>
    //               <Text as="p" className="font-medium">
    //                 {roomData?.capacity }{" "}
    //                 {roomData?.capacity && 0 > 1 ? "Beds" : "Bed"}
    //               </Text>
    //             </View>
    //             <View className="space-y-1">
    //               <Text as="p" className="text-sm text-neutral-500">Ward Name</Text>
    //               <Text as="p" className="font-medium">{roomData?.ward_name}</Text>
    //             </View>
    //             <View className="space-y-1">
    //               <Text as="p" className="text-sm text-neutral-500">Ward Type</Text>
    //               <Text as="p" className="font-medium">{roomData?.ward_type}</Text>
    //             </View>
    //           </View>
    //         </CardContent>
    //       </Card>

    //       {/* Location Info Card */}
    //       <Card>
    //         <CardHeader>
    //           <CardTitle className="text-lg font-semibold">Location</CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <View className="flex items-center gap-2 text-neutral-600">
    //             <Building className="h-4 w-4" />
    //             <span>{roomData?.location}</span>
    //           </View>
    //           <View className="flex items-center gap-2 text-neutral-600">
    //             <MapPin className="h-4 w-4" />
    //             <span>Floor {roomData?.floor}</span>
    //           </View>
    //           <View className="flex items-center gap-2 text-neutral-600">
    //             <BedDouble className="h-4 w-4" />
    //             <span>Capacity: {roomData?.capacity}</span>
    //           </View>
    //         </CardContent>
    //       </Card>
    //     </View>
    //   </View>
    // </View>
  );
};

export default RoomDetails;
