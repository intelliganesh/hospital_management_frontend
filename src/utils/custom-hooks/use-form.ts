import { useState, ChangeEvent, useEffect, useRef } from "react";
import { isEqual } from "../compareData";

function useForm<T>(initialValues: T) {
  const prevInitialRef = useRef<T>(initialValues);
  const [values, setValues] = useState(initialValues);
  // const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isEqual(prevInitialRef.current, initialValues)) {
      prevInitialRef.current = initialValues;
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    // startTransition(() => {
    setValues((prevValues) => {
      if (type === "file") {
        const fileInput = e.target as HTMLInputElement;
        const files = fileInput.files ? Array.from(fileInput.files) : [];

        return {
          ...prevValues,
          [name]: files,
        };
      }

      if (name === "id_proof_for_pan") {
        return {
          ...prevValues,
          [name]: value.toUpperCase(),
        };
      }
      return {
        ...prevValues,
        [name]: value,
      };
    });
    // });
  };

  const handleTipTapChange = (value: string, name: string) => {
    const event = {
      target: {
        name,
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const onSetHandler = (
    name: string,
    value: string | boolean | number | File[] | string[] | any[]
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => setValues(initialValues);

  return {
    values,
    resetForm,
    onSetHandler,
    handleChange,
    handleTipTapChange,
  };
}

export default useForm;
