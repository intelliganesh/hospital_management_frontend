import * as Yup from "yup";

const today = new Date();
const eighteenYearsAgo = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate(),
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

// console.log(idValidatoinMap);

export const validationForm = Yup.object({
  name: Yup.string().required("Name is required").min(2),
  // lastName: Yup.string().required("Name is required"),
  email: Yup.string()
    .test("is-valid-email", "Invalid email address", function (value) {
      if (!value) return true;
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    })
    .required("Email is required"),
  // .test(
  //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //   "Invalid email address"
  // ),
  // password: Yup.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .matches(
  //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //     "Must include uppercase, lowercase, number, special character, and be at least 8 characters"
  //   )
  //   .required("Password is required"),
  password: Yup.string().when("$isEditMode", {
    is: true, // ✅ Edit mode
    then: (schema) =>
      schema
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must include uppercase, lowercase, number, special character, and be at least 8 characters",
        )
        .notRequired(), // password optional in edit, but if provided must meet rules
    otherwise: (schema) =>
      schema
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must include uppercase, lowercase, number, special character, and be at least 8 characters",
        )
        .required("Password is required"), // ✅ required in create mode
  }),

  //   .required("Password is required"),
  phone: Yup.string()
    // .matches(/^[6-9]\d{9}$/, "Invalid phone number")
    .required("Phone number is required")
    .test("min-digits", "Phone number should be at least 5 digits", (value) => {
      if (!value) return false;
      // remove + and spaces, then take only the last part (number)
      const numberPart = value.replace(/^\+\d+\s*/, "");
      return numberPart.length >= 5;
    }),
  DOB: Yup.date()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .max(eighteenYearsAgo, "User must be at least 18 year old")
    .min(
      new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()),
      "Date of birth is too far in the past (max 120 years)",
    )
    .nullable(),

  gender: Yup.string().required("Gender is required"),
  age: Yup.string()
    .nullable()
    .test("is-valid-age", "Age must be 18 or above", function (value) {
      if (!value) return true;
      return (
        !isNaN(Number(value)) && Number(value) >= 18 && Number(value) <= 120
      );
    }),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
  pincode: Yup.string()
    .nullable()
    .test("is-valid-pincode", "Invalid pincode", function (value) {
      if (!value) return true;
      return /^[1-9][0-9]{5}$/.test(value);
    }),
  // .matches(
  //   /^[1-9][0-9]{5}$/,
  //   "PIN Code must be a 6-digit number starting from 1-9"
  // )
  // marital_status: Yup.string().required("Marital status is required"),
  role: Yup.string().required("Role is required"),
  // Conditional validation for professional fields based on role
  // designation: Yup.string().when("role", {
  //   is: (role: any) => role !== Role.ADMIN,
  //   then: (schema) => schema.required("Designation is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  designation: Yup.string().nullable(),
  qualification: Yup.string().nullable(),
  department: Yup.string().required("Department is required"),
  // qualification: Yup.string().when("role", {
  //   is: (role: any) => role !== Role.ADMIN,
  //   then: (schema) => schema.required("Qualification is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // id_type: Yup.string().when("$isEditMode", {
  //   is: true,
  //   then: (schema) => schema.notRequired(),
  //   otherwise: (schema) => schema.required("ID is required"),
  // }),

  id_type: Yup.string().nullable(),

  // id_value: Yup.string().when(["id_type",  "$isEditMode"], {
  //   is: (isEditMode: boolean) => {
  //     return isEditMode;
  //     // If in edit mode, bypass validation
  //     // if (isEditMode) return false;
  //     // return true;
  //   },
  //   then: (schema) =>
  //     schema.when("id_type", (id_type: any, schema) => {
  //       const rule = idValidatoinMap[id_type];
  //       if (!rule) {
  //         return schema.required("ID value is required");
  //       }
  //       return schema
  //         .matches(rule.regex, rule.message)
  //         .required(`${id_type} value is required`);
  //     }),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  id_value: Yup.string().when(["id_type", "$isEditMode"], {
    is: (isEditMode: boolean) => isEditMode,
    then: (schema) =>
      schema.when("id_type", (id_type: any, schema) => {
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
      "You must consent to the storage of your ID for address verification.",
    );
    // return schema.required("Consent is required");
  }),
  // consent: Yup.boolean()
  // .transform((value, originalValue) => {
  //   // If checkbox sends "1" or 1 → treat as true
  //   console.log("originalValue", originalValue);
  //   if (originalValue === "1" || originalValue === 1) {
  //     return true;
  //   }
  //   return value;
  // })
  // .when("id_value", (id_value: any, schema) => {
  //   if (!id_value || !id_value?.[0]) {
  //     return schema.notRequired();
  //   }
  //   return schema.oneOf([true], "You must consent to the storage of your ID for address verification.");
  // }),

  // files: Yup.array().when("id_type", (id_type: any, schema) => {
  //   if (!id_type?.[0]) {
  //     return schema.notRequired();
  //   }

  //   return schema
  //     .of(
  //       Yup.mixed().test("is-valid", "Invalid file", (value) => {
  //         return typeof value === "string" || value instanceof File;
  //       })
  //     )
  //     .required("ID proof file is required");
  // }),
  files: Yup.array().optional(),

  id_proof_for_pan: Yup.string()
    .nullable()
    .test("is-valid-pan", "Invalid PAN number", function (value) {
      if (!value) return true;
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }),

  status: Yup.string().required("Status is required"),
  available_days: Yup.string().optional(),
  slot_duration: Yup.number().optional(),
  leave_date: Yup.string().optional(),

  // value: Yup.string().when("ids", (ids: any, schema) => {
  //   const rule = idValidatoinMap[ids];
  //   console.log("rule", rule);
  //   if (!rule) {
  //     return schema.required("ID value is required");
  //   }
  //   return schema.matches(rule.regex, rule.message).required(`${ids} value is required`);
  // }),

  // department: Yup.string().when("role", {
  //   is: (role: any) => role !== Role.ADMIN,
  //   then: (schema) => schema.required("Department is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // status: Yup.boolean().required("Status is required"),
});
