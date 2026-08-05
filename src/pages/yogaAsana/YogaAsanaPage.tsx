import { useYogaAsana } from "@/actions/calls/yogaAsana";
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
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  YOGA_ASANA_DETAILS_URL,
  YOGA_ASANA_EDIT_URL,
  YOGA_ASANA_FORM_URL,
  YOGA_ASANA_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const YogaAsanaPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { yogaAsanaListHandler, cleanUp, deleteYogaAsanaHandler } =
    useYogaAsana();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const yogaAsanaData = useSelector(
    (state: RootState) => state?.yogaAsana?.yogaAsanaListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      yogaAsanaListHandler(
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

  const handleDeletePatient = () => {
    if (deleteId) {
      deleteYogaAsanaHandler(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          yogaAsanaListHandler(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
  };
  const sortOptions: SortOption[] = [
    { label: "Asana Name (A-Z)", value: "asana_name", order: "asc" },
    { label: "Asana Name (Z-A)", value: "asana_name", order: "desc" },
    // { label: "Description (A-Z)", value: "description", order: "asc" },
    // { label: "Description (Z-A)", value: "description", order: "desc" },
    // { label: "Benefits (A-Z)", value: "benefits", order: "asc" },
    // { label: "Benefits (Z-A)", value: "benefits", order: "desc" },
    // { label: "Contraindications (A-Z)", value: "contraindications", order: "asc" },
    // { label: "Contraindications (Z-A)", value: "contraindications", order: "desc" },
    { label: "Difficulty Level (A-Z)", value: "difficulty_level", order: "asc" },
    { label: "Difficulty Level (Z-A)", value: "difficulty_level", order: "desc" },
    // { label: "Recommended Duration (A-Z)", value: "recommended_duration", order: "asc" },
    // { label: "Recommended Duration (Z-A)", value: "recommended_duration", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
       <BouncingLoader  isLoading={isLoading} />
      <Modal
        title="Yoga Asana Delete"
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
          <Button variant="danger" className="flex items-center gap-2" onPress={handleDeletePatient}>
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
          Yoga Asanas
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Yoga Asanas
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Asana Name",
            // "Description",
            // "Benefits",
            // "Contraindications",
            "Difficulty Level",
            // "Recommended Duration",
            "Status",
            "Action",
          ]}
          tableData={yogaAsanaData?.data?.map((data: any) => [
            <Link
              to={`${YOGA_ASANA_TABLE_URL + YOGA_ASANA_DETAILS_URL}/${data.id}`}
            >
              <Text as="span" className="font-medium text-text-DEFAULT">
                {data.asana_name || "N/A"}
              </Text>
            </Link>,
            // data.description,
            // data.benefits,
            // data.contraindications,
            data.difficulty_level || "N/A",
            // data.recommended_duration,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data.status)}
            >
              {data.status}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  `${YOGA_ASANA_TABLE_URL + YOGA_ASANA_EDIT_URL}/${data.id}`
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
                onPress={() =>
                  navigate(YOGA_ASANA_TABLE_URL + YOGA_ASANA_FORM_URL)
                }
              >
                <Plus size={16} /> Add New Asana
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={yogaAsanaData?.current_page}
                last_page={yogaAsanaData?.last_page}
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
export default YogaAsanaPage;
