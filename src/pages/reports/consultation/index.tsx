import Filter from "@/pages/filter";
import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import Button from "@/components/button";
import { RootState } from "@/actions/store";
import { Card } from "@/components/ui/card";
import DataSort from "@/components/SortData";
import InfoCard from "@/components/ui/infoCard";
import { Activity, FileText, TrendingUp, UserCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import { useDispatch, useSelector } from "react-redux";
import DynamicTable from "@/components/ui/DynamicTable";
import TruncatedCell from "@/components/ui/TruncatedCell";
import SingleSelector from "@/components/SingleSelector";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import DateRangePicker from "@/components/DateRangePicker";
import { clearList } from "@/actions/slices/consultationReportSlice";
import { useConsultationReport } from "@/actions/calls/reports/consultationReport";
import { CONSULTATION_REPORT_LIST_DOWNLOAD_URL } from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";
import { useOpd } from "@/actions/calls/opd";

export const formatClockPositions = (value?: string | null) => {
  if (!value) return "-";

  return value
    .split("#")
    .map((v) => `${v} o'clock`)
    .join(", ");
};

export const formatInternalOpeningPosition = (
  value?: string
): string => {
  if (!value) return "";

  const [position, level] = value.split("#");

  if (!position && !level) return "";

  return `${position} o'clock at ${level}`;
};


export function camelToWords(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Z]|^)([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
}

export const formatInternalOpeningWithLevel = (value?: string | null) => {
  if (!value) return "-";

  const parts = value.split("#");
  const result: string[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    if (parts[i] && parts[i + 1]) {
      result.push(`${parts[i]} ${parts[i + 1]}`);
    }
  }

  return result.join(", ");
};

const ConsultationReport: React.FC<{}> = ({ }) => {
  const dispatch = useDispatch();
  const [loadingStatus, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const consultationReportList = useSelector(
    (state: RootState) => state.consultationReport.consultationReportList,
  );
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );
  const { PuaListHandler } = useOpd();
  const patientList = useSelector(
    (state: RootState) => state?.opd?.patientList,
  );
  const doctorList = useSelector((state: RootState) => state.opd.userList);
  useEffect(() => {
    PuaListHandler(() => { });
  }, []);

  const { cleanUp, getListApi } = useConsultationReport();

  const sortOptions: any[] = [
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    {
      label: "Appointment Number (A-Z)",
      value: "appointment_number",
      order: "asc",
    },
    {
      label: "Appointment Number (Z-A)",
      value: "appointment_number",
      order: "desc",
    },
    { label: "Doctor Name (A-Z)", value: "doctor_name", order: "asc" },
    { label: "Doctor Name (Z-A)", value: "doctor_name", order: "desc" },
    {
      label: "Created At (A-Z)",
      value: "created_at",
      order: "asc",
    },
    {
      label: "Created At (Z-A)",
      value: "created_at",
      order: "desc",
    },
  ];

  const [activeSort, setActiveSort] = useState<any | null>(sortOptions[0]);

  useEffect(() => {
    getListApi(
      searchParams.get("currentPage") ?? 1,
      () => { },
      (loadingStatus) => {
        setIsLoading(
          loadingStatus == "pending"
            ? true
            : loadingStatus == "failed"
              ? true
              : loadingStatus == "success" && false,
        );
      },
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      searchParams?.get("from_date") ?? null,
      searchParams?.get("to_date") ?? null,
      filterData,
    );
    return () => {
      cleanUp();
      dispatch(clearList());
    };
  }, [
    filterData,
    searchParams.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams?.get("to_date"),
    searchParams?.get("from_date"),
    searchParams.get("sort_order"),
  ]);

  const downloadConsultationExcel = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const bodyData: any = {
        page: searchParams.get("currentPage") ?? 1,
        search: searchParams.get("search") || null,
        from_date: searchParams.get("from_date") || null,
        to_date: searchParams.get("to_date") || null,
        ...filterData,
      };

      const sortBy = searchParams.get("sort_by");
      if (sortBy) {
        bodyData.sort_by = sortBy;
      }

      const sortOrder = searchParams.get("sort_order");
      if (sortOrder === "asc" || sortOrder === "desc") {
        bodyData.sort_order = sortOrder;
      }

      const response = await fetch(
        `${baseUrl}${CONSULTATION_REPORT_LIST_DOWNLOAD_URL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          body: JSON.stringify(bodyData),
        },
      );

      if (!response.ok) {
        handleApiError(response);
        throw new Error("Excel download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "consultation-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel download error:", error);
      handleApiError(error);
      alert("Failed to download Excel report");
    }
  };

  const currencySymbol = useSelector(
    (state: RootState) => state.systemSettings.settings.currency_symbol,
  );

  const parseJson = function parseJsonArray(value: any) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const codeHtml = function stripHtml(html: string | null | undefined) {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim() || "";
  };

  // ============ CUSTOM RENDER CELL WITH TRUNCATION ============
  const renderCellWithTruncation = (_: number, __: number, value: any) => {
    if (React.isValidElement(value)) {
      return value;
    }

    return <TruncatedCell text={value} maxLength={50} />;
  };

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={loadingStatus} />
      </View>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Consultation Report
        </Text>
        <Text as="p" className="text-text-light">
          Track and analyze consultation data and patient visits
        </Text>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard
          label="Total Consultations"
          value={consultationReportList?.totalConsultations || "0"}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Activity size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <InfoCard
          label="Total Revenue"
          value={`${currencySymbol}${consultationReportList?.totalRevenue || "0"
            }`}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<TrendingUp size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <InfoCard
          label="Pending Payments"
          value={`${currencySymbol}${consultationReportList?.pendingPayments || "0"
            }`}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          icon={<FileText size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <InfoCard
          label="Completed Payments"
          value={`${currencySymbol}${consultationReportList?.completedPayments || "0"
            }`}
          valueStyle="!text-purple-600 dark:!text-purple-400 !text-2xl"
          icon={<UserCheck size={20} />}
          iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>

      <View className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <View className="flex items-center gap-4">
          {consultationReportList?.data?.length > 0 && (
            <Button
              variant="outline"
              onPress={downloadConsultationExcel}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Download Report
            </Button>
          )}
        </View>
        <View>
          <Text
            as="label"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Select Date Range
          </Text>
          <DateRangePicker placeholder="Choose your dates" />
        </View>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Date",
            "Patient Name",
            "Patient Number",
            "Appointment Number",
            "Patient Age",
            "Patient Gender",
            "Patient Phone",
            "Patient Email",
            "Doctor Name",
            "Department",
            "Proc Chief Complaints",
            "Proc Surgical History",
            "Proc Co-morbidities",
            "Proc Co-morbidities Description",
            "Proc On Examination",
            "Proc DRE",
            "Proc Proctoscopy",
            "Proc Diagnosis",
            "Proc Examination Overview",
            "Proc Preliminary Diagnostic",
            "Proc Treatment Plan",
            "Proc Tests",
            "Proc Diet Plan",
            "Proc Management",
            "Type of Fistula Position",
            "Type of Fistula Sphincter",
            "No of Fistula",
            "No of Tracks in one Fistula",
            "Internal Opening Distance",
            "Internal Opening Position",
            "No of External Opening Position",
            "External Opening Position",
            "No of Secondary Opening",
            "positions of secondary openings",
            "Previous Scar",
            "Previous Scar Position",
            "Abscess",
            "Abscess Position",
            "Posterior Fistulous Angle",
            // "PFA",
            "Fistula Recurrence",
            "Fistula Recurrence Surgery Count",
            "Fistula Remark",
            "Sonologist",
            "Sonologist Findings",
            "Any Other Investigations",
            "Non-Proc Chief Complaints",
            "Non-Proc Surgical History",
            "Non-Proc Co-morbidities",
            "Non-Proc Co-morbidities Description",
            "Non-Proc On Examination",
            "Non-Proc Treatment Plan",
            "Non-Proc Tests",
            "Non-Proc Diet Plan",
            "Non-Proc Food Advice",
            "Non-Proc Yoga Asana",
            "Non-Proc Prakriti",
            "Non-Proc Vikruti",
            "Non-Proc Agni",
            "Non-Proc Koshta",
            "Non-Proc Avastha",
            "Total Amount",
            "Payment Status",
          ]}
          tableData={consultationReportList?.data?.map((data: any) => [
            data.appointment_date || "-",
            data.patient_name || "-",
            data.patient_number || "-",
            data.appointment_number || "-",
            data.patient_age || "-",
            data.patient_gender || "-",
            data.patient_phone || "-",
            data.patient_email || "-",
            data.doctor_name || "-",
            data.type || "-",
            parseJson(data.proc_chief_complaints)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_surgical_history)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_co_morbidities)
              .map((m) => m.label)
              .join(", ") || "-",
            data.proc_co_morbidities_description || "-",
            parseJson(data.proc_on_examination)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_dre)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_proctoscopy)
              .map((m) => m.label)
              .join(", ") || "-",
            data.proc_diagnosis || "-",
            data.proc_examination_overview || "-",
            data.proc_preliminary_diagnostic || "-",
            codeHtml(data.proc_treatment_plan) || "-",
            parseJson(data.proc_tests)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_diet_plan)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.proc_managements)
              .map((m) => m.label)
              .join(", ") || "-",
            data.type_of_fistula_position
              ? data.type_of_fistula_position.split("#").join(", ")
              : "-",
            data.type_of_fistula_sphincter
              ? data.type_of_fistula_sphincter.split("#").join(", ")
              : "-",
            data.no_of_fistula || "-",
            data.no_of_tracks_in_one_fistula
              ? data.no_of_tracks_in_one_fistula.split("#").join(", ")
              : "-",
            data?.internal_opening_distance
              ? data?.internal_opening_distance.split("#").join(", ")
              : "-",
            formatInternalOpeningPosition(data?.internal_opening_position),
            data?.no_of_external_opening_position
              ? data.no_of_external_opening_position.split("#").join(", ")
              : "-",
            formatClockPositions(data?.external_opening_position),
            data?.no_of_secondary_opening_position
              ? data.no_of_secondary_opening_position.split("#").join(", ")
              : "-",
            data?.secondary_anal_valve
              ? data?.secondary_anal_valve.split("#").join(", ")
              : "-",
            data.previous_scar || "-",
            data.previous_scar_position || "-",
            data.abscess || "-",
            data.abscess_position || "-",
            data.posterior_fistulous_angle || "-",
            // data.pfa || "-",
            data.fistula_recurrence
              ? camelToWords(data.fistula_recurrence).split("_").join(" ")
              : "-",
            data.fistula_recurrence_surgery_count || "-",
            data.fistula_remark || "-",
            data.sonologist || "-",
            data.sonologist_findings || "-",
            data.other_investigation || "-",
            parseJson(data.non_proc_chief_complaints)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.non_proc_surgical_history)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.non_proc_co_morbidities)
              .map((m) => m.label)
              .join(", ") || "-",
            data.non_proc_co_morbidities_description || "-",
            parseJson(data.non_proc_on_examination)
              .map((m) => m.label)
              .join(", ") || "-",
            codeHtml(data.non_proc_treatment_plan) || "-",
            parseJson(data.non_proc_tests)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.non_proc_diet_plan)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.non_proc_food_advice)
              .map((m) => m.label)
              .join(", ") || "-",
            parseJson(data.non_proc_yoga_asana)
              .map((m) => m.label)
              .join(", ") || "-",
            data.non_proc_prakriti || "-",
            data.non_proc_vikruti || "-",
            data.non_proc_agni || "-",
            data.non_proc_koshta || "-",
            data.non_proc_avastha || "-",
            data.currency + " " + data.consultation_amount || 0,
            data.payment_status || "Pending",
          ])}
          renderCell={renderCellWithTruncation}
          header={{
            search: (
              <SearchBar
                onSearch={(val) =>
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    search: val,
                    currentPage: "1",
                  })
                }
              />
            ),
            filter: (
              <Filter
                onResetFilter={() => {
                  setFilterData(null);
                }}
                title="Consultation Filter"
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4" key="patient-name">
                    <SingleSelector
                      id="patient_id"
                      name="patient_id"
                      label="Patient Name"
                      placeholder="Search Patient"
                      options={patientList?.map((p: any) => ({
                        value: p.id,
                        label: p.name,
                      }))}
                    />
                  </View>,
                  <View className="w-full my-4" key="doctor-name">
                    <SingleSelector
                      id="doctor_id"
                      name="doctor_id"
                      label="Doctor Name"
                      placeholder="Search Doctor"
                      options={doctorList?.map((d: any) => ({
                        value: d.id,
                        label: d.name,
                      }))}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="proc_chief_complaints"
                      placeholder="Proc Chief Complaints"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="proc_surgical_history"
                      placeholder="Proc Surgical History"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="proc_co_morbidities"
                      placeholder="Proc Co-morbidities"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="proc_on_examination"
                      placeholder="Proc On Examination"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="proc_dre" placeholder="Proc DRE" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="proc_proctoscopy"
                      placeholder="Proc Proctoscopy"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_chief_complaints"
                      placeholder="Non-Proc Chief Complaints"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_surgical_history"
                      placeholder="Non-Proc Surgical History"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_co_morbidities"
                      placeholder="Non-Proc Co-morbidities"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_on_examination"
                      placeholder="Non-Proc On Examination"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_prakriti"
                      placeholder="Non-Proc Prakriti"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_vikruti"
                      placeholder="Non-Proc Vikruti"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="non_proc_agni" placeholder="Non-Proc Agni" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_koshta"
                      placeholder="Non-Proc Koshta"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="non_proc_avastha"
                      placeholder="Non-Proc Avastha"
                    />
                  </View>,
                ]}
              />
            ),
            sort: (
              <DataSort
                sortOptions={sortOptions}
                onSort={(option) =>
                  handleSortChange(
                    option,
                    setActiveSort,
                    setSearchParams,
                    searchParams,
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={consultationReportList?.current_page}
                last_page={consultationReportList?.last_page}
                getPageNumberHandler={(page) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: `${page}`,
                    },
                    { replace: true },
                  )
                }
              />
            ),
          }}
        />
      </Card>
    </React.Fragment>
  );
};

export default ConsultationReport;
