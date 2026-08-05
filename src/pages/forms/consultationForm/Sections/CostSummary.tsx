import Text from "@/components/text";
import View from "@/components/view";
import { RootState } from "@/actions/store";
import React, { useEffect, useState } from "react";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import { Consultation } from "@/interfaces/consultation";
import { setConsultationAmount } from "@/actions/slices/consultation";
import { TAB_COLORS } from "../consultationFormConfig";
// import useExtractValue from "@/utils/custom-hooks/useExtractValue";

const CostSummary: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();
  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol,
  // );
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [totalCost, setTotalCost] = useState<number>(0);
  const totalServiceCost = useSelector(
    (state: RootState) => state.serviceCost.totalServiceCost,
  );
  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData,
  );
  const discountPercent = useSelector(
    (state: RootState) => state.serviceCost.discountPercent,
  );
  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
  };
  const consultationAmount = useSelector(
    (state: RootState) => state.consultation.consultationAmount,
  );
  const { values } = useForm<Consultation | null>(consultationDetailData || {});

  useEffect(() => {
    if (values?.consultation_amount) {
      dispatch(
        setConsultationAmount({
          type: "add",
          amount: Number(values?.consultation_amount || 0),
        }),
      );
    }
  }, [values?.consultation_amount]);

  useEffect(() => {
    const serviceCost = Number(totalServiceCost) || 0;
    const consultCost = Number(consultationAmount) || 0;
    const totalServiceAndConsultationCost = serviceCost + consultCost;
    const discount =
      totalServiceAndConsultationCost * (Number(discountPercent || 0) / 100);
    const discountedConsult = totalServiceAndConsultationCost - discount;
    setTotalCost(discountedConsult);
  }, [consultationAmount, totalServiceCost, discountPercent]);

  useEffect(() => {
    setCurrencySymbol(consultationDetailData?.currency ?? "");
  }, [consultationDetailData]);

  return (
    <React.Fragment>
      <View className="mt-6">
        <Text
          as="h3"
          weight="font-bold"
          className={`text-lg  ${TAB_COLORS.consultationBilling.textColor}`}
        >
          Cost Summary
        </Text>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background p-4 rounded-lg mt-2">
          <View>
            <Text as="p" className="text-sm">
              Consultation Cost
            </Text>
            <Text as="p" className="text-sm">
              {/* {currencySymbol} &nbsp; */}
              {currencySymbol} &nbsp;
              {consultationAmount}
              {/* {values?.consultation_amount || "0"} */}
            </Text>
          </View>
          <View>
            <Text as="p" className="text-sm">
              Additional Cost
            </Text>
            <Text as="p" className="text-sm">
              {/* {currencySymbol} */}
              {currencySymbol}
              &nbsp;
              {totalServiceCost || "0"}
            </Text>
          </View>
          <View className="border-t border-border pt-4 col-span-2">
            <Text as="p" className="text-sm">
              Total Cost
            </Text>
            <Text
              as="p"
              weight="font-bold"
              className=" text-primary text-xl flex items-center"
            >
              <Text as="span" className="text-black dark:text-white text-xl">
                {/* {currencySymbol} */}
                {currencySymbol}
              </Text>
              &nbsp;
              {totalCost}
            </Text>
          </View>
        </View>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6"></View>
      </View>
      <input
        type="text"
        hidden
        name="discount_amount"
        value={
          totalCost
          // Number(consultationAmount || 0) + Number(totalServiceCost || 0) || "0"
        }
      />
    </React.Fragment>
  );
};

export default CostSummary;
