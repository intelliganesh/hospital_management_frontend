import * as Yup from "yup";

const today = new Date();
const eighteenYearsAgo = new Date(
  today.getFullYear() - 1,
  today.getMonth(),
  today.getDate()
);
// const idValidatoinMap: Record<string, { regex: RegExp; message: string }> = {
//   [Ids.ADHAR.replace(" ", "_")]: {
//     // regex: /"^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/,
//     regex: /^[2-9]{1}[0-9]{11}$/,
//     message: "Invalid Aadhaar number",
//   },
//   [Ids.PASSPORT.replace(" ", "_")]: {
//     regex: /^[A-PR-WYa-pr-wy][0-9]{7}$/,
//     message: "Invalid Passport number",
//   },
//   [Ids.VOTER_ID.replace(" ", "_")]: {
//     regex: /^[A-Z]{3}[0-9]{7}$/,
//     message: "Invalid Voter ID",
//   },
//   [Ids.DRIVING_LICENSE.replace(" ", "_")]: {
//     regex: /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/,
//     message: "Invalid Driving License number",
//   },
//   [Ids.RATION_CARD.replace(" ", "_")]: {
//     regex: /^[0-9]{12}$/,
//     message: "Invalid Ration Card number",
//   },
// };

export const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "First name should contain only letters and numbers"
    )
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .required("First name is required"),

  // last_name: Yup.string()
  //   .matches(/^[A-Za-z\s]+$/, "Last name should contain only letters")
  //   // .min(2, "Last name must be at least 2 characters")
  //   // .max(50, "Last name is too long")
  //   .required("Last name is required"),

  // email: Yup.string().email("Email is invalid").required("Email is required"),

  // phone_no: Yup.string()
  //   // .matches(/^\+?[1-9]\d{9}$/, "Phone number is invalid")
  //   .min(5, "Phone number should be at least 5 characters")
  //   .required("Phone number is required"),
  // phone_no: Yup.string()
  //   .required("Phone number is required")
  //   .test("min-digits", "Phone number should be at least 5 digits", (value) => {
  //     if (!value) return false;
  //     // remove + and spaces, then take only the last part (number)
  //     const numberPart = value.replace(/^\+\d+\s*/, "");
  //     return numberPart.length >= 5;
  //   }),

  // dob: Yup.date()
  //   .max(eighteenYearsAgo, "Patient must be at least 1 year old")
  //   .min(
  //     new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()),
  //     "Date of birth is too far in the past (max 120 years)"
  //   )
  //   .required("Date of birth is required"),
  dob: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .max(eighteenYearsAgo, "Patient must be atleast 1 year old")
    .min(
      new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()),
      "Date of birth is too far in the past (max 120 years)"
    )
    .nullable(),
  age: Yup.number()
    .typeError("Age must be a number")
    .nullable()
    .notRequired()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than or equal to 120"),

  gender: Yup.string().required("Gender is required"),
  // marital_status: Yup.string().required("Marital status is required"),
  // id_proof_for_pan: Yup.string().notRequired().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
  id_proof_for_pan: Yup.string()
    .nullable()
    .test("is-valid-pan", "Invalid PAN number", function (value) {
      if (!value) return true;
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }),
  // address: Yup.string()
  //   .min(10, "Address must be at least 10 characters")
  //   .required("Address is required"),

  // city: Yup.string().required("City is required"),

  // state: Yup.string().required("State is required"),

  // country: Yup.string().required("Country is required"),

  // pincode: Yup
  //   .string()
  //   .required('PIN Code is required')
  //   .matches(/^[1-9][0-9]{5}$/, 'PIN Code must be a 6-digit number starting from 1-9'),

  referred_by_name: Yup.string().nullable().notRequired(),
  referred_by_phone_no: Yup.string().test(
    "is-valid-phone",
    "Phone number is invalid",
    (value) => !value || /^\+?[1-9]\d{9}$/.test(value)
  ),
  // attendant_with_patient_phone_no: Yup.string().test(
  //   "is-valid-phone",
  //   "Phone number is invalid",
  //   (value) => !value || /^\+?[1-9]\d{9}$/.test(value)
  // ),
  referred_by_email: Yup.string().email("Email is invalid").nullable(),
  referred_by_hospital_name: Yup.string().nullable(),

  id_type: Yup.string().nullable(),
  id_value: Yup.string().when(["id_type", "id_edited", "$isEditMode"], {
    is: (isEditMode: boolean) => isEditMode,
    then: (schema) =>
      schema.when("id_type", (id_type: any) => {
        return schema.required(`${id_type} Number is required`);
      }),
    otherwise: (schema) => schema.notRequired(),
  }),

  consent: Yup.boolean().when("id_value", (id_value: any, schema) => {
    if (!id_value || !id_value?.[0]) {
      return schema.notRequired();
    }
    return schema.oneOf(
      [true],
      "You must consent to the storage of your ID for address verification."
    );
    // return schema.required("Consent is required");
  }),
  attendant_id_type: Yup.string().nullable(),
  attendant_id_value: Yup.string().when(
    ["attendant_id_type", "attendant_id_edited", "$isEditMode"],
    {
      is: (isEditMode: boolean) => isEditMode, // Only validate in edit mode
      then: (schema) =>
        schema.when("attendant_id_type", (id_type: any) => {
          return schema.required(`${id_type} Number is required`);
        }),
      otherwise: (schema) => schema.notRequired(),
    }
  ),

  attendant_consent: Yup.boolean().when(
    "attendant_id_value",
    (attendant_id_value: any, schema) => {
      if (!attendant_id_value || !attendant_id_value?.[0]) {
        return schema.notRequired();
      }
      return schema.oneOf(
        [true],
        "You must consent to the storage of your ID for address verification."
      );
      // return schema.required("Consent is required");
    }
  ),

  // image: Yup.array()
  //   .when("id_type", (id_type: any, schema) => {
  //     if (!id_type?.[0]) {
  //       return schema.notRequired();
  //     }

  //     return schema
  //       .of(
  //           Yup.mixed().test("is-valid", "Invalid file", (value) => {
  //             return typeof value === "string" || value instanceof File;
  //           })
  //         )
  //       .required("ID proof file is required");
  //   })
});
