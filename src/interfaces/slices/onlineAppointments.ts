import { OnlineAppointment } from "@/types/onlineAppointment.types";

export interface OnlineAppointmentsState {
  onlineAppointmentsList: any;
  appointmentDetail: OnlineAppointment | null;
  onlineAppointmentStats: any;
  loading: boolean;
  error: string | null;
}
