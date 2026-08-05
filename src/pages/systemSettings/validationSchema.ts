import { Theme } from "@/interfaces/systemSettings";
import * as yup from "yup";
export const validationSchema = yup.object().shape({
  hospital_name: yup
    .string()
    .required("Hospital name is required")
    .min(2, "Hospital name must be at least 2 characters"),
  address: yup
    .string()
    .required("Address is required")
    .max(1000, "Address must be 1000 characters or less"),
  hospital_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  patient_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  ipd_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  opd_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  appointment_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  payment_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  // findings_prefix: yup
  //   .string()
  //   .required("Prefix is required")
  //   .min(2, "Prefix must be atleast 2 characters")
  //   .max(15, "Prefix must be  15 characters"),
  test_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  invoice_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  voucher_prefix: yup
    .string()
    .required("Prefix is required")
    .min(2, "Prefix must be atleast 2 characters")
    .max(15, "Prefix must be  15 characters"),
  // invoice_start_number: yup
  //   .number()
  //   .notRequired()
  //   .min(1, "Invoice start number must be at least 1"),
  // invoice_status: yup
  //   .boolean()
  //   .notRequired(),
  primary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  bg_primary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  // text_primary_color: yup
  //   .string()
  //   .required("Color is required")
  //   .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  secondary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  bg_secondary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  // text_secondary_color: yup
  //   .string()
  //   .required("Color is required")
  //   .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  tertiary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  bg_tertiary_color: yup
    .string()
    .required("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  // text_tertiary_color: yup
  //   .string()
  //   .required("Color is required")
  //   .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  currency_symbol: yup.string().required("Currency symbol is required"),
  // .matches(/^[$₹€£¥₽₩₦₪₫฿₴₲₵₺₡₱₭₨]+$/, "Enter a valid currency symbol"),
  // .min(1, "Symbol must be at least 1 character")
  // .max(3, "Symbol must not exceed 3 characters"),
  currency: yup
    .string()
    .required("Currency is required")
    .matches(
      /^[A-Z]{3}$/,
      "Enter a valid 3-letter currency code (e.g., USD, INR, EUR)"
    ),
  theme: yup.string().required("Theme is required").oneOf(Object.values(Theme)),
});
