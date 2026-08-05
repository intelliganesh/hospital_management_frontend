export interface Dasboard {
  name: "dashboard" | string; //example for your reference
}

export interface LoginDetails {
  email: string;
  password: string;
}

export interface FormTypeProps {
  toAddInModal?: boolean;
  formType?: "add" | "edit";
  errorsDepartmentType?: string;
  onModalSuccess?: () => void;
  iAmIn?: string;
}
