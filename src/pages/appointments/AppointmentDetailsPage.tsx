import AppointmentIndex from ".";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import { useAppointments } from "@/actions/calls/appointments";
import View from "@/components/view";
import BouncingLoader from "@/components/BouncingLoader";

const AppointmentDetailsPage = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { appointmentDetailHandler } = useAppointments();

  const appointmentDetails = useSelector(
    (state: RootState) => state.appointment.appointmentDetailData
  );

  useEffect(() => {
    if (params.id) {
      appointmentDetailHandler(params.id, () => {}, [],
    (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      });
    }
  }, [params.id]);

  return <>
     <View className="fixed top-4 left-0  w-full z-50">
             <BouncingLoader  isLoading={isLoading} />
           </View>
    <AppointmentIndex appointmentDetails={appointmentDetails} />
  </>;
};

export default AppointmentDetailsPage;
