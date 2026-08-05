import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
// import { appointmentTypeOptions, statusOptions } from "./appointmentFormOptions";
import Textarea from "@/components/Textarea";
import {  useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Finding } from "@/interfaces/findings";
import { categoryOptions, statusOptions } from "./findingsFormOptions";
import { useFindings } from "@/actions/calls/findings";
import { useSelector } from "react-redux";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsName: string;
  errorsDescription: string;
  errorsStatus: string;
  errorsCategory: string;
  formType: "add" | "edit";
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsDescription,
  errorsStatus,
  errorsCategory,
  formType,
}) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const findingData = useSelector((state: any) => state.findings.findingDetailData);
  const { values, handleChange, onSetHandler } = useForm<Finding | null>(findingData);
  const {findingDetailHandler, cleanUp } = useFindings();
  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);
  useEffect(() => {
    if (id) {
            findingDetailHandler(id, () => {});
    }
    return () => {
      cleanUp();
    };
  }, [id]);
  return (
    <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <View className="col-span-2">
        <Input
          id="name"
          name="finding_name"
          required={true}
          error={errorsName}
          label="Finding Name"
          value={values?.finding_name}
          onChange={handleChange}
          placeholder="Enter Finding Name"
        />
      </View>
      <View className="col-span-2">
        <Textarea
          id="finding_description"
          name="finding_description"
          label="Finding Description"
          error={errorsDescription}
          onChange={handleChange}
          value={values?.finding_description ?? ""}
        />
      </View>

      <View>
        {/* <Select
          id="category"
          name="category"
          label="Category"
          error={errorsCategory}
          value={values?.category ?? ""}
          placeholder="Select Category"
          options={categoryOptions}
          onChange={handleChange}
          required={true}
        /> */}
        <SingleSelector
          id="category"
          label="Category"
          name="category"
          error={errorsCategory}
          value={values?.category ?? ""}
          placeholder="Select Category"
          onChange={(value) => {
            onSetHandler("category", value);
          }}
          options={categoryOptions}
          required={true}
        />
      </View>
      <View>
        {/* <Select
          id="status"
          name="status"
          label="Status"
          error={errorsStatus}
          value={values?.status ?? ""}
          placeholder="Select Status"
          options={statusOptions}
          onChange={handleChange}
          required={true}
        /> */}
        <SingleSelector
          id="status"
          label="Status"
          name="status"
          error={errorsStatus}
          value={values?.status ?? statusOptions[0].value}
          placeholder="Select Status"
          onChange={(value) => {
            onSetHandler("status", value);
          }}
          options={statusOptions}
          required={true}
        />
      </View>
    </View>
  );
};
export default SectionOne;
