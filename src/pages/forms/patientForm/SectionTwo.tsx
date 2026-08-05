import React from "react";
import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import Textarea from "@/components/Textarea";
import useForm from "@/utils/custom-hooks/use-form";
import { PatientInterface } from "@/interfaces/patients";
import CountryStateDropdown from "@/components/countryStatedropdown";

interface SectionTwoProps {
  errorsAddress: string;
  errorsPinCode: string;
  errorsCity: string;
  errorsState: string;
  errorsCountry: string;
  formType: "add" | "edit";
  // errorEnroleFees: string;
  // errorPaymentType: string;
  // errorAmountFor: string;
}

const SectionTwo: React.FC<SectionTwoProps> = ({
  formType,
  errorsCity,
  errorsState,
  errorsCountry,
  errorsAddress,
  errorsPinCode,
  // errorAmountFor,
  // errorEnroleFees,
  // errorPaymentType,
}) => {
  const patientDetail = useSelector(
    (state: RootState) => state.patient.patientDetailData
  );
  const { values, handleChange } =
    useForm<PatientInterface>(patientDetail);
  return (
    <React.Fragment>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <View>
          <Textarea
            label="Address:"
            id="address"
            name="address"
            type="textarea"
            className={`w-full`}
            placeholder="Ex: House No. 09, Street 01, City, State, Country"
            error={errorsAddress}
            value={values?.address ?? ""}
            onChange={handleChange}
            // required={true}
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
      </View>

      <View className="grid grid-cols-1 gap-4 mb-4">
        <View>
          <Input
            // id="address"
            id="pincode"
            label="Pin Code"
            name="pincode"
            type="text"
            className={`w-full`}
            placeholder="Ex: 123456"
            error={errorsPinCode}
            value={values?.pincode}
            onChange={handleChange}
            // required={true}
          />
        </View>
      </View>

      <View>
        {/* <Text
          as="h3"
          className="text-lg font-bold border-b pb-2 mb-4"
          weight="font-bold"
        >
          Enroll Fees
        </Text> */}
        {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> */}
        {/* <View>
            <Input
              required={true}
              id="enroll_fees"
              name="enroll_fees"
              label="Enroll Fees"
              onChange={handleChange}
              error={errorEnroleFees}
              value={values?.enroll_fees ? values?.enroll_fees + "" : ""}
              placeholder="Enter Enroll Fees"
            />
          </View> */}
        {/* <View>
        <Select
          id="amount_for"
          required={true}
          name="amount_for"
          label="Amount For"
          error={errorAmountFor}
          options={amountOptions}
          placeholder="Select Amount For"
          value={values?.amount_for}
          onChange={(e) => {
            onSetHandler("amount_for", e.target.value);
          }}
        />
      </View> */}
        {/* <View>
            <Select
              id="payment_type"
              name="payment_type"
              required={true}
              error={errorPaymentType}
              label="Payment Type"
              placeholder="Select Payment Type"
              options={paymentTypeOptions}
              value={values?.payment_type}
              onChange={(e) => {
                onSetHandler("payment_type", e.target.value);
              }}
            />
          </View> */}
        {/* </View> */}
      </View>
    </React.Fragment>
  );
};

export default SectionTwo;
