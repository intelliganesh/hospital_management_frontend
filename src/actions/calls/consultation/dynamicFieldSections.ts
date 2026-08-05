import { useDispatch } from "react-redux";
import { addDynamicFieldSections } from "@/actions/slices/consultation/dynamicFieldSections";

const useDynamicFieldSections = () => {
  const dispatch = useDispatch();

  const handleDynamicFieldSections = (data: any) => {
    dispatch(addDynamicFieldSections(data));
  };
  const cleanUp = () => {
    dispatch(addDynamicFieldSections([]));
  };

  return { handleDynamicFieldSections, cleanUp };
};

export default useDynamicFieldSections;
