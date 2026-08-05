import React, { useEffect } from "react";
import View from "@/components/view";

import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import Input from "@/components/input";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";
import { paymentStatusOptions, statusOptions } from "./consultationFormOptions";
import { GenericStatus } from "@/interfaces";
import SingleSelector from "@/components/SingleSelector";

interface SectionFourProps {
  paymentStatus: string;
  status: string;
  errorsStatus: string;
  errorsPaymentStatus: string;
  errorNextVisitDate: string;
}

const SectionFour: React.FC<SectionFourProps> = ({
  paymentStatus,
  status,
  errorsStatus,
  errorsPaymentStatus,
  errorNextVisitDate,
}) => {
  const consultationDetailData = useSelector(
    (state: RootState) => state.consultation.consultationDetailData
  );

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetailData?.consultations
  );

  useEffect(() => {
    onSetHandler("payment_status", paymentStatus);
    onSetHandler("status", status);
  }, [paymentStatus]);

  return (
    //consultations
    <View className="mt-4">
      <Card className="shadow-none border-none" style={{ boxShadow: "none" }}>
        <View className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <View>
            <Input
              type="date"
              required={true}
              id="next_visit_date"
              name="next_visit_date"
              label="Next Visit Date"
              onChange={handleChange}
              error={errorNextVisitDate}
              value={dayjs(values?.next_visit_date).format("YYYY-MM-DD")}
              // value={dayjs(values?.consultations?.next_visit_date).format("YYYY-MM-DD")}
              placeholder="Select Next Visit Date"
            />
          </View>

          <View>
            {/* <Select
              // name="appointment_payment_status"
              name="payment_status"
              label="Appointment Payment Status"
              value={values?.payment_status || GenericStatus.PENDING}
              onChange={(e) => onSetHandler("payment_status", e.target.value)}
              placeholder="Select Appointment Payment Status"
              options={paymentStatusOptions}
              error={errorsPaymentStatus}
            /> */}
            <SingleSelector
              id="payment_status"
              label="Payment Status"
              name="payment_status"
              error={errorsPaymentStatus}
              value={values?.payment_status || GenericStatus.PENDING}
              placeholder="Select Payment Status"
              onChange={(value) => {
                onSetHandler("payment_status", value);
              }}
              options={paymentStatusOptions}
            />
          </View>
          <View className="col-span-2">
            {/* <Select
              id="status"
              name="status"
              label="Status"
              placeholder="Select Status"
              required={true}
              error={errorsStatus}
              value={values?.status || GenericStatus.COMPLETED}
              options={statusOptions}
              onChange={handleChange}
            /> */}
            <SingleSelector
              id="status"
              label="Status"
              name="status"
              error={errorsStatus}
              value={values?.status || GenericStatus.COMPLETED}
              placeholder="Select Status"
              onChange={(value) => {
                onSetHandler("status", value);
              }}
              options={statusOptions}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default SectionFour;
