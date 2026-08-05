
const enum DepartmentTypes {
  PROCTOLOGY = "Proctology",
  NON_PROCTOLOGY = "Non Proctology",
  ALLOPATHY = "Allopathy",
}

const departmentTypeOptions = [
  DepartmentTypes.PROCTOLOGY,
  DepartmentTypes.NON_PROCTOLOGY,
  DepartmentTypes.ALLOPATHY,
].map((value) => ({
  value,
  label: value.replace(/_/g, " "),
}));

export { departmentTypeOptions };
