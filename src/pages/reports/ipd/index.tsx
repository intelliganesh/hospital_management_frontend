import dayjs from "dayjs";
import Filter from "@/pages/filter";
import Text from "@/components/text";
import View from "@/components/view";
import SingleSelector from "@/components/SingleSelector";
import Button from "@/components/button";
import { RootState } from "@/actions/store";
import { Card } from "@/components/ui/card";
import DataSort from "@/components/SortData";
import { FileText } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import { useDispatch, useSelector } from "react-redux";
import DynamicTable from "@/components/ui/DynamicTable";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";
import DateRangePicker from "@/components/DateRangePicker";
import { clearList } from "@/actions/slices/ipdReport";
import { useIpdReport } from "@/actions/calls/reports/ipdReport";
import { useOpd } from "@/actions/calls/opd";
import { useWards } from "@/actions/calls/wards";
import { useRoom } from "@/actions/calls/rooms";
import { useBeds } from "@/actions/calls/beds";
import { IPD_REPORT_DOWNLOAD_URL } from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";

const normalizeRows = (reportData: any) => {
  const candidates = [
    reportData?.table?.data,
    reportData?.data?.data,
    reportData?.data,
    reportData?.list,
  ];

  return candidates.find(Array.isArray) || [];
};

const getPagination = (reportData: any) => {
  if (reportData?.table) return reportData.table;
  if (reportData?.data && !Array.isArray(reportData.data)) return reportData.data;
  return reportData || {};
};

