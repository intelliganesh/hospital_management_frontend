import * as Yup from "yup";

export const validationForm = Yup.object({
name: Yup.string()
    .required('Department name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),  
// code: Yup.string()
//     .required('Department code is required')
//     .matches(/^[A-Z0-9]{2,15}$/, 'Code must be 2 to 15 uppercase alphanumeric characters'),
department_type: Yup.string().required('Department type is required'),
is_active: Yup.boolean()
    .required('Active status is required')
    .typeError('Active status must be true or false'),

description: Yup.string().nullable()
});
