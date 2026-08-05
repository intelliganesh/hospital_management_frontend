import { PatientTest } from "../test";

export interface PatientTestState{
    loading: boolean;
    patientTestListData: PatientTest[] | any;
    patientTestDetailData: any;
}