import React from "react";
import Modal from "@/components/Modal";
import { RootState } from "@/actions/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setPatientModel,
} from "@/actions/slices/medicalStatus";
import PatientForm from "../patientForm/patient";

import { usePatient } from "@/actions/calls/patient";

const IPDModels: React.FC<{
  patientId?: string;
  children?: React.ReactNode;
}> = ({ patientId, children }) => {
  const dispatch = useDispatch();
  const { patientModelStatus } = useSelector(
    (state: RootState) => state.modelStatus
  );

  const { patientDetailHandler } = usePatient();

  return (
    <React.Fragment>
      { patientModelStatus ? (
        <Modal
          size="full"
          isOpen={patientModelStatus}
          onClose={() => {
            dispatch(setPatientModel(false));
          }}
          title="Edit Patient"
        >
          <PatientForm
            formType="edit"
            iAmIn="ipdModal"
            patientId={patientId}
            onModalSuccess={() => {
              patientDetailHandler(patientId!, () => {
                dispatch(setPatientModel(false));
              });
            }}
          />
        </Modal>
      ) : null}
    
      {children}
    </React.Fragment>
  );
};

export default IPDModels;
