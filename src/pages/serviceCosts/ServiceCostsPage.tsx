import { useServiceCost } from "@/actions/calls/serviceCost";
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
  SERVICE_COST_TABLE_URL,
  SERVICE_COST_FORM_URL,
  SERVICE_COST_EDIT_URL,
  SERVICE_COST_DETAILS_URL,
} from "@/utils/urls/frontend";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
// import Filter from "../filter";
// import Select from "@/components/Select";
// import {
//   categoryOptions,
//   statusOptions,
// } from "../forms/findings form/findingsFormOptions";

const ServiceCostsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { serviceCostListHandler, deleteServiceCostHandler, cleanUp } =
    useServiceCost();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [filterData, setFilterData] = useState<null | Record<string, string>>(
  //   null
  // );
  const serviceCostListData = useSelector(
    (state: any) => state.serviceCost.serviceCostListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      serviceCostListHandler(
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
    { label: "Service Name (A-Z)", value: "service_name", order: "asc" },
    { label: "Service Name (Z-A)", value: "service_name", order: "desc" },
    { label: "Cost (A-Z)", value: "cost", order: "asc" },
    { label: "Cost (Z-A)", value: "cost", order: "desc" },
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
        title="Service Cost Delete"
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
                deleteServiceCostHandler(deleteId, (success: boolean) => {
                  if (success) {
                    setIsDeleting(false);
                    serviceCostListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  } else {
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
            Delete{" "}
            <span className={`${isDeleting ? "block" : "hidden"}`}>
              <Loader size={16} className="animate-spin" />
            </span>
          </Button>
        </View>
      </Modal>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Service Costs
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Service Costs
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Service Name",
            "Cost",
            "Department Type",
            "Status",
            // "Test Description",
            "Actions",
          ]}
          tableData={serviceCostListData?.data?.map((data: any) => [
            <Link
              to={SERVICE_COST_TABLE_URL + SERVICE_COST_DETAILS_URL + "/" + data.id}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.service_name || "N/A"}
            </Link>,
            // data?.service_name || "N/A",
            data?.cost || "N/A",
            data?.department_type || "N/A",
            <Badge
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status}
            </Badge>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  SERVICE_COST_TABLE_URL + SERVICE_COST_EDIT_URL + "/" + data.id
                )
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
                  navigate(SERVICE_COST_TABLE_URL + SERVICE_COST_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Service Cost
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={serviceCostListData?.current_page}
                last_page={serviceCostListData?.last_page}
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

export default ServiceCostsPage;
