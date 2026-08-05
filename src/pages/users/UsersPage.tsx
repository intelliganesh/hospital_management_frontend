import { Loader, Mail, Phone, Plus } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { RootState } from "@/actions/store";
import { useUsers } from "@/actions/calls/user";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ActionMenu from "@/components/editDeleteAction";
import DynamicTable from "@/components/ui/DynamicTable";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  USER_URL,
  EDIT_USER_URL,
  USER_TABLE_URL,
  USER_DETAIL_URL,
} from "@/utils/urls/frontend";

import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import Filter from "../filter";
import Input from "@/components/input";
import { useDepartment } from "@/actions/calls/department";
import Select from "@/components/Select";
import { useRoles } from "@/actions/calls/roles";
import BouncingLoader from "@/components/BouncingLoader";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import ImageComponent from "@/components/ui/ImageComponent";

const UsersPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { getUserList, deleteUser, cleanUp } = useUsers();
  const { departmentDropdownHandler } = useDepartment();
  const { roleDropdownHandler } = useRoles();

  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { role, id: userId } = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails") as string)
    : null;

  const departments = useSelector(
    (state: RootState) => state.department.departmentDropdownData
  )?.map((department: any) => ({
    id: department.id,
    label: department.name,
    value: department.name,
  }));

  // const logedinPerson = useSelector((state: RootState) => state.systemSettings.settings);
  // console.log("logedinPerson", logedinPerson);

  const roles = useSelector(
    (state: RootState) => state.roles.rolesDropdown
  )?.map((role: any) => ({
    id: role.id,
    label: role.name,
    value: role.name,
  }));

  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const userData = useSelector((state: RootState) => state.users.users);
  const userObj = useSelector(
    (state: RootState) => state.users.userCompleteObj
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      getUserList(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        filterData,
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
      departmentDropdownHandler(() => {});
      roleDropdownHandler(() => {});
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
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
    { label: "Email (A-Z)", value: "email", order: "asc" },
    { label: "Email (Z-A)", value: "email", order: "desc" },
    { label: "Phone (A-Z)", value: "phone", order: "asc" },
    { label: "Phone (Z-A)", value: "phone", order: "desc" },
    { label: "Designation (A-Z)", value: "designation", order: "asc" },
    {
      label: "Designation (Z-A)",
      value: "designation",
      order: "desc",
    },
    { label: "Role (A-Z)", value: "role", order: "asc" },
    { label: "Role (Z-A)", value: "role", order: "desc" },
    // {
    //   label: "Qualification (A-Z)",
    //   value: "qualification",
    //   order: "asc",
    // },
    // {
    //   label: "Qualification (Z-A)",
    //   value: "qualification",
    //   order: "desc",
    // },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
    { label: "Department (A-Z)", value: "department", order: "asc" },
    { label: "Department (Z-A)", value: "department", order: "desc" },
  ];
  // const sortOptions: SortOption[] = [
  //   { label: "Name (A-Z)", value: "name" },
  //   { label: "Name (Z-A)", value: "name" },
  //   { label: "Email (A-Z)", value: "email_asc" },
  //   { label: "Email (Z-A)", value: "email_desc" },
  //   { label: "Phone (A-Z)", value: "phone_asc" },
  //   { label: "Phone (Z-A)", value: "phone_desc" },
  //   { label: "Designation (A-Z)", value: "designation_asc" },
  //   {
  //     label: "Designation (Z-A)",
  //     value: "designation_desc",
  //   },
  //   {
  //     label: "Qualification (A-Z)",
  //     value: "qualification_asc",
  //   },
  //   {
  //     label: "Qualification (Z-A)",
  //     value: "qualification_desc",
  //   },
  // ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  // const handleSortChange = (option: SortOption) => {
  //   setActiveSort(option);
  //   setSearchParams({
  //     ...Object.fromEntries([...searchParams]),
  //     currentPage: "1",
  //     sort_by: option.value.split("_")[0],
  //     sort_order: option.value.split("_")[1],
  //   });
  // };
  //  const handleSortChange = (option: SortOption) => {

  //       setActiveSort(option);
  //       if(option.order){
  //         setSearchParams(
  //           {
  //             ...Object.fromEntries([...searchParams]),
  //             currentPage: "1",
  //             sort_by:  option.value,
  //             sort_order: option.order,
  //           },
  //           { replace: true }
  //         );
  //       }
  //     };

  const actions = (user: any) => {
    if (
      (role !== "Super Admin" && role !== "Admin" && user.id !== userId) ||
      (role === "Admin" && user.role === "Super Admin")
    ) {
      return null;
    } else if (
      ((user?.role === "Admin" || user?.role === "Super Admin") &&
        user?.id === userId) ||
      userId === user?.id
    ) {
      return (
        <ActionMenu
          onEdit={() =>
            navigate(USER_TABLE_URL + EDIT_USER_URL + "/" + user.id)
          }
        />
      );
    } else {
      // console.log((user?.role === "Admin" || user?.role === "Super Admin") && user?.id === Number(logedinPerson?.user_id), user?.role) ;

      return (
        <ActionMenu
          onEdit={() =>
            navigate(USER_TABLE_URL + EDIT_USER_URL + "/" + user.id)
          }
          onDelete={() => setDeleteId(user.id)}
        />
      );
    }
  };

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50 ">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <Modal
        title="User Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user’s data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isDeleting}
            className="flex items-center gap-2"
            onPress={() => {
              setIsDeleting(true);
              if (deleteId) {
                deleteUser(deleteId, (success: boolean) => {
                  if (success) {
                    setIsDeleting(false);
                    getUserList(searchParams?.get("currentPage") ?? 1, () => {
                      modalCloseHandler();
                    });
                  } else {
                    setIsDeleting(false);
                  }
                });
              } else {
                setIsDeleting(false);
              }
            }}
          >
            Delete{" "}
            <span className={`${isDeleting ? "block" : "hidden"}`}>
              <Loader size={16} className="animate-spin" />
            </span>
          </Button>
        </View>
      </Modal>
      <View className="flex justify-between items-center mb-6">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Users
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all User information
          </Text>
        </View>
        <Button
          variant="primary"
          onPress={() => {
            navigate(USER_TABLE_URL + USER_URL);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={16} />
          Add New User
        </Button>
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* Table Header with Search and Filters */}
        {/* <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none">
          <View className="flex gap-2 w-full  justify-between items-center "> */}
        {/* <Button
              variant="outline"
              size="small"
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filter
            </Button> */}
        {/* <SearchBar
              onSearch={(value: string) => {
                setSearchParams({
                  ...Object.fromEntries([...searchParams]),
                  currentPage: "1",
                  search: value,
                });
              }}
              className="shadow-sm dark:shadow-md"
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
                    <Input name="name" placeholder="User Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="email" placeholder="User Email" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="phone" placeholder="User Phone Number" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="designation" placeholder="User Designation" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="qualification"
                      placeholder="User Qualification"
                    />
                  </View>,
                ]}
              />
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(USER_TABLE_URL + USER_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add User
              </Button> */}
        {/* </View> */}
        {/* </View> */}
        {/* </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Name",
            "Contacts",
            // "Email",
            // "Phone",
            "Designation",
            // "Qualification",
            "Role",
            "Department",
            "Status",
            "Actions",
          ]}
          tableData={userData?.map((user: any) => [
            <View className="flex items-center">
              <View className="h-10 w-10 shadow-md rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                {user?.image ? (
                  <ImageComponent
                    src={import.meta.env.VITE_APP_URL + user?.image}
                    alt={user?.name}
                    className="rounded-full object-cover h-full"
                  />
                ) : (
                  <Text
                    as="span"
                    className="text-xs font-medium text-secondary-600"
                  >
                    {user?.name
                      .split(" ")
                      .map((n: string, i: number) => {
                        if (i >= 3) return "";
                        return n[0];
                      })
                      .join("")}
                  </Text>
                )}
                {/* <Text
                  as="span"
                  className="text-xs font-medium text-secondary-600"
                >
                  <Link to={USER_TABLE_URL + USER_DETAIL_URL + "/" + user.id}>
                    {user.name
                      .split(" ")
                      .map((n: string, i: number) => {
                        if (i >= 3) return "";
                        return n[0];
                      })
                      .join("")}
                  </Link>
                </Text> */}
              </View>
              <Text
                as="span"
                className="font-medium text-text-DEFAULT hover:text-secondary"
              >
                <Link
                  to={USER_TABLE_URL + USER_DETAIL_URL + "/" + user.id}
                  className="hover:text-secondary hover:underline"
                >
                  {user?.name || "N/A"}
                </Link>
              </Text>
            </View>,
            <View className="space-y-2">
              <Text className="text-sm font-normal flex items-center gap-2">
                <Mail size={14} className="text-muted-foreground" />
                {user?.email || "N/A"}
              </Text>
              <Text className="text-sm font-normal flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground" />
                {user?.phone || "N/A"}
              </Text>
            </View>,
            // user?.email || "N/A",
            // user?.phone || "N/A",
            user?.designation || "N/A",
            user?.role || "N/A",
            user?.department_name || "N/A",
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(user?.status)}
            >
              {user?.status}
            </Text>,
            //  role !== "Admin" && user?.role === "Admin" ? null : (user?.role === "Admin" && user?.id === Number(logedinPerson?.user_id) )  ? (
            //    <ActionMenu
            //   onEdit={() =>
            //     navigate(USER_TABLE_URL + EDIT_USER_URL + "/" + user.id)
            //   }
            // />
            // ) : (

            //     <ActionMenu
            //     onEdit={() =>
            //       navigate(USER_TABLE_URL + EDIT_USER_URL + "/" + user.id)
            //     }
            //     onDelete={() => setDeleteId(user.id)}
            //   />
            // )
            actions(user),
          ])}
          header={{
            search: (
              <SearchBar
                // onSearch={(val) =>
                //   setSearchParams({
                //     ...Object.fromEntries(searchParams),
                //     search: val,
                //     currentPage: "1",
                //   })
                // }
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
            filter: (
              <Filter
                title="Users Filter"
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
                    <Input name="name" placeholder="User Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="email" placeholder="User Email" />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input name="phone" placeholder="User Phone Number" />
                  // </View>,
                  <View className="w-full my-4">
                    <Input name="designation" placeholder="User Designation" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="qualification"
                      placeholder="User Qualification"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      id="department_name"
                      // label="Department"
                      name="department_name"
                      value={filterData?.department_name || ""}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          department_name: e.target.value,
                        });
                      }}
                      options={departments}
                      placeholder="Select Department"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      id="role"
                      // label="Role"
                      name="role"
                      placeholder="Select Role"
                      value={filterData?.role || ""}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          role: e.target.value,
                        });
                      }}
                      options={roles}
                    />
                  </View>,
                ]}
              />
            ),
            // action: (
            //   <Button
            //     variant="primary"
            //     size="small"
            //     onPress={() => {
            //       navigate(USER_TABLE_URL + USER_URL);
            //     }}
            //     className="flex items-center gap-2"
            //   >
            //     <Plus size={16} />
            //     Add User
            //   </Button>
            // ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={userObj?.current_page}
                last_page={userObj?.last_page}
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

export default UsersPage;
