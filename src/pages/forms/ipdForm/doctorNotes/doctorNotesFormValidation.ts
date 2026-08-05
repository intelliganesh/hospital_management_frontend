import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    doctor_id: Yup.number().required("Doctor ID is required"),
    ipd_id: Yup.string().required("IPD ID is required"),
    gc: Yup.string().optional(),
    bp: Yup.string().optional(),
    pr: Yup.string().optional(),
    clinical_notes: Yup.string().optional(),
    diagnosis: Yup.string().optional(),
    datetime: Yup.date().required("Date is required"),
    
});


