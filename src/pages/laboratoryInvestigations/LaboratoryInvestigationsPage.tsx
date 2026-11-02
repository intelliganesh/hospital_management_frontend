import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FlaskConical } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import SingleSelector from "@/components/SingleSelector";
import PaginationComponent from "@/components/Pagination";
import BouncingLoader from "@/components/BouncingLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useIpdPatients } from "@/actions/calls/ipd";
import { clearIpdPatientListSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { RootState } from "@/actions/store";
import { LoadingStatus } from "@/interfaces";
import { dynamicTableCardStyle } from "@/utils/helperFunctions";
import {
  DATE_FORMAT,
  TIME_FORMAT,
  LAB_INVESTIGATIONS_URL,
  LAB_INVESTIGATIONS_FORM_URL,
} from "@/utils/urls/frontend";

const statusOptions = [
  { label: "Admitted", value: "Admitted" },
  { label: "Discharged", value: "Discharged" },
];

const LaboratoryInvestigationsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { ipdPatientListHandler, cleanUp } = useIpdPatients();

  const ipdPatients = useSelector(
    (state: RootState) => state.ipd.ipdPatientList,
  );

  const ipdPatientRows = Array.isArray(ipdPatients)
    ? ipdPatients
    : ipdPatients?.data || [];

  // lab investigations are mostly done for admitted patients, so show them by default
  const status = searchParams.get("status") ?? "Admitted";

  useEffect(() => {
    ipdPatientListHandler(
      searchParams.get("currentPage") ?? 1,
      () => {},
      searchParams.get("search") ?? null,
      null,
      null,
      status ? { multiple_filter: { status } } : {},
      (loadingStatus: LoadingStatus) => {
        setIsLoading(loadingStatus === "pending");
      },
    );
    return () => {
      cleanUp();
      dispatch(clearIpdPatientListSlice());
    };
  }, [searchParams.get("currentPage"), searchParams.get("search"), status]);

  const formUrl = (ipdId: string) =>
    `${LAB_INVESTIGATIONS_URL}${LAB_INVESTIGATIONS_FORM_URL}/${ipdId}`;

  const getPatientName = (ipdPatient: any) =>
    [ipdPatient?.patient?.first_name, ipdPatient?.patient?.last_name]
      .filter(Boolean)
      .join(" ") ||
    ipdPatient?.patient_name ||
    "N/A";

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <View className="mb-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laboratory Investigations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
        >
          Laboratory Investigations
        </Text>
        <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
          Search an IPD patient and record their laboratory investigation results
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "IPD No",
            "Patient",
            "Phone",
            "Ward / Room / Bed",
            "Admitted On",
            "Status",
            "Action",
          ]}
          tableData={ipdPatientRows.map((ipdPatient: any) => [
            <Link to={formUrl(ipdPatient?.id)}>
              <Text
                as="span"
                className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
              >
                {ipdPatient?.ipd_number}
              </Text>
            </Link>,
            <View className="flex flex-col">
              <Text as="span" className="font-medium">
                {getPatientName(ipdPatient)}
              </Text>
              <Text as="span" className="text-xs text-muted-foreground">
                {ipdPatient?.patient_number}
              </Text>
            </View>,
            ipdPatient?.patient?.phone_no || "N/A",
            `${ipdPatient?.ward_number || "N/A"} / ${ipdPatient?.room_number || "N/A"} / ${ipdPatient?.bed_number || "N/A"}`,
            ipdPatient?.admission_date_time ? (
              <View>
                <Text className="text-sm font-normal">
                  {dayjs(ipdPatient.admission_date_time).format(DATE_FORMAT)}
                </Text>
                <Text className="text-sm font-normal">
                  {dayjs(ipdPatient.admission_date_time).format(TIME_FORMAT)}
                </Text>
              </View>
            ) : (
              "N/A"
            ),
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                String(ipdPatient?.status).toLowerCase() === "discharged"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {ipdPatient?.status}
            </Text>,
            <Button
              variant="outline"
              size="small"
              className="flex items-center gap-2 whitespace-nowrap"
              onPress={() => navigate(formUrl(ipdPatient?.id))}
            >
              <FlaskConical size={16} />
              Fill Investigations
            </Button>,
          ])}
          emptyMessage="No IPD patients found"
          header={{
            search: (
              <SearchBar
                onSearch={(value: string) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                      search: value,
                    },
                    { replace: true },
                  )
                }
                className="shadow-sm dark:shadow-none"
              />
            ),
            filter: (
              <View className="w-44">
                <SingleSelector
                  name="status"
                  placeholder="Status"
                  value={status}
                  options={statusOptions}
                  searchable={false}
                  onChange={(value) =>
                    setSearchParams(
                      {
                        ...Object.fromEntries([...searchParams]),
                        currentPage: "1",
                        status: String(value || ""),
                      },
                      { replace: true },
                    )
                  }
                />
              </View>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={
                  ipdPatients?.current_page ||
                  ipdPatients?.pagination?.current_page ||
                  1
                }
                last_page={
                  ipdPatients?.last_page ||
                  ipdPatients?.pagination?.total_pages ||
                  1
                }
                getPageNumberHandler={(page) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
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

export default LaboratoryInvestigationsPage;
