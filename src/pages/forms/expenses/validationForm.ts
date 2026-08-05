import * as Yup from "yup";

export const validationForm = Yup.object({
    date: Yup.date().required("Date is required"),
    description: Yup.string().required("Description is required"),
    amount: Yup.number()
        .typeError("Amount must be a valid number") // custom message for invalid numbers
        .required("Amount is required"), mode_of_payment: Yup.string().required("Mode of Payment is required"),
    // transaction_id: Yup.string().required("Transaction ID is required"),
    expense_name: Yup.string().required("Expense Name is required"),
});