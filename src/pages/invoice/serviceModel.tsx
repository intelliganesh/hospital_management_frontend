import React from "react";
import Modal from "@/components/Modal";
import { RootState } from "@/actions/store";
import { useDispatch, useSelector } from "react-redux";
import { useServiceCost } from "@/actions/calls/serviceCost";
import { setServicesModel } from "@/actions/slices/medicalStatus";
import ServiceCostForm from "../forms/serviceCostForm/serviceCostForm";

const ServiceModel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { serviceCostDropdownHandler } = useServiceCost();

  const servicesStatusModel = useSelector(
    (state: RootState) => state.modelStatus.servicesStatus
  );
  return (
    <React.Fragment>
      {servicesStatusModel ? (
        <Modal
          size="full"
          isOpen={servicesStatusModel}
          onClose={() => {
            dispatch(setServicesModel(false));
          }}
          title="Add Service Cost"
        >
          <ServiceCostForm
            onModalSuccess={() => {
              dispatch(setServicesModel(false));
              serviceCostDropdownHandler(() => {});
            }}
          />
        </Modal>
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default ServiceModel;
