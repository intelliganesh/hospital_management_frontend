import { useDepartment } from "@/actions/calls/department";
import { RootState } from "@/actions/store";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import DeleteLoader from "@/components/deleteLoader";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { GenericStatus } from "@/interfaces";
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  DEPARTMENT_DETAILS_URL,
  DEPARTMENT_EDIT_URL,
  DEPARTMENT_FORM_URL,
  DEPARTMENT_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const DepartmentsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const {   departmentListHandler, deleteDepartmentHandler, cleanUp,
  } = useDepartment();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const departmentsData = useSelector((state: RootState) => state?.department?.departmentListData
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      departmentListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status) => {
          setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
        }
      );
    }
    return () => {
      cleanUp();
    };
  }, [
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleDeleteDepartment = () => {
    if (deleteId) {
      deleteDepartmentHandler(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          departmentListHandler(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
    );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
    { label: "Code (A-Z)", value: "code", order: "asc" },
    { label: "Code (Z-A)", value: "code", order: "desc" },
    { label: "Is Active (A-Z)", value: "is_active", order: "asc" },
    { label: "Is Active (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  // const handleSortChange = (option: SortOption) => {
  //   setActiveSort(option);
  //   setSearchParams(
  //     {
  //       ...Object.fromEntries([...searchParams]),
  //       currentPage: "1",
  //       sort_by: option.value.split("_")[0],
  //       sort_order: option.value.split("_")[1],
  //     },
  //     { replace: true }
  //   );
  // };
  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Room Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="text-black"
            onPress={modalCloseHandler}
          >
            Cancel
          </Button>
          <Button variant="danger" className="flex items-center gap-2" onPress={handleDeleteDepartment}>
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Departments
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Departments
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Name",
            "Code",
            "Is Active",
            "Action",
          ]}
          tableData={departmentsData?.data?.map((department: any) => [
            <Link to={`${DEPARTMENT_TABLE_URL + DEPARTMENT_DETAILS_URL}/${department.id}`}>
              <Text as="span" className="font-medium text-text-DEFAULT">
                {department.name}
              </Text>
            </Link>,
            department.code || "N/A",
            
            department.is_active ? 
            (
              <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(GenericStatus.ACTIVE)}
            >
              Yes
            </Text>
            ) : (
              <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(GenericStatus.INACTIVE)}
            >
              No
            </Text>
            ),
            <ActionMenu
              onEdit={() =>
                navigate(`${DEPARTMENT_TABLE_URL + DEPARTMENT_EDIT_URL}/${department?.id}`)
              }
              onDelete={() => setDeleteId(department.id)}
            />,
          ])}
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
            sort: (
              <DataSort
                sortOptions={sortOptions}
                activeSort={activeSort ?? undefined}
                onSort={(option) =>
                  handleSortChange(
                    option,
                    setActiveSort,
                    setSearchParams,
                    searchParams
                  )
                }
              />
            ),
            action: (
              <Button
                variant="primary"
                size="small"
                className={commanButtonStyle}
                onPress={() => navigate(DEPARTMENT_TABLE_URL + DEPARTMENT_FORM_URL)}
              >
                <Plus size={16} /> Add New Department
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={departmentsData?.current_page}
                last_page={departmentsData?.last_page}
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
export default DepartmentsPage;
