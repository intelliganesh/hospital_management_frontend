import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import View from "@/components/view";

interface FilterProps {
  title?: string;
  onResetFilter: () => void;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  inputFields: React.ReactNode[];
  onFilterApiCall: (data: any) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  apiCall?: () => void
}

const Filter: React.FC<FilterProps> = ({
  title = "",
  footer,
  size = "md",
  inputFields,
  onFilterApiCall,
  onResetFilter,
  apiCall,
  showCloseButton = true,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resetFilter, setResetFilter] = useState<boolean>(false);
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    let data: any = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value as any;
    }
    onFilterApiCall(data);
    onCloseHandler();
    setResetFilter(true);
  };
  useEffect(()=>{
    apiCall?.()
  },[])
  const onCloseHandler = () => {
    setModalOpen(false);
    setResetFilter(false);
  };
  return (
    <React.Fragment>
      <Button
        variant="primary"
        size="small"
        className="flex items-center gap-2 "
        onPress={() => {
          setModalOpen(true);
        }}
      >
        Filter
      </Button>
      {resetFilter && (
        <Button
          variant="primary"
          size="small"
          className="flex items-center gap-2 "
          onPress={() => {
            onResetFilter();
            setResetFilter(false);
          }}
        >
          Reset
        </Button>
      )}
      <Modal
        size={size}
        title={title}
        footer={footer}
        isOpen={modalOpen}
        onClose={onCloseHandler}
        showCloseButton={showCloseButton}
      >
        <form onSubmit={onSubmitHandler}>
          {inputFields?.map((data: React.ReactNode,index:number) => {
            return <React.Fragment key={index}  >{data}</React.Fragment>;
          })}
          <View className="flex justify-end gap-2">
            <Button onPress={onCloseHandler}>Close</Button>
            <Button type="submit">Submit</Button>
          </View>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Filter;
