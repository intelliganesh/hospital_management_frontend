import View from "@/components/view";
import { Card } from "@/components/ui/card";
import { Users, Bed } from "lucide-react";
import React, { useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ActionMenu from "@/components/editDeleteAction";
import PaginationComponent from "@/components/Pagination";
import { useSearchParams } from "react-router-dom";
import DataSort, { SortOption } from "@/components/SortData";
import DynamicTable from "@/components/ui/DynamicTable";
import { handleSortChange } from "@/utils/helperFunctions";
import Text from "@/components/text";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import InfoCard from "@/components/ui/infoCard";
import dayjs from "dayjs";

const IpdPatientsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mock data - Replace with actual API calls
  const mockIpdPatients = {
    data: [
      {
        id: "1",
        patient_number: "P001",
        first_name: "John",
        last_name: "Doe",
        age: "45",
        ward: "General Ward",
        room: "Room 101",
        bed: "Bed A",
        admission_date: "2024-12-20",
        status: "Admitted",
      },
      {
        id: "2",
        patient_number: "P002",
        first_name: "Jane",
        last_name: "Smith",
        age: "32",
        ward: "ICU",
        room: "Room 201",
        bed: "Bed B",
        admission_date: "2024-12-21",
        status: "Admitted",
      },
    ],
    current_page: 1,
    last_page: 1,
  };

  const mockStats = {
    total_ipd_patients: 45,
    active_admissions: 38,
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "first_name", order: "asc" },
    { label: "Name (Z-A)", value: "first_name", order: "desc" },
    {
      label: "Admission Date (Newest)",
      value: "admission_date",
      order: "desc",
    },
    { label: "Admission Date (Oldest)", value: "admission_date", order: "asc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(
    sortOptions[0]
  );

  return (
    <React.Fragment>
      <View className="mb-8">
        <View className="flex justify-between items-center gap-4">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
            >
              IPD Patients
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              View and manage admitted patients
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total IPD Patients"
          value={mockStats.total_ipd_patients || 0}
          valueStyle="!text-purple-600 dark:!text-purple-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Active Admissions"
          value={mockStats.active_admissions || 0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<Bed size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            "Patient ID",
            "Name",
            "Age",
            "Ward",
            "Room",
            "Bed",
            "Admission Date",
            "Status",
            "Actions",
          ]}
          tableData={mockIpdPatients.data.map((patient: any) => [
            patient.patient_number,
            <View className="flex items-center">
              <View className="h-8 w-8 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                <Text
                  as="span"
                  className="text-xs font-medium text-secondary-600"
                >
                  {patient.first_name.charAt(0)}
                  {patient?.last_name ? patient?.last_name.charAt(0) : ""}
                </Text>
              </View>
              <Text as="span" className="font-medium text-text-DEFAULT">
                {patient.first_name +
                  " " +
                  (patient.last_name ? patient.last_name : "")}
              </Text>
            </View>,
            patient.age || "N/A",
            patient.ward || "N/A",
            patient.room || "N/A",
            patient.bed || "N/A",
            dayjs(patient.admission_date).format("DD MMM YYYY"),
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full `}
              style={getStatusColorScheme(patient?.status)}
            >
              {patient.status}
            </Text>,
            <ActionMenu
              onView={() => {
                // TODO: Navigate to IPD patient detail
                console.log("View IPD patient:", patient.id);
              }}
              onEdit={() => {
                // TODO: Navigate to edit IPD patient
                console.log("Edit IPD patient:", patient.id);
              }}
            />,
          ])}
          header={{
            search: (
              <SearchBar
                onSearch={(value: string) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                      search: value,
                    },
                    { replace: true }
                  );
                }}
                className="shadow-sm dark:shadow-none"
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
                    searchParams
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={mockIpdPatients.current_page}
                last_page={mockIpdPatients.last_page}
                getPageNumberHandler={(page) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: `${page}`,
                    },
                    { replace: true }
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

export default IpdPatientsPage;
