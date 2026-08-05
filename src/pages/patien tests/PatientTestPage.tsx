import { usePatientTest } from "@/actions/calls/patientTest";
import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
    PATIENT_TEST_DETAILS_URL,
    PATIENT_TEST_EDIT_URL,
    PATIENT_TEST_FORM_URL,
    PATIENT_TEST_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import Filter from "../filter";
import Input from "@/components/input";

const PatientTestPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { patientTestListHandler, patientTestDeleteHandler, cleanUp } = usePatientTest();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const testListData = useSelector((state: any) => state.patientTest.patientTestListData);
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      patientTestListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        filterData
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
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Test Name (A-Z)", value: "test_name", order: "asc" },
    { label: "Test Name (Z-A)", value: "test_name", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <Modal
        title="Test Delete"
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
                patientTestDeleteHandler(deleteId, (success: boolean) => {
                  if (success) {
                    patientTestListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  }
                });
              }
            }}
          >
            Delete
          </Button>
        </View>
      </Modal>
      <View className="mb-6">
        <Text as="h1" weight="font-semibold" className="text-2xl font-bold text-text-DEFAULT mb-1">
          Patient Tests
        </Text>
        <Text as="p" className="text-text-light">
          manage hospital patient tests
        </Text>
      </View>

      <Card className="overflow-hidden">
        <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none">
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
                              onResetFilter={() => {
                                setFilterData(null);
                              }}
                              title="Patient Filter"
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
                                  <Input name="first_name" placeholder="Patient First Name" />
                                </View>,
                                <View className="w-full my-4">
                                  <Input name="last_name" placeholder="Patient Last Name" />
                                </View>,
                                <View className="w-full my-4">
                                  <Input name="phone_no" placeholder="Patient Phone" />
                                </View>,
                              ]}
                            />
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(PATIENT_TEST_TABLE_URL + PATIENT_TEST_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Test
              </Button>
            </View>
          </View>
        </View>
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Test Id",
            "Test Name",
            "Test Place",
            "Billing Amount",
            "Result Status",
            "Result Uploaded By",
            "Actions",
          ]}
          tableData={testListData?.data?.map((data: any) => [
            <Link to={PATIENT_TEST_TABLE_URL + PATIENT_TEST_DETAILS_URL + "/" + data.id}
              className="font-medium text-text-DEFAULT hover:text-secondary-DEFAULT hover:underline"
            >
              {data?.test_id}
            </Link>,
            data?.test_name,
            data?.test_place,
            data?.billing_amount,
            <Badge
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.result_status)}
            >
              {data?.result_status}
            </Badge>,
            data?.result_uploaded_by,
            <ActionMenu
              onEdit={() =>
                navigate(PATIENT_TEST_TABLE_URL + PATIENT_TEST_EDIT_URL + "/" + data.id)
              }
              onDelete={() => setDeleteId(data.id)}
              // onDownload={() => console.log("Download")}
            />,
          ])}
        />
        <PaginationComponent
          getPageNumberHandler={(page) => {
            setSearchParams(
              {
                ...Object.fromEntries([...searchParams]),
                currentPage: `${page}`,
              },
              { replace: true }
            );
          }}
          last_page={testListData?.last_page}
          current_page={testListData?.current_page}
        />
      </Card>
    </React.Fragment>
  );
};

export default PatientTestPage;
