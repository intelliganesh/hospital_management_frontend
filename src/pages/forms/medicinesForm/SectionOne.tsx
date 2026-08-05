import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
// import SearchSelect from "@/components/SearchSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Medicine } from "@/interfaces/medicines";

interface SectionOneProps {
  errorMedicineName: string;
}
const SectionOne: React.FC<SectionOneProps> = (
  {
    errorMedicineName,
  }
) => {
  const medicineDetails = useSelector(
    (state: RootState) => state.medicines.medicineDetailData
  );

  const { values, handleChange } = useForm<Medicine | null>(medicineDetails);
  return (
    <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* <View>
        <Select
          id="type"
          name="type"
          required={true}
          error={errorsType}
          label="Appointment Type"
          placeholder="Select Appointment Type"
          options={appointmentTypeOptions}
          value={values?.type}
          onChange={(e) => onSetHandler("type", e.target.value)}
        />
      </View> */}
      <View>
        <Input
          id="medicine_name"
          name="medicine_name"
          label="Medicine Name"
          error={errorMedicineName}
          placeholder="Ex: Paracetamol"
          onChange={handleChange}
          value={values?.medicine_name}
          required={true}
        />
      </View>
      <View>
        <Input
          id="generic_name"
          name="generic_name"
          label="Generic Name"
          placeholder="Ex: Acetaminophen"
          onChange={handleChange}
          value={values?.generic_name}
        />
      </View>
      <View>
        <Input
          id="manufacturer"
          name="manufacturer"
          label="Manufacturer Name"
          placeholder="Ex: Johnson & Johnson"
          onChange={handleChange}
          value={values?.manufacturer}
        />
      </View>
      
    </View>
  );
};
export default SectionOne;
