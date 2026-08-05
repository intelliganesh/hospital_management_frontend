import React from "react";
import Input from "@/components/input";
import View from "@/components/view";
// import { Examination } from "@/interfaces/appointments";
import useForm from "@/utils/custom-hooks/use-form";
// import SearchSelect from "@/components/SearchSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import dayjs from "dayjs";
import { Medicine } from "@/interfaces/medicines";

// interface SectionOneProps {
// errorsType: string;
// errorsPatientId: string;
// errorsDoctorId: string;
// errorsComplaint: string;
// errorsAppointmentDate: string;
// errorsAppointmentTime: string;
// errorsEnrollFees: string;
// errorsStatus: string;

// }
const SectionThree: React.FC = (
  {
    // errorsType,
    // errorsPatientId,
    // errorsDoctorId,
    // errorsComplaint,
    // errorsAppointmentDate,
    // errorsAppointmentTime,
    // errorsEnrollFees,
    // errorsStatus
  }
) => {
  const medicineDetails = useSelector(
    (state: RootState) => state.medicines.medicineDetailData
  );

  const { values, handleChange } = useForm<Medicine | null>(medicineDetails);

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <View>
          <Input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            label="Stock Quantity"
            placeholder="Ex: 100"
            onChange={handleChange}
            value={values?.stock_quantity ? values?.stock_quantity + "" : ""}
            min={0}
            required={true}
          />
        </View>
        <View>
          <Input
            id="unit_price"
            name="unit_price"
            required={true}
            label="Unit Price"
            placeholder="Ex: 200"
            onChange={handleChange}
            value={values?.unit_price ? values?.unit_price + "" : ""}
          />
        </View>
        <View>
          <Input
            type="date"
            required={true}
            id="expiry_date"
            name="expiry_date"
            onChange={handleChange}
            label="Expiry Date"
            // error={errorsAppointmentDate}
            value={
              values?.expiry_date
                ? dayjs(values?.expiry_date).format("YYYY-MM-DD")
                : ""
            }
          />
        </View>
      </View>
    </React.Fragment>
  );
};
export default SectionThree;
