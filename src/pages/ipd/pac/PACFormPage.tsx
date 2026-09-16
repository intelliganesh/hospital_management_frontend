import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import TabView from "@/components/Tabs";
import GeneralInfoCard from "./components/GeneralInfoCard";
import PreOpEvalForm from "./tabs/PreOpEvalForm/PreOpEvalForm";
import DeptAnaesthesiaForm from "./tabs/DeptAnaesthesiaForm/DeptAnaesthesiaForm";
import RecoveryObsForm from "./tabs/RecoveryObsForm/RecoveryObsForm";
import ConsentForm from "./tabs/ConsentForm";
import AnaesthesiaRecordForm from "./tabs/AnaesthesiaRecordForm";
import { ArrowLeft, FileDown } from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
/**
 * Add / Edit PAC Page – wraps the three section forms inside TabView.
 * Modes:
 *  - create (new)   => /ipd/:id/pac/new
 *  - edit/view      => /ipd/:id/pac/:pacId?mode=view|edit
 */
const PACFormPage: React.FC = () => {
  const { id: _id, pacId } = useParams<{ id: string; pacId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  const mode = searchParams.get("mode") || (pacId ? "edit" : "add");
  // const [infoSaved, setInfoSaved] = useState<boolean>(false);
  // const [summary, setSummary] = useState<string>("");
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const dispatch = useDispatch();

  // const { anaesthesiaDetailHandler, cleanUp } = useAnaesthesia();

  const anaesthesiaDetail =
    (useSelector(
      (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
    ) as AnaesthesiaDetails) || null;

  // const activeTab = searchParams.get("tab") || "pre-op";

  const getReportType = (tabValue: string) => {
    switch (tabValue) {
      case "pre-op":
        return "pre_anaesthesia_assessment";
      case "dept-anaes":
        return "department_of_anaesthesia";
      case "recovery":
        return "anaesthesia_recovery_room_observation";
      case "consent":
        return "anaesthesia_consent_form";
      case "anaesthesia-record":
        return "anaesthesia_record";
      default:
        return "";
    }
  };

  const handleDownload = (tabValue: string) => {
    const type = getReportType(tabValue);
    if (type && _id) {
      fetchAndDownloadPdf(
        _id,
        IPD_GENERATE_PDF_URL,
        type,
        () => {},
        anaesthesiaDetail?.ipd_surgery_id,
      );
    }
  };

  // const handleGeneratePdf = () => {
  //   const type = getReportType(activeTab);
  //   if (type && _id) {
  //     fetchAndDownloadPdf(_id, IPD_GENERATE_PDF_URL, type, () => {});
  //   }
  // };

  // TODO fetch existing pac record when pacId
  // useEffect(() => {
  //   if (pacId) {
  //     anaesthesiaDetailHandler(
  //       pacId,
  //       () => {
  //         setIsLoading(false);
  //       },
  //       undefined,
  //       (status) => {
  //         setIsLoading(
  //           status === "pending"
  //             ? true
  //             : status === "failed"
  //               ? true
  //               : status === "success" && false,
  //         );
  //       },
  //     );
  //   }

  //   return () => {
  //     cleanUp();
  //     dispatch(clearAnaesthesiaDetailSlice());
  //   };
  // }, [pacId]);

  const tabs = [
    {
      value: "pre-op",
      label: "Pre-Op  Anesthesia Evaluation",
      content: <PreOpEvalForm readOnly={mode === "view"} />,
    },
    {
      value: "consent",
      label: "Consent for Anaesthesia / Sedation",
      content: <ConsentForm readOnly={mode === "view"} />,
    },
    {
      value: "dept-anaes",
      label: "Department of Anaesthesia",
      content: <DeptAnaesthesiaForm />,
    },
    {
      value: "anaesthesia-record",
      label: "Anaesthesia Record",
      content: <AnaesthesiaRecordForm readOnly={mode === "view"} />,
    },
    {
      value: "recovery",
      label: "Recovery Room Observation",
      content: <RecoveryObsForm />,
    },
  ];

  return (
    <View className="p-4 md:p-6 space-y-6">
      <View className="flex items-center justify-between gap-4">
        <View>
          <Text as="h1" className="text-2xl font-bold mb-1">
            {pacId ? (mode === "view" ? "View" : "Edit") : "Add"} PAC
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            {pacId
              ? `PAC #${pacId}`
              : "Create a new Pre-Anaesthesia Assessment"}
          </Text>
        </View>
        <View className="flex items-center gap-2">
          {/* {pacId && (
            <Button
              variant="outline"
              size="small"
              className="flex items-center gap-2"
              onPress={handleGeneratePdf}
              disabled={isPdfDownloading}
            >
              {isPdfDownloading ? (
                <BouncingLoader isLoading={isPdfDownloading} />
              ) : (
                <FileDown size={14} />
              )}
              Generate PDF
            </Button>
          )} */}
          <Button
            variant="outline"
            size="small"
            onPress={() => navigate(`/ipd/${_id}/pac?currentPage=1`)}
            className="flex gap-2"
          >
            <ArrowLeft className="w-5 h-5"></ArrowLeft>Back
          </Button>
        </View>
      </View>

      {/* General Info */}
      <GeneralInfoCard
        readOnly={mode === "view"}
        // onSave={() => setInfoSaved(true)}
      />

      {/* Tabs & Forms – shown only after general info saved */}
      {/* {anaesthesiaDetail?.position && ( */}
        <>
          <Card className="p-4 !px-0 mt-4 space-y-4">
            <View className="px-4 pt-2">
              <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Anesthesia PDF Downloads
              </Text>
            </View>
            <View className="flex flex-wrap justify-center gap-4 p-4 pt-2">
              {[
                { label: "Generate Pre-Op Anesthesia Evaluation", value: "pre-op" },
                { label: "Consent for Anaesthesia Form", value: "consent" },
                { label: "Generate Anaesthesia Form", value: "dept-anaes" },
                {
                  label: "Generate Anaesthesia Record Form",
                  value: "anaesthesia-record",
                },
                { label: "Generate Recovery Room Observation", value: "recovery" },
              ].map((d) => (
                <Button
                  key={d.value}
                  variant="outline"
                  size="small"
                  onPress={() => handleDownload(d.value)}
                  disabled={isPdfDownloading}
                  className="flex items-center gap-3 rounded !p-4 justify-center bg-white dark:bg-background"
                >
                  {d.label}
                  {isPdfDownloading ? (
                    <BouncingLoader isLoading={isPdfDownloading} />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                </Button>
              ))}
            </View>
          </Card>
          {/* Tabs Section with download buttons */}
          <Card className="p-4 pt-0 !px-0 mt-4 space-y-4">
            {/* Download header */}

            {/* Tab buttons & content */}
            <View className="mt-12 p-4">
              <TabView tabs={tabs} />
            </View>
          </Card>

          {/* Summary & Single Submit */}
          {/* <Card className="p-4 mt-4 space-y-4">
            <Textarea
              label="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              variant="primary"
              onPress={() => {
                const activeTab = searchParams.get("tab") || "pre-op";
                console.log(`Submit for ${activeTab}`, { summary });
              }}
            >
              Submit
            </Button>
          </Card> */}
        </>
      {/* )} */}
    </View>
  );
};

export default PACFormPage;
