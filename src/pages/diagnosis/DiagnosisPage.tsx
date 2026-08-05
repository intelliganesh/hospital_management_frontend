import { useDiagnosis } from "@/actions/calls/diagnosis";
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
import { handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  DIAGNOSIS_DETAILS_URL,
  DIAGNOSIS_EDIT_URL,
  DIAGNOSIS_FORM_URL,
  DIAGNOSIS_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const DiagnosisPage = () => {
  const navigate = useNavigate();
  const { diagnosisList, deleteDiagnosis, cleanUp } = useDiagnosis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const diagnosisListData = useSelector(
    (state: any) => state?.diagnosis?.diagnosisList
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      diagnosisList(
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

  const handleDeleteDiagnosis = () => {
    if (deleteId) {
      deleteDiagnosis(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          diagnosisList(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
    (status) => {
      setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
    });
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Diagnosis Name (A-Z)", value: "diagnosis_name", order: "asc" },
    { label: "Diagnosis Name (Z-A)", value: "diagnosis_name", order: "desc" },
    { label: "Icd Code (A-Z)", value: "icd_code", order: "asc" },
    { label: "Icd Code (Z-A)", value: "icd_code", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <>
      <React.Fragment>
        <BouncingLoader isLoading={isLoading} />
        <Modal
          title="Diagnosis Delete"
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
            <Button variant="danger" className="flex items-center gap-2" onPress={handleDeleteDiagnosis}>
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
            Diagnosis
          </Text>
          <Text as="p" className="text-text-light">
            Manage All Diagnosis
          </Text>
        </View>

        <Card className="overflow-hidden">
          <DynamicTable
            tableHeaders={["Diagnosis Name", "Icd Code","Department Type", "Status", "Action"]}
            tableData={diagnosisListData?.data?.map((data: any) => [
              <Link
                to={`${DIAGNOSIS_TABLE_URL + DIAGNOSIS_DETAILS_URL}/${data.id}`}
              >
                {data.diagnosis_name}
              </Link>,
              data?.icd_code,
              data?.department_type,
              <Text
                as="span"
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                style={getStatusColorScheme(data.status)}
              >
                {data.is_active}
              </Text>,
              <ActionMenu
                onEdit={() =>
                  navigate(
                    `${DIAGNOSIS_TABLE_URL + DIAGNOSIS_EDIT_URL}/${data.id}`
                  )
                }
                onDelete={() => setDeleteId(data.id)}
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
              action: (
                <Button
                  variant="primary"
                  size="small"
                  className="flex items-center gap-2"
                  onPress={() =>
                    navigate(DIAGNOSIS_TABLE_URL + DIAGNOSIS_FORM_URL)
                  }
                >
                  <Plus size={16} /> Add Diagnosis
                </Button>
              ),
            }}
            footer={{
              pagination: (
                <PaginationComponent
                  current_page={diagnosisListData?.current_page}
                  last_page={diagnosisListData?.last_page}
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
    </>
  );
};
export default DiagnosisPage;
