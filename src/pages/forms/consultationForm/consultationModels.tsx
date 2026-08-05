import React from "react";
import Modal from "@/components/Modal";
import { RootState } from "@/actions/store";
import DiagnosisForm from "../diagnosis/Diagnosis";
import { useDispatch, useSelector } from "react-redux";
import { useDiagnosis } from "@/actions/calls/diagnosis";
import ComorbidityForm from "../comorbidities/Comorbidities";
import { useComorbidity } from "@/actions/calls/comorbidities";
import OnExaminationForms from "../onExamination/OnExamination";
import { useOnExamination } from "@/actions/calls/onExamination";
import { useChiefComplaint } from "@/actions/calls/chiefComplaints";
import { useSurgicalHistory } from "@/actions/calls/surgicalHistory";
import SurgicalHistoryForm from "../surgicalHistory/SurgicalHistory";
import ChiefComplaintForm from "../chief complaints form/chiefComplaintsForm";
import {
  setDiagnosisModel,
  setComorbiditiesModel,
  setOnExaminationModel,
  setChiefComplaintModel,
  setSurgicalHistoryModel,
  setTestModel,
  setDietPlanModel,
  setDreModel,
  setProctoscopyModel,
  setManagementModel,
  setServicesModel,
  setMedicineModel,
} from "@/actions/slices/medicalStatus";
import TestForm from "../test/Test";
import { useTest } from "@/actions/calls/test";
import { useDiet } from "@/actions/calls/diet";
import DietForm from "../diet/Diet";
import { useDre } from "@/actions/calls/dre";
import { useProctoscopy } from "@/actions/calls/proctoscopy";
import { useManagement } from "@/actions/calls/management";
import DreForm from "../dre/DreForm";
import ProctoscopyForm from "../proctoscopy/ProctoscopyForm";
import ManagementForm from "../management/ManagementForm";
import { useServiceCost } from "@/actions/calls/serviceCost";
import ServiceCostForm from "../serviceCostForm/serviceCostForm";
import MedicineForm from "../medicinesForm/medicines";
import { useMedicine } from "@/actions/calls/medicine";

