import Button from "@/components/button";
import Modal from "@/components/Modal";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  ROLES_URL,
  EDIT_ROLE_URL,
  ROLES_TABLE_URL,
  // PERMISSIONS_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoles } from "@/actions/calls/roles";
// import { RootState } from "@/actions/store";
import { useSelector } from "react-redux";
import ActionMenu from "@/components/editDeleteAction";
import PaginationComponent from "@/components/Pagination";
import { RootState } from "@/actions/store";
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
// import { get } from "node_modules/axios/index.d.cts";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import BouncingLoader from "@/components/BouncingLoader";
import DeleteLoader from "@/components/deleteLoader";
// import { Link } from "react-router-dom";

const RolesPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const roles = useSelector((state: RootState) => state.roles.roles);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getRoleList, deleteRole, cleanUp } = useRoles();
  const [description, setDescription] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      getRoleList(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
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

  const sortOptions: SortOption[] = [
    { label: "Roles (A-Z)", value: "name", order: "asc" },
    { label: "Roles (Z-A)", value: "name", order: "desc" },
    { label: "Description (A-Z)", value: "description", order: "asc" },
    { label: "Description (Z-A)", value: "description", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  const handleDeleteRole = () => {
    if (deleteId) {
      deleteRole(
        deleteId,
        (success: boolean) => {
          if (success) {
            getRoleList(searchParams?.get("currentPage") ?? 1, () => {
              modalCloseHandler();
            });
          }
        },
        (status) => {
          setIsDeleting(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
        }
      );
    }
  };
  const modalDescriptionCloseHandler = () => {
    setDescription(null);
  };
  const handleDescription = (roleDescription: string) => {
    setDescription(roleDescription);
  };

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Role Description"
        isOpen={description !== null}
        onClose={modalDescriptionCloseHandler}
        description={description || ""}
      >
        <View className="flex justify-end gap-2">
          <Button
            className="text-black dark:text-white "
            variant="outline"
            onPress={modalDescriptionCloseHandler}
          >
            Cancel
          </Button>
        </View>
      </Modal>
      <Modal
        title="Delete Role"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button
            className="text-black"
            variant="outline"
            onPress={modalCloseHandler}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex items-center gap-2"
            onPress={handleDeleteRole}
          >
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
          Roles
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Roles
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* Table */}
        <DynamicTable
          tableHeaders={["Roles", "Description", "Status", "Actions"]}
          // tableData= {roles}
          tableData={roles?.data?.map((role: any) => [
            // patient.patient_number,
            // <div>
            //   <Link to={ROLES_TABLE_URL + PERMISSIONS_URL}>{role.name}</Link>
            // </div>,
            role.name,
            <Button
              variant="ghost"
              onClick={() => handleDescription(role?.description)}
              className="text-left hover:text-primary underline"
            >
              {role?.description?.slice(0, 80) + "..." || "N/A"}
            </Button>,

            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(role?.status)}
            >
              {role.status || "N/A"}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(ROLES_TABLE_URL + EDIT_ROLE_URL + "/" + role.id, {
                  state: role,
                })
              }
              onDelete={
                role.name !== "Super Admin" && role.name !== "Admin"
                  ? () => {
                      setDeleteId(role.id);
                    }
                  : undefined
              }
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
                onPress={() => {
                  navigate(ROLES_TABLE_URL + ROLES_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Role
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={roles?.current_page}
                last_page={roles?.last_page}
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
export default RolesPage;
