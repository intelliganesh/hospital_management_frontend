import useDoshaAnalysis from ".";
// import { Plus } from "lucide-react";
import Text from "@/components/text";
import View from "@/components/view";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ActionMenu from "@/components/editDeleteAction";
import DynamicTable from "@/components/ui/DynamicTable";
import PaginationComponent from "@/components/Pagination";
import { dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import DataSort, { SortOption } from "@/components/SortData";
import { useParams, useSearchParams } from "react-router-dom";

import { DoshaAnalysis } from "@/interfaces/doshaAnalysis";
import { validationForm } from "../forms/doshaAnalysisForm/validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import useForm from "@/utils/custom-hooks/use-form";
import BouncingLoader from "@/components/BouncingLoader";
import DeleteLoader from "@/components/deleteLoader";
// import {
//   FINDINGS_URL,
//   FINDINGS_EDIT_URL,
//   FINDINGS_FORM_URL,
//   DOSHA_ANALYSIS_URL,
// } from "@/utils/urls/frontend";

const DoshaAnalysisPage: React.FC<{}> = () => {
  const { type } = useParams();
  // const type = location.pathname.split("/")[3];
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setErrors] = useState<Record<string, string>>({});
  const [isEdit, setIsEdit] = useState<string>("");

  const doshaAnalysisListData = useSelector(
    (state: any) => state.doshaAnalysis.doshaAnalysisListData
  );
  const doshaAnalysisData = useSelector(
    (state: any) => state.doshaAnalysis.doshaAnalysisDetailData
  );

  const doshaAnalysisOptions = useSelector(
    (state: any) => state.doshaAnalysis.doshaAnalysisDropdownData
  );

  const { values, handleChange } = useForm<DoshaAnalysis | null>(
    doshaAnalysisData
  );

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const doshaAnalysisObj: Partial<DoshaAnalysis> = {};

    try {
      for (let [key, value] of formData.entries()) {
        doshaAnalysisObj[key as keyof DoshaAnalysis] = value as any;
      }
      await validationForm.validate(doshaAnalysisObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (isEdit === "") {
        addHandler(doshaAnalysisObj, (success) => {
          setIsSubmitting(false);
          handleAddModalClose();
          if (success) {
            ListHandler(
              searchParams?.get("currentPage") ?? 1,
              () => {},
              searchParams.get("search") ?? null,
              searchParams.get("sort_by") ?? null,
              searchParams.get("sort_order") ?? null
            );
            toast({
              title: "Success!",
              description: `${type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : ""} added successfully.`,
              variant: "success",
            });
          } else {
            // toast({
            //   title: "Error!",
            //   description: response?.message,
            //   variant: "destructive",
            // });
          }
        });
      } else if (isEdit) {
        editHandler(isEdit, doshaAnalysisObj, (success: boolean) => {
          if (success) {
            setIsEdit("");
            toast({
              title: "Success!",
              description: `${type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : ""} updated successfully.`,
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Role",
            //   variant: "destructive",
            // });
          }
          setIsSubmitting(false);
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const {
    addHandler,
    editHandler,
    ListHandler,
    deleteHandler,
    OptionsListHandler,
    cleanUp,
  } = useDoshaAnalysis();

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      ListHandler(
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
      OptionsListHandler((_: any) => {});
    }
    return () => {
      cleanUp();
    };
  }, [
    type,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title={`Delete ${type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : ""}`}
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
            className="flex items-center gap-2"
            onPress={() => {
              if (deleteId) {
                deleteHandler(deleteId, (success: boolean) => {
                  if (success) {
                    ListHandler(searchParams?.get("currentPage") ?? 1, () => {
                      modalCloseHandler();
                    });
                  }
                },
                 (status) => {
                   setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
                 }
              );
              }
            }}
          >
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>
      <Modal
        title={`Add ${type}`}
        isOpen={addModalOpen ? true : false}
        onClose={handleAddModalClose}
        description={`Add new ${type}`}
      >
        <form onSubmit={handleSubmit}>
          <View className="grid grid-cols-1 mb-4 gap-6">
            <View>
              <Select
                id="name"
                name="name"
                label="Dosha"
                // error={errorsCategory}
                value={values?.name ?? ""}
                placeholder={`Select ${type}`}
                options={doshaAnalysisOptions?.map((item: any) => {
                  return { label: item.label, value: item.value };
                })}
                onChange={handleChange}
                required={true}
              />
            </View>
          </View>
          <View className="flex justify-end gap-2">
            <Button variant="outline" onPress={handleAddModalClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </View>
        </form>
      </Modal>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          {type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : ""}
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all {type}
        </Text>
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

              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  setAddModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add{" "}
                {type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : type}
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Name",
            // "Test Description",
            // "Actions",
          ]}
          tableData={doshaAnalysisListData?.data?.map((data: any) => [
            data?.name || "N/A",
            <ActionMenu
              // onEdit={() => setIsEdit(data.id)}
              // onDelete={() => setDeleteId(data.id)}
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
            // action: (
            //   <Button
            //     variant="primary"
            //     size="small"
            //     onPress={() => {
            //       setAddModalOpen(true);
            //     }}
            //     className={commanButtonStyle}
            //   >
            //     <Plus size={16} />
            //     Add New {" "}
            //     {type ? type?.charAt(0)?.toUpperCase() + type?.slice(1) : type}
            //   </Button>
            // ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={doshaAnalysisListData?.current_page}
                last_page={doshaAnalysisListData?.last_page}
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
          last_page={doshaAnalysisListData?.last_page}
          current_page={doshaAnalysisListData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};

export default DoshaAnalysisPage;
