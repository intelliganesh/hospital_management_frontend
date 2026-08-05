import { useConsultationFees } from "@/actions/calls/consultationFees";
import BouncingLoader from "@/components/BouncingLoader";
 import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
// import Input from "@/components/input";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  // CONSULTATION_FEES_DETAILS_URL,
  CONSULTATION_FEES_EDIT_URL,
  CONSULTATION_FEES_FORM_URL,
  CONSULTATION_FEES_URL,
} from "@/utils/urls/frontend";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
// import Filter from "../filter";
// import Select from "@/components/Select";
// import {
//   categoryOptions,
//   statusOptions,
// } from "../forms/findings form/findingsFormOptions";

const ConsultatoinFeesPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { consultationFeesListHandler, deleteConsultationFeesHandler, cleanUp } = useConsultationFees();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [filterData, setFilterData] = useState<null | Record<string, string>>(
  //   null
  // );
  const consultationFeesListData = useSelector(
    (state: any) => state.consultationFees.consultationFeesListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      consultationFeesListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status) => {
          setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
        }
        // filterData
      );
    }
    return () => {
      cleanUp();
    };
  }, [
    // filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Consultation Name (A-Z)", value: "consultation_name", order: "asc" },
    { label: "Consultation Name (Z-A)", value: "consultation_name", order: "desc" },
    { label: "Amount (A-Z)", value: "amount", order: "asc" },
    { label: "Amount (Z-A)", value: "amount", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Consultation Fee Delete"
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
              setIsDeleting(true);
              if (deleteId) {
                deleteConsultationFeesHandler(deleteId, (success: boolean) => {
                  if (success) {
                    setIsDeleting(false);
                    consultationFeesListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  } else{
                    setIsDeleting(false);
                  }
                });
              } else {
                setIsDeleting(false);
              }
            }}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            Delete <span className={`${isDeleting ? "block" : "hidden"}`}><Loader size={16} className="animate-spin" /></span>
          </Button>
        </View>
      </Modal>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Consultation Fees
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Consultation Fees
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Consultation Name",
            "Amount",
            "Department Type",
            "Status",
            // "Test Description",
            "Actions",
          ]}
          tableData={consultationFeesListData?.data?.map((data: any) => [
            
            // <Link
            //   to={FINDINGS_URL + FINDINGS_DETAILS_URL + "/" + data.id}
            //   className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            // >
            //   {data?.finding_name}
            // </Link>,
            data?.consultation_name,
            data?.amount,
            data?.department_type,
            <Badge
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status}
            </Badge>,
            <ActionMenu
              onEdit={() =>
                navigate(CONSULTATION_FEES_URL + CONSULTATION_FEES_EDIT_URL + "/" + data.id)
              }
              onDelete={() => setDeleteId(data.id)}
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
            // filter: (
            //   <Filter
            //     title="Consultation Fees Filter"
            //     onResetFilter={() => {
            //       setFilterData(null);
            //     }}
            //     onFilterApiCall={(data) => {
            //       setFilterData({
            //         multiple_filter: data,
            //       });
            //     }}
            //     inputFields={[
            //       <View className="w-full my-4">
            //         <Input name="finding_name" placeholder="Finding Name" />
            //       </View>,
            //       <View className="w-full my-4">
            //         <Input name="finding_code" placeholder="Finding Code" />
            //       </View>,
            //       <View className="w-full my-4">
            //         <Select
            //           placeholder="Select Category"
            //           options={categoryOptions}
            //           onChange={(e) => {
            //             setFilterData({
            //               ...filterData,
            //               category: e.target.value,
            //             });
            //           }}
            //           required={true}
            //         />
            //       </View>,
            //       <View className="w-full my-4">
            //         <Select
            //           placeholder="Select Status"
            //           options={statusOptions}
            //           onChange={(e) => {
            //             setFilterData({
            //               ...filterData,
            //               status: e.target.value,
            //             });
            //           }}
            //           required={true}
            //         />
            //       </View>,
            //     ]}
            //   />
            // ),
            action: (
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(CONSULTATION_FEES_URL + CONSULTATION_FEES_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add Consultation Fees
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={consultationFeesListData?.current_page}
                last_page={consultationFeesListData?.last_page}
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

export default ConsultatoinFeesPage;
