import { useSelector } from "react-redux";

interface RootStateProps {
  [key: string]: any;
  
}

export const useOptions = (
  selectReduxVar: string,
  resultType: "primitive" | "non_primitive" = "non_primitive",
  valueToBeIdOrLabel: "id" | "label" = "label",
) => {
  const [reduxVar, selectVar] = selectReduxVar.split("|");
  const options = useSelector(
    (state: RootStateProps) =>
      state[reduxVar as keyof RootStateProps][selectVar]
  );
  if (resultType === "non_primitive") {
    return options?.map((item: any, index: number) => ({
      id: item?.id ? item?.id : index,
      value: valueToBeIdOrLabel === "id" ? item?.id : item?.name,
      label: item?.name,
    }));
  }
  return options;
};
 