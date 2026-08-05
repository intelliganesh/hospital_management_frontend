import { OpdCase } from "../opdCases";

interface userList {
  id: string;
  name: string;
}
interface patientList {
  id: string;
  patient_number: string;
}
interface appointmentList {
  id: string;
  appointment_number: string;
}
interface frontDeskUserList {
  id: string;
  appointment_number: string;
}
export interface OpdState {
  opdDetailData: any;
  opdFullDetailData: any | null;
  opdListData: OpdCase[] | any;
  loading: boolean;
  userList: userList[] | null | any;
  allUserList: userList[] | null | any;
  patientList: patientList[] | null | any;
  appointmentList: appointmentList[] | null | any;
  frontDeskUserList: frontDeskUserList[] | null | any;
}
