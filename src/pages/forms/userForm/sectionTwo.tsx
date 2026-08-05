import React, { useEffect } from "react";
import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import Textarea from "@/components/Textarea";
import { UserInterface } from "@/interfaces/users";
import useForm from "@/utils/custom-hooks/use-form";
import CountryStateDropdown from "@/components/countryStatedropdown";
import { useUsers } from "@/actions/calls/user";
import { useDepartment } from "@/actions/calls/department";
import SingleSelector from "@/components/SingleSelector";
import { userStatusOptions } from "./userFormOptions";

interface SectionTwoProps {
  formType: "add" | "edit";
  errorsAddress: string | undefined;
  errorsCity: string | undefined;
  errorsState: string | undefined;
  errorsCountry: string | undefined;
  errorsPinCode: string | undefined;
  errorsDesignation: string | undefined;
  errorsQualification: string | undefined;
  errorsRole: string | undefined;
  errorsDepartment: string | undefined;
  errorsStatus: string | undefined;
  onRoleChange?: (role: string) => void;
}

const SectionTwo: React.FC<SectionTwoProps> = ({
  formType,
  errorsAddress,
  errorsCity,
  errorsRole,
  errorsState,
  errorsCountry,
  errorsPinCode,
  errorsDesignation,
  errorsQualification,
  errorsDepartment,
  errorsStatus,
  onRoleChange,
}) => {
  const { rolesList } = useUsers();
  const { departmentDropdownHandler } = useDepartment();
  const { role } = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails") as string)
    : null;

  const userDetails = useSelector((state: any) => state?.users?.userDetails);
  const department = useSelector(
    (state: any) => state?.department?.departmentDropdownData,
  );
  const roles = useSelector((state: any) => state?.users?.rolesList);
  const roleListForNonAdmin = roles?.filter(
    (role: any) => role?.name !== "Admin",
  );
  const roleListForNonSuperAdmin = roles?.filter(
    (role: any) => role?.name !== "Super Admin",
  );
  const rolesFor =
    role === "Super Admin"
      ? roles
      : role === "Admin"
        ? roleListForNonSuperAdmin
        : roleListForNonAdmin;

  const departmentObj = department?.map((department: any) => ({
    id: department?.id,
    label: department?.name,
    value: department?.id,
  }));
  const { values, handleChange, onSetHandler } =
    useForm<UserInterface>(userDetails);

  useEffect(() => {
    rolesList(() => {});
    departmentDropdownHandler(() => {});
  }, []);

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <View className="col-span-2">
          <Textarea
            id="address"
            label="Address"
            name="address"
            placeholder="Ex: 123 Main St, Anytown, CA 12345"
            error={errorsAddress}
            value={values?.address ?? ""}
            onChange={handleChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <CountryStateDropdown
          cityName="city"
          stateName="state"
          formType={formType}
          countryName="country"
          cityValue={values?.city}
          stateValue={values?.state}
          countryValue={values?.country}
          errorsCity={errorsCity}
          errorsState={errorsState}
          errorsCountry={errorsCountry}
        />

        <View>
          <Input
            // id="address"
            label="Pin Code"
            name="pincode"
            type="text"
            className={`w-full`}
            placeholder="Ex: 123456"
            error={errorsPinCode}
            value={values?.pincode}
            onChange={handleChange}
          />
        </View>
      </View>

      <View className="col-span-2 mt-6">
        <h3 className="text-lg font-semibold text-text-DEFAULT mb-3 border-b border-neutral-200 pb-2">
          Professional Information
        </h3>
      </View>

      {/* Designation */}
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          <Input
            id="designation"
            label="Designation"
            name="designation"
            onChange={handleChange}
            placeholder="Ex: Doctor"
            error={errorsDesignation}
            value={values?.designation}
          />
        </View>

        {/* Qualification */}
        <View>
          <Input
            id="qualification"
            label="Qualification"
            name="qualification"
            onChange={handleChange}
            placeholder="Ex: MBBS"
            error={errorsQualification}
            value={values?.qualification}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          {/* <Select 
            id="department"
            label="Department"
            name="department"
            value={values?.department}
            onChange={handleChange}
            options={departmentObj}
            placeholder="Select Department"
            error={errorsDepartment}
            required={true}
          /> */}
          <SingleSelector
            id="department"
            label="Department"
            name="department"
            value={Number(values?.department) || ""}
            onChange={(value) => {
              onSetHandler("department", value);
            }}
            options={departmentObj}
            placeholder="Select Department"
            error={errorsDepartment}
            required={true}
          />
        </View>

        <View
          className={`${
            role === "Admin" || role === "Super Admin" ? "" : "hidden"
          }`}
        >
          {/* <Select
            id="role"
            label="Role"
            name="role"
            options={roles?.map((role: any) => ({
              value: role?.name,
              label: role?.name?.charAt(0).toUpperCase() + role?.name?.slice(1),
            }))}
            onChange={handleChange}
            placeholder="Select Role"
            error={errorsRole}
            value={values?.role}
            required={true}
          /> */}
          <SingleSelector
            id="role"
            label="Role"
            name="role"
            value={values?.role || ""}
            onChange={(value) => {
              onSetHandler("role", value);
              onRoleChange?.(value);
            }}
            // options={roles}
            options={rolesFor?.map((role: any) => ({
              value: role?.name,
              label: role?.name?.charAt(0).toUpperCase() + role?.name?.slice(1),
            }))}
            placeholder="Select Role"
            error={errorsRole}
            required={true}
            // closeOnSelect={true}
          />
        </View>

        <View
          className={`${
            role === "Admin" || role === "Super Admin" ? "col-span-2" : ""
          }`}
        >
          <SingleSelector
            id="status"
            label="Status"
            name="status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            // placeholder="Ex: Active"
            error={errorsStatus}
            options={userStatusOptions}
            value={values?.status || "Active"}
            required={true}
          />
        </View>
      </View>

      <View className="mt-4">
        <Textarea
          name="letter_header_info"
          label="Letter Header Info"
          value={values?.letter_header_info || ""}
          onChange={handleChange}
          placeholder="Enter Letter Header Info"
        />
      </View>
      <View className="mt-4">
        <Textarea
          name="letter_footer_info"
          label="Letter Footer Info"
          value={values?.letter_footer_info || ""}
          onChange={handleChange}
          placeholder="Enter Letter Footer Info"
        />
      </View>
    </React.Fragment>
  );
};

export default SectionTwo;
