import * as Yup from "yup";

const yup = Yup.object();

export const validationSchema = Yup.object().shape({
    patient_id: Yup.string().when("$formType", (formType: any, schema: any) => {
        if (formType[0] === "addPatientWithEnrollment" || formType[0] === "editEnrollment") return schema.optional();
        return schema.required("Patient ID is required");
    }),
    consultation_id: Yup.string().optional(),
    // duty_doctor: Yup.array().optional(),
    // nurse: Yup.array().optional(),
    // consultant_doctor: Yup.array().optional(),
    // admission_date_time: Yup.string().optional(),
    // ward_id: Yup.number().optional(),
    // room_id: Yup.number().optional(),
    // bed_id: Yup.number().optional(),
    // advance_amount: Yup.number().optional(),
    
    // Patient details - required only when adding new patient with enrollment
    // patient_first_name: Yup.string().when("$formType", (formType: any, schema: any) => {
    //     return formType[0] === "addPatientWithEnrollment" ? schema.required("First Name is required") : schema.optional();
    // }),
    // patient_last_name: Yup.string().when("$formType", (formType: any, schema: any) => {
    //     return formType[0] === "addPatientWithEnrollment" ? schema.required("Last Name is required") : schema.optional();
    // }),
    // patient_gender: Yup.string().when("$formType", (formType: any, schema: any) => {
    //     return formType[0] === "addPatientWithEnrollment" ? schema.required("Gender is required") : schema.optional();
    // }),
    // patient_attendant_name: Yup.string().when("$formType", (formType: any, schema: any) => {
    //     return formType[0] === "addPatientWithEnrollment" ? schema.required("Attendant Name is required") : schema.optional();
    // }),
    // patient_attendant_phone: Yup.string().when("$formType", (formType: any, schema: any) => {
    //     return formType[0] === "addPatientWithEnrollment" ? schema.required("Attendant Phone is required") : schema.optional();
    // }),
});

export const patientDetailsStepSchema = Yup.object().shape({
  patient_first_name: Yup.string().when("$formType", (formType: any, schema: any) => {
        return formType[0] === "addPatientWithEnrollment" ? schema.required("First Name is required") : schema.optional();
    }),
    patient_last_name: Yup.string().when("$formType", (formType: any, schema: any) => {
        return formType[0] === "addPatientWithEnrollment" ? schema.required("Last Name is required") : schema.optional();
    }),
    patient_gender: Yup.string().when("$formType", (formType: any, schema: any) => {
        return formType[0] === "addPatientWithEnrollment" ? schema.required("Gender is required") : schema.optional();
    }),
    patient_attendant_name: Yup.string().when("$formType", (formType: any, schema: any) => {
        return formType[0] === "addPatientWithEnrollment" ? schema.required("Attendant Name is required") : schema.optional();
    }),
    patient_attendant_phone: Yup.string().when("$formType", (formType: any, schema: any) => {
        return formType[0] === "addPatientWithEnrollment" ? schema.required("Attendant Phone is required") : schema.optional();
    }),
})

export const medicalAssignementStepSchema = Yup.object().shape({
  consultant_doctor_id: Yup.string().required("Primary Consultant Doctor is required"),
  consultant_doctor: Yup.array().optional(),
  duty_doctor: Yup.array().nullable(),
  nurse: Yup.array().nullable(),
});

export const admisstionAndAllocationStepSchema = Yup.object().shape({
  admission_date_time: Yup.string().optional(),
  ward_id: Yup.number().nullable(),
  room_id: Yup.number().nullable(),
  bed_id: Yup.number().nullable(),
})

export const paymentAndEnrollmentStepSchema = Yup.object().shape({
  advance_amount: Yup.number().nullable()
})