const sanitizeFilters = (filters?: Record<string, any> | null) => {
  return Object.entries(filters || {}).reduce((acc: Record<string, any>, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const formatDateTime = (value?: string | null) => {
  return value ? dayjs(value).format("DD-MM-YYYY hh:mm A") : "-";
};

const formatValue = (value?: any) => {
  return value !== undefined && value !== null && value !== "" ? value : "-";
};

const formatPhone = (value?: string | null) => {
  const phone = value?.trim();
  return phone && phone !== "+91" ? phone : "-";
};

const formatSummaryType = (value?: string | null) => {
  if (!value) return "-";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const toOptions = (
  list: any[] | null | undefined,
  getLabel: (item: any) => string,
  getValue: (item: any) => string | number | undefined,
) =>
  (list || [])
    .map((item) => ({
      label: getLabel(item),
      value: getValue(item),
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

const IpdReport: React.FC = () => {
  const dispatch = useDispatch();
  const [loadingStatus, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<null | { multiple_filter: Record<string, any> }>(null);
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const ipdReportList = useSelector(
    (state: RootState) => state.ipdReport.ipdReportList,
  );

  const { cleanUp, getListApi } = useIpdReport();
  const { PuaListHandler } = useOpd();
  const { wardDropdownHandler } = useWards();
  const { roomDropdownHandler } = useRoom();
  const { bedDropdownHandler } = useBeds();

  const reportRows = useMemo(() => normalizeRows(ipdReportList), [ipdReportList]);
  const pagination = useMemo(() => getPagination(ipdReportList), [ipdReportList]);

  const doctorOptions = toOptions(
    useSelector((state: RootState) => state.opd.userList)?.filter(
      (doctor: any) => doctor.role === "Doctor",
    ),
    (doctor) => doctor.name,
    (doctor) => doctor.id,
  );
  const patientOptions = toOptions(
    useSelector((state: RootState) => state.opd.patientList),
    (patient) =>
      `${patient.patient_number || ""}(${[patient.first_name, patient.last_name]
        .filter(Boolean)
        .join(" ")})`,
    (patient) => patient.id,
  );
  const wardOptions = toOptions(
    useSelector((state: RootState) => state.wards.wardDropdownData),
    (ward) => ward.name || ward.ward_number || "Ward",
    (ward) => ward.id,
  );
  const roomOptions = toOptions(
    useSelector((state: RootState) => state.rooms.roomDropdownData),
    (room) => room.name || room.room_number || "Room",
    (room) => room.id,
  );
  const bedOptions = toOptions(
    useSelector((state: RootState) => state.beds.bedDropdownData),
    (bed) => bed.bed_number || bed.name || "Bed",
    (bed) => bed.id,
  );

  const sortOptions: any[] = [
    { label: "Admission Date (Oldest)", value: "admission_date_time", order: "asc" },
    { label: "Admission Date (Newest)", value: "admission_date_time", order: "desc" },
    { label: "Discharge Date (Oldest)", value: "discharge_date_time", order: "asc" },
    { label: "Discharge Date (Newest)", value: "discharge_date_time", order: "desc" },
    { label: "Created At (Oldest)", value: "created_at", order: "asc" },
    { label: "Created At (Newest)", value: "created_at", order: "desc" },
    { label: "IPD Number (A-Z)", value: "ipd_number", order: "asc" },
    { label: "IPD Number (Z-A)", value: "ipd_number", order: "desc" },
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    { label: "Doctor Name (A-Z)", value: "doctor_name", order: "asc" },
    { label: "Doctor Name (Z-A)", value: "doctor_name", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<any | null>(sortOptions[1]);

  useEffect(() => {
    PuaListHandler(() => {});
    wardDropdownHandler(() => {});
  }, []);

  useEffect(() => {
    if (!selectedWardId) return;

    roomDropdownHandler(Number(selectedWardId), () => {});
    setSelectedRoomId("");
  }, [selectedWardId]);

  useEffect(() => {
    if (!selectedRoomId) return;

    bedDropdownHandler(Number(selectedRoomId), () => {});
  }, [selectedRoomId]);

  useEffect(() => {
    getListApi(
      searchParams.get("currentPage") ?? 1,
      () => {},
      (status) => {
        setIsLoading(status === "pending" || status === "failed");
      },
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      searchParams.get("from_date") ?? null,
      searchParams.get("to_date") ?? null,
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
    searchParams.get("sort_order"),
    searchParams.get("from_date"),
    searchParams.get("to_date"),
  ]);

  const downloadIpdExcel = async () => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const multipleFilter = sanitizeFilters({
        ...(filterData?.multiple_filter || {}),
        from_date: searchParams.get("from_date") || undefined,
        to_date: searchParams.get("to_date") || undefined,
      });

      const payload = sanitizeFilters({
        multiple_filter: multipleFilter,
        search: searchParams.get("search") || undefined,
        sort_by: searchParams.get("sort_by") || undefined,
        sort_order: searchParams.get("sort_order") || undefined,
      });

      const response = await fetch(`${baseUrl}${IPD_REPORT_DOWNLOAD_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error("Excel download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ipd-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      error && handleApiError(error);
      alert("Failed to download Excel report");
    } finally {
      setIsLoading(false);
    }
  };

  const tableRows = reportRows.map((item: any) => [
    formatValue(item?.ipd_number),
    formatValue(item?.patient_number),
    formatValue(item?.patient_name),
    formatPhone(item?.patient_phone),
    formatValue(item?.patient_age),
    formatValue(item?.patient_email),
    // formatValue(item?.patient_attendant_name),
    // formatPhone(item?.patient_attendant_phone),
    formatValue(item?.doctor_name),
    formatPhone(item?.doctor_phone),
    formatValue(item?.doctor_email),
    formatValue(item?.ward_number),
    formatValue(item?.ward_type),
    formatValue(item?.room_number),
    formatValue(item?.room_type),
    formatValue(item?.bed_number),
    formatSummaryType(item?.discharge_summary_type || item?.report_summary_type),
    formatValue(item?.status),
    formatDateTime(item?.admission_date_time),
    formatDateTime(item?.discharge_date_time),
    // formatValue(item?.patient_address),
  ]);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={loadingStatus} />

      <View className="mb-6">
        <Text as="h1" className="text-2xl font-bold text-slate-900 dark:text-white">
          IPD Report
        </Text>
        <Text as="p" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Basic IPD report list and Excel download.
        </Text>
      </View>

      <View className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <View className="flex items-center gap-4">
          {reportRows.length > 0 && (
            <Button
              variant="outline"
              onPress={downloadIpdExcel}
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
            "IPD No",
            "Patient No",
            "Patient Name",
            "Patient Phone",
            "Age",
            "Patient Email",
            // "Attendant Name",
            // "Attendant Phone",
            "Doctor Name",
            "Doctor Phone",
            "Doctor Email",
            "Ward No",
            "Ward Type",
            "Room No",
            "Room Type",
            "Bed No",
            "Summary Type",
            "Status",
            "Admission Date & Time",
            "Discharge Date & Time",
            // "Address",
          ]}
          tableData={tableRows}
          isLoading={loadingStatus}
          emptyMessage="No IPD report data found!"
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
                title="IPD Report Filter"
                onResetFilter={() => {
                  setFilterData(null);
                  setSelectedWardId("");
                  setSelectedRoomId("");
                }}
                onFilterApiCall={(data) => {
                  setFilterData({ multiple_filter: sanitizeFilters(data) });
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: "1",
                    },
                    { replace: true },
                  );
                }}
                inputFields={[
                  <View className="w-full my-4" key="doctor-id">
                    <SingleSelector
                      name="doctor_id"
                      label="Doctor"
                      placeholder="Select doctor"
                      options={doctorOptions}
                    />
                  </View>,
                  <View className="w-full my-4" key="patient-id">
                    <SingleSelector
                      name="patient_id"
                      label="Patient"
                      placeholder="Select patient"
                      options={patientOptions}
                    />
                  </View>,
                  <View className="w-full my-4" key="status">
                    <SingleSelector
                      name="status"
                      label="Status"
                      placeholder="Select IPD status"
                      options={[
                        { label: "Admitted", value: "Admitted" },
                        { label: "Discharged", value: "Discharged" },
                      ]}
                    />
                  </View>,
                  <View className="w-full my-4" key="ward-id">
                    <SingleSelector
                      name="ward_id"
                      label="Ward"
                      placeholder="Select ward"
                      value={selectedWardId}
                      onChange={(value) => setSelectedWardId(String(value || ""))}
                      options={wardOptions}
                    />
                  </View>,
                  <View className="w-full my-4" key="room-id">
                    <SingleSelector
                      name="room_id"
                      label="Room"
                      placeholder="Select room"
                      value={selectedRoomId}
                      onChange={(value) => setSelectedRoomId(String(value || ""))}
                      options={roomOptions}
                      disabled={!selectedWardId}
                    />
                  </View>,
                  <View className="w-full my-4" key="bed-id">
                    <SingleSelector
                      name="bed_id"
                      label="Bed"
                      placeholder="Select bed"
                      options={bedOptions}
                      disabled={!selectedRoomId}
                    />
                  </View>,
                  <View className="w-full my-4" key="summary-type">
                    <SingleSelector
                      name="summary_type"
                      label="Summary Type"
                      placeholder="Select summary type"
                      options={[
                        { label: "Surgical", value: "surgical" },
                        { label: "Non Surgical", value: "non_surgical" },
                      ]}
                    />
                  </View>,
                ]}
              />
            ),
            sort: (
              <DataSort
                sortOptions={sortOptions}
                onSort={(option) =>
                  handleSortChange(option, setActiveSort, setSearchParams, searchParams)
                }
                activeSort={activeSort ?? undefined}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={pagination?.current_page}
                last_page={pagination?.last_page}
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

export default IpdReport;

