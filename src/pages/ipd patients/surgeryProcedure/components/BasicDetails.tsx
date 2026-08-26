import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import View from "@/components/view";
import Text from "@/components/text";
import {
  User,
  Calendar,
  Clock,
  Bed,
  FileText,
  ClipboardList,
} from "lucide-react";
import { useIpdPatients } from "@/actions/calls/ipd";
import { useParams } from "react-router-dom";
import BouncingLoader from "@/components/BouncingLoader";
import { LoadingStatus } from "@/interfaces";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import dayjs from "dayjs";

const BasicDetails: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { surgeryReportDetail } = useSurgeryReport();

  const { ipdPatientDetailHandler, cleanUp } = useIpdPatients();

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );
  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData,
  );

  const surgeryStart = surgeryReportData?.surgery_start_datetime;
  const surgeryEnd = surgeryReportData?.surgery_end_datetime;

  const formattedSurgeryTime =
    surgeryStart && surgeryEnd
      ? `${dayjs(surgeryStart).format("DD MMM YYYY, hh:mm A")} – ${dayjs(
          surgeryEnd,
        ).format("hh:mm A")}`
      : "-";

  useEffect(() => {
    if (id) {
      surgeryReportDetail(id, () => {});
    }
  }, []);

  useEffect(() => {
    if (surgeryReportData?.ipd_id) {
      ipdPatientDetailHandler(
        surgeryReportData?.ipd_id,
        () => {},
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
    return () => {
      cleanUp();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [surgeryReportData?.ipd_id]);

  const InfoCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <Card className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      <View className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
          {label}
        </Text>
        <Text className="font-semibold text-sm">{value}</Text>
      </View>
    </Card>
  );

  return (
    <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BouncingLoader isLoading={isLoading} />
      <InfoCard
        icon={User}
        label="Patient Name"
        value={ipdPatientDetailData?.patient_name}
      />

      <InfoCard
        icon={User}
        label="Age / Gender"
        value={`${ipdPatientDetailData?.patient_age} / ${ipdPatientDetailData?.patient?.gender}`}
      />

      <InfoCard
        icon={FileText}
        label="IPD Number"
        value={ipdPatientDetailData?.ipd_number}
      />

      <InfoCard
        icon={Bed}
        label="Ward / Room / Bed"
        value={`${ipdPatientDetailData?.ward_number} / ${ipdPatientDetailData?.room_number} / ${ipdPatientDetailData?.bed_number}`}
      />

      <InfoCard
        icon={Calendar}
        label="Admission Date"
        value={dayjs(ipdPatientDetailData?.admission_date).format(
          "DD MMM YYYY, hh:mm A",
        )}
      />

      <InfoCard
        icon={ClipboardList}
        label="Surgery Name"
        value={surgeryReportData?.surgery_name}
      />

      <InfoCard
        icon={Clock}
        label="Surgery Time"
        value={formattedSurgeryTime}
      />

      <InfoCard
        icon={FileText}
        label="Surgeon"
        value={surgeryReportData?.surgeon}
      />
    </View>
  );
};

export default BasicDetails;
