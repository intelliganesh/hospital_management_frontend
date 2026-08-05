import { useState } from "react";

export const useValidator = <T = any>() => {
  const [validationObj, setValidationObj] = useState<T>({} as T);
  const validateFields = (array: React.Ref<HTMLInputElement>[]) => {
    const arrayData = [];
    for (let i = 0; i < array.length; i++) {
      arrayData.push(array[i]);
    }
    setValidationObj(arrayData as unknown as T);
  };
  return { validateFields, validationObj };
};
