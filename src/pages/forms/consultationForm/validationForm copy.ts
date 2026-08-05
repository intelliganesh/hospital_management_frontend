// src/pages/forms/consultationForm/validationForm.ts
import * as Yup from "yup";

// Create the validation schema for the consultation form
const validationForm = Yup.object({
  // Section One - Basic Information
  appointment_id: Yup.string().required("Appointment ID is required"),

  patient_id: Yup.string().required("Patient ID is required"),

  doctor_id: Yup.string().required("Doctor is required"),

  next_visit_date: Yup.date()
    .required("Next visit date is required")
    .min(new Date(), "Next visit date must be in the future"),

  complaint: Yup.string()
    .required("Complaint is required")
    .min(5, "Complaint must be at least 5 characters"),

  // advice: Yup.string()
  //   .required("Advice is required")
  //   .min(5, "Advice must be at least 5 characters"),

  // preliminary_diagnosis: Yup.string()
  //   .required("Preliminary diagnosis is required")
  //   .min(5, "Preliminary diagnosis must be at least 5 characters"),

  status: Yup.string().required("Status is required"),

  // Section Two - Vital Signs
  // temperature: Yup.string()
  //   .nullable()
  //   .test('is-valid-temp', 'Temperature must be between 35°C and 42°C', function(value) {
  //     if (!value) return true;
  //     // Extract the numeric part from "36.5 °C" format
  //     const tempValue = parseFloat(value.split(' ')[0]);
  //     return !isNaN(tempValue) && tempValue >= 35 && tempValue <= 42;
  //   }),

  // bp: Yup.string()
  //   .nullable()
  //   .matches(/^\d{2,3}\/\d{2,3}$/, {
  //     message: 'Blood pressure must be in format 120/80',
  //     excludeEmptyString: true
  //   })
  //   .test('is-valid-bp', 'Blood pressure values must be valid (120/80)', function(value) {
  //     if (!value) return true;
  //     const [systolic, diastolic] = value.split('/').map(Number);
  //     return (
  //       systolic >= 70 && systolic <= 220 &&
  //       diastolic >= 40 && diastolic <= 130 &&
  //       systolic > diastolic
  //     );
  //   }),

  // pulse: Yup.string()
  //   .nullable()
  //   .test('is-valid-pulse', 'Pulse rate must be between 40 and 200 bpm', function(value) {
  //     if (!value) return true;
  //     const pulseValue = parseFloat(value);
  //     return !isNaN(pulseValue) && pulseValue >= 40 && pulseValue <= 200;
  //   }),

  // temperature: Yup.string()
  //   .nullable()
  //   .test(
  //     "is-valid-temp",
  //     "Temperature must be between 36.5°C and 37.5°C",
  //     function (value) {
  //       if (!value) return true;
  //       const tempValue = parseFloat(value.split(" ")[0]);
  //       return !isNaN(tempValue) && tempValue >= 30 && tempValue <= 45;
  //     }
  //   ),

  // bp: Yup.string()
  //   .nullable()
  //   .matches(/^\d{2,3}\/\d{2,3}$/, {
  //     message: "Blood pressure must be in format 120/80",
  //     excludeEmptyString: true,
  //   })
  //   .test(
  //     "is-valid-bp",
  //     "Blood pressure values must be valid (120/80)",
  //     function (value) {
  //       if (!value) return true;
  //       const [systolic, diastolic] = value.split("/").map(Number);
  //       return (
  //         systolic >= 90 &&
  //         systolic <= 140 &&
  //         diastolic >= 60 &&
  //         diastolic <= 90 &&
  //         systolic > diastolic
  //       );
  //     }
  //   ),

  // pulse: Yup.string()
  //   .nullable()
  //   .test(
  //     "is-valid-pulse",
  //     "Pulse rate must be between 60 and 100 bpm",
  //     function (value) {
  //       if (!value) return true;
  //       const pulseValue = parseFloat(value);
  //       return !isNaN(pulseValue) && pulseValue >= 60 && pulseValue <= 100;
  //     }
  //   ),

  // Section Two - Examination Details
  // cvs: Yup.string()
  //   .nullable()
  //   .test('html-not-empty', 'Cardiovascular system details cannot be empty if provided', function(value) {
  //     if (!value) return true;
  //     // Check if the HTML content has actual text (not just tags)
  //     return value.replace(/<[^>]*>/g, '').trim().length > 0;
  //   }),

  // rs: Yup.string()
  //   .nullable()
  //   .test('html-not-empty', 'Respiratory system details cannot be empty if provided', function(value) {
  //     if (!value) return true;
  //     return value.replace(/<[^>]*>/g, '');
  //   }),

  // // Section Three - Additional Details
  // description: Yup.string()
  //   .nullable()
  //   .test('html-not-empty', 'Description cannot be empty if provided', function(value) {
  //     if (!value) return true;
  //     return value.replace(/<[^>]*>/g, '').trim().length > 0;
  //   }),

  // examination_overview: Yup.string()
  //   .nullable()
  //   .test('html-not-empty', 'Examination overview cannot be empty if provided', function(value) {
  //     if (!value) return true;
  //     return value.replace(/<[^>]*>/g, '').trim().length > 0;
  //   }),

  cvs: Yup.string().nullable(),

  rs: Yup.string().nullable(),
  test_id: Yup.string().nullable(),

  medicines: Yup.string().nullable(),

  // proctology validations
  preliminary_diagnostic: Yup.string()
    .min(5, "Preliminary diagnostic must be at least 5 characters")
    .required("Preliminary diagnostic is required"),

  // diagnosis_summary: Yup.string()
  //   .min(5, "Diagnosis summary must be at least 5 characters")
  //   .required("Diagnosis summary is required"),
  diagnosis_summary: Yup.string().when("type", (type: any, schema) => {
    if (type === "Proctology") {
      return schema.min(5, "Diagnosis summary must be at least 5 characters").required("Diagnosis summary is required");
    } else {
      return schema.nullable();
    }
  }),

  // advice_field: Yup.string()
  //   .min(5, "Advice field must be at least 5 characters")
  //   .required("Advice field is required"),
  advice_field: Yup.string().when("type", (type: any, schema) => {
  if (type === "Proctology") {
    return schema.min(5, "Advice field must be at least 5 characters").required("Advice field is required");
  } else {
    return schema.nullable();
  }
}),

  // finding_fields: Yup.array()
  //   .of(Yup.string())
  //   .min(1, "At least one finding is required"),

  examination_overview: Yup.string()
    .min(5, "Examination overview must be at least 5 characters")
    .nullable(),

doc_upload: Yup.array()
  .of(
    Yup.mixed().test("is-valid", "Invalid file", (value) => {
      return typeof value === "string" || value instanceof File;
    })
  )
  .nullable(),
  
  // fees: Yup.number().required("Fees is required"),
  fees: Yup.number().when("type", (type: any, schema) => {
    if (type === "Proctology") {
      return schema.required("Fees is required");
    } else {
      return schema.nullable();
    }
  }),

  advice_admition: Yup.boolean().nullable(),

  // Non proctology validations
  food_prescription: Yup.string().nullable(),
  yoga_prescription: Yup.string().nullable(),
  vikruti: Yup.string().nullable(),
  prakriti: Yup.string().nullable(),
  koshta: Yup.string().nullable(),
  avastha: Yup.string().nullable(),
  agni: Yup.string().nullable(),

  breakfast: Yup.string().nullable(),
  lunch: Yup.string().nullable(),
  dinner: Yup.string().nullable(),
  general_advice: Yup.string().nullable(),
  yoga_asana: Yup.string().nullable(),
});

export default validationForm;
