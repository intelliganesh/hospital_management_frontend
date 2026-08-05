import { GenericStatus } from "@/interfaces/index";
import { LineOfTreatment } from "../ipdCases";

export interface Investigation{
    patientId:string;
    provisionalDiagnosis:string;
    finalDiagnosis:string;
    lineOfTreatment:LineOfTreatment | GenericStatus.BOTH;
    treatmentAdvice:string;
    preOperativeInstruction?:string;
    familyHistoryId:number;
    personalHistoryId:number;
    examinationId:number;
    treatmentGiven:string;
}