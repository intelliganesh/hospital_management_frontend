import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import BouncingLoader from "@/components/BouncingLoader";
import { PlusCircle } from "lucide-react";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import ActionMenu from "@/components/editDeleteAction";
import { Link } from "react-router-dom";
import {
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
  SURGERY_PROCEDURE_URL,
} from "@/utils/urls/frontend";
import DeleteLoader from "@/components/deleteLoader";
// import { AnaesthesiaListResponse } from "@/interfaces/ipd/anaesthesia";

/**
 * Lists all PAC (Pre-Anaesthesia Assessments) entries for a given IPD patient/enrollment.
 * Re-uses existing DynamicTable + Button pattern adopted across the application.
 */
const PACListPage: React.FC = () => {
  // patient/enrollment id coming from route => /ipd/:id/pac
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    anaesthesiaListHandler,
    addAnaesthesiaHandler,
    deleteAnaesthesiaHandler,
    cleanUp,
  } = useAnaesthesia();
  const { surgeryDropdownHandler } = useSurgeryReport();

  const PACList = useSelector(
    (state: RootState) => state.anaesthesia.anaesthesiaListData,
  );
  const surgeryDropdownData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryDropdownData,
  )?.map((item: any) => ({
    label: item?.surgery_name,
    value: item?.id,
  }));

  // TODO: replace with real API hook when backend ready
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState<string>("");
  const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   if (!id) return;
  //   // Stub fetch – swap with Redux/React-Query later
  //   setIsLoading(true);
  //   // simulate fetch
  //   setTimeout(() => {
  //     setPacList([]); // empty for now
  //     setIsLoading(false);
  //   }, 500);
  // }, [id]);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      anaesthesiaListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        { ipd_id: id },
        (status: "pending" | "failed" | "success") => {
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

    surgeryDropdownHandler(() => {}, id);

    return () => {
      cleanUp();
    };
  }, [
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleAddPAC = () => {
    if (!selectedSurgery) return;
    addAnaesthesiaHandler(
      {
        ipd_id: id,
        ipd_surgery_id: selectedSurgery,
      },
      () => {
        anaesthesiaListHandler(
          searchParams?.get("currentPage") ?? 1,
          () => {},
          searchParams.get("search") ?? null,
          searchParams.get("sort_by") ?? null,
          searchParams.get("sort_order") ?? null,
          { ipd_id: id },
          (status: "pending" | "failed" | "success") => {
            setIsLoading(
              status === "pending"
                ? true
                : status === "failed"
                  ? true
                  : status === "success" && false,
            );
          },
        );
      },
    );
  };

  return (
    <View className="p-4 md:p-6 space-y-6">
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <Modal
        title="Delete PAC"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this PAC? This action cannot be undone and will permanently remove the data from the system."
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
                deleteAnaesthesiaHandler(
                  deleteId,
                  (_: boolean) => {
                    // if (success) {
                    anaesthesiaListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      },
                    );
                    // }
                  },
                  (status) => {
                    setIsDeleting(
                      status === "pending"
                        ? true
                        : status === "failed"
                          ? false
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="#">IPD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="#">IPD Patients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="#">{"name"}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>PAC</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <View className="flex justify-between items-center gap-4">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold mb-1"
          >
            Pre-Anaesthesia Assessments
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            Manage PAC records for this IPD patient
          </Text>
        </View>
        <View className="flex gap-2">
          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3"
            onPress={() => setShowAddModal(true)}
          >
            <PlusCircle className="h-5 w-5" />
            Add PAC
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onPress={() =>
              navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${id}`, {
                replace: true,
              })
            }
          >
            Back
          </Button>
        </View>
      </View>

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            "Surgery Date",
            "Surgery",
            "IPD No",
            "Surgeon",
            "Anaesthetist",
            // { label: "Status", key: "status" },
            "Actions",
          ]}
          tableData={
            PACList && PACList?.data?.length > 0
              ? PACList?.data?.map((row) => [
                  row?.surgery?.surgery_date || "N/A",
                  <Link
                    to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${SURGERY_PROCEDURE_URL}/${row?.ipd_surgery_id}`}
                    className="hover:text-secondary font-medium"
                  >
                    {row?.surgery?.surgery_name || "N/A"}
                  </Link>,
                  <Link
                    to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${row?.ipd_id}`}
                    className="hover:text-secondary font-medium"
                  >
                    {row?.ipd?.ipd_number || "N/A"}
                  </Link>,
                  row?.surgery?.surgeon || "N/A",
                  row?.surgery?.anaesthetist || "N/A",
                  ActionMenu({
                    onView: () => {
                      navigate(`/ipd/${id}/pac/${row.id}/view`);
                    },
                    onDelete: () => {
                      setDeleteId(row.id);
                    },
                    onEdit: () => {
                      navigate(
                        `/ipd/${id}/pac/${row.id}?tab=pre-op&currentPage=1?mode=edit`,
                      );
                    },
                  }),
                ])
              : []
          }
          // header={{
          //   search: (
          //     <SearchBar
          //       onSearch={(value: string) => {
          //         setSearchParams(
          //           {
          //             ...Object.fromEntries([...searchParams]),
          //             currentPage: "1",
          //             search: value,
          //           },
          //           { replace: true },
          //         );
          //       }}
          //       className="shadow-sm dark:shadow-none"
          //     />
          //   ),
          // }}
          emptyMessage="No PAC records found!"
        />
      </Card>

      {/* Add PAC Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add PAC"
        description="Select surgery to create Pre-Anaesthesia Assessment"
      >
        <View className="space-y-6 min-w-[250px]">
          <Select
            name="surgery"
            label="Surgery"
            options={surgeryDropdownData}
            placeholder="Select surgery"
            value={selectedSurgery}
            onChange={(e) => setSelectedSurgery(e.target.value)}
            fullWidth
          />
          <Button
            variant="primary"
            className="w-full"
            disabled={!selectedSurgery}
            onPress={() => {
              handleAddPAC();
              setSelectedSurgery("");
              setShowAddModal(false);
            }}
          >
            Add PAC
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default PACListPage;
