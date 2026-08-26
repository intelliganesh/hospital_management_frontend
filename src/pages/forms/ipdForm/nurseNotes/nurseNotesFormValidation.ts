import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    nurse_id: Yup.number().required("Nurse ID is required"),
    ipd_id: Yup.string().required("IPD ID is required"),
    remark1: Yup.string().optional(),
    temperature: Yup.string().optional(),
    bp: Yup.string().optional(),
    pulse: Yup.string().optional(),
    spo2: Yup.string().optional(),
    remark2: Yup.string().optional(),
    // datetime: Yup.date(),
    
});