const ConsultationModels: React.FC<{
  consultationType?: string;
  children?: React.ReactNode;
}> = ({ consultationType, children }) => {
  const dispatch = useDispatch();
  const chiefComplaintModel = useSelector(
    (state: RootState) => state.modelStatus.chiefComplaintStatus
  );
  const surgicalHistoryStatus = useSelector(
    (state: RootState) => state.modelStatus.surgicalHistoryStatus
  );
  const comorbiditiesStatus = useSelector(
    (state: RootState) => state.modelStatus.comorbiditiesStatus
  );
  const onExaminationStatus = useSelector(
    (state: RootState) => state.modelStatus.onExaminationStatus
  );
  const diagnosisStatus = useSelector(
    (state: RootState) => state.modelStatus.diagnosisStatus
  );
  const testStatus = useSelector(
    (state: RootState) => state.modelStatus.testStatus
  );
  const dietPlanStatus = useSelector(
    (state: RootState) => state.modelStatus.dietPlanStatus
  );
  const dreStatus = useSelector(
    (state: RootState) => state.modelStatus.dreHistoryStatus
  );
  const proctoscopyStatus = useSelector(
    (state: RootState) => state.modelStatus.proctoscopyStatus
  );
  const managementStatus = useSelector(
    (state: RootState) => state.modelStatus.managementStatus
  );
  const servicesStatus = useSelector(
    (state: RootState) => state.modelStatus.servicesStatus
  );
  const medicineStatus = useSelector(
    (state: RootState) => state.modelStatus.medicineStatus
  );
  const { dietDropdownHandler } = useDiet();
  const { testDropdownHandler } = useTest();
  const { diagnosisDropdownHandler } = useDiagnosis();
  const { comorbidityDropdownHandler } = useComorbidity();
  const { onExaminationDropdownHandler } = useOnExamination();
  const { chiefComplaintDropdownHandler } = useChiefComplaint();
  const { surgicalHistoryDropdownHandler } = useSurgicalHistory();
  const { dreDropdownHandler } = useDre();
  const { proctoscopyDropdownHandler } = useProctoscopy();
  const { managementDropdown } = useManagement();
  const { serviceCostDropdownHandler } = useServiceCost();
  const { medicineDropdownHandler } = useMedicine();

  return (
    <React.Fragment>
      {chiefComplaintModel ? (
        <Modal
          size="full"
          isOpen={chiefComplaintModel}
          onClose={() => {
            dispatch(setChiefComplaintModel(false));
          }}
          title="Add Chief Complaint"
        >
          <ChiefComplaintForm
            formType="add"
            onModalSuccess={() => {
              chiefComplaintDropdownHandler(() => {
                dispatch(setChiefComplaintModel(false));
              });
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : surgicalHistoryStatus ? (
        <Modal
          size="full"
          isOpen={surgicalHistoryStatus}
          onClose={() => {
            dispatch(setSurgicalHistoryModel(false));
          }}
          title="Add Surgical History"
        >
          <SurgicalHistoryForm
            onModalSuccess={() => {
              surgicalHistoryDropdownHandler(() => {
                dispatch(setSurgicalHistoryModel(false));
              });
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : comorbiditiesStatus ? (
        <Modal
          size="full"
          isOpen={comorbiditiesStatus}
          onClose={() => {
            dispatch(setComorbiditiesModel(false));
          }}
          title="Add Comorbidity"
        >
          <ComorbidityForm
            onModalSuccess={() => {
              comorbidityDropdownHandler(() => {
                dispatch(setComorbiditiesModel(false));
              });
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : onExaminationStatus ? (
        <Modal
          size="full"
          isOpen={onExaminationStatus}
          onClose={() => {
            dispatch(setOnExaminationModel(false));
          }}
          title="Add On Examination"
        >
          <OnExaminationForms
            onModalSuccess={() => {
              onExaminationDropdownHandler(() => {
                dispatch(setOnExaminationModel(false));
              });
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : diagnosisStatus ? (
        <Modal
          size="full"
          isOpen={diagnosisStatus}
          onClose={() => {
            dispatch(setDiagnosisModel(false));
          }}
          title="Add Diagnosis"
        >
          <DiagnosisForm
            onModalSuccess={() => {
              diagnosisDropdownHandler(() => {
                dispatch(setDiagnosisModel(false));
              }, consultationType);
            }}
          />
        </Modal>
      ) : dreStatus ? (
        <Modal
          size="full"
          isOpen={dreStatus}
          onClose={() => {
            dispatch(setDreModel(false));
          }}
          title="Add Dre"
        >
          <DreForm
            onModalSuccess={() => {
              dreDropdownHandler(() => {
                dispatch(setDreModel(false));
              }, consultationType);
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : proctoscopyStatus ? (
        <Modal
          size="full"
          isOpen={proctoscopyStatus}
          onClose={() => {
            dispatch(setProctoscopyModel(false));
          }}
          title="Add Proctoscopy"
        >
          <ProctoscopyForm
            onModalSuccess={() => {
              proctoscopyDropdownHandler(() => {
                dispatch(setProctoscopyModel(false));
              }, consultationType);
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : managementStatus ? (
        <Modal
          size="full"
          isOpen={managementStatus}
          onClose={() => {
            dispatch(setManagementModel(false));
          }}
          title="Add Management"
        >
          <ManagementForm
            onModalSuccess={() => {
              managementDropdown(() => {
                dispatch(setManagementModel(false));
              }, consultationType);
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : testStatus ? (
        <Modal
          size="full"
          isOpen={testStatus}
          onClose={() => {
            dispatch(setTestModel(false));
          }}
          title="Add Test"
        >
          <TestForm
            onModalSuccess={() => {
              testDropdownHandler(() => {
                dispatch(setTestModel(false));
              });
            }}
          />
        </Modal>
      ) : dietPlanStatus ? (
        <Modal
          size="full"
          isOpen={dietPlanStatus}
          onClose={() => {
            dispatch(setDietPlanModel(false));
          }}
          title="Add Diet Plan"
        >
          <DietForm
            onModalSuccess={() => {
              dietDropdownHandler(() => {
                dispatch(setDietPlanModel(false));
              });
            }}
            iAmIn="consultation"
          />
        </Modal>
      ) : medicineStatus ? (
        <Modal
          size="full"
          isOpen={medicineStatus}
          onClose={() => {
            dispatch(setMedicineModel(false));
          }}
          title="Add Medicine"
        >
          <MedicineForm
            onModalSuccess={() => {
              medicineDropdownHandler(
                () => {
                  dispatch(setMedicineModel(false));
                },
                "medicine_name",
              );
            }}
          />
        </Modal>
      ) : (
        servicesStatus && (
          <Modal
            size="full"
            isOpen={servicesStatus}
            onClose={() => {
              dispatch(setServicesModel(false));
            }}
            title="Add Service Cost"
          >
            <ServiceCostForm
              formType="add"
              onModalSuccess={() => {
                serviceCostDropdownHandler(() => {
                  dispatch(setServicesModel(false));
                });
              }}
            />
          </Modal>
        )
      )}
      {/*
      // : (
      //   null
      //   // children
      // )}*/}
      {children}
    </React.Fragment>
  );
};

export default ConsultationModels;
