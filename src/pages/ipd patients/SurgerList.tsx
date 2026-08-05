import View from "@/components/view";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { Edit, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/ui/DynamicTable";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import SingleSelector from "@/components/SingleSelector";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
  SURGERY_LIST_URL,
  SURGERY_PROCEDURE_URL,
} from "@/utils/urls/frontend";

type Surgery = {
  id: number;
  date: string;
  doctor: string;
  status: string;
  type: "Surgical" | "Non-Surgical";
  name: string;
};

const SurgeryList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const location = useLocation();
  const isIpdDetailPage = location.pathname.includes(SURGERY_LIST_URL);
  const [type, setType] = useState<"Surgical" | "Non-Surgical">("Surgical");
  const [name, setName] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSurgeries([
        {
          id: 1,
          date: "2024-01-22",
          doctor: "Dr. Kumar",
          status: "Completed",
          type: "Surgical",
          name: "Appendectomy",
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    if (!name) return;

    setSurgeries((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        doctor: "Dr. Demo",
        status: "Pending",
        type,
        name,
      },
    ]);

    setName("");
    setType("Surgical");
    setShowModal(false);
  };

  if (isLoading) return <BouncingLoader isLoading />;

  return (
    <View className="mt-4">
      <View className="flex justify-between items-center">
        <View>
          <Text as="h2" className="text-xl font-semibold mb-1">
            Surgery Details
          </Text>
          <Text as="p" className="text-muted-foreground">
            List of surgeries for this IPD patient
          </Text>
        </View>

        <Button
          variant="primary"
          className="flex items-center gap-2 px-6 py-3"
          onPress={() => setShowModal(true)}
        >
          <PlusCircle className="h-5 w-5" />
          Add Surgery
        </Button>
      </View>

      <Card className="border-0 shadow-medium bg-white mt-4">
        <DynamicTable
          tableHeaders={[
            { label: "Date", key: "date" },
            { label: "Doctor", key: "doctor" },
            { label: "Surgery", key: "name" },
            { label: "Type", key: "type" },
            { label: "Status", key: "status" },
             ...(isIpdDetailPage ? ["Actions"] : []),
          ]}
          
          tableData={surgeries.map((row) => [
            row.date,
            row.doctor,
            row.name,
            row.type,
            row.status,
            <>
              {isIpdDetailPage && (
                <View className="flex items-center gap-2">
                  <Button
                    size="small"
                    variant="secondary"
                    className="flex gap-2 items-center"
                    onPress={() =>
                      navigate(
                        `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${SURGERY_PROCEDURE_URL}/${patientId}`
                      )
                    }
                  >
                    <Edit className="h-5 w-5 text-primary" />
                  </Button>
                </View>
              )}
            </>,
          ])}
          emptyMessage="No surgeries found!"
        />
      </Card>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Add Surgery"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="xl"
        >
          <View className="grid grid-cols-2 gap-4">
            <View>
              <Text className="text-sm mb-1">Surgery Type</Text>

              <SingleSelector
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border p-2 rounded"
                options={[
                  { label: "Surgical", value: "Surgical" },
                  { label: "Non-Surgical", value: "Non-Surgical" },
                ]}
              />
            </View>

            <View>
              <Text className="text-sm mb-1">Surgery Name</Text>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter surgery name"
              />
            </View>
            <View className="mt-4">
              <Text className="text-sm mb-1">Surgery Date</Text>
              <input
                type="date"
                className="w-full border p-2 rounded"
                placeholder="Enter surgery date"
              />
            </View>
            <View className="mt-4">
              <Text className="text-sm mb-1">Doctor</Text>
              <input
                className="w-full border p-2 rounded"
                placeholder="Enter surgery date"
              />
            </View>
          </View>

          <View className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onPress={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={handleSave}>
              Save
            </Button>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SurgeryList;
