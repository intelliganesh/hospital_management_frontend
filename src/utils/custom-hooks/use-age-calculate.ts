import { useState } from "react";

export const useAgeCalculate = () => {
  const [userAge, setUserAge] = useState<string>("0");

  const calculateAge = (dob: Date | string | null): void => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setUserAge(age + "");
    }
  };
  return {userAge,calculateAge};
};
