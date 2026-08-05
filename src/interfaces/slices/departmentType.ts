// import { GenericStatus } from "..";
import { CaseType } from "../index";
import { DepartmentTypeEnum } from "../index";


export const departmentTypeOptions = [
  DepartmentTypeEnum.PROCTOLOGY,
  DepartmentTypeEnum.NON_PROCTOLOGY,
  DepartmentTypeEnum.ALLOPATHY,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));


export const caseTypeOptions = [
  CaseType.OPD,
  CaseType.IPD,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));
