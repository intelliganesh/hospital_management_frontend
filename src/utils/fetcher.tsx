import { usePatient } from "@/actions/calls/patient"

export const GetPatientConsultationList = (patientId: string) => {
    const {getPatientConsultationHandler} = usePatient();

       const data = getPatientConsultationHandler(patientId, (data) => {
            return data;
        });
    return data;
}