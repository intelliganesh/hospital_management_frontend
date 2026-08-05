import { useConsultation } from "@/actions/calls/consultation";
import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import {
  CONSULTATION_DETAILS_URL,
  CONSULTATION_EDIT_URL,
  CONSULTATION_TABLE_URL,
  DATE_FORMAT,
  TIME_FORMAT,
} from "@/utils/urls/frontend";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import Filter from "../filter";
import Input from "@/components/input";
import { toast } from "@/utils/custom-hooks/use-toast";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
// import { toast } from "@/utils/custom-hooks/use-toast";
import { useInvoice } from "@/actions/calls/invoice";
// import Select from "@/components/Select";
import DateRangePicker from "@/components/DateRangePicker";
import BouncingLoader from "@/components/BouncingLoader";
import { GenericStatus } from "@/interfaces";
import DynamicTable from "@/components/ui/DynamicTable";
import InfoCard from "@/components/ui/infoCard";
import { CheckCircle, FileText, Stethoscope } from "lucide-react";
import DeleteLoader from "@/components/deleteLoader";
import { departmentTypeOptions } from "../forms/deparmentsForm/deparmentsForm/departementOptions";
import SingleSelector from "@/components/SingleSelector";

const ConsultationPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const {
    downloadPrescroriptionHandler,
    downloadInvoiceHandler,
    downloadConsultationHandler,
  } = useInvoice();
  const {
    consultationListHandler,
    consultationDeleteHandler,
    consultationStatsHandler,
    cleanUp,
  } = useConsultation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const consultationListData = useSelector(
    (state: any) => state.consultation.consultationListData,
  );
  const consultationStatsData = useSelector(
    (state: any) => state.consultation.consultationStatsData,
  );
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      consultationListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        searchParams?.get("from_date"),
        searchParams?.get("to_date"),
        filterData,
        (status) => {
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
    };
  }, [
    filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("from_date"),
    searchParams?.get("to_date"),
  ]);

  useEffect(() => {
    consultationStatsHandler(
      () => {},
      [],
      (status) => {
        setIsLoading(
          status === "pending"
            ? true
            : status === "failed"
              ? true
              : status === "success" && false,
        );
      },
    );
  }, []);

  const prescriptionDownloadHandler = (id: string) => {
    setIsLoading(true);
    if (id) {
      downloadPrescroriptionHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Prescription",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Prescription",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };
  const handleDownloadConsultation = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadConsultationHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded consultation",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download consultation",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };
  const handleDownloadInvoice = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadInvoiceHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Invoice",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Invoice",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    // { label: "Appointment ID (A-Z)", value: "appointment_id", order: "asc" },
    // { label: "Appointment ID (Z-A)", value: "appointment_id", order: "desc" },
    { label: "Patient Number (A-Z)", value: "patient_id", order: "asc" },
    { label: "Patient Number (Z-A)", value: "patient_id", order: "desc" },
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    { label: "Department Type (A-Z)", value: "type", order: "asc" },
    { label: "Department Type (Z-A)", value: "type", order: "desc" },
    {
      label: "Appointment Date (A-Z)",
      value: "appointment_date",
      order: "asc",
    },
    {
      label: "Appointment Date (Z-A)",
      value: "appointment_date",
      order: "desc",
    },
    // { label: "Doctor ID (A-Z)", value: "doctor_id", order: "asc" },
    // { label: "Doctor ID (Z-A)", value: "doctor_id", order: "desc" },
    { label: "Next Visit Date (A-Z)", value: "next_visit_date", order: "asc" },
    { label: "Next Visit Date (Z-A)", value: "next_visit_date", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
    { label: "Payment Status (A-Z)", value: "payment_status", order: "asc" },
    { label: "Payment Status (Z-A)", value: "payment_status", order: "desc" },
    // { label: "Complaint (A-Z)", value: "complaint", order: "asc" },
    // { label: "Complaint (Z-A)", value: "complaint", order: "desc" },
    // { label: "Advice (A-Z)", value: "advice", order: "asc" },
    // { label: "Advice (Z-A)", value: "advice", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <Modal
        title="Consultation Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onPress={() => {
              if (deleteId) {
                consultationDeleteHandler(
                  deleteId,
                  (success: boolean) => {
                    if (success) {
                      consultationListHandler(
                        searchParams?.get("currentPage") ?? 1,
                        () => {
                          modalCloseHandler();
                        },
                      );
                    }
                  },
                  (status) => {
                    setIsDeleting(
                      status === "pending"
                        ? true
                        : status === "failed"
                          ? true
                          : status === "success" && false,
                    );
                  },
                );
              }
            }}
          >
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>
      <View className="mb-6 flex justify-between items-center">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Consultation
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all consultations
          </Text>
        </View>
        <View>
          <Text
            as="label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Select Date Range
          </Text>
          <DateRangePicker
            // onDateChange={handleDateChange}
            placeholder="Choose your dates"
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total Consultations"
          value={consultationStatsData?.total_consultations || 0}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Stethoscope size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Today's Consultations"
          value={consultationStatsData?.todays_consultations || 0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<FileText size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Completed"
          value={consultationStatsData?.completed_consultations || 0}
          valueStyle="!text-green-600 dark:!text-green-400 !text-2xl"
          icon={<CheckCircle size={20} />}
          iconStyle="!bg-gradient-to-br !from-green-100 !via-green-200 !to-green-300 dark:!from-green-800/40 dark:!via-green-700/40 dark:!to-green-600/40 !text-green-600 dark:!text-green-400 !shadow-lg !shadow-green-500/25 dark:!shadow-green-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        {/* <InfoCard
          label="Active Patients"
          value={new Set(consultationListData?.data?.map((consultation: any) => consultation.patient_id)).size || 0}
          valueStyle="!text-purple-600 dark:!text-purple-400"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        /> */}
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none">
          <View className="flex gap-2 w-full  justify-between items-center ">
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
            <View className="flex gap-3">
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
              <Filter
                title="Patient Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="patient_number" placeholder="Patient Number" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="appointment_number"
                      placeholder="Appointment Number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="doctor_name" placeholder="Doctor Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      type="text"
                      name="next_visit_date"
                      placeholder="Next Visit Date"
                      onFocus={(e) => (e.target.type = "date")}
                    />
                  </View>,
                ]}
              />
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Patient info",
            // "Patient Name",
            "Appointment Details",
            "Department Type",
            "Doctor Name",
            "Next Visit Date",
            "Consultation Status",
            "Payment Status",
            "Actions",
            "Downloads",
          ]}
          tableData={consultationListData?.data?.map((data: any) => [
            <View>
              <Link
                to={
                  CONSULTATION_TABLE_URL +
                  CONSULTATION_DETAILS_URL +
                  "/" +
                  data.id
                }
                className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
              >
                {data?.patient_number || "N/A"}
              </Link>
              <Text className="text-sm font-normal">
                {data?.patient_name || "N/A"}
              </Text>
            </View>,
            <View>
              {data?.external_appointment_id && (
                <Text
                  className="mb-1 bg-primary-100 w-fit px-4 py-1 rounded text-xs text-primary cursor-pointer"
                  title={data?.external_appointment_reference_number || "N/A"}
                >
                  {data?.external_appointment_type || "N/A"}
                </Text>
              )}
              <Text className="text-sm font-normal">
                {dayjs(
                  `${data?.appointment_date} ${data?.appointment_time}`,
                ).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${data?.appointment_date} ${data?.appointment_time}`,
                ).format(TIME_FORMAT)}
              </Text>
            </View>,
            data?.type || "N/A",
            data?.doctor_name,
            data?.next_visit_date
              ? dayjs(data?.next_visit_date).format(DATE_FORMAT)
              : "NA",
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status || "N/A"}
            </Text>,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.payment_status)}
            >
              {data?.payment_status || "N/A"}
            </Text>,

            <ActionMenu
              onEdit={() =>
                navigate(
                  CONSULTATION_TABLE_URL +
                    CONSULTATION_EDIT_URL +
                    "/" +
                    data.id,
                )
              }
              // onDelete={() => setDeleteId(data.id)}
              editTitle="Edit Consultation"
              deleteTitle="Delete Consultation"
            />,
            <ActionMenu
              onDownloadPrescription={
                data?.status === GenericStatus.COMPLETED
                  ? () => {
                      prescriptionDownloadHandler(data?.id);
                    }
                  : undefined
              }
              onDownloadConsultation={
                data?.status === GenericStatus.COMPLETED
                  ? () => {
                      handleDownloadConsultation(data?.id);
                    }
                  : undefined
              }
              onDownload={
                data?.payment_status === GenericStatus.COMPLETED
                  ? () => {
                      handleDownloadInvoice(data?.id);
                    }
                  : undefined
              }
              downloadTitle="Download Invoice"
              downloadPrescriptionTitle="Download Prescription"
              downloadConsultationTitle="Download Consultation"
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
                    { replace: true },
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
                    searchParams,
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
            filter: (
              <Filter
                title="Consultation Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                    },
                    { replace: true },
                  );
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="patient_name" placeholder="Patient Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="referred_by_name" placeholder="Referred By" />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      label="Department Type"
                      name="type"
                      placeholder="Select Department Type"
                      // value={paymentStatus}
                      // onChange={(e) => {
                      //   setPaymentStatus(e.target.value);
                      // }}
                      options={departmentTypeOptions}
                    />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input
                  //     name="appointment_number"
                  //     placeholder="Appointment Number"
                  //   />
                  // </View>,
                  // <View className="w-full my-4">
                  //   <Input name="doctor_name" placeholder="Doctor Name" />
                  // </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      label="Status"
                      name="status"
                      // value={paymentStatus}
                      // onChange={(e) => {
                      //   setPaymentStatus(e.target.value);
                      //   // onSetHandler("payment_status", e.target.value)
                      // }}
                      placeholder="Select Status"
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                      ]}
                      // error={errorsPaymentStatus}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      label="Payment Status"
                      name="payment_status"
                      // value={paymentStatus}
                      // onChange={(e) => {
                      //   setPaymentStatus(e.target.value);
                      //   // onSetHandler("payment_status", e.target.value)
                      // }}
                      placeholder="Select Payment Status"
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                      ]}
                      // error={errorsPaymentStatus}
                    />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input
                  //     type="date"
                  //     name="next_visit_date"
                  //     placeholder="Next Visit Date"
                  //     onFocus={(e) => (e.target.type = "date")}
                  //   />
                  // </View>,
                ]}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={consultationListData?.current_page}
                last_page={consultationListData?.last_page}
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
        {/* <PaginationComponent
          getPageNumberHandler={(page) => {
            setSearchParams(
              {
                ...Object.fromEntries([...searchParams]),
                currentPage: `${page}`,
              },
              { replace: true }
            );
          }}
          last_page={consultationListData?.last_page}
          current_page={consultationListData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};

export default ConsultationPage;
