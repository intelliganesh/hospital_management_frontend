import Filter from "@/pages/filter";
import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import { Link } from "react-router-dom";
import Button from "@/components/button";
import { RootState } from "@/actions/store";
import { Card } from "@/components/ui/card";
import DataSort from "@/components/SortData";
import InfoCard from "@/components/ui/infoCard";
import { Activity, FileText, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import { PATIENT_DETAIL_URL, PATIENT_TABLE_URL } from "@/utils/urls/frontend";
import { useDispatch, useSelector } from "react-redux";
import DynamicTable from "@/components/ui/DynamicTable";
import SingleSelector from "@/components/SingleSelector";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import DateRangePicker from "@/components/DateRangePicker";
import { clearList } from "@/actions/slices/fistulaReport";
import { useFistulaReport } from "@/actions/calls/reports/fistula";
import { FISTULA_REPORT_DOWNLOAD_URL } from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";
import { useFistula } from "@/actions/calls/fistula";
import { useOpd } from "@/actions/calls/opd";
import {
  camelToWords,
  formatClockPositions,
  formatInternalOpeningPosition,
} from "../consultation";
import TruncatedCell from "@/components/ui/TruncatedCell";

const FistulaReport: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();
  const [loadingStatus, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fistulaReportList = useSelector(
    (state: RootState) => state.fistulaReport.fistulaReportList,
  );
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );
  // console.log(filterData);
  const { cleanUp, getListApi } = useFistulaReport();
  const { fistulaDropdownHandler } = useFistula();
  const { PuaListHandler } = useOpd();
  const patientList = useSelector(
    (state: RootState) => state?.opd?.patientList,
  );
  const doctorList = useSelector((state: RootState) => state.opd.userList);
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  const fistulaDropDownList = useSelector(
    (state: RootState) => state.fistula.fistulaDropdownData,
  );

  const sortOptions: any[] = [
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    { label: "Doctor Name (A-Z)", value: "doctor_name", order: "asc" },
    { label: "Doctor Name (Z-A)", value: "doctor_name", order: "desc" },
    {
      label: "Appointment Id (A-Z)",
      value: "appointment_id",
      order: "asc",
    },
    {
      label: "Appointment Id (Z-A)",
      value: "appointment_id",
      order: "desc",
    },
    { label: "Created At (A-Z)", value: "created_at", order: "asc" },
    { label: "Created At (Z-A)", value: "created_at", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<any | null>(sortOptions[0]);

  useEffect(() => {
    fistulaDropdownHandler(() => {}, "Proctology");
  }, []);

  useEffect(() => {
    getListApi(
      searchParams.get("currentPage") ?? 1,
      () => {},
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

  const downloadFistulaExcel = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      // Build the body exactly like list API
      const bodyData: any = {
        page: searchParams.get("currentPage") ?? 1,
        search: searchParams.get("search") || null,
        from_date: searchParams.get("from_date") || null,
        to_date: searchParams.get("to_date") || null,
        ...filterData, // includes { multiple_filter: {...} }
      };

      // Add sort_by only if exists
      const sortBy = searchParams.get("sort_by");
      if (sortBy) {
        bodyData.sort_by = sortBy;
      }

      // Add sort_order ONLY if it is "asc" or "desc"
      const sortOrder = searchParams.get("sort_order");
      if (sortOrder === "asc" || sortOrder === "desc") {
        bodyData.sort_order = sortOrder;
      }

      // Now call download API
      const response = await fetch(`${baseUrl}${FISTULA_REPORT_DOWNLOAD_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        handleApiError(response);
        throw new Error("Excel download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger browser download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fistula-report.xlsx");
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

      <View className="flex flex-col md:flex-row justify-between items-center mb-6">
        <View className="mb-6">
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Fistula Report
          </Text>
          <Text as="p" className="text-text-light">
            Track and analyze fistula cases and patient data
          </Text>
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

      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard
          label="Total Fistula Cases"
          value={fistulaReportList?.analytics?.total_cases || "0"}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Activity size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <InfoCard
          label="New Cases"
          value={fistulaReportList?.analytics?.new_cases || "0"}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<TrendingUp size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        <InfoCard
          label="Recurrence Cases"
          value={fistulaReportList?.analytics?.recurrence_cases || "0"}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          icon={<Activity size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>

      <View className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <View className="flex items-center gap-4">
          {fistulaReportList?.data?.length > 0 && (
            <Button
              variant="outline"
              onPress={downloadFistulaExcel}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Download Report
            </Button>
          )}
        </View>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Patient Name",
            "Patient Number",
            "patient phone",
            "patient email",
            "Doctor Name",
            // "Previous Scar",
            // "Previous Scar Position",
            // "Abscess",
            // "Abscess Position",
            "No of Anal Fistula",
            "No of Tracks in Fistula",
            "No of External Opening ",
            "Positions of External Openings",
            "No of Secondary Opening",
            "positions of secondary openings",
            "Internal Opening Distance",
            "Internal Opening Position",
            "Any Other",
            "Fistula Crypt",
            "If Secondary, Cause",
            "Fistula Sphincter",
            "Fistula Position",
            "Fistula High Low Riding",
            "Distant or Visceral Communications",
            // "Secondary fistula opening position",
            // "Internal Opening Position Level",
            "Sonofistulaogram",
            "MRI fistulogram",
            "Posterior Fistulous Angle",
            "Sonologist/Radiologist",
            "Sonologist/Radiologist Findings",
            "Any Other Investigations",
            "Recurrence/New",
            "Surgery Count",
            // "Fistula Remark",
            // "Management",
          ]}
          tableData={fistulaReportList?.data?.map((fistula: any) => [
            <Link
              to={
                PATIENT_TABLE_URL +
                PATIENT_DETAIL_URL +
                "/" +
                fistula.patient_id
              }
              className="text-primary hover:underline"
            >
              {fistula?.patient_name || "N/A"}
            </Link>,
            fistula.patient_number || "N/A",
            fistula.patient_phone || "N/A",
            fistula.patient_email || "N/A",
            fistula.doctor_name || "N/A",

            // <Link
            //   to={`/consultation/details/${fistula.consultation_id}`}
            //   className="text-primary hover:underline"
            // >
            //   {fistula.consultation_id || "N/A"}
            // </Link>,
            // fistula.consultation_date
            //   ? dayjs(fistula.consultation_date).format(DATE_FORMAT)
            //   : "-",

            // fistula.previous_scar || "-",
            // fistula.previous_scar_position || "-",
            // fistula.abscess || "-",
            // fistula.abscess_position || "-",
            fistula.no_of_fistula || "-",
            fistula.no_of_tracks_in_one_fistula
              ? fistula.no_of_tracks_in_one_fistula.split("#").join(", ")
              : "-",
            fistula.no_of_external_opening_position
              ? fistula.no_of_external_opening_position.split("#").join(", ")
              : "-",
            formatClockPositions(fistula?.external_opening_position),
            fistula.no_of_secondary_opening_position
              ? fistula.no_of_secondary_opening_position.split("#").join(", ")
              : "-",
            fistula.secondary_anal_valve
              ? fistula.secondary_anal_valve.split("#").join(", ")
              : "-",
            // formatClockPositions(fistula?.secondary_opening_position),
            fistula.internal_opening_distance
              ? fistula.internal_opening_distance.split("#").join(", ")
              : "-",
            formatInternalOpeningPosition(fistula?.internal_opening_position),

            fistula.any_other ? fistula.any_other.split("#").join(", ") : "-",

            fistula.type_of_crypt
              ? fistula.type_of_crypt.split("#").join(", ")
              : "-",
            fistula.crypt_cause
              ? fistula.crypt_cause.split("#").join(", ")
              : "-",
            fistula.type_of_fistula_sphincter
              ? fistula.type_of_fistula_sphincter.split("#").join(", ")
              : "-",
            fistula.type_of_fistula_position
              ? fistula.type_of_fistula_position.split("#").join(", ")
              : "-",
            fistula.basis_of_high_low_riding
              ? fistula.basis_of_high_low_riding.split("#").join(", ")
              : "-",
            fistula.distant_visceral_communication
              ? fistula.distant_visceral_communication.split("#").join(", ")
              : "-",

            // formatClockPositions(fistula?.secondary_anal_valve),
            fistula.sono_fistula_gram || "-",
            fistula.mri_fistula_gram || "-",
            fistula.posterior_fistulous_angle || "-",
            fistula.sonologist || "-",
            fistula.sonologist_findings || "-",
            fistula.other_investigation || "-",
            fistula.fistula_recurrence
              ? camelToWords(fistula.fistula_recurrence).split("_").join(" ")
              : "-",
            fistula.fistula_recurrence_surgery_count || "-",
            // fistula.fistula_remark,
            // (() => {
            //   let mgmt = fistula?.managements;

            //   // If string → parse it
            //   if (typeof mgmt === "string") {
            //     try {
            //       mgmt = JSON.parse(mgmt);
            //     } catch {
            //       mgmt = [];
            //     }
            //   }

            //   // If still not array → fix
            //   if (!Array.isArray(mgmt)) mgmt = [];

            //   return mgmt.length > 0
            //     ? mgmt.map((m: any) => m.label).join(", ")
            //     : "-";
            // })(),
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
                title="Fistula Filter"
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
                        value: p.id, // backend wants patient_id
                        label: p.name, // display name to user
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
                    <SingleSelector
                      id="type_of_crypt"
                      name="type_of_crypt"
                      label="On The Basis Of Crypt"
                      options={fistulaDropDownList
                        ?.filter((x) => x?.sub_fistula_name === "crypt")
                        .map((x) => ({
                          value: x.fistula_name,
                          label: x.fistula_name,
                        }))}
                      placeholder="Select Fistula Crypt"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="crypt_cause"
                      placeholder="If Secondary, Cause"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      id="type_of_fistula_position"
                      name="type_of_fistula_position"
                      label="On The Basis Of Position"
                      options={fistulaDropDownList
                        ?.filter((x) => x?.sub_fistula_name === "position")
                        .map((x) => ({
                          value: x.fistula_name,
                          label: x.fistula_name,
                        }))}
                      placeholder="Select Fistula Position"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      id="type_of_fistula_sphincter"
                      name="type_of_fistula_sphincter"
                      label="On The Basis Of Sphincter"
                      options={fistulaDropDownList
                        ?.filter((x) => x?.sub_fistula_name === "sphincter")
                        .map((x) => ({
                          value: x.fistula_name,
                          label: x.fistula_name,
                        }))}
                      placeholder="Select Fistula Sphincter"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      id="basis_of_high_low_riding"
                      name="basis_of_high_low_riding"
                      label="On The Basis Of high/Low Riding"
                      options={fistulaDropDownList
                        ?.filter(
                          (x) => x?.sub_fistula_name === "high_low_riding",
                        )
                        .map((x) => ({
                          value: x.fistula_name,
                          label: x.fistula_name,
                        }))}
                      placeholder="Select Fistula High/Low Riding "
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="no_of_tracks_in_one_fistula"
                      placeholder="No of Tracks in Fistula"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="no_of_fistula"
                      placeholder="No of Anal Fistula"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="internal_opening_position"
                      placeholder="Internal opening position"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="external_opening_position"
                      placeholder="Positions of External Openings"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="secondary_anal_valve"
                      placeholder="positions of secondary openings"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="posterior_fistulous_angle"
                      placeholder="Posterior Fistulous Angle"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="sonologist" placeholder="Sonologist" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="sono_fistula_gram"
                      placeholder="Sonofistulogram"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="mri_fistula_gram"
                      placeholder="MRI fistulogram"
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
                current_page={fistulaReportList?.current_page}
                last_page={fistulaReportList?.last_page}
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

export default FistulaReport;
