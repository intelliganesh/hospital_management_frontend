import Input from "@/components/input";
import View from "@/components/view";
import { Role, rolesTypeOptions } from "@/interfaces/roles";
import useForm from "@/utils/custom-hooks/use-form";
// import { appointmentTypeOptions, statusOptions } from "./appointmentFormOptions";
import Textarea from "@/components/Textarea";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROLES_TABLE_URL } from "@/utils/urls/frontend";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsName: string;
  errorsDescription: string;
  errorsStatus: string;
  formType: "add" | "edit";
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsDescription,
  errorsStatus,
  formType,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { values, handleChange, onSetHandler } = useForm<Role | null>(
    location.state
  );
  useEffect(() => {
    if (!location.state && formType === "edit") {
      navigate(ROLES_TABLE_URL);
      return;
    }
  }, [location.state, formType]);
  return (
    <>
      <View>
        <View>
          <Input
            id="name"
            name="name"
            required={true}
            error={errorsName}
            label="Role Name"
            value={values?.name}
            onChange={handleChange}
            placeholder="Ex: Doctor"
          />
        </View>
      </View>
      <View className="col-span-2 mt-6">
        <Textarea
          id="description"
          name="description"
          label="Description"
          error={errorsDescription}
          onChange={handleChange}
          value={values?.description ?? ""}
        />
      </View>
      <View className="mt-6">
        <SingleSelector
          id="status"
          label="Status"
          name="status"
          required={true}
          error={errorsStatus}
          value={values?.status ?? rolesTypeOptions[0].value}
          placeholder="Select Status"
          onChange={(value) => {
            onSetHandler("status", value);
          }}
          options={rolesTypeOptions}
        />
      </View>
    </>
  );
};
export default SectionOne;
