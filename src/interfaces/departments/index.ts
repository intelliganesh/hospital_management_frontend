export interface Department {
  id?: number;
  name: string;
  code?: string;
  type_of_department?: string;
  description?: string;
  is_active: boolean;
  department_type: string;
}

export interface DepartmentState {
  departmentDetailData: any;
  departmentListData: Department[] | any;
  departmentDropdownData: any[];
}